<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import SidebarDev from '@/layouts/sidebars/SidebarDev.vue'
import SidebarRecruiter from '@/layouts/sidebars/SidebarRecruiter.vue'
import SidebarAdmin from '@/layouts/sidebars/SidebarAdmin.vue' 

const authStore = useAuthStore()

// Decide qual componente carregar baseado no Role
const currentSidebar = computed(() => {
  if (authStore.isAdmin) return SidebarAdmin 
  if (authStore.isRecruiter) return SidebarRecruiter
  return SidebarDev // Padrão
})
</script>

<template>
  <aside class="sidebar-glass">
    <div class="sidebar-scroller">
      <component :is="currentSidebar" />
    </div>
  </aside>
</template>

<style scoped>
.sidebar-glass { 
  width: 400px; flex-shrink: 0;
  background: rgba(255, 255, 255, 0.016); 
  backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(20px); 
  border: 1px solid rgba(255, 255, 255, 0.1); 
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15); 
  border-radius: 20px; 
  display: flex; flex-direction: column; overflow: hidden; 
}

.sidebar-scroller { 
  flex: 1; overflow-y: auto; padding: 2rem; 
  display: flex; flex-direction: column; 
  scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.3) transparent; 
}
.sidebar-scroller::-webkit-scrollbar { width: 4px; }
.sidebar-scroller::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }

@media (max-width: 900px) {
  .sidebar-glass { width: 100%; height: auto; flex-shrink: 0; overflow: visible; border-radius: 15px; }
  .sidebar-scroller { padding: 1.5rem; overflow: visible; }
}
</style>