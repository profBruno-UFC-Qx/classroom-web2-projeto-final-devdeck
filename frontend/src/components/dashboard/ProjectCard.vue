<script setup lang="ts">
import type { Project } from '@/stores/portfolio'

defineProps<{
  project: Project
}>()

defineEmits(['open'])
</script>

<template>
  <div class="card-container" @click="$emit('open')">
    
    <div class="image-wrapper">
      <img 
        :src="(project.images && project.images.length > 0) ? project.images[0] : 'https://via.placeholder.com/400x250/333/fff?text=DevDeck'" 
        alt="Capa do Projeto" 
        class="project-img"
      />
    </div>

    <div class="card-footer">
      <h3>{{ project.title }}</h3>
    </div>

    <div class="overlay">
      <div class="gear-icon">
        <i class="bi bi-gear-fill"></i>
      </div>
      <span>Gerenciar</span>
    </div>

  </div>
</template>

<style scoped>
.card-container {
  /* --- ESTILO BASE --- */
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  border: none; 
  border-radius: 16px;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  overflow: hidden;
  
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  display: flex;
  flex-direction: column;
  height: 340px; 
  position: relative; 
}

.card-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.25);
}

/* --- Imagem Wrapper --- */
.image-wrapper {
  flex: 1; 
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}

.card-container:hover .project-img {
  transform: scale(1.1);
}

/* --- Footer --- */
.card-footer {
  padding: 1.2rem;
  background: rgba(0, 0, 0, 0.2);
  text-align: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.card-footer h3 {
  margin: 0;
  font-size: 1.1rem;
  color: white;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* --- Overlay --- */
.overlay {
  position: absolute;
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px); 
  
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  transition: opacity 0.3s ease;
  
  z-index: 10; 
}

.card-container:hover .overlay {
  opacity: 1;
}

.gear-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #ffffff;
  animation: spin 4s linear infinite; 
}

.overlay span {
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

@keyframes spin { 
  from { transform: rotate(0deg); } 
  to { transform: rotate(360deg); } 
}
</style>