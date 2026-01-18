<script setup lang="ts">
// --- IMPORTS ---
import { ref, onMounted, watch } from 'vue'
import { api } from '@/services/api'
import { useRouter } from 'vue-router'

// --- CONFIG & TYPES ---
const router = useRouter()

interface Developer {
  id: number
  name: string
  headline: string
  avatarUrl: string
  skills: string[]
  location: string
}

// --- STATE (REFS) ---
const developers = ref<Developer[]>([])
const searchQuery = ref('')
const isLoading = ref(true)

// --- PAGINATION STATE ---
const page = ref(1)
const limit = ref(8)
const totalPages = ref(1)
const totalRecords = ref(0)

// --- METHODS: API DATA FETCHING ---
async function fetchTalents() {
  isLoading.value = true
  try {
    const { data } = await api.get('/users', {
      params: { q: searchQuery.value, page: page.value, limit: limit.value }
    })
    
    const backendUsers = data.data || []
    developers.value = backendUsers.map((d: any) => ({
      id: d.id,
      name: d.name,
      headline: d.headline || 'Desenvolvedor',
      avatarUrl: d.avatarUrl || `https://ui-avatars.com/api/?name=${d.name}&background=6366f1&color=fff`,
      skills: d.skills ? (typeof d.skills === 'string' ? JSON.parse(d.skills) : d.skills) : [],
      location: d.location || 'Remoto'
    }))

    totalPages.value = data.lastPage || 1
    totalRecords.value = data.total || 0
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    isLoading.value = false
  }
}

// --- WATCHERS ---
let timeout: number
watch(searchQuery, (newVal) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    page.value = 1
    fetchTalents()
  }, 500)
})

// --- METHODS: NAVIGATION & ACTIONS ---
function prevPage() {
  if (page.value > 1) {
    page.value--
    fetchTalents()
  }
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++
    fetchTalents()
  }
}

function viewPortfolio(id: number) {
  window.open(`/portfolio/${id}`, '_blank')
}

// --- LIFECYCLE ---
onMounted(() => fetchTalents())
</script>

<template>
  <div class="search-panel">
    
    <div class="panel-header-controls">
      
      <div class="control-item search-wrapper">
        <i class="bi bi-search"></i>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar talentos..."
        />
      </div>

      <div class="pagination-controls-inline">
        <button class="control-item btn-page" :disabled="page === 1" @click="prevPage">
          <i class="bi bi-chevron-left"></i>
        </button>
        
        <span class="page-number">{{ page }} / {{ totalPages }}</span>

        <button class="control-item btn-page" :disabled="page === totalPages" @click="nextPage">
          <i class="bi bi-chevron-right"></i>
        </button>
        
        <span class="page-info" v-if="!isLoading">({{ totalRecords }} encontrados)</span>
      </div>

    </div>

    <div class="content-area">
      
      <div v-if="isLoading" class="state-container">
        <div class="spinner"></div>
        <p>Carregando...</p>
      </div>

      <div v-else-if="developers.length === 0" class="state-container">
        <i class="bi bi-people" style="font-size: 3rem; opacity: 0.5;"></i>
        <p>Nenhum talento encontrado.</p>
      </div>

      <div v-else class="talent-grid">
        <div v-for="dev in developers" :key="dev.id" class="talent-card">
          <div class="card-top">
            <img :src="dev.avatarUrl" :alt="dev.name" class="dev-avatar" />
            <div class="dev-info">
              <h3>{{ dev.name }}</h3>
              <span class="headline">{{ dev.headline }}</span>
              <span class="location"><i class="bi bi-geo-alt-fill"></i> {{ dev.location }}</span>
            </div>
          </div>

          <div class="card-skills">
            <span v-for="skill in dev.skills.slice(0, 3)" :key="skill" class="skill-tag">
              {{ skill }}
            </span>
            <span v-if="dev.skills.length > 3" class="skill-more">+{{ dev.skills.length - 3 }}</span>
          </div>

          <button class="btn-view-profile" @click="viewPortfolio(dev.id)">
            Ver Perfil
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* --- BASE LAYOUT --- */
.search-panel { 
  width: 100%; height: 100%; display: flex; flex-direction: column; gap: 1.5rem; 
  animation: fadeIn 0.5s ease;
}

