<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import logoImg from '@/assets/img/img-logo-header-50px.png' 
import AppSidebar from '@/layouts/AppSidebar.vue' 

const authStore = useAuthStore()
const route = useRoute()

const pageTitle = computed(() => {
  if (route.path === '/dashboard' && authStore.isAdmin) return 'Painel de Controle'
  return (route.meta.title as string) || 'DevDeck'
})

const pageDesc = computed(() => {
  if (route.path === '/dashboard' && authStore.isAdmin) return 'Gerenciamento global'
  return (route.meta.desc as string) || ''
})
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
      
      <AppSidebar />

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
/* Layout Global e CSS Estrutural */
.layout-container { background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%); height: 100vh; width: 100vw; display: flex; flex-direction: column; overflow: hidden; position: relative; }
.background-effects { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; background-color: rgba(0, 0, 0, 0.233); }
.circle-1, .circle-2 { position: absolute; border-radius: 50%; background: white; opacity: 0.05; filter: blur(50px); }
.circle-1 { width: 600px; height: 600px; top: -200px; left: -200px; animation: floatCircle 35s infinite ease-in-out; }
.circle-2 { width: 500px; height: 500px; bottom: -100px; right: -100px; animation: floatCircle 40s infinite ease-in-out reverse; }
.floating-symbol { position: absolute; color: rgba(255, 255, 255, 0.15); font-family: monospace; font-weight: bold; font-size: 3rem; animation: floatSymbol 25s infinite linear; text-shadow: 0 0 10px rgba(255,255,255,0.1); }
.sym-1 { top: 10%; left: 10%; } .sym-2 { bottom: 20%; right: 10%; } .sym-3 { top: 40%; right: 30%; } .sym-4 { bottom: 10%; left: 20%; }
.code-rain { position: absolute; top: 20%; left: 5%; color: rgba(255,255,255,0.06); font-family: 'Fira Code', monospace; transform: rotate(-5deg); pointer-events: none; opacity: 0.8; }
@keyframes floatCircle { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(30px, 30px); } }
@keyframes floatSymbol { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 50% { opacity: 0.2; } 100% { transform: translateY(-100px) rotate(20deg); opacity: 0; } }

.top-header { height: 80px; flex-shrink: 0; width: 100%; position: relative; display: flex; align-items: center; padding: 0 2rem; z-index: 50; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.brand-logo-link { position: absolute; left: 50%; transform: translateX(-50%); display: flex; align-items: center; }
.brand-logo { height: 40px; width: auto; filter: brightness(0) invert(1); display: block; cursor: pointer; transition: transform 0.2s; }
.brand-logo:hover { transform: scale(1.05); }

.layout-body { flex: 1; display: flex; padding: 1.5rem; gap: 1.5rem; overflow: hidden; height: calc(100vh - 80px); }

.content-glass { flex: 1; position: relative; background: rgba(255, 255, 255, 0.016); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15); border-radius: 20px; display: flex; flex-direction: column; overflow: hidden; }
.page-header { padding: 2rem 2.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: rgba(0, 0, 0, 0.1); flex-shrink: 0; }
.page-title { font-size: 1.8rem; font-weight: 800; color: white; margin: 0 0 0.5rem 0; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.page-desc { font-size: 1rem; color: rgba(255, 255, 255, 0.7); margin: 0; font-weight: 500; }
.content-scroller { flex: 1; overflow-y: auto; padding: 2rem 2.5rem; scroll-behavior: smooth; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.3) transparent; }
.content-scroller::-webkit-scrollbar { width: 6px; }
.content-scroller::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 10px; }
.fade-page-enter-active, .fade-page-leave-active { transition: opacity 0.2s ease; }
.fade-page-enter-from, .fade-page-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .layout-body { flex-direction: column; padding: 1rem; }
  .content-glass { border-radius: 15px; }
  .page-header { padding: 1.5rem; }
  .content-scroller { padding: 1.5rem; }
}
</style>