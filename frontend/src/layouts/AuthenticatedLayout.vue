<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePortfolioStore } from '@/stores/portfolio'
import { useToastStore } from '@/stores/toast'
import { api } from '@/services/api' 
import logoImg from '@/assets/img/img-logo-header-50px.png' 

// --- Store & Router ---
const authStore = useAuthStore()
const portfolioStore = usePortfolioStore()
const toast = useToastStore()
const router = useRouter()
const route = useRoute()

// --- State ---
const copyButtonText = ref('Copiar')
const copyIcon = ref('bi-clipboard')
const fileInput = ref<HTMLInputElement | null>(null) 
const isUploading = ref(false)

// --- Lifecycle ---
onMounted(async () => {
  await portfolioStore.fetchUserProfile()

  if (authStore.user && portfolioStore.userProfile.avatarUrl) {
    authStore.user.avatar = portfolioStore.userProfile.avatarUrl
    authStore.user.name = portfolioStore.userProfile.name 
  }
})

// --- Computed Data ---
const pageTitle = computed(() => (route.meta.title as string) || 'DevDeck')
const pageDesc = computed(() => (route.meta.desc as string) || '')

const userName = computed(() => {
  const name = authStore.user?.name || 'Dev'
  return name.split(' ')[0] 
})

const userAvatar = computed(() => {
  return authStore.user?.avatar || `https://ui-avatars.com/api/?name=${userName.value}&background=8456b5&color=fff&bold=true`
})

const portfolioPath = computed(() => {
  const userId = authStore.user?.id || 1
  return `/p/${userId}` 
})

// --- Actions ---
function handleLogout() {
  authStore.logout()
  router.push('/')
}

async function copyLink() {
  const fullUrl = window.location.origin + portfolioPath.value
  try {
    await navigator.clipboard.writeText(fullUrl)
    copyButtonText.value = 'Copiado!'
    copyIcon.value = 'bi-check-lg'
    toast.success('Link copiado para a área de transferência!')
    setTimeout(() => { copyButtonText.value = 'Copiar'; copyIcon.value = 'bi-clipboard' }, 2000)
  } catch (err) { 
    console.error('Erro ao copiar', err)
    toast.error('Não foi possível copiar o link.')
  }
}

// --- Upload Avatar ---
function triggerAvatarEdit() {
  fileInput.value?.click()
}

async function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const formData = new FormData()
    formData.append('image', file)

    isUploading.value = true
    toast.info('Enviando sua nova foto...')

    try {
      const { data } = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const newAvatarUrl = data.url
      await portfolioStore.updateAvatar(newAvatarUrl)
      toast.success('Foto de perfil atualizada com sucesso!')
    } catch (error) {
      console.error('Erro no processo de avatar:', error)
      toast.error('Erro ao atualizar foto. Tente novamente.')
    } finally {
      isUploading.value = false
      if (fileInput.value) fileInput.value.value = ''
    }
  }
}
</script>

<template>
  <div class="layout-container">
    
    <div class="background-effects">
      <div class="circle-1"></div>
      <div class="circle-2"></div>
      <div class="floating-symbol sym-1">&lt;/&gt;</div>
      <div class="floating-symbol sym-2">{ }</div>
      <div class="floating-symbol sym-3">#</div>
      <div class="floating-symbol sym-4">;</div>
      <div class="code-rain"><pre>import { User } from '@devdeck';</pre></div>
    </div>

    <header class="top-header">
      <RouterLink to="/dashboard" class="brand-logo-link">
        <img :src="logoImg" alt="DevDeck Logo" class="brand-logo" />
      </RouterLink>
    </header>

    <div class="layout-body">
      
      <aside class="sidebar-glass">
        <div class="sidebar-scroller">
          
          <div class="sidebar-profile">
            <div class="avatar-wrapper">
              <div class="avatar-ring">
                 <img :src="userAvatar" :alt="userName" class="avatar-img" />
              </div>
              <button 
                class="edit-avatar-btn" 
                title="Alterar foto"
                @click="triggerAvatarEdit" 
                :disabled="isUploading"
              >
                <i class="bi" :class="isUploading ? 'bi-hourglass-split' : 'bi-pencil-fill'"></i>
              </button>
              <input type="file" ref="fileInput" hidden accept="image/*" @change="onFileSelected" />
            </div>
            <div class="welcome-text">
              <span>Bem-vindo(a),</span>
              <h3>{{ userName }}</h3>
            </div>
          </div>

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
            <RouterLink to="/configuracoes" class="nav-btn" active-class="active">
              <i class="bi bi-gear-fill"></i>
              <span>Configurações</span>
            </RouterLink>
          </nav>

        </div>
      </aside>

      <main class="content-glass">
        <header class="page-header">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <p class="page-desc" v-if="pageDesc">{{ pageDesc }}</p>
        </header>

        <div class="content-scroller">
          <RouterView v-slot="{ Component }">
            <Transition name="fade-page" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </div>
      </main>

    </div>
  </div>
