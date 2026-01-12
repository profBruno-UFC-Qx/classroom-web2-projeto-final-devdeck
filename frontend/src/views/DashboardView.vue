<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePortfolioStore, type Project } from '@/stores/portfolio'

// Components
import ProjectCard from '@/components/dashboard/ProjectCard.vue'
import ProjectModal from '@/components/dashboard/ProjectModal.vue'

// --- Setup & State ---
const store = usePortfolioStore()
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
      await store.updateProject({ ...projectData, id: selectedProject.value.id })
    } else {
      await store.createNewProject(projectData)
    }
    isModalOpen.value = false
  } catch (error: any) {
    alert(error.message)
  } finally {
    isActionLoading.value = false
  }
}

async function handleDelete(id: number) {
  isActionLoading.value = true
  try {
    await store.removeProject(id)
    isModalOpen.value = false
  } catch (error) {
    alert('Erro ao deletar o projeto.')
  } finally {
    isActionLoading.value = false
  }
}
</script>

<template>
  <div class="dashboard-container">
    
    <div class="dash-header">
      <div class="greeting">
        <h1>Meus Projetos</h1>
        <p>Gerencie seu portfólio e mostre seu melhor trabalho.</p>
      </div>
      
      <button class="btn-new" @click="openNewProject">
        <i class="bi bi-plus-lg"></i> Novo Projeto
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
      <i class="bi bi-folder-plus"></i>
      <h3>Comece seu portfólio!</h3>
      <p>Clique em "Novo Projeto" para adicionar seu primeiro trabalho.</p>
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
/* --- Layout Container --- */
.dashboard-container {
  padding: 120px 2rem 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

/* --- Dashboard Header --- */
.dash-header {
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  padding: 2.5rem 3rem;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  margin-bottom: 3rem; 
  color: white;
  flex-wrap: wrap; 
  gap: 1rem;
}

.greeting h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
.greeting p { color: rgba(255, 255, 255, 0.9); font-size: 1rem; }

.btn-new {
  background: white; 
  color: var(--color-primary); 
  border: none;
  padding: 0.9rem 1.8rem; 
  border-radius: 50px; 
  font-weight: 700;
  display: flex; 
  align-items: center; 
  gap: 10px; 
  cursor: pointer; 
  transition: 0.3s; 
  white-space: nowrap;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.btn-new:hover { 
  background: #f0f7ff; 
  transform: translateY(-3px); 
  box-shadow: 0 6px 20px rgba(0,0,0,0.2); 
}

/* --- Content Display --- */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.loading-state, .empty-state { text-align: center; padding: 4rem; color: #999; }

.spinner { 
  width: 40px; 
  height: 40px; 
  border: 4px solid #eee; 
  border-top-color: var(--color-primary); 
  border-radius: 50%; 
  animation: spin 1s linear infinite; 
  margin: 0 auto 1rem; 
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-state i { font-size: 3rem; margin-bottom: 1rem; display: block; opacity: 0.5; }

/* --- Responsive Breakpoints --- */
@media (max-width: 900px) {
  .dashboard-container { padding: 100px 1rem 2rem 1rem; }
  .dash-header { flex-direction: column; align-items: flex-start; padding: 2rem; }
  .btn-new { margin-top: 1rem; width: 100%; justify-content: center; }
}
</style>