<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Project } from '@/stores/portfolio'
import { api } from '@/services/api'
import { useToastStore } from '@/stores/toast' 

// Componentes UI
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue' 

const props = defineProps<{
  isOpen: boolean
  projectToEdit?: Project | null
  isLoading: boolean
}>()

const emit = defineEmits(['close', 'save', 'delete'])
const toast = useToastStore()

// --- State ---
const form = ref<Partial<Project>>({
  title: '',
  shortDescription: '',
  detailedDescription: '',
  images: [],
  linkRepo: '',
  linkDeploy: '',
  tags: []
})

const newTag = ref('')
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Controle do Dialog de Exclusão
const showDeleteConfirm = ref(false)

const isEditing = computed(() => !!props.projectToEdit)
const modalTitle = computed(() => isEditing.value ? 'Gerenciar Projeto' : 'Novo Projeto')

// --- Sincronização de Dados ---
watch(() => props.projectToEdit, (newVal) => {
  if (newVal) {
    form.value = JSON.parse(JSON.stringify(newVal))
    
    if (!form.value.images) form.value.images = []
    if (!form.value.tags) form.value.tags = [] 
    
  } else {
    form.value = { 
      title: '', 
      shortDescription: '', 
      detailedDescription: '', 
      images: [], 
      linkRepo: '', 
      linkDeploy: '',
      tags: [] 
    }
  }
}, { immediate: true })

// --- Actions ---

function handleSave() {
  if (!form.value.title) {
    toast.warning('O título do projeto é obrigatório.')
    return
  }
  // Envia uma cópia limpa dos dados para o Dashboard salvar
  emit('save', JSON.parse(JSON.stringify(form.value)))
}

// Usuário clica em "Excluir" e  Abre o Dialog
function requestDelete() {
  showDeleteConfirm.value = true
}

// Usuário confirma a exclusão no Dialog
function confirmDeleteAction() {
  if (form.value.id) {
    emit('delete', form.value.id)
    showDeleteConfirm.value = false
  }
}

// --- Upload e Imagens ---
function triggerFileInput() {
  if ((form.value.images?.length || 0) >= 5) {
    toast.warning('Máximo de 5 fotos permitido.')
    return
  }
  fileInput.value?.click()
}

async function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const formData = new FormData()
    formData.append('image', file)

    isUploading.value = true
    try {
      const { data } = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (!form.value.images) form.value.images = []
      form.value.images.push(data.url)
      
      toast.success('Imagem enviada com sucesso!')
      
    } catch (error) {
      console.error(error)
      toast.error('Erro ao fazer upload da imagem.')
    } finally {
      isUploading.value = false
      if (fileInput.value) fileInput.value.value = ''
    }
  }
}

function removeImage(index: number) {
  form.value.images?.splice(index, 1)
}

function makeCover(index: number) {
  const img = form.value.images?.splice(index, 1)[0]
  if (img) {
    form.value.images?.unshift(img)
    toast.info('Capa do projeto atualizada.')
  }
}

// --- Tags (Tecnologias) ---
function addTag() {
  const val = newTag.value.trim()
  if (val) {
    if (!form.value.tags) form.value.tags = []
    
    if (!form.value.tags.includes(val)) {
      form.value.tags.push(val)
    }
  }
  newTag.value = ''
}