/* --- HEADER CONTROLS --- */
.panel-header-controls {
  display: flex; align-items: center; gap: 12px; 
  padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05);
}

.control-item.search-wrapper {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px; height: 45px;
  padding: 0 16px; gap: 10px;
  width: 260px; 
  display: flex; align-items: center; color: rgba(255,255,255,0.5);
  transition: all 0.2s;
}

.control-item.search-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.1); border-color: var(--color-primary); color: white;
}

.search-wrapper input {
  background: transparent; border: none; outline: none; color: white;
  width: 100%; font-size: 0.95rem; font-weight: 500; height: 100%;
}

.search-wrapper input::placeholder { color: rgba(255,255,255,0.4); }

/* --- INLINE PAGINATION --- */
.pagination-controls-inline {
  display: flex; align-items: center; gap: 8px;
  margin-left: 8px; 
}

.page-info { font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-left: 8px; }
.page-number { font-weight: 700; color: white; font-size: 0.9rem; min-width: 40px; text-align: center; }

.control-item.btn-page {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px; height: 40px; width: 40px;
  display: flex; align-items: center; justify-content: center;
  color: white; cursor: pointer; transition: 0.2s;
}

.control-item.btn-page:hover:not(:disabled) {
  background: white; color: var(--color-primary); transform: translateY(-2px);
}

.control-item.btn-page:disabled { opacity: 0.4; cursor: not-allowed; }

/* --- CONTENT AREA & GRID --- */
.content-area { flex: 1; overflow-y: auto; padding-right: 5px;}
.content-area::-webkit-scrollbar { width: 6px; }
.content-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }

.talent-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 10px;}

/* --- TALENT CARD DESIGN --- */
.talent-card {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px; padding: 1.5rem;
  display: flex; flex-direction: column; gap: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  background: rgba(255, 255, 255, 0.019); border: 1px solid rgba(255, 255, 255, 0.218); 
}

.talent-card:hover { 
  transform: translateY(-5px);  
}

.card-top { display: flex; align-items: center; gap: 1rem; }
.dev-avatar { width: 55px; height: 55px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.15); }

.dev-info { display: flex; flex-direction: column; overflow: hidden; width: 100%; }
.dev-info h3 { text-align: center; margin: 0; font-size: 1.05rem; color: #fff; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.headline { 
  font-size: 0.85rem; 
  color: var(--color-primary); 
  font-weight: 600; 
  background-color: rgba(255, 255, 255, 0.568); 
  border-radius: 5px; 
  margin: 2px 5px; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  text-align: center; 
}

.location { justify-content: center; font-size: 0.75rem; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 4px; }

.card-skills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; }
.skill-tag { 
  background: rgba(255,255,255,0.08); 
  color: rgba(255,255,255,0.9); 
  font-size: 0.75rem; padding: 4px 10px; border-radius: 6px; 
  border: 1px solid rgba(255,255,255,0.05);
}

.skill-more { font-size: 0.75rem; color: rgba(255,255,255,0.5); padding: 4px; }

.btn-view-profile {
  margin-top: 0.8rem; width: 100%; padding: 0.7rem; 
  background: rgba(255, 255, 255, 0.121);
  border: 1px solid rgba(255, 255, 255, 0.159); 
  color: white; border-radius: 8px; font-weight: 600; 
  cursor: pointer; transition: 0.2s;
}

.btn-view-profile:hover { background: white; color: var(--color-primary); box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); }

/* --- STATE INDICATORS  --- */
.state-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; color: rgba(255,255,255,0.6); gap: 1rem; }
.spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 1s infinite linear; }

@keyframes spin { to { transform: rotate(360deg); } }
</style>