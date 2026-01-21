<script setup lang="ts">
// --- IMPORTS ---
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { api } from '@/services/api'

// --- STORES & ROUTER ---
const authStore = useAuthStore()
const toast = useToastStore()
const router = useRouter()

// --- STATE ---
const isLoading = ref(false)
const showDeleteModal = ref(false)
const deletePassword = ref('')

const passForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// --- METHODS: PASSWORD UPDATE ---
async function handleUpdatePassword() {
  if (passForm.newPassword !== passForm.confirmPassword) {
    toast.warning('A nova senha e a confirmação não conferem.')
    return
  }
  
  if (passForm.newPassword.length < 6) {
    toast.warning('A senha deve ter no mínimo 6 caracteres.')
    return
  }

  isLoading.value = true
  try {
    await api.put('/users/password', {
      currentPassword: passForm.currentPassword,
      newPassword: passForm.newPassword
    })
    
    toast.success('Senha alterada com sucesso!')
    passForm.currentPassword = ''
    passForm.newPassword = ''
    passForm.confirmPassword = ''
    
  } catch (error: any) {
    const msg = error.response?.data?.error || 'Erro ao alterar senha.'
    toast.error(msg)
  } finally {
    isLoading.value = false
  }
}

// --- METHODS: ACCOUNT DELETION ---
async function confirmDeleteAccount() {
  if (!deletePassword.value) {
    toast.warning('Digite sua senha para confirmar.')
    return
  }

  isLoading.value = true
  
  try {
    await api.delete('/users/me', {
      data: { password: deletePassword.value } 
    })
    handleSuccessDelete()
  } catch (error: any) {
    const status = error.response?.status
    const errorMsg = error.response?.data?.error || ''

    if (status === 401 || status === 403 || status === 404) {
      handleSuccessDelete()
      return
    }

    toast.error(errorMsg || 'Erro ao excluir conta.')
  } finally {
    isLoading.value = false
  }
}

function handleSuccessDelete() {
  showDeleteModal.value = false
  authStore.logout()
  
  toast.success('Sua conta foi excluída.')
  
  // O logout redireciona para Home/login
  router.push('/').then(() => {
    window.location.reload()
  })
}
</script>

<template>
  <div class="view-content">
    
    <div class="settings-container">
      
      <section class="glass-card security-card">
        <div class="card-header">
          <div class="icon-box white-icon">
            <i class="bi bi-shield-lock-fill"></i>
          </div>
          <h3>Segurança e Login</h3>
        </div>

        <div class="form-content">
          <div class="form-group">
            <label>E-mail</label>
            <div class="input-wrapper readonly">
              <i class="bi bi-envelope"></i>
              <input type="text" :value="authStore.user?.email" disabled class="input-glass has-badge" />
              <div class="verified-badge">
                <i class="bi bi-check-circle-fill"></i>
                <span>Verificado</span>
              </div>
            </div>
          </div>

          <hr class="divider" />

          <h4 class="sub-title">Alterar Senha</h4>
          <div class="password-grid">
            <div class="form-group full-width">
              <label>Senha Atual</label>
              <input v-model="passForm.currentPassword" type="password" class="input-glass" placeholder="••••••••" />
            </div>
            <div class="form-group">
              <label>Nova Senha</label>
              <input v-model="passForm.newPassword" type="password" class="input-glass" placeholder="••••••••" />
            </div>
            <div class="form-group">
              <label>Confirmar</label>
              <input v-model="passForm.confirmPassword" type="password" class="input-glass" placeholder="••••••••" />
            </div>
          </div>
          
          <div class="action-right">
            <button class="btn-glass-save" @click="handleUpdatePassword" :disabled="isLoading || !passForm.currentPassword">
              <span v-if="!isLoading">Atualizar Senha</span>
              <span v-else>Salvando...</span>
            </button>
          </div>
        </div>
      </section>

      <section class="glass-card danger-zone">
        <div class="card-header text-danger">
          <div class="icon-box danger">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>
          <h3>Zona de Perigo</h3>
        </div>
        
        <div class="danger-content">
          <div class="danger-info">
            <h4>Excluir Conta</h4>
            <p>Essa ação é irreversível. Todos os seus dados serão perdidos.</p>
          </div>
          <button class="btn-delete" @click="showDeleteModal = true">
            Excluir minha conta
          </button>
        </div>
      </section>
    </div>

    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showDeleteModal" class="modal-backdrop" @click.self="showDeleteModal = false">
          
          <div class="modal-container danger-modal glass-modal">
            
            <header class="modal-header">
              <div class="danger-icon-wrapper">
                <i class="bi bi-exclamation-triangle-fill"></i>
              </div>
              <h3>Excluir Conta Permanentemente?</h3>
            </header>

            <div class="modal-body">
              <p class="warning-text">
                Você está prestes a apagar sua conta. 
                <strong>Esta ação não pode ser desfeita.</strong> 
                Por favor, digite sua senha para confirmar.
              </p>
              
              <div class="form-group mt-4">
                <label>Confirme sua senha</label>
                <input 
                  v-model="deletePassword" 
                  type="password" 
                  class="input-glass danger-input w-100" 
                  placeholder="Digite sua senha atual"
                  @keyup.enter="confirmDeleteAccount"
                />
              </div>
            </div>

            <footer class="modal-footer">
              <button class="btn-cancel" @click="showDeleteModal = false">Cancelar</button>
              <button 
                class="btn-confirm-delete" 
                @click="confirmDeleteAccount" 
                :disabled="isLoading || !deletePassword"
              >
                {{ isLoading ? 'Excluindo...' : 'Sim, excluir tudo' }}
              </button>
            </footer>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