function removeTag(index: number) { 
  if (form.value.tags) {
    form.value.tags.splice(index, 1) 
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-container">
          
          <header class="modal-header">
            <div class="header-text">
              <h3>{{ modalTitle }}</h3>
              <p v-if="!isEditing">Preencha os dados abaixo.</p>
              <p v-else>Edite as informações do projeto.</p>
            </div>
            <button class="btn-close" @click="$emit('close')"><i class="bi bi-x-lg"></i></button>
          </header>

          <div class="modal-body">
            
            <div class="image-gallery-section">
              <div class="section-label">
                <i class="bi bi-images"></i> Galeria ({{ form.images?.length || 0 }}/5)
              </div>
              <div class="gallery-grid">
                <div 
                  class="upload-box" 
                  @click="triggerFileInput"
                  v-if="(form.images?.length || 0) < 5"
                  :class="{ 'disabled': isUploading }"
                >
                  <i class="bi" :class="isUploading ? 'bi-hourglass-split' : 'bi-plus-lg'"></i>
                  <span>{{ isUploading ? '...' : 'Adicionar' }}</span>
                </div>

                <div v-for="(img, index) in form.images" :key="img" class="gallery-item" :class="{ 'is-cover': index === 0 }">
                  <img :src="img" />
                  <div class="item-overlay">
                    <span v-if="index === 0" class="badge-cover">Capa Principal</span>
                    <div class="actions">
                      <button v-if="index !== 0" @click.stop="makeCover(index)" class="btn-star" title="Definir como Capa"><i class="bi bi-star-fill"></i></button>
                      <button class="btn-trash" @click.stop="removeImage(index)" title="Remover"><i class="bi bi-trash-fill"></i></button>
                    </div>
                  </div>
                </div>
              </div>
              <input type="file" ref="fileInput" hidden accept="image/*" @change="onFileSelected" />
            </div>

            <div class="form-grid">
              <div class="form-group"><label>Título do Projeto</label><input v-model="form.title" type="text" class="input-premium" placeholder="Nome do projeto" /></div>
              <div class="form-group"><label>Descrição Curta</label><input v-model="form.shortDescription" type="text" class="input-premium" placeholder="Breve resumo" /></div>
              <div class="form-group full-width"><label>Descrição Detalhada</label><textarea v-model="form.detailedDescription" rows="5" class="input-premium area" placeholder="Detalhes completos..."></textarea></div>
              <div class="form-group"><label><i class="bi bi-github"></i> Repositório</label><input v-model="form.linkRepo" type="text" class="input-premium" placeholder="URL do GitHub" /></div>
              <div class="form-group"><label><i class="bi bi-globe"></i> Deploy (Demo)</label><input v-model="form.linkDeploy" type="text" class="input-premium" placeholder="URL do site no ar" /></div>
              
              <div class="form-group full-width">
                <label>Tecnologias</label>
                <div class="tags-container input-premium">
                  <span v-for="(tag, idx) in form.tags" :key="idx" class="tag-pill">{{ tag }} <i class="bi bi-x" @click="removeTag(idx)"></i></span>
                  <input v-model="newTag" @keydown.enter.prevent="addTag" placeholder="Digite e Enter..." class="tag-input-field" />
                </div>
              </div>
            </div>
          </div>

          <footer class="modal-footer">
            <button v-if="isEditing" class="btn-delete" @click="requestDelete" :disabled="isLoading">
              <i class="bi bi-trash"></i> Excluir
            </button>
            
            <div class="footer-actions" :class="{ 'ml-auto': !isEditing }">
              <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
              <button class="btn-save" @click="handleSave" :disabled="isLoading || isUploading">
                {{ isEditing ? 'Salvar Alterações' : 'Criar Projeto' }}
              </button>
            </div>
          </footer>

        </div>
      </div>
    </Transition>
  </Teleport>

  <ConfirmDialog 
    :is-open="showDeleteConfirm"
    title="Excluir Projeto?"
    message="Tem certeza que deseja excluir este projeto? Esta ação removerá o projeto do seu portfólio permanentemente."
    confirm-text="Sim, excluir"
    cancel-text="Cancelar"
    :is-danger="true"
    @cancel="showDeleteConfirm = false"
    @confirm="confirmDeleteAction"
  />
</template>

<style scoped>
/* --- Backdrop --- */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 20px; }
.modal-container { background: #ffffff; width: 100%; max-width: 950px; border-radius: 24px; display: flex; flex-direction: column; max-height: 90vh; box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25); animation: modalEnter 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); overflow: hidden; }
@keyframes modalEnter { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

.modal-header { padding: 1.5rem 3rem; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; background: white; }
.header-text h3 { margin: 0; color: #1e293b; font-size: 1.5rem; font-weight: 700; letter-spacing: -0.5px; }
.header-text p { margin: 4px 0 0 0; color: #64748b; font-size: 1rem; }
.btn-close { background: #f8fafc; border: none; width: 40px; height: 40px; border-radius: 50%; color: #64748b; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
.btn-close:hover { background: #fee2e2; color: #ef4444; }

.modal-body { padding: 2rem 3rem; overflow-y: auto; background: #fff; scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
.modal-body::-webkit-scrollbar { width: 6px; }
.modal-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

.image-gallery-section { margin-bottom: 2.5rem; }
.section-label { font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 1rem; }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px; }
.upload-box { height: 120px; border: 2px dashed #cbd5e1; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; color: #94a3b8; transition: all 0.2s; background: #f8fafc; }
.upload-box:hover { border-color: var(--color-primary); color: var(--color-primary); background: #eff6ff; }
.gallery-item { height: 120px; border-radius: 16px; overflow: hidden; position: relative; border: 1px solid #e2e8f0; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }
.gallery-item.is-cover { border: 3px solid var(--color-secondary); }
.item-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); opacity: 0; transition: 0.2s; display: flex; flex-direction: column; justify-content: center; align-items: center; }
.gallery-item:hover .item-overlay { opacity: 1; }
.badge-cover { position: absolute; top: 8px; left: 8px; background: var(--color-secondary); color: white; font-size: 0.7rem; padding: 4px 8px; border-radius: 4px; font-weight: 700; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
.actions { display: flex; gap: 10px; }
.actions button { width: 36px; height: 36px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; font-size: 1.1rem; }
.btn-star { background: white; color: #d1d5db; }
.btn-star:hover { background: #fffbeb; color: #f59e0b; transform: scale(1.1); }
.btn-trash { background: white; color: #ef4444; }
.btn-trash:hover { background: #fee2e2; transform: scale(1.1); }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.full-width { grid-column: span 2; }
.form-group label { display: block; margin-bottom: 0.6rem; font-weight: 700; font-size: 1rem; color: #334155; }
.form-group label i { margin-right: 6px; color: #64748b; }
.input-premium { width: 100%; box-sizing: border-box; padding: 1rem 1.2rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 1rem; color: #1e293b; transition: all 0.2s ease; }
.input-premium:focus { background: #ffffff; border-color: var(--color-primary); box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb), 0.1); outline: none; }
.input-premium.area { resize: vertical; min-height: 120px; }
.tags-container { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; min-height: 54px; }
.tag-input-field { border: none; background: transparent; flex: 1; min-width: 150px; font-size: 1rem; outline: none; }
.tag-pill { background: #e0f2fe; color: #0284c7; padding: 6px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.tag-pill i { cursor: pointer; }

.modal-footer { padding: 1.5rem 3rem; background: #ffffff; border-top: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
.footer-actions { display: flex; gap: 1rem; }
.ml-auto { margin-left: auto; }
.btn-delete { color: #ef4444; background: transparent; border: 1px solid transparent; cursor: pointer; font-weight: 600; font-size: 1rem; padding: 0.75rem 1.5rem; border-radius: 12px; transition: 0.2s; }
.btn-delete:hover { background: #fef2f2; border-color: #fee2e2; }
.btn-cancel { padding: 0.8rem 1.8rem; border: 1px solid #cbd5e1; background: white; border-radius: 12px; cursor: pointer; font-weight: 600; color: #475569; font-size: 1rem; transition: 0.2s; }
.btn-cancel:hover { background: #f1f5f9; color: #1e293b; border-color: #94a3b8; }
.btn-save { padding: 0.8rem 2.2rem; border: none; border-radius: 12px; cursor: pointer; font-weight: 700; color: white; font-size: 1rem; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); box-shadow: 0 4px 15px rgba(var(--color-primary-rgb), 0.3); transition: all 0.2s ease; }
.btn-save:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(var(--color-primary-rgb), 0.4); }
.btn-save:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

@media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; gap: 1rem; } .full-width { grid-column: span 1; } .modal-container { max-height: 100vh; border-radius: 0; } .modal-body { padding: 1.5rem; } .modal-footer { flex-direction: column; gap: 1rem; } .footer-actions { width: 100%; justify-content: space-between; } .btn-save, .btn-cancel { flex: 1; } .btn-delete { width: 100%; justify-content: center; } }
</style>