</template>

<style scoped>
/* --- Layout Global --- */
.layout-container {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  height: 100vh; width: 100vw; display: flex; flex-direction: column; overflow: hidden; position: relative;
}

/* --- Background Effects --- */
.background-effects { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; background-color: rgba(0, 0, 0, 0.233); }
.circle-1, .circle-2 { position: absolute; border-radius: 50%; background: white; opacity: 0.05; filter: blur(50px); }
.circle-1 { width: 600px; height: 600px; top: -200px; left: -200px; animation: floatCircle 35s infinite ease-in-out; }
.circle-2 { width: 500px; height: 500px; bottom: -100px; right: -100px; animation: floatCircle 40s infinite ease-in-out reverse; }
.floating-symbol { position: absolute; color: rgba(255, 255, 255, 0.15); font-family: monospace; font-weight: bold; font-size: 3rem; animation: floatSymbol 25s infinite linear; text-shadow: 0 0 10px rgba(255,255,255,0.1); }
.sym-1 { top: 10%; left: 10%; } .sym-2 { bottom: 20%; right: 10%; } .sym-3 { top: 40%; right: 30%; } .sym-4 { bottom: 10%; left: 20%; }
.code-rain { position: absolute; top: 20%; left: 5%; color: rgba(255,255,255,0.06); font-family: 'Fira Code', monospace; transform: rotate(-5deg); pointer-events: none; opacity: 0.8; }
@keyframes floatCircle { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(30px, 30px); } }
@keyframes floatSymbol { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 50% { opacity: 0.2; } 100% { transform: translateY(-100px) rotate(20deg); opacity: 0; } }

/* --- Header Superior --- */
.top-header { height: 80px; flex-shrink: 0; width: 100%; position: relative; display: flex; align-items: center; padding: 0 2rem; z-index: 50; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.brand-logo-link { position: absolute; left: 50%; transform: translateX(-50%); display: flex; align-items: center; }
.brand-logo { height: 40px; width: auto; filter: brightness(0) invert(1); display: block; cursor: pointer; transition: transform 0.2s; }
.brand-logo:hover { transform: scale(1.05); }

/* --- Layout Body --- */
.layout-body { flex: 1; display: flex; padding: 1.5rem; gap: 1.5rem; overflow: hidden; height: calc(100vh - 80px); }

/* --- GLASS STYLE --- */
.sidebar-glass, .content-glass { background: rgba(255, 255, 255, 0.016); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15); border-radius: 20px; display: flex; flex-direction: column; overflow: hidden; }

/* --- SIDEBAR --- */
.sidebar-glass { width: 400px; flex-shrink: 0; }
.sidebar-scroller { flex: 1; overflow-y: auto; padding: 2rem; display: flex; flex-direction: column; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.3) transparent; }
.sidebar-scroller::-webkit-scrollbar { width: 4px; }
.sidebar-scroller::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }

