<script setup lang="ts">
import { ref, reactive } from 'vue'
import { api } from '@/services/api'
import { useToastStore } from '@/stores/toast'

const props = defineProps<{
  isOpen: boolean
  receiverId: number
  receiverName: string
}>()

const emit = defineEmits(['close'])
const toast = useToastStore()

const isLoading = ref(false)
const form = reactive({
  subject: '',
  content: ''
})

async function handleSend() {
  if (!form.subject || !form.content) {
    toast.error('Preencha o assunto e a mensagem.')
    return
  }

  isLoading.value = true

  try {
    await api.post('/messages', {
      receiverId: props.receiverId,
      subject: form.subject,
      content: form.content
    })

    toast.success(`Mensagem enviada para ${props.receiverName}!`)
    // Limpa form
    form.subject = ''
    form.content = ''
    emit('close')
  } catch (error: any) {
    console.error(error)
    toast.error('Erro ao enviar mensagem.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-glass">
        
        <div class="modal-header">
          <h3>Nova Mensagem</h3>
          <button class="btn-close" @click="$emit('close')"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="modal-body">
          <p class="to-label">Para: <strong>{{ receiverName }}</strong></p>

          <div class="form-group">
            <label>Assunto</label>
            <input 
              v-model="form.subject" 
              type="text" 
              placeholder="Ex: Proposta de Vaga Front-end" 
              class="input-glass"
            />
          </div>

          <div class="form-group">
            <label>Mensagem</label>
            <textarea 
              v-model="form.content" 
              rows="5" 
              placeholder="Olá, vi seu portfólio e..." 
              class="input-glass area"
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
          <button class="btn-send" @click="handleSend" :disabled="isLoading">
            <i class="bi" :class="isLoading ? 'bi-hourglass-split' : 'bi-send-fill'"></i>
            <span>{{ isLoading ? 'Enviando...' : 'Enviar' }}</span>
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0, 0, 0, 0.503); 
  backdrop-filter: blur(8px); 
  display: flex; align-items: center; justify-content: center; padding: 1rem;
}

.modal-glass {
  width: 100%; max-width: 500px;
  border-radius: 16px; overflow: hidden;
  display: flex; flex-direction: column;
  background: rgba(12, 0, 55, 0.798);
  backdrop-filter: blur(25px); 
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1); 
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6); 
}

.modal-header {
  padding: 1.2rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(255,255,255,0.03);
}
.modal-header h3 { margin: 0; color: white; font-size: 1.1rem; }
.btn-close { background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; font-size: 1.1rem; transition: 0.2s; }
.btn-close:hover { color: white; }

.modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.2rem; }
.to-label { margin: 0; color: rgba(255,255,255,0.7); font-size: 0.9rem; }
.to-label strong { color: white }

.form-group label { display: block; margin-bottom: 0.5rem; color: rgba(255,255,255,0.9); font-size: 0.9rem; font-weight: 600; }
.input-glass {
  width: 100%; padding: 0.8rem; box-sizing: border-box;
  background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; color: white; outline: none; transition: 0.2s;
  font-family: inherit; font-size: 0.95rem;
}
.input-glass:focus { border-color: var(--color-primary); background: rgba(0,0,0,0.5); }
.input-glass.area { resize: vertical; min-height: 100px; }

.modal-footer {
  padding: 1.2rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.1);
  display: flex; justify-content: flex-end; gap: 10px;
  background: rgba(255,255,255,0.03);
}

.btn-cancel {
  padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 600;
  background: transparent; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.8);
  transition: 0.2s;
}
.btn-cancel:hover { background: rgba(255, 255, 255, 0.121); color: white; }

.btn-send {
  padding: 0.6rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600;
  background: rgba(255, 255, 255, 0.208); border: none; color: white;
  display: flex; align-items: center; gap: 8px; transition: 0.2s;
}
.btn-send:hover { background: white; color: var(--color-primary); transform: translateY(-1px); }
.btn-send:disabled { opacity: 0.6; cursor: not-allowed; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>