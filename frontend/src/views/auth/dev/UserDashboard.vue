<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePortfolioStore, type Project } from '@/stores/portfolio'
import { useToastStore } from '@/stores/toast' 

// Components
import ProjectCard from '@/components/dashboard/ProjectCard.vue'
import ProjectModal from '@/components/dashboard/ProjectModal.vue'

// --- Setup & State ---
const store = usePortfolioStore()
const toast = useToastStore() 
const { projects, isLoading } = storeToRefs(store)

const isModalOpen = ref(false)
const selectedProject = ref<Project | null>(null)
const isActionLoading = ref(false)

// --- Lifecycle ---
onMounted(async () => {
  await store.fetchProjects()
})

// --- Modal Handlers ---
function openNewProject() {
  selectedProject.value = null
  isModalOpen.value = true
}

function openEditProject(project: Project) {
  selectedProject.value = project
  isModalOpen.value = true
}

// --- Persistence Methods ---
async function handleSave(projectData: Partial<Project>) {
  isActionLoading.value = true
  try {
    if (selectedProject.value) {
      // Edição
      await store.updateProject({ ...projectData, id: selectedProject.value.id })
      toast.success('Projeto atualizado com sucesso!') 
    } else {
      // Criação
      await store.createNewProject(projectData)
      toast.success('Novo projeto criado!')
    }
    isModalOpen.value = false
  } catch (error: any) {
    // Feedback Erro
    toast.error(error.message || 'Erro ao salvar projeto.') 
  } finally {
    isActionLoading.value = false
  }
}

async function handleDelete(id: number) {
  isActionLoading.value = true
  try {
    await store.removeProject(id)
    
    // Feedback Sucesso na Exclusão
    toast.success('Projeto removido com sucesso.') 
    
    isModalOpen.value = false
  } catch (error) {
    // Feedback Erro
    toast.error('Não foi possível excluir o projeto.')
  } finally {
    isActionLoading.value = false
  }
}
</script>

<template>
  <div class="view-content">
    
    <div class="toolbar">
      <button class="btn-action-white" @click="openNewProject">
        <i class="bi bi-plus-lg"></i> 
        <span>Novo Projeto</span>
      </button>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Carregando projetos...</p>
    </div>

    <div v-else-if="projects.length > 0" class="projects-grid">
      <ProjectCard 
        v-for="project in projects" 
        :key="project.id" 
        :project="project"
        @open="openEditProject(project)"
      />
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="bi bi-folder-plus"></i>
      </div>
      <h3>Comece seu portfólio!</h3>
      <p>Clique em "Novo Projeto" acima para adicionar seu primeiro trabalho.</p>
    </div>

    <ProjectModal
      :is-open="isModalOpen"
      :project-to-edit="selectedProject"
      :is-loading="isActionLoading"
      @close="isModalOpen = false"
      @save="handleSave"
      @delete="handleDelete"
    />

  </div>
</template>

<style scoped>
/* --- View Wrapper --- */
.view-content {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* --- Toolbar --- */
.toolbar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 2rem;
  align-items: center;
}

/* --- Botão Novo Design --- */
.btn-action-white {
  background: #ffffff; 
  color: var(--color-primary); 
  border: none;
  padding: 0.7rem 1.5rem; 
  border-radius: 50px; 
  font-weight: 700;
  font-size: 0.95rem;
  display: flex; 
  align-items: center; 
  gap: 10px; 
  cursor: pointer; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.btn-action-white i { font-size: 1.1rem; font-weight: bold; }
.btn-action-white:hover { transform: scale(1.05); }
.btn-action-white:active { transform: scale(0.95); }

/* --- Grid --- */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

/* --- Loading --- */
.loading-state { text-align: center; padding: 4rem; color: rgba(255,255,255,0.7); }
.spinner { 
  width: 40px; height: 40px; 
  border: 4px solid rgba(255,255,255,0.1); 
  border-top-color: var(--color-primary); 
  border-radius: 50%; 
  animation: spin 1s linear infinite; 
  margin: 0 auto 1rem; 
}
@keyframes spin { to { transform: rotate(360deg); } }

/* --- Empty State  --- */
.empty-state { 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  
  /* Layout e Espaçamento */
  width: auto;
  margin: 0 1rem; 
  box-sizing: border-box; 
  
  /* Visual Glass */
  background: rgba(255, 255, 255, 0.03);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  
  transition: all 0.3s ease;
}

.empty-state:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.4);
}

.empty-icon {
  font-size: 4rem; 
  margin-bottom: 1.5rem;
  color: #ffffff; 
  opacity: 0.9;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.empty-state h3 { 
  font-size: 1.8rem; 
  margin-bottom: 0.5rem; 
  color: white; 
  font-weight: 700;
  text-align: center;
}

.empty-state p { 
  font-size: 1.1rem; 
  opacity: 0.8; 
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

/* --- Responsive --- */
@media (max-width: 600px) {
  .btn-action-white { width: 100%; justify-content: center; }
  .projects-grid { grid-template-columns: 1fr; }
  .empty-state { margin: 0; }
}
</style>