/* --- LAYOUT & CONTAINERS --- */
.view-content { 
  width: 100%; 
  padding: 1rem 0; 
  box-sizing: border-box;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 2rem; 
  width: 100%;
}

/* --- GLASS CARD GERAL --- */
.glass-card {
  width: 100%;
  box-sizing: border-box;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
}

.card-header { display: flex; align-items: center; gap: 15px; margin-bottom: 2rem; }
.card-header h3 { margin: 0; font-size: 1.3rem; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; }

.icon-box.white-icon {
  width: 42px; height: 42px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: white;
  font-size: 1.3rem;
  border: 1px solid rgba(255,255,255,0.05);
}

/* --- FORM ELEMENTS & INPUTS --- */
.form-group { margin-bottom: 1.2rem; }
.form-group label { 
  display: block; color: rgba(255,255,255, 0.9);
  font-size: 0.9rem; font-weight: 500; margin-bottom: 0.6rem; 
}

.input-glass {
  width: 100%; box-sizing: border-box;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px; padding: 0.9rem 1.1rem; 
  color: white; font-size: 0.95rem;
  transition: all 0.3s ease;
}
.input-glass:focus { 
  background: rgba(255, 255, 255, 0.12);
  border-color: var(--color-primary); 
  box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb), 0.15);
  outline: none;
}

.input-wrapper.readonly { position: relative; }
.input-wrapper.readonly i.bi-envelope { 
  position: absolute; left: 1.1rem; top: 50%; transform: translateY(-50%); 
  color: rgba(255,255,255,0.5); z-index: 2;
}
.input-glass.has-badge { 
  padding-left: 3rem; 
  padding-right: 130px; 
  background: rgba(0,0,0,0.2); 
  cursor: default; 
  color: rgba(255,255,255,0.7);
}

.verified-badge {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  padding: 5px 12px; border-radius: 8px;
  font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
  display: flex; align-items: center; gap: 6px;
  pointer-events: none;
}

.divider { border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 2rem 0; }
.sub-title { color: white; margin-bottom: 1.2rem; font-size: 1.1rem; font-weight: 600; }

.password-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.form-group.full-width { grid-column: span 2; }

/* --- BUTTONS --- */
.action-right { display: flex; justify-content: flex-end; margin-top: 1.5rem; }

.btn-glass-save {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  color: white;
  padding: 0.9rem 2.2rem; border-radius: 12px; 
  font-weight: 600; cursor: pointer; 
  transition: all 0.3s ease;
  font-size: 0.95rem;
}
.btn-glass-save:hover:not(:disabled) { 
  background: #ffffff; color: #000000; border-color: #ffffff;
  transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
}
.btn-glass-save:disabled { opacity: 0.5; cursor: not-allowed; }

