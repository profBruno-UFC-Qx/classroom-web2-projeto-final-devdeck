import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
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
          component: () => import('../views/DashboardView.vue'),
          meta: { 
            title: 'Dashboard', 
            desc: 'Visão geral dos seus projetos.' 
          }
        },
        {
          path: 'curriculo',
          name: 'profile',
          component: () => import('../views/ProfileView.vue'),
          meta: { 
            title: 'Meu Currículo', 
            desc: 'Gerencie suas informações pessoais, habilidades e experiências.' 
          }
        },
        {
          path: 'conta',
          name: 'account',
          component: () => import('../views/AccountView.vue'), 
          meta: { title: 'Minha Conta', desc: 'Gerencie seus dados de acesso e plano.' }
        },
        //Essa rota não vai ter
        {
          path: 'configuracoes',
          name: 'settings',
          component: () => import('../views/DashboardView.vue'), 
          meta: { title: 'Configurações', desc: 'Personalize sua experiência no DevDeck.' }
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