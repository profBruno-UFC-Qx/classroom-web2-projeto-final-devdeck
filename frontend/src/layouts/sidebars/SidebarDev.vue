<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePortfolioStore } from '@/stores/portfolio'
import { useToastStore } from '@/stores/toast'
// Mantive o import do jeito que você mandou, verifique se o caminho está correto no seu projeto
import SidebarHeader from '@/layouts/sidebars/SidebarHeader.vue' 

const authStore = useAuthStore()
const portfolioStore = usePortfolioStore()
const toast = useToastStore()
const router = useRouter()

const copyButtonText = ref('Copiar')
const copyIcon = ref('bi-clipboard')

// Link do portfólio
const portfolioPath = computed(() => {
  const id = authStore.user?.id
  if (!id) return '#'
  return `/portfolio/${id}` 
})

// Sincronização de dados do perfil 
watch(
  () => authStore.user?.id,
  async (newId) => {
    if (newId) {
      try { await portfolioStore.fetchUserProfile() } catch (e) { console.error(e) }
    }
  },
  { immediate: true }
)

function handleLogout() {
  authStore.logout()
  portfolioStore.userProfile = {} as any
  router.push('/')
}

async function copyLink() {
  const fullUrl = window.location.origin + portfolioPath.value
  try {
    await navigator.clipboard.writeText(fullUrl)
    copyButtonText.value = 'Copiado!'
    copyIcon.value = 'bi-check-lg'
    toast.success('Link copiado!')
    setTimeout(() => { copyButtonText.value = 'Copiar'; copyIcon.value = 'bi-clipboard' }, 2000)
  } catch (err) { toast.error('Erro ao copiar link.') }
}
</script>

<template>
  <div class="sidebar-content">
    <SidebarHeader />

    <div class="profile-separator"></div>

    <div class="sidebar-actions-grid">
      <a :href="portfolioPath" target="_blank" class="action-btn view" title="Ver Portfólio">
        <i class="bi bi-eye-fill"></i>
        <span>Ver</span>
      </a>
      <button @click="copyLink" class="action-btn copy" :class="{ copied: copyButtonText === 'Copiado!' }" title="Copiar Link">
        <i class="bi" :class="copyIcon"></i>
        <span>{{ copyButtonText }}</span>
      </button>
      <button @click="handleLogout" class="action-btn logout" title="Sair">
        <i class="bi bi-box-arrow-right"></i>
        <span>Sair</span>
      </button>
    </div>

    <div class="separator"></div>

    <nav class="nav-grid">
      <RouterLink to="/dashboard" class="nav-btn" active-class="active">
        <i class="bi bi-grid-fill"></i>
        <span>Dashboard</span>
      </RouterLink>
      
      <RouterLink to="/curriculo" class="nav-btn" active-class="active">
        <i class="bi bi-file-earmark-person-fill"></i>
        <span>Currículo</span>
      </RouterLink>
      
      <RouterLink to="/conta" class="nav-btn" active-class="active">
        <i class="bi bi-person-circle"></i>
        <span>Minha Conta</span>
      </RouterLink>
      
      <RouterLink to="/messages" class="nav-btn" active-class="active">
        <i class="bi bi-chat-dots-fill"></i>
        <span>Mensagens</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.sidebar-content { display: flex; flex-direction: column; height: 100%; }
.profile-separator { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); margin: 1.5rem 0; width: 100%; }
.separator { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); margin-bottom: 2rem; width: 100%; }
.sidebar-actions-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 2rem; }
.action-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 65px; border-radius: 12px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.8); text-decoration: none; cursor: pointer; transition: 0.2s; }
.action-btn:hover { background: rgba(255, 255, 255, 0.1); color: white; }
.action-btn.logout:hover { background: rgba(255, 50, 50, 0.15); border-color: #ff6b6b; color: #ffadad; }
.action-btn.copy.copied { background: rgba(46, 204, 113, 0.15); border-color: #2ecc71; color: #2ecc71; }
.nav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.nav-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; aspect-ratio: 1 / 1; border-radius: 16px; text-decoration: none; color: white; font-weight: 600; font-size: 0.95rem; transition: all 0.3s; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); }
.nav-btn:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-5px); border-color: var(--color-primary); }
.nav-btn.active { background: rgba(255, 255, 255, 0.15); border-color: rgba(255,255,255,0.4); }
.nav-btn i { font-size: 2rem; margin-bottom: 10px; opacity: 0.9; }

@media (max-width: 900px) {
  .separator, .profile-separator { display: none; }
  .sidebar-actions-grid { margin-bottom: 1rem; }
  .nav-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .nav-btn { aspect-ratio: auto; padding: 10px; height: 80px; }
}
</style>