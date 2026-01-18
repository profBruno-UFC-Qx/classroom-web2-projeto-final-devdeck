/**
 * STORE: Autenticação
 * OBJETIVO: Gerenciar o estado do usuário logado, persistência de token e controle de acesso.
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';

// Recupera a URL da API das variáveis de ambiente ou usa localhost como fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// --- INTERFACES ---

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  headline?: string;
  avatar?: string;
  avatarUrl?: string; 
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  // --- STATE (Estado Central) ---

  const user = ref<User | null>(null);
  const token = ref(localStorage.getItem('devdeck_token') || '');

  // --- GETTERS (Dados Computados) ---
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isRecruiter = computed(() => user.value?.role === 'recruiter');

  // --- HELPERS AUXILIARES ---
  function normalizeUrl(url: string | undefined | null): string | undefined {
    if (!url) return undefined;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${API_BASE_URL}${cleanPath}`;
  }

  // --- ACTIONS (Lógica de Negócio) ---

  /**
   * Realiza o login, normaliza dados de perfil e persiste a sessão.
   */
  async function login(email: string, password: string) {
    try {
      const response = await api.post('/login', { email, password });
      const { token: newToken, user: userData } = response.data;

      // Normalização da foto de perfil
      const rawAvatar = userData.avatarUrl || userData.avatar;
      const fullUrl = normalizeUrl(rawAvatar);

      userData.avatar = fullUrl;
      userData.avatarUrl = fullUrl; 

      // Atualização do Estado
      token.value = newToken;
      user.value = userData;

      // Persistência Local
      localStorage.setItem('devdeck_token', newToken);
      localStorage.setItem('devdeck_user', JSON.stringify(userData));

      // Configura cabeçalho padrão para futuras requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Email ou senha incorretos');
    }
  }

  /**
   * Atualiza o avatar do usuário no estado e no storage após um upload bem sucedido.
   */
  function updateUserAvatar(newUrl: string) {
    if (user.value) {
      const fullUrl = normalizeUrl(newUrl);
      user.value.avatar = fullUrl;
      user.value.avatarUrl = fullUrl;
      localStorage.setItem('devdeck_user', JSON.stringify(user.value));
    }
  }

  /**
   * Restaura a sessão do usuário ao recarregar a página (F5).
   */
  function checkAuth() {
    const savedToken = localStorage.getItem('devdeck_token');
    const savedUser = localStorage.getItem('devdeck_user');
    
    if (savedToken && savedUser) {
      token.value = savedToken;
      const parsedUser = JSON.parse(savedUser);
      
      const rawAvatar = parsedUser.avatarUrl || parsedUser.avatar;
      const fullUrl = normalizeUrl(rawAvatar);
      
      parsedUser.avatar = fullUrl;
      parsedUser.avatarUrl = fullUrl;

      user.value = parsedUser;
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }

  /**
   * Cadastra um novo usuário e realiza o login automático.
   */
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

  /**
   * Finaliza a sessão e limpa todos os dados de autenticação.
   */
  function logout() {
    token.value = '';
    user.value = null;
    localStorage.removeItem('devdeck_token');
    localStorage.removeItem('devdeck_user');
    delete api.defaults.headers.common['Authorization'];
    router.push('/login');
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isRecruiter, 
    login,
    register,
    logout,
    checkAuth,
    updateUserAvatar
  };
});