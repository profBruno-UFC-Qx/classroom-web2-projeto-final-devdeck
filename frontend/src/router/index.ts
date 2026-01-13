import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/portfolio/:id',
      name: 'portfolio',
      component: () => import('../views/PortfolioView.vue'), 
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: AuthenticatedLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: { title: 'Dashboard', desc: 'Visão geral dos seus projetos.' }
        },
        {
          path: 'curriculo',
          name: 'profile',
          component: () => import('../views/ProfileView.vue'),
          meta: { title: 'Meu Currículo', desc: 'Gerencie suas informações pessoais e experiências.' }
        },
        {
          path: 'conta',
          name: 'account',
          component: () => import('../views/AccountView.vue'),
          meta: { title: 'Minha Conta', desc: 'Gerencie seus dados de acesso e segurança.' }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Tenta restaurar a sessão se houver token mas sem usuário 
  if (authStore.token && !authStore.user) {
    try {
      await authStore.checkAuth()
    } catch {
      authStore.logout()
    }
  }

  // Redireciona para Home se não estiver logado e a rota exigir auth
  if (to.meta.requiresAuth && !authStore.token) {
    return next({ name: 'home' })
  }

  // Redireciona para Dashboard se já estiver logado e tentar acessar Home/Login
  if (to.name === 'home' && authStore.token) {
    return next({ name: 'dashboard' })
  }

  next()
})

export default router