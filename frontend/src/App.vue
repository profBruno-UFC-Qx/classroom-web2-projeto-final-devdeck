<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

// Stores & Components
import { usePortfolioStore } from '@/stores/portfolio'
import { useAuthStore } from '@/stores/auth' 
import SearchModal from '@/components/common/SearchModal.vue'

// Assets
import logoImg from '@/assets/img/img-logo-header-50px.png'

// --- State & Hooks ---
const route = useRoute()
const router = useRouter()
const portfolioStore = usePortfolioStore()
const authStore = useAuthStore() 

const isSearchOpen = ref(false)
const tooltipText = ref('Copiar Link') 

// --- Computed Properties ---
const isPortfolio = computed(() => route.name === 'portfolio')
const isHomePage = computed(() => route.path === '/')

const isLoggedArea = computed(() => {
  return authStore.isAuthenticated || route.path.includes('/dashboard')
})

const portfolioLink = computed(() => {
  const baseUrl = window.location.origin
  const authUser = authStore.user as any
  const portfolioUser = portfolioStore.userProfile as any
  
  // Resolve User ID priority
  const userId = authUser?.id || portfolioUser?.id || 1
  return `${baseUrl}/p/${userId}`
})

// --- Methods ---
function handleLogout() {
  authStore.logout()
  router.push('/')
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(portfolioLink.value)
    tooltipText.value = 'Copiado!'
    setTimeout(() => { tooltipText.value = 'Copiar Link' }, 2000)
  } catch (err) {
    console.error('Clipboard error:', err)
  }
}
</script>

<template>
  <SearchModal v-if="isSearchOpen" @close="isSearchOpen = false" />

  <header v-if="!isPortfolio" :class="{ 'header-transparent': isLoggedArea }">
    <div class="wrapper">
      
      <RouterLink to="/" class="logo-link">
        <img :src="logoImg" alt="Logo DevDeck" class="logo-img" />
      </RouterLink>

      <div v-if="!isLoggedArea" class="search-trigger" @click="isSearchOpen = true">
        <i class="bi bi-search"></i>
        <span>Pesquisar currículo...</span>
      </div>

      <nav>
        <template v-if="!isLoggedArea">
          <RouterLink to="/" class="nav-item">
            <i class="bi bi-house-door"></i>
            <span>Home</span>
          </RouterLink>

          <RouterLink to="/sobre" class="nav-item">
            <i class="bi bi-card-heading"></i>
            <span>Sobre</span>
          </RouterLink>
        </template>

        <template v-else>
          <RouterLink to="/dashboard" class="nav-item">
            <i class="bi bi-grid"></i> 
            <span>Dashboard</span>
          </RouterLink>

          <RouterLink to="/curriculo" class="nav-item">
            <i class="bi bi-person-lines-fill"></i>
            <span>Currículo</span>
          </RouterLink>

          <div class="separator"></div>

          <div class="split-btn-container">
            <a :href="portfolioLink" target="_blank" class="split-main">
              <i class="bi bi-eye-fill"></i>
              <span>Ver Portfólio</span>
            </a>
            <button class="split-copy" @click="copyLink">
              <i class="bi bi-copy"></i>
              <span class="tooltip">{{ tooltipText }}</span>
            </button>
          </div>

          <span class="user-label">Olá, {{ authStore.user?.name?.split(' ')[0] || 'Dev' }}</span>
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
/* --- Global App Layout --- */
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

/* --- Header & Navigation --- */
header {
  background-color: rgb(255, 255, 255); 
  backdrop-filter: blur(5px); 
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
  border-radius: 20px; 
  z-index: 1000;
  padding: 0 15px; 
  transition: background-color 0.3s ease;
}

.header-transparent {
  background-color: rgba(255, 255, 255, 0.678); 
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

nav {
  display: flex;
  gap: 1rem;
  align-items: center;
  height: 100%;
  margin-left: auto; 
}

/* --- Nav Items & Active States --- */
.nav-item {
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 24px;
  border-radius: 12px;
  position: relative; 
  z-index: 1;
  background-color: transparent; 
  backdrop-filter: blur(1px); 
  border: none; 
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  white-space: nowrap;
  gap: 8px; 
}

.nav-item::before {
  content: "";
  position: absolute;
  inset: 0; 
  border-radius: 12px; 
  padding: 2px; 
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none; 
  transition: opacity 0.3s ease;
}

.nav-item:hover, .nav-item.router-link-active {
  background: linear-gradient(90deg, var(--color-primary-1) 0%, var(--color-secondary-2) 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.173);
}

.nav-item:hover::before, .nav-item.router-link-active::before {
  opacity: 0; 
}

/* --- Split Button Actions --- */
.split-btn-container {
  display: flex;
  align-items: stretch;
  position: relative;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  overflow: hidden;
  height: 36px;
  transition: 0.3s;
}

.split-btn-container::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 2px;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); 
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.split-btn-container:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.split-main {
  display: flex; align-items: center; gap: 6px; padding: 0 16px;
  background: transparent; color: var(--color-primary);
  text-decoration: none; font-size: 0.8rem; font-weight: 700;
  transition: 0.2s; cursor: pointer;
}

.split-copy {
  border: none;
  border-left: 1px solid rgba(143, 0, 255, 0.3); 
  background: transparent; color: var(--color-primary);
  padding: 0 12px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  position: relative; transition: 0.2s;
}

/* --- Tooltip UI --- */
.tooltip {
  position: absolute;
  top: 130%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: 0.2s;
  z-index: 10;
}

.split-copy:hover .tooltip {
  opacity: 1;
  top: 120%;
}

/* --- User Info & Logout --- */
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
  font-size: 0.85rem;
}

.btn-logout:hover {
  background: #e74c3c;
  color: white;
}

/* --- Responsive Adjustments --- */
@media (max-width: 999px) {
  .search-trigger { max-width: 100px; padding: 0; justify-content: center; }
  .search-trigger span, .nav-item span, .user-label, .split-main span { display: none; }
  .nav-item, .split-btn-container { height: 45px; width: 45px; border-radius: 12px; }
  .split-main { padding: 0 12px; }
}

/* --- Transitions --- */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>