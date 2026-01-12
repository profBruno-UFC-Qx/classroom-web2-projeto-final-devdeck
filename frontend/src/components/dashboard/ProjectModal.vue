<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Project } from '@/stores/portfolio'
import { api } from '@/services/api'

// --- Props & Emits ---
const props = defineProps<{
  isOpen: boolean
  projectToEdit?: Project | null
  isLoading: boolean
}>()

const emit = defineEmits(['close', 'save', 'delete'])

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

// --- Computed ---
const isEditing = computed(() => !!props.projectToEdit)
const modalTitle = computed(() => isEditing.value ? 'Gerenciar Projeto' : 'Cadastrar Novo Projeto')

// --- Watchers ---
watch(() => props.projectToEdit, (newVal) => {
  if (newVal) {
    form.value = JSON.parse(JSON.stringify(newVal))
    if (!form.value.images) form.value.images = []
  } else {
    form.value = { title: '', tags: [], images: [] }
  }
}, { immediate: true })

// --- Project Actions ---
function handleSave() {
  emit('save', form.value)
}

function handleDelete() {
  if (confirm('Tem certeza absoluta?')) {
    emit('delete', form.value.id)
  }
}

// --- Gallery Logic ---
function triggerFileInput() {
  if ((form.value.images?.length || 0) >= 5) {
    alert('Máximo de 5 fotos permitido.')
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
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erro ao fazer upload.')
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
  const imageToMove = form.value.images?.splice(index, 1)[0]
  if (imageToMove) {
    form.value.images?.unshift(imageToMove)
  }
}

// --- Tag Management ---
function addTag() {
  const val = newTag.value.trim()
  if (val && !form.value.tags?.includes(val)) {
    if (!form.value.tags) form.value.tags = []
    form.value.tags.push(val)
  }
  newTag.value = ''
}

function removeTag(index: number) {
  form.value.tags?.splice(index, 1)
}
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal-container">
        
        <header class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button class="btn-close" @click="$emit('close')"><i class="bi bi-x-lg"></i></button>
        </header>

        <div class="modal-body">
          <div class="image-gallery-section">
            <div class="gallery-header">
              <label>Galeria ({{ form.images?.length || 0 }}/5)</label>
              <small>A primeira foto será a capa. Clique na estrela para definir.</small>
            </div>

            <div class="gallery-grid">
              <div 
                class="upload-box" 
                @click="triggerFileInput"
                v-if="(form.images?.length || 0) < 5"
                :class="{ 'disabled': isUploading }"
              >
                <i class="bi" :class="isUploading ? 'bi-hourglass-split' : 'bi-camera-fill'"></i>
                <span>{{ isUploading ? '...' : 'Adicionar' }}</span>
              </div>

              <div 
                v-for="(img, index) in form.images" 
                :key="img" 
                class="gallery-item"
                :class="{ 'is-cover': index === 0 }"
              >
                <img :src="img" />
                <div class="actions-overlay">
                  <button class="btn-icon star" @click.stop="makeCover(index)" title="Capa" v-if="index !== 0">
                    <i class="bi bi-star"></i>
                  </button>
                  <span v-else class="cover-badge">Capa</span>

                  <button class="btn-icon trash" @click.stop="removeImage(index)">
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </div>
              </div>
            </div>

            <input type="file" ref="fileInput" hidden accept="image/*" @change="onFileSelected" />
          </div>

          <div class="form-grid">
            <div class="form-group full">
              <label>Título</label>
              <input v-model="form.title" type="text" placeholder="Ex: App de Delivery" />
            </div>
            <div class="form-group full">
              <label>Descrição Curta</label>
              <input v-model="form.shortDescription" type="text" placeholder="Resumo em uma frase" />
            </div>
            <div class="form-group full">
              <label>Descrição Detalhada</label>
              <textarea v-model="form.detailedDescription" rows="4" placeholder="Detalhes do projeto..."></textarea>
            </div>
            <div class="form-group">
              <label><i class="bi bi-github"></i> Repositório</label>
              <input v-model="form.linkRepo" type="text" />
            </div>
            <div class="form-group">
              <label><i class="bi bi-globe"></i> Deploy</label>
              <input v-model="form.linkDeploy" type="text" />
            </div>
            <div class="form-group full">
              <label>Tecnologias</label>
              <div class="tags-input">
                <span v-for="(tag, idx) in form.tags" :key="idx" class="tag-pill">
                  {{ tag }} <i class="bi bi-x" @click="removeTag(idx)"></i>
                </span>
                <input v-model="newTag" @keydown.enter.prevent="addTag" placeholder="Digite e Enter..." />
              </div>
            </div>
          </div>
        </div>

        <footer class="modal-footer">
          <button v-if="isEditing" class="btn-delete" @click="handleDelete" :disabled="isLoading">
            <i class="bi bi-trash"></i> Excluir
          </button>
          <div class="right-actions">
            <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
            <button class="btn-save" @click="handleSave" :disabled="isLoading || isUploading">
              {{ isEditing ? 'Salvar' : 'Criar' }}
            </button>
          </div>
        </footer>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* --- Modal Layout --- */
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px); z-index: 2000; display: flex; justify-content: center; align-items: center; padding: 20px; }
.modal-container { background: white; width: 100%; max-width: 700px; border-radius: 20px; display: flex; flex-direction: column; max-height: 90vh; animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }

@keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.modal-header { padding: 1.5rem 2rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; color: var(--color-primary); font-size: 1.5rem; }
.btn-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #999; }
.modal-body { padding: 2rem; overflow-y: auto; }

/* --- Gallery Styling --- */
.gallery-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.gallery-header label { font-weight: 700; color: #555; }
.gallery-header small { color: #888; font-size: 0.8rem; }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; margin-bottom: 2rem; }

.upload-box {
  height: 100px; border: 2px dashed #ccc; border-radius: 12px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer; color: #999; transition: 0.2s; background: #f9f9f9;
}
.upload-box:hover { border-color: var(--color-primary); color: var(--color-primary); background: #f0f7ff; }
.upload-box.disabled { opacity: 0.5; pointer-events: none; }

.gallery-item { height: 100px; border-radius: 12px; overflow: hidden; position: relative; border: 1px solid #eee; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }
.gallery-item.is-cover { border: 3px solid var(--color-secondary); }

.actions-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); opacity: 0; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
.gallery-item:hover .actions-overlay { opacity: 1; }

.cover-badge { background: var(--color-secondary); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; position: absolute; top: 5px; left: 5px; }

.btn-icon { width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; transition: 0.2s; }
.btn-icon.star:hover { background: #f1c40f; }
.btn-icon.trash:hover { background: #e74c3c; }

/* --- Form Components --- */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.full { grid-column: span 2; }
.form-group label { display: block; margin-bottom: 0.3rem; font-weight: 600; font-size: 0.9rem; color: #555; }
.form-group input, .form-group textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-family: inherit; }

.tags-input { display: flex; flex-wrap: wrap; gap: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 8px; }
.tags-input input { border: none; outline: none; flex: 1; min-width: 100px; }
.tag-pill { background: var(--color-secondary); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; }

/* --- Footer & Actions --- */
.modal-footer { padding: 1.5rem 2rem; border-top: 1px solid #eee; background: #fafafa; display: flex; justify-content: space-between; border-radius: 0 0 20px 20px; }
.btn-delete { color: #e74c3c; background: none; border: none; cursor: pointer; font-weight: 600; }
.btn-cancel { padding: 10px 20px; border: 1px solid #ddd; background: white; border-radius: 8px; cursor: pointer; font-weight: 600; color: #666; }
.btn-save { padding: 10px 20px; border: none; background: var(--color-primary); color: white; border-radius: 8px; cursor: pointer; font-weight: 600; }
.btn-save:hover { background: var(--color-highlight); }
.btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
</style>