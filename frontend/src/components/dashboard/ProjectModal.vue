<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Project } from '@/stores/portfolio'
import { api } from '@/services/api'
import { useToastStore } from '@/stores/toast' 
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
const showDeleteConfirm = ref(false)

const isEditing = computed(() => !!props.projectToEdit)
const modalTitle = computed(() => isEditing.value ? 'Gerenciar Projeto' : 'Novo Projeto')

watch(() => props.projectToEdit, (newVal) => {
  if (newVal) {
    form.value = JSON.parse(JSON.stringify(newVal))
    if (!form.value.images) form.value.images = []
    if (!form.value.tags) form.value.tags = [] 
  } else {
    form.value = { 
      title: '', shortDescription: '', detailedDescription: '', 
      images: [], linkRepo: '', linkDeploy: '', tags: [] 
    }
  }
}, { immediate: true })

function handleSave() {
  if (!form.value.title) {
    toast.warning('O título do projeto é obrigatório.')
    return
  }
  emit('save', JSON.parse(JSON.stringify(form.value)))
}

function requestDelete() {
  showDeleteConfirm.value = true
}

function confirmDeleteAction() {
  if (form.value.id) {
    emit('delete', form.value.id)
    showDeleteConfirm.value = false
  }
}

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

function addTag() {
  const val = newTag.value.trim()
  if (val) {
    if (!form.value.tags) form.value.tags = []
    if (!form.value.tags.includes(val)) form.value.tags.push(val)
  }
  newTag.value = ''
}

function removeTag(index: number) { 
  if (form.value.tags) form.value.tags.splice(index, 1) 
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
        
        <div class="modal-container layout-modal">
          
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
                    <span v-if="index === 0" class="badge-cover">Capa</span>
                    <div class="actions">
                      <button v-if="index !== 0" @click.stop="makeCover(index)" class="btn-icon-action" title="Definir como Capa"><i class="bi bi-star-fill"></i></button>
                      <button class="btn-icon-action delete" @click.stop="removeImage(index)" title="Remover"><i class="bi bi-trash-fill"></i></button>
                    </div>
                  </div>
                </div>
              </div>
              <input type="file" ref="fileInput" hidden accept="image/*" @change="onFileSelected" />
            </div>

            <div class="form-grid">
              <div class="form-group"><label>Título do Projeto</label><input v-model="form.title" type="text" class="input-match" placeholder="Ex: DevDeck Plataform" /></div>
              <div class="form-group"><label>Descrição Curta</label><input v-model="form.shortDescription" type="text" class="input-match" placeholder="Resumo de uma linha" /></div>
              <div class="form-group full-width"><label>Descrição Detalhada</label><textarea v-model="form.detailedDescription" rows="5" class="input-match area" placeholder="Descreva as funcionalidades..."></textarea></div>
              <div class="form-group"><label><i class="bi bi-github"></i> Repositório</label><input v-model="form.linkRepo" type="text" class="input-match" placeholder="https://github.com/..." /></div>
              <div class="form-group"><label><i class="bi bi-globe"></i> Deploy (Demo)</label><input v-model="form.linkDeploy" type="text" class="input-match" placeholder="https://..." /></div>
              
              <div class="form-group full-width">
                <label>Tecnologias</label>
                <div class="tags-container input-match">
                  <span v-for="(tag, idx) in form.tags" :key="idx" class="tag-pill-solid">
                    {{ tag }} 
                    <i class="bi bi-x" @click="removeTag(idx)"></i>
                  </span>
                  <input v-model="newTag" @keydown.enter.prevent="addTag" placeholder="Digite e Enter..." class="tag-input-field" />
                </div>
              </div>
            </div>
          </div>

          <footer class="modal-footer">
            <button v-if="isEditing" class="btn-delete-glass" @click="requestDelete" :disabled="isLoading">
              <i class="bi bi-trash"></i> Excluir Projeto
            </button>
            
            <div class="footer-actions" :class="{ 'ml-auto': !isEditing }">
              <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
              
              <button class="btn-save-white" @click="handleSave" :disabled="isLoading || isUploading">
                {{ isEditing ? 'Salvar' : 'Criar' }}
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
    message="Tem certeza? Isso removerá o projeto permanentemente."
    confirm-text="Excluir"
    cancel-text="Cancelar"
    :is-danger="true"
    @cancel="showDeleteConfirm = false"
    @confirm="confirmDeleteAction"
  />
</template>

<style scoped>
/* --- Backdrop --- */
.modal-backdrop { 
  position: fixed; inset: 0; 
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px); 
  z-index: 9999; 
  display: flex; justify-content: center; align-items: center; padding: 20px; 
}

