<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SidebarHeader from '@/layouts/sidebars/SidebarHeader.vue'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="sidebar-content">
    <SidebarHeader />

    <div class="profile-separator"></div>

    <div class="sidebar-single-action">
      <button @click="handleLogout" class="action-btn logout-full" title="Sair do Sistema">
        <i class="bi bi-box-arrow-right"></i>
        <span>Sair do Painel</span>
      </button>
    </div>

    <div class="separator"></div>

    <nav class="nav-grid">
      <RouterLink to="/admin/users" class="nav-btn" active-class="active">
        <i class="bi bi-people-fill"></i>
        <span>Usuários</span>
      </RouterLink>

      <RouterLink to="/admin/projects" class="nav-btn" active-class="active">
        <i class="bi bi-collection-play-fill"></i>
        <span>Projetos</span>
      </RouterLink>

      <RouterLink to="/dashboard" class="nav-btn" active-class="active">
        <i class="bi bi-speedometer2"></i>
        <span>Visão Geral</span>
      </RouterLink>

      <RouterLink to="/conta" class="nav-btn" active-class="active">
        <i class="bi bi-person-circle"></i>
        <span>Minha Conta</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.sidebar-content { display: flex; flex-direction: column; height: 100%; }

/* Separadores */
.profile-separator { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); margin: 1.5rem 0; width: 100%; }
.separator { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); margin-bottom: 2rem; width: 100%; }

/* Botão de Sair Largo */
.sidebar-single-action { margin-bottom: 2rem; }
.action-btn.logout-full {
  width: 100%; height: 50px; border-radius: 12px;
  background: rgba(255, 50, 50, 0.1); border: 1px solid rgba(255, 50, 50, 0.3);
  color: #ffadad; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
  font-weight: 600; transition: 0.2s;
}
.action-btn.logout-full:hover { background: rgba(255, 50, 50, 0.2); color: white; }

/* Grid de Navegação */
.nav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.nav-btn { 
  display: flex; flex-direction: column; align-items: center; justify-content: center; 
  text-align: center; aspect-ratio: 1 / 1; border-radius: 16px; 
  text-decoration: none; color: white; font-weight: 600; font-size: 0.95rem; 
  transition: all 0.3s; 
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); 
}

.nav-btn:hover { 
  background: rgba(255, 255, 255, 0.1); 
  transform: translateY(-5px); 
  border-color: var(--color-primary); 
}

.nav-btn.active { 
  background: rgba(255, 255, 255, 0.15); 
  border-color: rgba(255,255,255,0.4); 
}

.nav-btn i { font-size: 2rem; margin-bottom: 10px; opacity: 0.9; }

@media (max-width: 900px) {
  .separator, .profile-separator { display: none; }
  .sidebar-single-action { margin-bottom: 1rem; }
  .nav-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .nav-btn { aspect-ratio: auto; padding: 10px; height: 80px; }
}
</style>