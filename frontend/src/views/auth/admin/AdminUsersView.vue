<script setup lang="ts">
// --- IMPORTS ---
import { ref, onMounted, watch } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { storeToRefs } from 'pinia'

// --- CONFIGURATIONS ---
const SERVER_URL = 'http://localhost:3000'

// --- STORES & DATA ---
const adminStore = useAdminStore()
const { users, isLoading } = storeToRefs(adminStore)

// --- STATE: FILTERS & PAGINATION ---
const searchQuery = ref('')
const currentPage = ref(1)
const ITEMS_PER_PAGE = 5 

// --- LIFECYCLE ---
onMounted(() => {
  fetchData()
})

// --- METHODS: DATA FETCHING ---
async function fetchData() {
  const params = {
    page: currentPage.value,
    limit: ITEMS_PER_PAGE,
    search: searchQuery.value
  }
  await adminStore.fetchUsers(params) 
}

// --- UTILS: DEBOUNCE ---
function customDebounce(func: Function, wait: number) {
  let timeout: number | undefined
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// --- WATCHERS ---
watch(searchQuery, customDebounce(() => {
  currentPage.value = 1 
  fetchData()
}, 500))

// --- METHODS: NAVIGATION ---
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

// --- METHODS: FORMATTERS & GETTERS ---
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

function getUserAvatar(user: any) {
  const path = user.avatar || user.avatarUrl || null
  if (path && path.toString().startsWith('/')) {
    return `${SERVER_URL}${path}`
  }
  return path
}

function formatRole(role: string) {
  switch (role) {
    case 'admin': return 'ADMIN'
    case 'recruiter': return 'RECRUTADOR'
    default: return 'DEV'
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
          placeholder="Buscar usuário por nome ou email..."
        />
      </div>
    </div>

    <div class="glass-table-container">
      
      <div v-if="isLoading" class="loading-state">
        <i class="bi bi-hourglass-split"></i> Carregando usuários...
      </div>

      <table v-else class="glass-table">
        <thead>
          <tr>
            <th class="left">Usuário</th>
            <th class="left">Email</th>
            <th class="center">Cadastro</th>
            <th class="center">Cargo</th>
            <th class="center">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="left">
              <div class="user-cell">
                <img 
                  v-if="getUserAvatar(user)" 
                  :src="getUserAvatar(user)" 
                  class="avatar-img"
                />
                <div v-else class="avatar-placeholder">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <strong>{{ user.name }}</strong>
              </div>
            </td>
            
            <td class="left">{{ user.email }}</td>
            
            <td class="center">{{ formatDate(user.createdAt) }}</td>
            
            <td class="center">
              <span :class="['role-badge', user.role]">
                {{ formatRole(user.role) }}
              </span>
            </td>

            <td class="center">
              <div class="actions-flex">
                <button class="btn-icon" @click="adminStore.changeRole(user.id, user.role)" :title="user.role === 'admin' ? 'Rebaixar para Dev' : 'Promover a Admin'">
                  <i class="bi" :class="user.role === 'admin' ? 'bi-arrow-down-circle' : 'bi-arrow-up-circle-fill'"></i>
                </button>
                
                <button class="btn-icon delete" @click="adminStore.banUser(user.id)" title="Banir Usuário">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </td>
          </tr>
          
          <tr v-if="users.length === 0">
            <td colspan="5" class="empty-cell">Nenhum usuário encontrado.</td>
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

  </div>
</template>

<style scoped>
/* --- BASE STRUCTURE --- */
.admin-panel { width: 100%; animation: fadeIn 0.5s ease; display: flex; flex-direction: column; gap: 1.5rem; min-height: 600px; }
.panel-header-controls { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }

/* --- SEARCH INPUT STYLES --- */
.control-item { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; height: 45px; display: flex; align-items: center; transition: all 0.2s; }
.control-item.search-wrapper { padding: 0 16px; gap: 10px; width: 300px; color: rgba(255,255,255,0.5); cursor: text; }
.control-item.search-wrapper:focus-within { background: rgba(255, 255, 255, 0.1); border-color: var(--color-primary); color: white; }
.search-wrapper input { background: transparent; border: none; outline: none; color: white; width: 100%; font-size: 0.95rem; font-weight: 500; height: 100%; }
.search-wrapper input::placeholder { color: rgba(255,255,255,0.4); }

/* --- GLASS TABLE DESIGN --- */
.glass-table-container { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; overflow: hidden; flex: 1; }
.glass-table { width: 100%; border-collapse: collapse; color: white; }

/* --- TABLE HEAD & CELLS --- */
.glass-table th { padding: 1.2rem; color: rgba(255,255,255,0.5); font-size: 0.85rem; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.1); }
.glass-table td { padding: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: middle; }
.glass-table tr:hover { background: rgba(255,255,255,0.03); }

/* --- ALIGNMENT HELPERS --- */
.glass-table th.left, .glass-table td.left { text-align: left; }
.glass-table th.center, .glass-table td.center { text-align: center; }

/* --- USER INFO & AVATAR --- */
.user-cell { display: flex; align-items: center; gap: 12px; }
.avatar-placeholder { width: 36px; height: 36px; background: var(--color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
.avatar-img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.1); background-color: rgba(255,255,255,0.05); }

/* --- ROLE BADGES --- */
.role-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; }
.role-badge.admin { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
.role-badge.dev { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); }
.role-badge.recruiter { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }

/* --- ACTION BUTTONS --- */
.actions-flex { display: flex; gap: 10px; justify-content: center; align-items: center; }
.btn-icon { background: rgba(255,255,255,0.1); border: none; color: white; width: 38px; height: 38px; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
.btn-icon:hover { background: white; color: var(--color-primary); transform: translateY(-2px); }
.btn-icon.delete:hover { background: rgba(239, 68, 68, 0.2); color: #f87171; }

/* --- STATES (LOADING/EMPTY) --- */
.loading-state { padding: 3rem; text-align: center; color: rgba(255,255,255,0.6); }
.empty-cell { text-align: center; opacity: 0.5; padding: 2rem; }

/* --- EXTERNAL PAGINATION --- */
.pagination-external { display: flex; justify-content: center; align-items: center; gap: 20px; padding: 10px 0; margin-top: auto; }
.page-pill { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: white; padding: 10px 24px; border-radius: 50px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 600; transition: 0.2s; }
.page-pill:hover:not(:disabled) { background: white; color: var(--color-primary); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
.page-pill:disabled { opacity: 0.4; cursor: not-allowed; }
.page-indicator { font-size: 1rem; font-weight: 700; color: rgba(255,255,255,0.8); letter-spacing: 0.5px; }
</style>