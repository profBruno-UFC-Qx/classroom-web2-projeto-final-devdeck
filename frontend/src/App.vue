<script setup lang="ts">
// --- Imports ---
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import logoImg from '@/assets/img/img-logo-header-50px.png'
import SearchModal from '@/components/common/SearchModal.vue'

// --- Hooks & Estado ---
const route = useRoute()
const router = useRouter()
const isSearchOpen = ref(false)

// --- Computados ---
const isDashboard = computed(() => route.path.includes('/dashboard'))
const isHomePage = computed(() => route.path === '/') 

// --- Métodos ---
function handleLogout() {
  router.push('/')
}
</script>

<template>
  <SearchModal v-if="isSearchOpen" @close="isSearchOpen = false" />

  <header>
    <div class="wrapper">
      
      <RouterLink to="/" class="logo-link">
        <img :src="logoImg" alt="Logo DevDeck" class="logo-img" />
      </RouterLink>

      <div v-if="!isDashboard" class="search-trigger" @click="isSearchOpen = true">
        <i class="bi bi-search"></i>
        <span>Pesquisar currículo...</span>
      </div>

      <nav>
        <template v-if="!isDashboard">
          <RouterLink to="/" class="nav-item">
            <i class="bi bi-house-door"></i>
            <span>Home</span>
          </RouterLink>

          <RouterLink to="/sobre" class="nav-item">
            <i class="bi bi-people"></i>
            <span>Sobre Nós</span>
          </RouterLink>
        </template>

        <template v-else>
          <RouterLink to="/dashboard" class="nav-item">
            <i class="bi bi-grid"></i> 
            <span>Dashboard</span>
          </RouterLink>

          <div class="separator"></div>

          <span class="user-label">Olá, Dev</span>
          <button @click="handleLogout" class="btn-logout">Sair</button>
        </template>
      </nav>

    </div>
  </header>

  <main>
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>

<style scoped>
/* --- Layout Global --- */
:global(#app) {
  display: flex;
  flex-direction: column;
  height: 100vh; 
}

main {
  flex: 1; 
  overflow-y: auto; 
  width: 100%;
  scroll-behavior: smooth;
}

/* --- Header & Wrapper --- */
header {
  background-color: rgb(255, 255, 255);
  backdrop-filter: blur(10px); 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  height: 70px;
  display: flex;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  position: fixed;
  top: 15px; 
  left: 50%; 
  transform: translateX(-50%); 
  width: 90%; 
  max-width: 1200px; 
  border-radius: 50px; 
  z-index: 1000;
  padding: 0 15px; 
}

.wrapper {
  width: 100%;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-start; 
  gap: 3rem; 
}

.logo-img {
  height: 40px;
  width: auto;
  display: block;
}

/* --- Barra de Pesquisa --- */
.search-trigger {
  flex: 1;
  max-width: 200px;
  background: linear-gradient(90deg, var(--color-primary-1) 0%, var(--color-secondary-2) 100%);
  border: none;
  border-radius: 50px;
  height: 38px;
  display: flex;
  align-items: center;
  padding: 0 1.2rem;
  gap: 12px;
  cursor: text;
  transition: all 0.3s ease;
}

.search-trigger i {
  color: white; 
  font-size: 1rem;
  -webkit-text-stroke: 0.5px currentColor;
}

.search-trigger span {
  font-size: 0.9rem;
  font-weight: 500;
  color: white; 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* --- Navegação & Links --- */
nav {
  display: flex;
  gap: 1rem;
  align-items: center;
  height: 100%;
  margin-left: auto; 
}

.nav-item {
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 24px;
  border-radius: 50px;
  border: 2px solid transparent;
  background-image: linear-gradient(white, white), linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-item i {
  display: none; 
  font-size: 1.3rem;
}

.nav-item:hover {
  background: linear-gradient(90deg, var(--color-primary-1) 0%, var(--color-secondary-2) 100%);
  border-color: var(--color-secondary);
  color: white;
}

.nav-item.router-link-active {
  border: 2px solid transparent;
  background-image: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  background-origin: border-box;
  background-clip: border-box;
  color: white;
  box-shadow: 0 4px 10px rgba(143, 0, 255, 0.3);
}

/* --- Elementos de Usuário --- */
.separator {
  width: 1px;
  height: 25px;
  background-color: #ddd;
  margin: 0 5px;
}

.user-label {
  color: var(--color-primary);
  font-weight: bold;
  font-size: 0.9rem;
}

.btn-logout {
  background: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 0.4rem 1rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
  font-family: inherit;
  font-size: 0.85rem;
}

.btn-logout:hover {
  background: #e74c3c;
  color: white;
}

/* --- Responsividade (Mobile) --- */
@media (max-width: 999px) {
  .search-trigger {
    max-width: 100px;
    max-height: 2;
    padding: 0;
    justify-content: center;
  }
  
  .search-trigger span { display: none; }
  
  .nav-item {
    padding: 2px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
  
  .nav-item span { display: none; }
  .nav-item i { display: block; }
  .user-label { display: none; }
}

/* --- Transições (Vue Transition) --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>