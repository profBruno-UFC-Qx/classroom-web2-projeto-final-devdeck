<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import logoImg from '@/assets/img/img-logo-header-50px.png' 

// --- Store & Router ---
const authStore = useAuthStore()
const router = useRouter()

// --- State ---
const copyButtonText = ref('Copiar')
const copyIcon = ref('bi-clipboard')

// --- Computed Data ---
const userName = computed(() => {
  const name = authStore.user?.name || 'Dev'
  return name.split(' ')[0] 
})

const userAvatar = computed(() => {
  return authStore.user?.avatar || `https://ui-avatars.com/api/?name=${userName.value}&background=fff&color=8456b5&bold=true`
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
    setTimeout(() => {
      copyButtonText.value = 'Copiar'
      copyIcon.value = 'bi-clipboard'
    }, 2000)
  } catch (err) {
    console.error('Erro ao copiar', err)
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
      <div class="code-rain">
        <pre>const layout = 'grid';</pre>
        <pre>import { User } from '@app';</pre>
      </div>
    </div>

    <header class="top-header">
      <div class="header-wrapper">
        <RouterLink to="/dashboard">
          <img :src="logoImg" alt="DevDeck Logo" class="header-logo" />
        </RouterLink>
      </div>
    </header>

    <div class="layout-body">
      
      <aside class="sidebar-glass">
        <div class="sidebar-scroller">
          
          <div class="sidebar-profile">
            <div class="avatar-wrapper">
              <img :src="userAvatar" :alt="userName" class="avatar-img" />
              <button class="edit-avatar-btn" title="Alterar foto">
                <i class="bi bi-pencil-fill"></i>
              </button>
            </div>
            
            <div class="welcome-text">
              <span>Bem-vindo(a),</span>
              <h3>{{ userName }}</h3>
            </div>
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

          <div class="spacer"></div>

          <div class="sidebar-footer-grid">
            
            <a :href="portfolioPath" target="_blank" class="footer-btn view" title="Ver Portfólio">
              <i class="bi bi-eye-fill"></i>
              <span>Ver</span>
            </a>

            <button @click="copyLink" class="footer-btn copy" :class="{ copied: copyButtonText === 'Copiado!' }" title="Copiar Link">
              <i class="bi" :class="copyIcon"></i>
              <span>{{ copyButtonText }}</span>
            </button>
            
            <button @click="handleLogout" class="footer-btn logout" title="Sair">
              <i class="bi bi-box-arrow-right"></i>
              <span>Sair</span>
            </button>

          </div>

        </div>
      </aside>

      <main class="content-card-white">
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
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* --- Background --- */
.background-effects { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.circle-1, .circle-2 { position: absolute; border-radius: 50%; background: white; opacity: 0.05; filter: blur(60px); }
.circle-1 { width: 600px; height: 600px; top: -200px; left: -200px; animation: floatCircle 30s infinite ease-in-out; }
.circle-2 { width: 500px; height: 500px; bottom: -100px; right: -100px; animation: floatCircle 25s infinite ease-in-out reverse; }
.floating-symbol { position: absolute; color: rgba(255, 255, 255, 0.1); font-family: monospace; font-weight: bold; font-size: 3rem; animation: floatSymbol 20s infinite linear; }
.sym-1 { top: 10%; left: 10%; } .sym-2 { bottom: 20%; right: 10%; } .sym-3 { top: 40%; right: 30%; } .sym-4 { bottom: 10%; left: 20%; }
.code-rain { position: absolute; top: 20%; left: 5%; color: rgba(255,255,255,0.03); font-family: 'Fira Code', monospace; transform: rotate(-5deg); pointer-events: none; }
@keyframes floatCircle { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(30px, 30px); } }
@keyframes floatSymbol { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 50% { opacity: 0.2; } 100% { transform: translateY(-100px) rotate(20deg); opacity: 0; } }

/* --- Header --- */
.top-header {
  height: 80px;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
  z-index: 50;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.header-logo { height: 40px; width: auto; filter: brightness(0) invert(1); display: block; cursor: pointer; transition: transform 0.2s; }
.header-logo:hover { transform: scale(1.05); }

/* --- Layout Body --- */
.layout-body {
  flex: 1;
  display: flex;
  padding: 1.5rem;
  gap: 1.5rem;
  overflow: hidden;
  height: calc(100vh - 80px);
}

/* --- Sidebar --- */
.sidebar-glass {
  width: 350px; 
  flex-shrink: 0;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sidebar-scroller { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.3) transparent; }
.sidebar-scroller::-webkit-scrollbar { width: 4px; }
.sidebar-scroller::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }

/* Perfil */
.sidebar-profile { display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-bottom: 1.5rem; text-align: center; }
.avatar-wrapper { position: relative; width: 90px; height: 90px; }
.avatar-img { width: 100%; height: 100%; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.5); object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
.edit-avatar-btn { position: absolute; bottom: 0; right: 0; background: var(--color-primary); color: white; border: 2px solid rgba(255, 255, 255, 0.8); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.8rem; transition: transform 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
.edit-avatar-btn:hover { transform: scale(1.1); background: var(--color-secondary); }
.welcome-text span { font-size: 0.85rem; color: rgba(255,255,255,0.8); display: block; margin-bottom: 4px; }
.welcome-text h3 { font-size: 1.3rem; color: white; font-weight: 700; margin: 0; }
.separator { height: 1px; background: rgba(255,255,255,0.2); margin-bottom: 1.5rem; width: 100%; }

/* Nav Grid */
.nav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.nav-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; aspect-ratio: 1 / 1; border-radius: 16px; text-decoration: none; color: white; font-weight: 600; font-size: 0.9rem; transition: all 0.3s; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); }
.nav-btn:hover { background: rgba(255, 255, 255, 0.15); transform: translateY(-3px); border-color: rgba(255, 255, 255, 0.3); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
.nav-btn.active { background: white; color: var(--color-primary); box-shadow: 0 4px 20px rgba(0,0,0,0.15); border-color: white; }
.nav-btn i { font-size: 1.8rem; margin-bottom: 8px; }

.spacer { flex: 1; min-height: 2rem; }

/* --- FOOTER GRID --- */
.sidebar-footer-grid { 
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; 
  gap: 8px;
  margin-top: auto;
}

.footer-btn {
  /* RESETA ESTILOS PADRÃO */
  display: flex;
  flex-direction: column; 
  align-items: center;
  justify-content: center;
  margin: 0; 
  width: 100%; 
  height: 60px; 
  padding: 0; 
  box-sizing: border-box; 

  /* ESTÉTICA */
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  cursor: pointer;
  transition: 0.2s;
  
  /* FONTE */
  font-family: inherit; 
  line-height: normal;
}

.footer-btn i { font-size: 1.1rem; margin-bottom: 4px; }
.footer-btn span { font-size: 0.7rem; font-weight: 600; }

.footer-btn:hover { background: rgba(255, 255, 255, 0.15); border-color: rgba(255,255,255,0.4); }
.footer-btn.logout:hover { background: rgba(255, 50, 50, 0.2); border-color: #ff6b6b; color: #ffcccc; }
.footer-btn.copy.copied { background: rgba(46, 204, 113, 0.2); border-color: #2ecc71; color: #2ecc71; }

/* Content Card */
.content-card-white { flex: 1; background: #f4f6f8; border-radius: 20px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); display: flex; flex-direction: column; overflow: hidden; position: relative; }
.content-scroller { flex: 1; overflow-y: auto; padding: 2rem; scroll-behavior: smooth; scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
.content-scroller::-webkit-scrollbar { width: 6px; }
.content-scroller::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.content-scroller::-webkit-scrollbar-track { background: transparent; }
.fade-page-enter-active, .fade-page-leave-active { transition: opacity 0.2s ease; }
.fade-page-enter-from, .fade-page-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .layout-body { flex-direction: column; padding: 1rem; }
  .sidebar-glass { width: 100%; height: auto; flex-shrink: 0; overflow: visible; }
  .sidebar-scroller { padding: 1rem; overflow: visible; }
  .separator, .spacer { display: none; }
  .sidebar-profile { flex-direction: row; text-align: left; }
  .avatar-wrapper { width: 50px; height: 50px; }
  .edit-avatar-btn { width: 20px; height: 20px; font-size: 0.6rem; }
  .welcome-text h3 { font-size: 1.1rem; }
  .nav-grid { grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 1rem;}
  .nav-btn { aspect-ratio: auto; padding: 10px; height: 70px;}
  .nav-btn i { font-size: 1.4rem; margin-bottom: 4px; }
  .nav-btn span { font-size: 0.65rem; }
  .sidebar-footer-grid { margin-top: 0; }
  .content-card-white { flex: 1; border-radius: 15px; }
}
</style>