/* --- Container --- */
.layout-modal { 
  background: rgba(12, 0, 55, 0.923); 
  backdrop-filter: blur(25px); 
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1); 
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6); 
  width: 100%; max-width: 900px; 
  border-radius: 24px; 
  display: flex; flex-direction: column; 
  max-height: 90vh; 
  animation: popUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden; 
  color: white;
}

@keyframes popUp { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }

/* --- Header --- */
.modal-header { 
  padding: 1.5rem 2.5rem; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.08); 
  display: flex; justify-content: space-between; align-items: flex-start; 
}
.header-text h3 { margin: 0; color: white; font-size: 1.8rem; font-weight: 700; letter-spacing: -0.5px; }
.header-text p { margin: 5px 0 0 0; color: rgba(255, 255, 255, 0.6); font-size: 0.95rem; }

.btn-close { 
  background: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(255, 255, 255, 0.05);
  width: 36px; height: 36px; border-radius: 50%; 
  color: rgba(255, 255, 255, 0.8); 
  cursor: pointer; transition: 0.2s; 
  display: flex; align-items: center; justify-content: center; 
}
.btn-close:hover { background: rgba(255, 255, 255, 0.15); color: white; }

/* --- Body --- */
.modal-body { 
  padding: 2rem 2.5rem; 
  overflow-y: auto; 
  scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.2) transparent; 
}
.modal-body::-webkit-scrollbar { width: 6px; }
.modal-body::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }

/* --- Galeria --- */
.image-gallery-section { margin-bottom: 2rem; }
.section-label { font-size: 1rem; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }

.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 12px; }

.upload-box { 
  height: 110px; 
  display: flex; flex-direction: column; align-items: center; justify-content: center; 
  cursor: pointer; color: rgba(255, 255, 255, 0.6); 
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1); 
  border-radius: 16px;
  transition: all 0.2s;
}
.upload-box:hover { 
  background: rgba(255, 255, 255, 0.08); 
  border-color: rgba(255, 255, 255, 0.4); 
  color: white; 
}

.gallery-item { height: 110px; border-radius: 16px; overflow: hidden; position: relative; border: 1px solid rgba(255, 255, 255, 0.1); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }
.gallery-item.is-cover { border: 2px solid var(--color-secondary); }

.item-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); opacity: 0; transition: 0.2s; display: flex; flex-direction: column; justify-content: center; align-items: center; backdrop-filter: blur(2px); }
.gallery-item:hover .item-overlay { opacity: 1; }
.badge-cover { position: absolute; top: 6px; left: 6px; background: var(--color-secondary); color: white; font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; }

.actions { display: flex; gap: 8px; }
.btn-icon-action { width: 32px; height: 32px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; background: rgba(255, 255, 255, 0.2); color: white; }
.btn-icon-action:hover { background: white; color: var(--color-primary); }

/* --- Form --- */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.full-width { grid-column: span 2; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); }

