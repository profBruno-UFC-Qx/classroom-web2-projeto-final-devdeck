<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Project {
  id: number
  title: string
  shortDescription: string
  detailedDescription: string
  imageUrl: string
  images: string[]
  tags: string[]
  linkRepo?: string
  linkDeploy?: string
}

const props = defineProps<{
  isOpen: boolean
  project: Project | null
}>()

const emit = defineEmits(['close'])

// --- Lógica do Carrossel ---
const currentImageIndex = ref(0)

watch(() => props.project, () => {
  currentImageIndex.value = 0
})

const currentImage = computed(() => {
  if (!props.project?.images || props.project.images.length === 0) {
    return props.project?.imageUrl || null 
  }
  return props.project.images[currentImageIndex.value]
})

function nextImage() {
  if (!props.project?.images || props.project.images.length === 0) return
  if (currentImageIndex.value < props.project.images.length - 1) {
    currentImageIndex.value++
  } else {
    currentImageIndex.value = 0 
  }
}

function prevImage() {
  if (!props.project?.images || props.project.images.length === 0) return
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  } else {
    currentImageIndex.value = props.project.images.length - 1
  }
}

function setImage(index: number) {
  currentImageIndex.value = index
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen && project" class="modal-backdrop" @click.self="$emit('close')">
        
        <div class="modal-container devdeck-deep-glass">
          
          <button class="btn-close-absolute" @click="$emit('close')">
            <i class="bi bi-x-lg"></i>
          </button>

          <div class="modal-content-grid">
            
            <div class="carousel-column">
              <div class="main-image-wrapper">
                <img v-if="currentImage" :src="currentImage" :alt="project.title" class="main-img" />
                <div v-else class="no-image-placeholder">
                  <i class="bi bi-image"></i>
                  <span>Sem imagem</span>
                </div>

                <div v-if="project.images && project.images.length > 1" class="nav-overlay">
                  <button class="nav-btn prev" @click.stop="prevImage"><i class="bi bi-chevron-left"></i></button>
                  <button class="nav-btn next" @click.stop="nextImage"><i class="bi bi-chevron-right"></i></button>
                </div>
              </div>

              <div v-if="project.images && project.images.length > 1" class="thumbnails-track">
                <div 
                  v-for="(img, idx) in project.images" 
                  :key="img" 
                  class="thumb-item"
                  :class="{ active: currentImageIndex === idx }"
                  @click="setImage(idx)"
                >
                  <img :src="img" />
                </div>
              </div>
            </div>

            <div class="info-column">
              
              <header class="info-header">
                <h2 class="project-title">{{ project.title }}</h2>
                <p class="project-short">{{ project.shortDescription }}</p>
                
                <div class="project-links">
                  <a v-if="project.linkDeploy" :href="project.linkDeploy" target="_blank" class="btn-link">
                    <i class="bi bi-globe"></i> Ver Projeto
                  </a>
                  <a v-if="project.linkRepo" :href="project.linkRepo" target="_blank" class="btn-link">
                    <i class="bi bi-github"></i> Código
                  </a>
                </div>
              </header>

              <div class="tags-wrapper">
                <span v-for="tag in project.tags" :key="tag" class="tech-tag">
                  {{ tag }}
                </span>
              </div>

              <div class="separator"></div>

              <div class="detailed-desc">
                <h3>Sobre o Projeto</h3>
                <p>{{ project.detailedDescription || 'Nenhuma descrição detalhada fornecida.' }}</p>
              </div>

            </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
.devdeck-deep-glass { 
  background: rgba(12, 0, 55, 0.738);
  backdrop-filter: blur(25px); 
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1); 
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6); 
  width: 100%; max-width: 1100px; 
  height: 85vh; 
  border-radius: 24px; 
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: white;
}

@keyframes modalEnter { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }

/* Botão Fechar */
.btn-close-absolute {
  position: absolute; top: 20px; right: 20px; z-index: 10;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;
  width: 40px; height: 40px; border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: 0.2s;
}
.btn-close-absolute:hover { background: rgba(255, 255, 255, 0.15); transform: rotate(90deg); }

/* --- Layout --- */
.modal-content-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr; 
  height: 100%;
  overflow: hidden;
}