/* Perfil */
.sidebar-profile { display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-bottom: 0; text-align: center; }
.avatar-wrapper { position: relative; width: 100px; height: 100px; }
.avatar-ring { width: 100%; height: 100%; padding: 3px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.avatar-img { width: 100%; height: 100%; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.9); object-fit: cover; }
.edit-avatar-btn { position: absolute; bottom: 0; right: 0; background: var(--color-primary); color: white; border: 2px solid rgba(255, 255, 255, 0.9); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 8px rgba(0,0,0,0.3); }
.edit-avatar-btn:hover { transform: scale(1.1); background: var(--color-secondary); }
.edit-avatar-btn:disabled { cursor: wait; opacity: 0.7; }
.welcome-text span { font-size: 0.9rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 6px; }
.welcome-text h3 { font-size: 1.5rem; color: white; font-weight: 800; margin: 0; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }

/* Separadores */
.profile-separator { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); margin: 1.5rem 0; width: 100%; }
.separator { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); margin-bottom: 2rem; width: 100%; }

/* Grid de Ações */
.sidebar-actions-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 2rem; }
.action-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0; width: 100%; height: 65px; padding: 0; box-sizing: border-box; border-radius: 12px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.8); text-decoration: none; cursor: pointer; transition: 0.2s; }
.action-btn i { font-size: 1.2rem; margin-bottom: 4px; }
.action-btn span { font-size: 0.75rem; font-weight: 600; }
.action-btn:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255,255,255,0.4); color: white; }
.action-btn.logout:hover { background: rgba(255, 50, 50, 0.15); border-color: #ff6b6b; color: #ffadad; }
.action-btn.copy.copied { background: rgba(46, 204, 113, 0.15); border-color: #2ecc71; color: #2ecc71; }

/* Nav Grid */
.nav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.nav-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; aspect-ratio: 1 / 1; border-radius: 16px; text-decoration: none; color: white; font-weight: 600; font-size: 0.95rem; transition: all 0.3s; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); }
.nav-btn:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-5px); border-color: var(--color-primary); box-shadow: 0 5px 20px rgba(0,0,0,0.2); }
.nav-btn.active { background: rgba(255, 255, 255, 0.15); color: white; box-shadow: 0 5px 20px rgba(0,0,0,0.1); border-color: rgba(255,255,255,0.4); }
.nav-btn i { font-size: 2rem; margin-bottom: 10px; opacity: 0.9; }

/* --- Content Glass --- */
.content-glass { flex: 1; position: relative; }
.page-header { padding: 2rem 2.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: rgba(0, 0, 0, 0.1); flex-shrink: 0; }
.page-title { font-size: 1.8rem; font-weight: 800; color: white; margin: 0 0 0.5rem 0; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.page-desc { font-size: 1rem; color: rgba(255, 255, 255, 0.7); margin: 0; font-weight: 500; }
.content-scroller { flex: 1; overflow-y: auto; padding: 2rem 2.5rem; scroll-behavior: smooth; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.3) transparent; }
.content-scroller::-webkit-scrollbar { width: 6px; }
.content-scroller::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 10px; }
.fade-page-enter-active, .fade-page-leave-active { transition: opacity 0.2s ease; }
.fade-page-enter-from, .fade-page-leave-to { opacity: 0; }

/* --- Responsive --- */
@media (max-width: 900px) {
  .layout-body { flex-direction: column; padding: 1rem; }
  .sidebar-glass { width: 100%; height: auto; flex-shrink: 0; overflow: visible; border-radius: 15px; }
  .sidebar-scroller { padding: 1.5rem; overflow: visible; }
  .separator, .profile-separator { display: none; }
  .sidebar-profile { flex-direction: row; text-align: left; gap: 1.5rem; margin-bottom: 1rem; }
  .avatar-wrapper { width: 60px; height: 60px; }
  .edit-avatar-btn { width: 24px; height: 24px; font-size: 0.7rem; }
  .welcome-text h3 { font-size: 1.3rem; }
  .sidebar-actions-grid { margin-bottom: 1rem; }
  .nav-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 1rem;}
  .nav-btn { aspect-ratio: auto; padding: 10px; height: 80px;}
  .nav-btn i { font-size: 1.5rem; margin-bottom: 5px; }
  .nav-btn span { font-size: 0.7rem; }
  .content-glass { flex: 1; border-radius: 15px; }
  .page-header { padding: 1.5rem; }
  .content-scroller { padding: 1.5rem; }
}
</style>