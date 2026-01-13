import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';

// Interface opcional para ajudar no autocomplete
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  // --- State ---
  const user = ref<User | null>(null);
  const token = ref(localStorage.getItem('devdeck_token') || '');

  // --- Computed ---
  const isAuthenticated = computed(() => !!token.value);

  // --- Actions ---
  async function login(email: string, password: string) {
    try {
      const response = await api.post('/login', { email, password });
      const { token: newToken, user: userData } = response.data;

      token.value = newToken;
      user.value = userData;

      localStorage.setItem('devdeck_token', newToken);
      localStorage.setItem('devdeck_user', JSON.stringify(userData));

      // Configura o Axios imediatamente
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Email ou senha incorretos');
    }
  }

  async function register(name: string, email: string, password: string, role: string = 'dev') {
    try {
      await api.post('/users', { name, email, password, role });
      await login(email, password);
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.error || 'Erro ao cadastrar');
    }
  }

  function logout() {
    token.value = '';
    user.value = null;
    localStorage.removeItem('devdeck_token');
    localStorage.removeItem('devdeck_user');
    
    // Remove o token do Axios para segurança
    delete api.defaults.headers.common['Authorization'];
  }

  // --- CORREÇÃO DO ERRO ---
  // Criamos o clearAuth como um apelido para o logout.
  // Assim, se o componente chamar clearAuth() ou logout(), ambos funcionam.
  const clearAuth = logout;

  function checkAuth() {
    const savedToken = localStorage.getItem('devdeck_token');
    const savedUser = localStorage.getItem('devdeck_user');
    
    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = JSON.parse(savedUser);
      
      // IMPORTANTE: Restaurar o header do Axios ao recarregar a página
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    clearAuth, // Exportando a função que faltava
    checkAuth
  };
});