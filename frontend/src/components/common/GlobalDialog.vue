<script setup lang="ts">
import { useDialogStore } from '@/stores/dialog'
import { storeToRefs } from 'pinia'

const dialogStore = useDialogStore()
const { isOpen, options } = storeToRefs(dialogStore)
</script>

<template>
  <Transition name="fade-overlay">
    <div v-if="isOpen" class="dialog-overlay">
      <div class="dialog-modal glass-effect" :class="{ 'destructive-mode': options.isDestructive }">
        
        <div class="dialog-header">
          <i v-if="options.isDestructive" class="bi bi-exclamation-triangle-fill text-danger"></i>
          <i v-else class="bi bi-check-circle-fill text-success"></i>
          <h3>{{ options.title }}</h3>
        </div>

        <div class="dialog-body">
          <p>{{ options.message }}</p>
        </div>

        <div class="dialog-footer">
          <button @click="dialogStore.cancel" class="btn-cancel">
            {{ options.cancelText }}
          </button>
          
          <button 
            @click="dialogStore.confirm" 
            :class="['btn-confirm', options.isDestructive ? 'danger' : 'success']"
          >
            {{ options.confirmText }}
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* --- Overlay --- */
.dialog-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.7); 
  backdrop-filter: blur(5px);
  z-index: 9999; display: flex; align-items: center; justify-content: center;
}

/* --- Modal Container --- */
.dialog-modal {
  width: 90%; max-width: 420px; padding: 2rem; border-radius: 16px;
  background: rgba(15, 23, 42, 0.95); 
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5); 
  transform: scale(1); transition: all 0.3s ease;
}

.dialog-modal.destructive-mode {
    border-color: rgba(239, 68, 68, 0.3);
}

/* --- Header & Icons --- */
.dialog-header { margin-bottom: 1.5rem; }
.dialog-header i { font-size: 3rem; display: block; margin-bottom: 15px; }
.text-danger { color: #ef4444; } 
.text-success { color: #10b981;}

.dialog-header h3 { color: white; margin: 0; font-size: 1.4rem; font-weight: 700; }
.dialog-body p { color: rgba(255, 255, 255, 0.8); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem; }
.dialog-footer { display: flex; gap: 12px; justify-content: center; }

button { padding: 12px 24px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 0.95rem; }
.btn-cancel { background: rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.8); }
.btn-cancel:hover { background: rgba(255, 255, 255, 0.15); color: white; }
.btn-confirm.success { 
  background: #10b981; color: white; 
}
.btn-confirm.success:hover { background: #059669; }
.btn-confirm.danger { 
  background: #ef4444; color: white; 
}
.btn-confirm.danger:hover { background: #dc2626; }
.fade-overlay-enter-active, .fade-overlay-leave-active { transition: opacity 0.2s; }
.fade-overlay-enter-from, .fade-overlay-leave-to { opacity: 0; }
.fade-overlay-enter-active .dialog-modal { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.fade-overlay-leave-active .dialog-modal { animation: popOut 0.2s ease-in; }

@keyframes popIn { from { transform: scale(0.95) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
@keyframes popOut { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }
</style>