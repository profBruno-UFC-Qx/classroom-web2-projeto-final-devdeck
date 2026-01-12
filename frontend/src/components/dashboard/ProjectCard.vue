<script setup lang="ts">
import type { Project } from '@/stores/portfolio'

defineProps<{
  project: Project
}>()

// Emite evento quando clicado
defineEmits(['open'])
</script>

<template>
  <div class="card-container" @click="$emit('open')">
    
    <div class="image-wrapper">
      <img 
        :src="(project.images && project.images.length > 0) ? project.images[0] : 'https://via.placeholder.com/400x250?text=Sem+Capa'" 
        alt="Capa do Projeto" 
        class="project-img"
      />
      
      <div class="overlay">
        <div class="gear-icon">
          <i class="bi bi-gear-fill"></i>
        </div>
        <span>Gerenciar</span>
      </div>
    </div>

    <div class="card-footer">
      <h3>{{ project.title }}</h3>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 280px; /* Altura fixa para uniformidade */
}

.card-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}

/* --- Imagem --- */
.image-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-container:hover .project-img {
  transform: scale(1.15); /* Zoom in */
}

/* --- Overlay e Blur --- */
.overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px); /* O Blur mágico */
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  transition: opacity 0.3s ease;
}

.card-container:hover .overlay {
  opacity: 1;
}

.gear-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  animation: spin 4s linear infinite; /* Roda devagar */
}

@keyframes spin { 
  from { transform: rotate(0deg); } 
  to { transform: rotate(360deg); } 
}

/* --- Footer --- */
.card-footer {
  padding: 1.2rem;
  background: white;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  z-index: 2;
}

.card-footer h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>