<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import logoImg from '@/assets/img/img-logo-vet.png'

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
  <div class="home-background">
    
    <div class="circle-1"></div>
    <div class="circle-2"></div>
    <div class="grid-texture"></div>

    <div class="floating-symbol sym-1">&lt;/&gt;</div>
    <div class="floating-symbol sym-2">{ }</div>
    <div class="floating-symbol sym-3">#</div>
    <div class="floating-symbol sym-4">;</div>

    <div class="code-snippet snip-1">
      <pre>const dev = { 
        level: 'Senior', 
        skills: ['Vue'] 
      };</pre>
    </div>
    <div class="code-snippet snip-2">
      <pre>git commit -m "Start"</pre>
    </div>

    <div class="content-container">
      
      <div class="brand-section">
        <div class="text-content">
          <img :src="logoImg" alt="DevDeck" class="hero-logo" />
          <h2>Sua carreira,<br>seu código,<br>sua vitrine.</h2>
          <p>Crie seu portfólio de desenvolvedor e gerencie seu currículo em uma única plataforma profissional.</p>
        </div>
      </div>

      <div class="login-card">
        <Transition name="slide-fade" mode="out-in">
          <div :key="isLogin ? 'login' : 'register'" class="auth-content">
            
            <div class="header-form">
              <h3>{{ isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta' }}</h3>
              <p>{{ isLogin ? 'Entre com suas credenciais para acessar.' : 'Preencha os dados para começar.' }}</p>
            </div>

            <form @submit.prevent="handleAuth">
              
              <div v-if="!isLogin" class="input-group">
                <label>Nome Completo</label>
                <input 
                  v-model="name" 
                  type="text" 
                  placeholder="Ex: João Silva" 
                  :disabled="isLoading"
                />
              </div>

              <div class="input-group">
                <label>E-mail</label>
                <input 
                  v-model="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  :disabled="isLoading"
                />
              </div>

              <div class="input-group">
                <label>Senha</label>
                <input 
                  v-model="password" 
                  type="password" 
                  placeholder="••••••••" 
                  :disabled="isLoading"
                />
              </div>

              <div v-if="errorMessage" class="error-alert">
                <i class="bi bi-exclamation-circle-fill"></i> {{ errorMessage }}
              </div>

              <button type="submit" class="btn-primary" :disabled="isLoading">
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

    </div>
  </div>
</template>

<style scoped>
/* --- Layout & Background --- */
.home-background {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  min-height: 100%; 
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  box-sizing: border-box; 
}

.content-container {
  width: 100%;
  max-width: 1100px;
  display: flex;
  align-items: center;
  justify-content: space-between; 
  gap: 4rem; 
  position: relative;
  z-index: 10; 
}

/* --- Seção da Marca --- */
.brand-section {
  flex: 1;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center; 
}

.hero-logo {
  height: 240px;
  width: auto;
  margin-left: 3rem;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
}

.text-content {
  width: 100%;
  max-width: 450px;
}

.brand-section h2 {
  font-size: 3rem;
  line-height: 1.1;
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: left;
}

.brand-section p {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
  text-align: left;
}

/* --- Card de Login --- */
.login-card {
  flex: 0 0 500px;
  background-color: var(--color-surface);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
}

.header-form { margin-bottom: 2rem; text-align: center; }
.header-form h3 { font-size: 2rem; color: var(--color-primary); margin-bottom: 0.5rem; }
.header-form p { color: #666; font-size: 0.9rem; }
.auth-content { width: 100%; }

/* --- Inputs & Botões --- */
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
  color: #7e8c9f; 
}

.input-group label::before {
  content: '// ';
  color: var(--color-secondary); 
  opacity: 0.8;
}

.input-group input {
  width: 100%;
  padding: 0.8rem 0.8rem 0.8rem 2.5rem; 
  box-sizing: border-box; 
  background-color: #f8fbfe; 
  border: 2px solid #e1e4e8;
  border-radius: 8px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.95rem;
  color: var(--color-primary); 
  font-weight: 500;
  transition: all 0.3s ease;
}

.input-group input:disabled {
  background-color: #eee;
  cursor: not-allowed;
  opacity: 0.7;
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

.input-group input:focus {
  background-color: #FFFFFF; 
  border-color: var(--color-secondary); 
  outline: none;
  box-shadow: 0 4px 12px rgba(143, 0, 255, 0.1); 
}

.input-group input::placeholder {
  color: #B0B7C3;
  font-style: italic;
}

.btn-primary { 
  width: 100%; 
  padding: 0.9rem; 
  background-color: var(--color-primary); 
  color: white; 
  border: none; 
  border-radius: 8px; 
  font-size: 1rem; 
  font-weight: bold; 
  cursor: pointer; 
  transition: 0.3s; 
  margin-top: 0.5rem; 
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:hover { 
  background-color: var(--color-highlight); 
  transform: translateY(-2px); 
}

.btn-primary:disabled {
  background-color: #999;
  cursor: not-allowed;
  transform: none;
}

.error-alert {
  background-color: rgba(255, 71, 87, 0.1);
  color: #ff4757;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  border: 1px solid rgba(255, 71, 87, 0.2);
}

.toggle-link { margin-top: 1.5rem; text-align: center; font-size: 0.85rem; color: #666; }
.toggle-link a { color: var(--color-secondary); font-weight: bold; margin-left: 5px; }

/* --- Decoração e Animações --- */
.circle-1, .circle-2 {
  position: absolute;
  border-radius: 50%;
  background: white;
  opacity: 0.05;
  pointer-events: none;
  will-change: transform;
}

.circle-1 { 
  width: 500px; height: 500px; 
  top: -100px; left: -100px; 
  animation: floatAnimation 20s ease-in-out infinite;
}

.circle-2 { 
  width: 700px; height: 700px; 
  bottom: -200px; right: -100px; 
  animation: floatAnimation 28s ease-in-out infinite reverse;
  animation-delay: -5s;
}

.grid-texture {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
  z-index: 1;
}

.floating-symbol {
  position: absolute;
  color: white;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  opacity: 0.1;
  pointer-events: none;
  z-index: 0;
  will-change: transform;
}

.sym-1 { font-size: 2rem; top: 15%; left: 10%; animation: floatAnimation 15s ease-in-out infinite; }
.sym-2 { font-size: 3rem; bottom: 15%; right: 10%; animation: floatAnimation 20s ease-in-out infinite reverse; }
.sym-3 { font-size: 4rem; top: 5%; right: 35%; animation: floatAnimation 12s ease-in-out infinite 2s; }
.sym-4 { font-size: 4rem; bottom: 5%; left: 10%; animation: floatAnimation 18s ease-in-out infinite -5s; }

.code-snippet {
  position: absolute;
  background: rgba(255, 255, 255, 0.02);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
  z-index: 0;
  will-change: transform;
}

.snip-1 { top: 10%; right: 5%; transform: rotate(10deg); animation: floatAnimation 25s ease-in-out infinite; }
.snip-2 { bottom: 25%; left: 5%; transform: rotate(-10deg); animation: floatAnimation 30s ease-in-out infinite reverse; }

@keyframes floatAnimation {
  0% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -40px) rotate(8deg); }
  66% { transform: translate(-20px, 20px) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@media (max-width: 999px) {
  .home-background { 
    padding: 7rem 2rem; 
    height: auto; 
    min-height: calc(100vh - 200px); 
    align-items: flex-start; 
  }
  
  .content-container { 
    flex-direction: column; 
    gap: 3rem; 
    margin-top: 2rem; 
  }
  
  .brand-section { 
    align-items: center; 
    text-align: center; 
  }
  
  .text-content { text-align: center; }
  .brand-section h2, .brand-section p { text-align: center; }
  
  .hero-logo { height: 150px; margin-left: 0rem;}
  .login-card { width: 100%; flex: auto; max-width: 300px; }
  .code-snippet { display: none;}
}
</style>