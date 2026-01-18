<script setup lang="ts">
// --- IMPORTAÇÕES ---
import { ref, onMounted, watch } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { storeToRefs } from 'pinia'
import ProjectModal from '@/components/dashboard/ProjectModal.vue'

// --- CONFIGURAÇÃO DA STORE ---
const adminStore = useAdminStore()
const { projects, isLoading } = storeToRefs(adminStore)

// --- ESTADOS DO MODAL ---
const showProjectModal = ref(false)
const projectToEdit = ref<any>(null)
const isModalLoading = ref(false)

// --- ESTADOS DE FILTRO E PAGINAÇÃO ---
const searchQuery = ref('')
const currentPage = ref(1)
const ITEMS_PER_PAGE = 5 

// --- CICLO DE VIDA (LIFECYCLE) ---
onMounted(() => {
  fetchData()
})

// --- MÉTODOS: BUSCA DE DADOS ---
async function fetchData() {
  const params = {
    page: currentPage.value,
    limit: ITEMS_PER_PAGE,
    search: searchQuery.value
  }
  await adminStore.fetchProjects(params)
}

// --- UTILITÁRIOS: DEBOUNCE ---
function customDebounce(func: Function, wait: number) {
  let timeout: number | undefined
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// --- WATCHERS (OBSERVADORES) ---
watch(searchQuery, customDebounce(() => {
  currentPage.value = 1 
  fetchData()
}, 500))

// --- MÉTODOS: NAVEGAÇÃO ---
function nextPage() {
  currentPage.value++
  fetchData()
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchData()
  }
}

// --- MÉTODOS: FORMATAÇÃO E UI ---
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

function openEditProject(proj: any) {
  projectToEdit.value = proj
  showProjectModal.value = true
}

// --- MÉTODOS: AÇÕES DE SALVAMENTO E EXCLUSÃO ---
async function handleSaveProject(formData: any) {
  if (!projectToEdit.value?.id) return
  isModalLoading.value = true
  const success = await adminStore.updateProject(projectToEdit.value.id, formData)
  isModalLoading.value = false
  if (success) {
    showProjectModal.value = false
    projectToEdit.value = null
    fetchData()
  }
}

async function handleDeleteProject(id: number) {
  isModalLoading.value = true
  const success = await adminStore.deleteProject(id)
  isModalLoading.value = false
  if (success) {
    showProjectModal.value = false
    projectToEdit.value = null
    fetchData()
  }
}
</script>

<template>
  <div class="admin-panel">
    
    <div class="panel-header-controls">
      <div class="control-item search-wrapper">
        <i class="bi bi-search"></i>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar projeto..."
        />
      </div>
    </div>

    <div class="glass-table-container">
      
      <div v-if="isLoading" class="loading-state">
        <i class="bi bi-hourglass-split"></i> Carregando projetos...
      </div>

      <table v-else class="glass-table">
        <thead>
          <tr>
            <th>Projeto</th>
            <th>Dono</th>
            <th>Data Criação</th>
            <th class="actions-col">Gerenciar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="proj in projects" :key="proj.id">
            <td>
              <div class="user-cell">
                <div class="project-icon"><i class="bi bi-window-stack"></i></div>
                <strong>{{ proj.title }}</strong>
              </div>
            </td>
            <td>
              <div class="user-cell" style="font-size: 0.9rem; opacity: 0.9;">
                <i class="bi bi-person-circle" style="color: var(--color-secondary);"></i>
                {{ proj.user?.name || 'Desconhecido' }}
              </div>
            </td>
            <td>{{ formatDate(proj.createdAt) }}</td>
            <td class="actions-cell">
              <button class="btn-icon manage" @click="openEditProject(proj)" title="Editar Projeto">
                <i class="bi bi-gear-fill"></i>
              </button>
            </td>
          </tr>
          
          <tr v-if="projects.length === 0">
            <td colspan="4" class="empty-cell">Nenhum projeto cadastrado.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-external">
      <button @click="prevPage" :disabled="currentPage === 1" class="page-pill">
        <i class="bi bi-chevron-left"></i> Anterior
      </button>
      
      <span class="page-indicator">Página {{ currentPage }}</span>
      
      <button @click="nextPage" class="page-pill">
          Próxima <i class="bi bi-chevron-right"></i>
      </button>
    </div>

    <ProjectModal 
      :is-open="showProjectModal"
      :project-to-edit="projectToEdit"
      :is-loading="isModalLoading"
      @close="showProjectModal = false"
      @save="handleSaveProject"
      @delete="handleDeleteProject"
    />
  </div>
</template>

<style scoped>
/* --- ESTRUTURA E ANIMAÇÕES --- */
.admin-panel { width: 100%; animation: fadeIn 0.5s ease; display: flex; flex-direction: column; gap: 1.5rem; min-height: 600px; }
.panel-header-controls { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }

/* --- CAMPOS DE BUSCA --- */
.control-item { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; height: 45px; display: flex; align-items: center; transition: all 0.2s; }
.control-item.search-wrapper { padding: 0 16px; gap: 10px; width: 300px; color: rgba(255,255,255,0.5); cursor: text; }
.control-item.search-wrapper:focus-within { background: rgba(255, 255, 255, 0.1); border-color: var(--color-primary); color: white; }
.search-wrapper input { background: transparent; border: none; outline: none; color: white; width: 100%; font-size: 0.95rem; font-weight: 500; height: 100%; }
.search-wrapper input::placeholder { color: rgba(255,255,255,0.4); }

/* --- TABELA GLASSMORPHISM --- */
.glass-table-container { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; overflow: hidden; flex: 1; }
.glass-table { width: 100%; border-collapse: collapse; color: white; }
.glass-table th { text-align: left; padding: 1.2rem; color: rgba(255,255,255,0.5); font-size: 0.85rem; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.1); }
.glass-table th.actions-col { text-align: center; width: 140px; }
.glass-table td { padding: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: middle; }
.glass-table tr:hover { background: rgba(255,255,255,0.03); }

/* --- PAGINAÇÃO --- */
.pagination-external { display: flex; justify-content: center; align-items: center; gap: 20px; padding: 10px 0; margin-top: auto; }
.page-pill { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); color: white; padding: 10px 24px; border-radius: 50px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 600; transition: 0.2s; }
.page-pill:hover:not(:disabled) { background: white; color: var(--color-primary); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
.page-pill:disabled { opacity: 0.4; cursor: not-allowed; }
.page-indicator { font-size: 1rem; font-weight: 700; color: rgba(255,255,255,0.8); letter-spacing: 0.5px; }

/* --- ELEMENTOS DA CÉLULA E ÍCONES --- */
.user-cell { display: flex; align-items: center; gap: 12px; }
.project-icon { width: 30px; height: 30px; background: rgba(255,255,255,0.1); color: #a78bfa; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
.actions-cell { display: flex; gap: 12px; justify-content: center; align-items: center; }

/* --- BOTÕES DE AÇÃO --- */
.btn-icon { background: rgba(255,255,255,0.1); border: none; color: white; width: 40px; height: 40px; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
.btn-icon:hover { background: white; color: var(--color-primary); transform: translateY(-2px); }
.btn-icon.manage:hover { background: white; color: #3b82f6; transform: translateY(-2px); }

/* --- ESTADOS DE LOADING E VAZIO --- */
.loading-state { padding: 3rem; text-align: center; color: rgba(255,255,255,0.6); }
.empty-cell { text-align: center; opacity: 0.5; }
</style>