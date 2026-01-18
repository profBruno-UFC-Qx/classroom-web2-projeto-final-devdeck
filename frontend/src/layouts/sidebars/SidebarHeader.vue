<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { usePortfolioStore } from '@/stores/portfolio'
import { useToastStore } from '@/stores/toast'
import { api } from '@/services/api'

const SERVER_URL = 'http://localhost:3000'

const authStore = useAuthStore()
const portfolioStore = usePortfolioStore()
const toast = useToastStore()

const { userProfile } = storeToRefs(portfolioStore)
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

// Limpa dados antigos ao trocar de usuário
watch(() => authStore.user?.id, (newId) => {
  if (!newId || (userProfile.value as any)?.id !== newId) {
    portfolioStore.userProfile = {} as any
  }
})

const userName = computed(() => {
  const name = userProfile.value?.name || authStore.user?.name || 'Usuário'
  return name.split(' ')[0] 
})

const userAvatar = computed(() => {
  if (userProfile.value?.avatarUrl) return userProfile.value.avatarUrl
  const user = authStore.user as any
  const rawPath = user?.avatar || user?.avatarUrl

  if (rawPath) {
    if (rawPath.toString().startsWith('/')) {
      return `${SERVER_URL}${rawPath}`
    }
    return rawPath
  }

  return `https://ui-avatars.com/api/?name=${userName.value}&background=6366f1&color=fff&bold=true`
})

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
    toast.info('Enviando foto...')

    try {
      const { data } = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      const newUrl = data.url 
      
      // Atualiza Stores
      await portfolioStore.updateAvatar(newUrl)
      
      if (authStore.user) {
        authStore.user.avatar = newUrl
        ;(authStore.user as any).avatarUrl = newUrl
        
        if (newUrl.startsWith('/')) {
          const fullUrl = `${SERVER_URL}${newUrl}`
          authStore.user.avatar = fullUrl
          ;(authStore.user as any).avatarUrl = fullUrl
        }
        localStorage.setItem('devdeck_user', JSON.stringify(authStore.user))
      }
      
      toast.success('Foto atualizada!')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao enviar foto.')
    } finally {
      isUploading.value = false
      if (fileInput.value) fileInput.value.value = ''
    }
  }
}
</script>

<template>
  <div class="sidebar-profile">
    <div class="avatar-wrapper">
      <div class="avatar-ring">
        <img :src="userAvatar" :alt="userName" class="avatar-img" />
      </div>
      
      <button class="edit-avatar-btn" @click="triggerAvatarEdit" :disabled="isUploading">
        <i class="bi" :class="isUploading ? 'bi-hourglass-split' : 'bi-pencil-fill'"></i>
      </button>
      
      <input type="file" ref="fileInput" hidden accept="image/*" @change="onFileSelected" />
    </div>
    
    <div class="welcome-text">
      <span>Bem-vindo(a),</span>
      <h3>{{ userName }}</h3>
      <div v-if="authStore.isAdmin" class="admin-badge"><i class="bi bi-shield-lock-fill"></i> ADMIN</div>
      <div v-if="authStore.isRecruiter" class="recruiter-badge"><i class="bi bi-briefcase-fill"></i> RECRUITER</div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-profile { display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-bottom: 0; text-align: center; }
.avatar-wrapper { position: relative; width: 100px; height: 100px; }
.avatar-ring { width: 100%; height: 100%; padding: 3px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.avatar-img { width: 100%; height: 100%; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.9); object-fit: cover; }
.edit-avatar-btn { position: absolute; bottom: 0; right: 0; background: var(--color-primary); color: white; border: 2px solid rgba(255, 255, 255, 0.9); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 8px rgba(0,0,0,0.3); }
.edit-avatar-btn:hover { transform: scale(1.1); background: var(--color-secondary); }
.welcome-text span { font-size: 0.9rem; color: rgba(255,255,255,0.7); display: block; margin-bottom: 6px; }
.welcome-text h3 { font-size: 1.5rem; color: white; font-weight: 800; margin: 0; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
.admin-badge { display: inline-flex; align-items: center; gap: 5px; background: linear-gradient(90deg, #f59e0b, #d97706); color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; margin-top: 8px; box-shadow: 0 2px 5px rgba(245, 158, 11, 0.3); }
.recruiter-badge { display: inline-flex; align-items: center; gap: 5px; background: linear-gradient(90deg, #10b981, #059669); color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; margin-top: 8px; box-shadow: 0 2px 5px rgba(16, 185, 129, 0.3); }
@media (max-width: 900px) { .sidebar-profile { flex-direction: row; text-align: left; gap: 1.5rem; } .avatar-wrapper { width: 60px; height: 60px; } .edit-avatar-btn { width: 24px; height: 24px; font-size: 0.7rem; } .welcome-text h3 { font-size: 1.3rem; } }
</style>