<script setup lang="ts">
defineProps<{
  isOpen: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  isDanger?: boolean
}>()

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="confirm-backdrop" @click.self="$emit('cancel')">
        <div class="confirm-card">
          <div class="icon-header" :class="{ 'danger': isDanger }">
            <i class="bi" :class="isDanger ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'"></i>
          </div>
          
          <h3>{{ title || 'Tem certeza?' }}</h3>
          <p>{{ message || 'Essa ação não pode ser desfeita.' }}</p>
          
          <div class="actions">
            <button class="btn-cancel" @click="$emit('cancel')">
              {{ cancelText || 'Cancelar' }}
            </button>
            <button 
              class="btn-confirm" 
              :class="{ 'btn-danger': isDanger }"
              @click="$emit('confirm')"
            >
              {{ confirmText || 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.confirm-backdrop {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 10000; 
  display: flex; justify-content: center; align-items: center;
  padding: 20px;
}

.confirm-card {
  background: white;
  width: 100%; max-width: 400px;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

.icon-header {
  font-size: 3rem; margin-bottom: 1rem; color: var(--color-primary);
}
.icon-header.danger { color: #ef4444; }

h3 { margin: 0 0 0.5rem; color: #1e293b; font-size: 1.5rem; }
p { color: #64748b; margin-bottom: 2rem; line-height: 1.5; }

.actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

.btn-cancel {
  padding: 0.8rem; border: 1px solid #e2e8f0; background: white;
  border-radius: 12px; font-weight: 600; color: #64748b; cursor: pointer;
  transition: 0.2s;
}
.btn-cancel:hover { background: #f8fafc; color: #334155; }

.btn-confirm {
  padding: 0.8rem; border: none; background: var(--color-primary);
  border-radius: 12px; font-weight: 600; color: white; cursor: pointer;
  transition: 0.2s;
}
.btn-confirm.btn-danger { background: #ef4444; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }
.btn-confirm:hover { transform: translateY(-2px); filter: brightness(1.1); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>