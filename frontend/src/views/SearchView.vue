<script setup lang="ts">
// --- Imports ---
import { ref, computed } from 'vue'
import { usePortfolioStore } from '../stores/portfolio'

// --- Estado e Store ---
const store = usePortfolioStore()
const searchTerm = ref('')

// --- Lógica de Filtragem ---
const filteredUsers = computed(() => {
  if (!searchTerm.value) return []
  return store.publicUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})
</script>

<template>
  <div class="page-container">
    
    <!-- Cabeçalho e Busca -->
    <div class="header-section">
      <h1>Encontrar Talentos</h1>
      <div class="search-box">
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Digite um nome ou cargo (ex: Maria, Designer)..." 
          autofocus
        />
      </div>
    </div>

    <!-- Grid de Resultados -->
    <div class="results-grid">
      <div v-for="user in filteredUsers" :key="user.username" class="user-card">
        <img :src="user.avatar" alt="Avatar" class="avatar">
        <div class="info">
          <h3>{{ user.name }}</h3>
          <p>{{ user.role }}</p>
          <RouterLink :to="`/p/${user.username}`" class="btn-visit">Ver Perfil</RouterLink>
        </div>
      </div>

      <!-- Mensagens de Feedback -->
      <p v-if="searchTerm && filteredUsers.length === 0" class="msg">Ninguém encontrado.</p>
      <p v-if="!searchTerm" class="msg">Digite algo para começar a buscar.</p>
    </div>

  </div>
</template>

<style scoped>
/* --- Layout Principal --- */
.page-container { 
  padding: 2rem; 
  max-width: 800px; 
  margin: 0 auto; 
}

.header-section h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

/* --- Campo de Busca --- */
.search-box input {
  width: 100%; 
  padding: 1rem; 
  font-size: 1.1rem;
  border: 2px solid #ddd; 
  border-radius: 50px; 
  margin-bottom: 2rem;
  transition: 0.3s;
}

.search-box input:focus { 
  border-color: var(--color-secondary); 
  outline: none; 
}

/* --- Grid de Resultados --- */
.results-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); 
  gap: 1.5rem; 
}

.msg { 
  text-align: center; 
  color: #999; 
  grid-column: 1 / -1; 
  margin-top: 2rem;
}

/* --- Card de Usuário --- */
.user-card {
  background: white; 
  padding: 1.5rem; 
  border-radius: 12px;
  text-align: center; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-card:hover { 
  transform: translateY(-5px); 
}

.avatar { 
  width: 80px; 
  height: 80px; 
  border-radius: 50%; 
  margin-bottom: 1rem; 
  object-fit: cover;
}

.info h3 { 
  margin: 0; 
  font-size: 1.1rem; 
  color: var(--color-primary);
}

.info p { 
  color: #777; 
  font-size: 0.9rem; 
  margin-bottom: 1rem; 
}

/* --- Botões --- */
.btn-visit {
  display: inline-block; 
  padding: 0.5rem 1rem;
  background: var(--color-primary); 
  color: white;
  border-radius: 20px; 
  font-size: 0.85rem;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-visit:hover {
  background: var(--color-secondary);
}
</style>