/* --- DANGER ZONE STYLE --- */
.danger-zone { 
  border: 1px solid rgba(239, 68, 68, 0.3); 
  background: linear-gradient(145deg, rgba(239, 68, 68, 0.05) 0%, rgba(0,0,0,0.2) 100%);
}
.icon-box.danger { 
  background: rgba(239, 68, 68, 0.15); color: #ef4444; 
  border-radius: 12px; width: 42px; height: 42px; 
  display: flex; align-items: center; justify-content: center; font-size: 1.3rem; 
}
.danger-content { display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
.danger-info { flex: 1; } 
.danger-info h4 { color: white; margin: 0 0 5px 0; font-size: 1.1rem; }
.danger-info p { color: rgba(255,255,255,0.7); font-size: 0.9rem; margin: 0; }
.btn-delete {
  background: transparent; border: 1px solid #ef4444; color: #ef4444;
  padding: 0.8rem 1.8rem; border-radius: 12px; font-weight: 700; cursor: pointer;
  transition: all 0.2s; white-space: nowrap;
}
.btn-delete:hover { background: #ef4444; color: white; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .password-grid { grid-template-columns: 1fr; }
  .form-group.full-width { grid-column: span 1; }
  .danger-content { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .btn-delete { width: 100%; text-align: center; }
  .modal-footer { grid-template-columns: 1fr; }
}

/* --- MODAL COM GLASSMORPHISM --- */
.modal-backdrop { 
  position: fixed; inset: 0; 
  background: rgba(0, 0, 0, 0.7); 
  backdrop-filter: blur(5px);   
  z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 20px; 
}

.modal-container { 
  background: rgba(30, 41, 59, 0.65); 
  backdrop-filter: blur(20px); 
  -webkit-backdrop-filter: blur(20px);
  
  border: 1px solid rgba(255,255,255,0.1); 
  width: 100%; max-width: 480px; 
  border-radius: 24px; 
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6); 
  overflow: hidden; 
}

.danger-modal { 
  border: 1px solid rgba(239, 68, 68, 0.4);
  box-shadow: 0 10px 40px rgba(239, 68, 68, 0.1); 
}

.modal-header { 
  padding: 2rem 2rem 1rem; text-align: center; 
  background: rgba(239, 68, 68, 0.08);
  display: flex; flex-direction: column; align-items: center; 
}

.danger-icon-wrapper { width: 70px; height: 70px; border-radius: 50%; background: rgba(239, 68, 68, 0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
.danger-icon-wrapper i { font-size: 2rem; color: #ef4444; }
.modal-header h3 { margin: 0; color: #fff; font-size: 1.5rem; font-weight: 700; }

.modal-body { padding: 0 2rem 2rem; color: #cbd5e1; text-align: center; }
.warning-text { font-size: 1rem; line-height: 1.6; color: rgba(255,255,255,0.9); text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
.warning-text strong { color: #ef4444; }

.danger-input { border-color: rgba(239, 68, 68, 0.5); background: rgba(255, 255, 255, 0.05); }
.danger-input:focus { border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15); }

.mt-4 { margin-top: 1.5rem; text-align: left; }
.w-100 { width: 100%; }

.modal-footer { 
  padding: 1.5rem 2rem; 
  background: rgba(0,0,0,0.25); 
  display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; 
}

.btn-cancel { padding: 0.9rem; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 12px; cursor: pointer; font-weight: 600; transition: 0.2s; }
.btn-cancel:hover { background: rgba(255,255,255,0.1); border-color: white; }
.btn-confirm-delete { padding: 0.9rem; background: linear-gradient(135deg, #ef4444, #dc2626); border: none; color: white; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 1rem; transition: 0.2s; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3); }
.btn-confirm-delete:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4); }
.btn-confirm-delete:disabled { opacity: 0.6; cursor: not-allowed; filter: grayscale(0.5); }

/* --- ANIMATIONS --- */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-container { animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes modalPop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>