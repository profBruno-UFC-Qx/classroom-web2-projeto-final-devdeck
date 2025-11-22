<script setup lang="ts">
// --- Imports e Configuração ---
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import logoImg from '@/assets/img/img-logo-header-45px.png'

const route = useRoute()
const router = useRouter()

// --- Lógica de Navegação (Estado) ---
const isDashboard = computed(() => route.path.includes('/dashboard'))
const isHomePage = computed(() => route.path === '/')

// --- Ações ---
function handleLogout() {
  router.push('/')
}
</script>

<template>
  <header>
    <div class="wrapper">
      
      <!-- Logo -->
      <RouterLink to="/" class="logo-link">
        <img :src="logoImg" alt="Logo DevDeck" class="logo-img" />
      </RouterLink>

      <!-- Navegação -->
      <nav>
        <!-- Menu Público -->
        <template v-if="!isDashboard">
          <RouterLink to="/sobre">Sobre Nós</RouterLink>
          <RouterLink to="/pesquisar"> <i class="bi bi-search"></i> Pesquisar</RouterLink>
          
          <RouterLink v-if="!isHomePage" to="/" class="btn-login">Login</RouterLink>
        </template>

        <!-- Menu Administrativo (Logado) -->
        <template v-else>
          <span class="user-label">Olá, Dev</span>
          <button @click="handleLogout" class="btn-logout">Sair</button>
        </template>
      </nav>

    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
/* --- Layout Global e Header --- */
header {
  background-color: var(--color-surface);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  height: 90px;
  display: flex;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  flex-shrink: 0; 
  z-index: 10;
}

.wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* --- Elementos de Navegação --- */
nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

nav a {
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.95rem;
}

nav a:hover {
  color: var(--color-secondary);
}

/* --- Botões e Ações --- */
.btn-login {
  background-color: var(--color-primary);
  color: white !important;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  transition: 0.3s;
  font-weight: 600;
}

.btn-login:hover {
  background-color: var(--color-secondary);
  transform: translateY(-1px);
}

.btn-logout {
  background: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.btn-logout:hover {
  background: #e74c3c;
  color: white;
}

.user-label {
  color: #666;
  font-size: 0.9rem;
}

/* --- Área Principal (Main) --- */
main {
  flex: 1; 
  overflow-y: auto; 
  width: 100%;
  scroll-behavior: smooth;
}

/* Fix global para manter o footer/header fixos se necessário */
:global(#app) {
  display: flex;
  flex-direction: column;
  height: 100vh; 
}
</style>