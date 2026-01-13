<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Hooks
const router = useRouter()
const authStore = useAuthStore()

// State
const isLogin = ref(true)
const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

// Methods
function toggleAuthMode() { 
  isLogin.value = !isLogin.value
  errorMessage.value = ''
}

async function handleAuth() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Preencha email e senha.'
    return
  }

  if (!isLogin.value && !name.value) {
    errorMessage.value = 'Informe seu nome para cadastrar.'
    return
  }

  isLoading.value = true

  try {
    if (isLogin.value) {
      await authStore.login(email.value, password.value)
    } else {
      await authStore.register(name.value, email.value, password.value)
    }

    router.push('/dashboard')
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error.message || 'Erro ao conectar com o servidor.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-card desk-glass">
    <Transition name="slide-fade" mode="out-in">
      <div :key="isLogin ? 'login' : 'register'" class="auth-content">
        
        <div class="header-form">
          <h3>{{ isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta' }}</h3>
          <p>{{ isLogin ? 'Entre com suas credenciais para acessar.' : 'Preencha os dados para começar.' }}</p>
        </div>

        <form @submit.prevent="handleAuth">
          
          <div v-if="!isLogin" class="input-group desk-input-group">
            <label>Nome Completo</label>
            <input 
              v-model="name" 
              type="text" 
              placeholder="Ex: João Silva" 
              :disabled="isLoading"
              class="desk-input"
            />
          </div>

          <div class="input-group desk-input-group">
            <label>E-mail</label>
            <input 
              v-model="email" 
              type="email" 
              placeholder="seu@email.com" 
              :disabled="isLoading"
              class="desk-input"
            />
          </div>

          <div class="input-group desk-input-group">
            <label>Senha</label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••" 
              :disabled="isLoading"
              class="desk-input"
            />
          </div>

          <div v-if="errorMessage" class="error-alert">
            <i class="bi bi-exclamation-circle-fill"></i> {{ errorMessage }}
          </div>

          <button type="submit" class="btn-primary btn-desk-glow" :disabled="isLoading">
            <span v-if="isLoading">Carregando...</span>
            <span v-else>{{ isLogin ? 'Entrar' : 'Criar Conta' }}</span>
          </button>
        </form>

        <div class="toggle-link">
          <p>
            {{ isLogin ? 'Ainda não tem uma conta?' : 'Já possui cadastro?' }}
            <a href="#" @click.prevent="toggleAuthMode">
              {{ isLogin ? 'Cadastre-se' : 'Fazer Login' }}
            </a>
          </p>
        </div>

      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* --- Card de Login  --- */
.login-card.desk-glass {
  flex: 0 0 500px;
  width: 100%;
  padding: 2.5rem;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.283); 
  backdrop-filter: blur(12px); 
  -webkit-backdrop-filter: blur(15px);
}

.header-form { margin-bottom: 2rem; text-align: center; }
.header-form h3 { font-size: 2rem; color: #ffffff; margin-bottom: 0.5rem; font-weight: 700; letter-spacing: -0.5px; }
.header-form p { color: rgba(255, 255, 255, 0.85); font-size: 0.9rem; } /* Texto mais claro */
.auth-content { width: 100%; }

/* --- Inputs estilo DevDeck Glass --- */
.input-group {
  margin-bottom: 1.2rem;
  position: relative;
}

.input-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-weight: 600;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9); 
}

.input-group label::before {
  content: '// ';
  color: var(--color-secondary); 
  opacity: 1; 
}

.input-group input.desk-input {
  width: 100%;
  padding: 0.8rem 0.8rem 0.8rem 2.5rem; 
  box-sizing: border-box; 

  background-color: rgba(0, 0, 0, 0.207); 
  border: none;
  
  border-radius: 8px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.95rem;
  color: white; 
  font-weight: 500;
  transition: all 0.3s ease;
}

.input-group input:disabled {
  background-color: rgba(0, 0, 0, 0.6);
  cursor: not-allowed;
  opacity: 0.6;
}

.input-group::after {
  content: '>';
  position: absolute;
  left: 14px;
  top: 39px; 
  color: var(--color-accent); 
  font-family: monospace;
  font-weight: bold;
  pointer-events: none;
  font-size: 1.1rem;
}

/* Foco no input */
.input-group input.desk-input:focus {
  background-color: rgba(0, 0, 0, 0.749); 
  border-color: var(--color-secondary); 
  outline: none;
  box-shadow: 0 0 0 4px rgba(144, 0, 255, 0.312); 
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
}

/* --- Botão --- */
.btn-primary { 
  width: 100%; 
  padding: 0.9rem; 
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white; 
  border: none; 
  border-radius: 8px; 
  font-size: 1rem; 
  font-weight: bold; 
  cursor: pointer; 
  transition: all 0.3s ease; 
  margin-top: 0.5rem; 
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.btn-desk-glow:hover { 
  transform: translateY(-2px); 

}

.btn-primary:disabled {
  background: #475569;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  filter: grayscale(1);
}

.error-alert {
  background-color: rgba(220, 38, 38, 0.2); 
  color: #fca5a5;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  border: 1px solid rgba(220, 38, 38, 0.3);
}

.toggle-link { margin-top: 1.5rem; text-align: center; font-size: 0.85rem; color: rgba(255, 255, 255, 0.7); }
.toggle-link a { color: #a78bfa; font-weight: bold; margin-left: 5px; text-decoration: none;}
.toggle-link a:hover { color: #c4b5fd; text-decoration: underline;}

/* Transições */
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.3s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateX(20px); }
.slide-fade-leave-to { opacity: 0; transform: translateX(-20px); }

@media (max-width: 999px) {
  .login-card.desk-glass { width: 100%; flex: auto; max-width: 350px; }
}
</style>