/* --- Coluna Esquerda --- */
.carousel-column {
  background: rgba(0,0,0,0.2); 
  padding: 2rem;
  display: flex; flex-direction: column; justify-content: center; gap: 1rem;
  border-right: 1px solid rgba(255,255,255,0.05);
}

.main-image-wrapper {
  position: relative;
  flex: 1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  background: rgba(12, 0, 55, 0.975);
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255,255,255,0.05);
}

.main-img { width: 100%; height: 100%; object-fit: contain; }

.no-image-placeholder { display: flex; flex-direction: column; align-items: center; color: rgba(255,255,255,0.3); gap: 10px; }
.no-image-placeholder i { font-size: 3rem; }

.nav-overlay {
  position: absolute; inset: 0; display: flex; justify-content: space-between; align-items: center; padding: 0 15px; pointer-events: none;
}
.nav-btn {
  pointer-events: auto;
  background: rgba(0,0,0,0.5); color: white; border: 1px solid rgba(255,255,255,0.2);
  width: 44px; height: 44px; border-radius: 50%; cursor: pointer; transition: 0.2s;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}
.nav-btn:hover { background: var(--color-primary); border-color: var(--color-primary); transform: scale(1.1); }

.thumbnails-track {
  height: 80px;
  display: flex; gap: 10px;
  overflow-x: auto;
  padding: 5px;
  justify-content: center; 
  scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent;
}
.thumb-item {
  width: 90px; height: 60px; flex-shrink: 0;
  border-radius: 8px; overflow: hidden; cursor: pointer;
  border: 2px solid transparent; opacity: 0.6; transition: 0.2s;
  background: rgba(0,0,0,0.2);
}
.thumb-item img { width: 100%; height: 100%; object-fit: cover; }
.thumb-item:hover { opacity: 1; }
.thumb-item.active { border-color: var(--color-primary); opacity: 1; transform: scale(1.05); box-shadow: 0 0 15px rgba(0,0,0,0.3); }

/* --- Coluna Direita --- */
.info-column {
  padding: 3rem 2.5rem;
  overflow-y: auto; 
  display: flex; flex-direction: column;
}
.info-column::-webkit-scrollbar { width: 6px; }
.info-column::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }

.project-title { font-size: 2.2rem; font-weight: 800; margin: 0 0 0.5rem 0; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
.project-short { font-size: 1.1rem; color: rgba(255,255,255,0.7); margin-bottom: 2rem; line-height: 1.5; font-weight: 300; }

.project-links { display: flex; gap: 1rem; margin-bottom: 2rem; }

.btn-link {
  flex: 1;
  padding: 0.9rem;
  border-radius: 14px;
  text-decoration: none;
  font-weight: 600;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: all 0.2s ease;
  background: rgba(255,255,255,0.05); 
  border: 1px solid rgba(255,255,255,0.15); 
  color: white; 
}

.btn-link:hover { 
  background: rgba(255,255,255,0.1); 
  border-color: rgba(255,255,255,0.4); 
  transform: translateY(-2px); 
}

.tags-wrapper { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 1.5rem; }
.tech-tag {
  background: rgba(255,255,255,0.05); 
  border: 1px solid rgba(255,255,255,0.1);
  color: #e2e8f0; 
  padding: 6px 14px; border-radius: 20px; 
  font-size: 0.85rem; font-weight: 600;
}

.separator { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); margin: 1rem 0 2rem 0; }

.detailed-desc h3 { font-size: 1.3rem; color: white; margin-bottom: 1rem; display: flex; align-items: center; gap: 10px; }
.detailed-desc h3::before { content: ''; display: block; width: 4px; height: 20px; background: white; border-radius: 2px; }
.detailed-desc p { 
  color: rgba(255,255,255,0.8); 
  line-height: 1.8; 
  font-size: 1rem; 
  white-space: pre-wrap; 
  font-weight: 400;
}

/* --- Responsivo --- */
@media (max-width: 900px) {
  .modal-content-grid { grid-template-columns: 1fr; grid-template-rows: auto 1fr; overflow-y: auto; }
  .devdeck-deep-glass { height: 95vh; max-width: 95vw; }
  .carousel-column { padding: 1.5rem; min-height: auto; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .info-column { padding: 1.5rem; overflow-y: visible; }
  .main-image-wrapper { height: 250px; }
  .btn-close-absolute { top: 15px; right: 15px; background: rgba(0,0,0,0.5); }
}
</style>