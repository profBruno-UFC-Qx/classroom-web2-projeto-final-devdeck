<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import { storeToRefs } from 'pinia'

const store = useToastStore()
const { toasts } = storeToRefs(store)

const icons = {
  success: 'bi-check-circle-fill',
  error: 'bi-x-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill'
}
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="toast-item"
        :class="toast.type"
      >
        <div class="icon-wrapper">
          <i class="bi" :class="icons[toast.type]"></i>
        </div>
        <span class="message">{{ toast.message }}</span>
        <button class="btn-close" @click="store.remove(toast.id)">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 99999; 
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  min-width: 300px;
  max-width: 400px;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  font-weight: 500;
  font-size: 0.95rem;
}

/* Tipos de Toast  */
.toast-item.success {
  background: rgba(16, 185, 129, 0.85); 
  border-left: 4px solid #34d399;
}

.toast-item.error {
  background: rgba(239, 68, 68, 0.85);
  border-left: 4px solid #fca5a5;
}

.toast-item.warning {
  background: rgba(245, 158, 11, 0.85); 
  border-left: 4px solid #fcd34d;
}

.toast-item.info {
  background: rgba(59, 130, 246, 0.85); 
  border-left: 4px solid #93c5fd;
}

.icon-wrapper i { font-size: 1.2rem; }
.message { flex: 1; line-height: 1.4; }

.btn-close {
  background: transparent; border: none; color: white; opacity: 0.7; cursor: pointer; font-size: 1.2rem; display: flex;
}
.btn-close:hover { opacity: 1; }
.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from { opacity: 0; transform: translateX(50px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateY(-30px); }
</style>