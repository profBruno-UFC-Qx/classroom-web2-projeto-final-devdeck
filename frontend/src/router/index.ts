import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// Importe o layout criado. Ajuste o caminho se salvou em outra pasta.
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rota Home (Landing Page / Login) - Sem Layout Logado
    {
      path: '/',
      name: 'home',
      component: HomeView
    },

    //  Rotas Autenticadas - Com Layout Logado
    {
      path: '/', 
      component: AuthenticatedLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard', 
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue')
        },
        {
          path: 'curriculo', 
          name: 'profile',
          component: () => import('../views/ProfileView.vue')
        }
      ]
    },
    // Rota Portfólio Público - Sem Layout Logado
    {
      path: '/p/:username', 
      name: 'portfolio',
      component: () => import('../views/PortfolioView.vue')
    }
  ]
})

export default router