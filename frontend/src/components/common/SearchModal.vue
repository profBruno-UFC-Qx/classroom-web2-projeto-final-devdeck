<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { usePortfolioStore } from '@/stores/portfolio'

// Define os eventos que esse componente pode emitir (para fechar)
const emit = defineEmits(['close'])
const router = useRouter()
const store = usePortfolioStore()

const searchInput = ref<HTMLInputElement | null>(null)
const term = ref('')

// Foca no input assim que o modal abre
onMounted(() => {
  nextTick(() => {
    searchInput.value?.focus()
  })
})

// Filtra os usuários da Store
const results = computed(() => {
  if (!term.value) return []
  return store.publicUsers.filter(u => 
    u.name.toLowerCase().includes(term.value.toLowerCase()) || 
    u.role.toLowerCase().includes(term.value.toLowerCase())
  )
})

function goToProfile(username: string) {
  router.push(`/p/${username}`)
  emit('close') // Fecha o modal ao clicar
}
</script>

<template>
  <div class="modal-overlay" @click="$emit('close')">
    
    <div class="modal-card" @click.stop>
      
      <div class="search-header">
        <i class="bi bi-search icon-search"></i>
        <input 
          ref="searchInput"
          v-model="term" 
          type="text" 
          placeholder=" Busque por nome, cargo ou stack..." 
          @keydown.esc="$emit('close')"
        />
        <button class="btn-close" @click="$emit('close')">ESC</button>
      </div>

      <div class="search-results" v-if="term">
        <p v-if="results.length === 0" class="no-results">
          Nenhum desenvolvedor encontrado.
        </p>

        <div 
          v-for="user in results" 
          :key="user.username" 
          class="result-item"
          @click="goToProfile(user.username)"
        >
          <img :src="user.avatar" class="avatar-mini" />
          <div class="info">
            <span class="name">{{ user.name }}</span>
            <span class="role">{{ user.role }}</span>
          </div>
          <i class="bi bi-chevron-right arrow"></i>
        </div>
      </div>

      <div class="search-footer" v-else>
        <p>Digite para pesquisar talentos...</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 2000; 
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px; 
  animation: fadeIn 0.2s ease;
}

.modal-card {
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  overflow: hidden;
  animation: slideDown 0.2s ease;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.icon-search { font-size: 1.2rem; color: var(--color-secondary); margin-right: 10px; }

input {
  flex: 1;
  border: none;
  font-size: 1.1rem;
  outline: none;
  color: var(--color-secondary);
}

input::placeholder{
  color: var(--color-text-2)
}

.search-footer p{
  color: var(--color-text-2);
}

.btn-close {
  background: var(--color-highlight); 
  border: none; 
  padding: 4px 8px;
  border-radius: 4px; 
  font-size: 0.7rem; 
  color: white; 
  cursor: pointer;
}

.search-results { max-height: 400px; overflow-y: auto;}

.search-results p { color: var(--color-text-2)}

.result-item {
  display: flex; align-items: center; gap: 1rem;
  padding: 1rem; cursor: pointer; border-bottom: 1px solid #f9f9f9;
  transition: 0.2s;
}

.result-item:hover { background: #f0f7ff; }

.avatar-mini { width: 40px; height: 40px; border-radius: 50%; }
.info { display: flex; flex-direction: column; flex: 1; }
.name { font-weight: bold; color: var(--color-primary); }
.role { font-size: 0.85rem; color: var(--color-text-2); }
.arrow { color: #ccc; }

.no-results, .search-footer { padding: 2rem; text-align: center; color: #999; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>