.input-match { 
  width: 100%; box-sizing: border-box; 
  padding: 1rem 1.2rem; 
  background: rgba(255, 255, 255, 0.03); 
  border: 1px solid rgba(255, 255, 255, 0.1); 
  border-radius: 16px; 
  font-size: 0.95rem; 
  color: white; 
  transition: all 0.3s; 
}
.input-match:focus { 
  background: rgba(255, 255, 255, 0.08); 
  border-color: var(--color-primary); 
  box-shadow: 0 5px 20px rgba(0,0,0,0.1); 
  outline: none; 
}
.input-match::placeholder { color: rgba(255, 255, 255, 0.3); }
.input-match.area { resize: vertical; min-height: 100px; }

/* --- Tags --- */
.tags-container { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; min-height: 54px; }
.tag-input-field { border: none; background: transparent; flex: 1; min-width: 120px; font-size: 0.9rem; color: white; outline: none; }

.tag-pill-solid { 
  background: rgba(59, 130, 246, 0.2); 
  border: 1px solid rgba(59, 130, 246, 0.5);
  color: #93c5fd; 
  padding: 5px 14px; border-radius: 20px; 
  font-size: 0.8rem; font-weight: 700; 
  display: flex; align-items: center; gap: 6px; 
  transition: 0.2s;
}
.tag-pill-solid:hover { background: rgba(59, 130, 246, 0.4); border-color: #60a5fa; color: white; }
.tag-pill-solid i { cursor: pointer; opacity: 0.7; }
.tag-pill-solid i:hover { opacity: 1; }

/* --- Footer --- */
.modal-footer { 
  padding: 1.5rem 2.5rem; 
  border-top: 1px solid rgba(255, 255, 255, 0.08); 
  display: flex; justify-content: space-between; align-items: center; 
}
.footer-actions { display: flex; gap: 1rem; }
.ml-auto { margin-left: auto; }

/* BOTÃO EXCLUIR*/
.btn-delete-glass { 
  color: rgba(239, 68, 68, 0.8); 
  background: rgba(239, 68, 68, 0.05); 
  border: 1px solid rgba(239, 68, 68, 0.3); 
  cursor: pointer; font-weight: 600; font-size: 0.9rem; 
  display: flex; align-items: center; gap: 8px;
  padding: 0.7rem 1.4rem;
  border-radius: 12px;
  transition: all 0.3s ease; 
}
.btn-delete-glass:hover { 
  background: rgba(239, 68, 68, 0.15); 
  border-color: rgba(239, 68, 68, 0.6);
  color: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
}

.btn-cancel { 
  padding: 0.7rem 1.5rem; 
  border: 1px solid rgba(255, 255, 255, 0.1); 
  background: rgba(255, 255, 255, 0.03); 
  border-radius: 12px; cursor: pointer; 
  font-weight: 500; color: rgba(255, 255, 255, 0.9); 
  font-size: 0.95rem; transition: 0.2s; 
}
.btn-cancel:hover { background: rgba(255, 255, 255, 0.1); color: white; border-color: rgba(255, 255, 255, 0.3); }

/* BOTÃO SALVAR*/
.btn-save-white { 
  padding: 0.7rem 2.2rem; 
  border-radius: 12px; cursor: pointer; 
  border: 1px solid rgba(255, 255, 255, 0.25);
  font-weight: 700; color: white; font-size: 0.95rem; 
  background: rgba(255, 255, 255, 0.282); 
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1); 
  transition: all 0.3s ease; 
}
.btn-save-white:hover { 
  background: rgba(255, 255, 255, 0.95); 
  border-color: white;
  color: var(--color-primary); 
  transform: translateY(-2px); 
}
.btn-save-white:disabled { opacity: 0.6; cursor: wait; transform: none; }

@media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; gap: 1rem; } .full-width { grid-column: span 1; } .modal-container { max-height: 100vh; border-radius: 0; } .modal-body { padding: 1.5rem; } .modal-footer { flex-direction: column; gap: 1rem; } .footer-actions { width: 100%; justify-content: space-between; } .btn-save-white, .btn-cancel { flex: 1; } .btn-delete-glass { width: 100%; justify-content: center; } }
</style>