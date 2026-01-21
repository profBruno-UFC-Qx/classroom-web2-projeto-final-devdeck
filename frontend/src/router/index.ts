import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/public/HomeView.vue'
import AuthenticatedLayout from '@/layouts/UserLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- ROTAS PÚBLICAS ---
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/portfolio/:id',
      name: 'portfolio',
      component: () => import('../views/public/PortfolioView.vue'), 
      meta: { requiresAuth: false }
    },

    // --- ROTAS AUTENTICADAS (Layout Principal) ---
    {
      path: '/',
      component: AuthenticatedLayout,
      meta: { requiresAuth: true },
      children: [
        // 1. DASHBOARD (Agora exclusivo do Desenvolvedor)
        {
          path: 'dashboard',
          name: 'dashboard',
          // AJUSTE 1: Aponta direto para o componente do Dev (pois DashboardView.vue não existe mais)
          component: () => import('../views/auth/dev/UserDashboard.vue'),
          meta: { 
            title: 'Dashboard', 
            desc: 'Visão geral da sua conta.',
            roles: ['dev'] // AJUSTE 2: Restrito apenas a DEVs
          }
        },
        
        // --- ROTAS DE ADMIN ---
        {
          path: 'admin/users',
          name: 'admin-users',
          // Certifique-se que o arquivo foi salvo em views/admin/ ou views/
          component: () => import('../views/auth/admin/AdminUsersView.vue'), 
          meta: { 
            title: 'Gerenciar Usuários', 
            desc: 'Administração de usuários e permissões.',
            roles: ['admin'] 
          }
        },
        {
          path: 'admin/projects',
          name: 'admin-projects',
          component: () => import('../views/auth/admin/AdminProjectsView.vue'),
          meta: { 
            title: 'Gerenciar Projetos', 
            desc: 'Moderação de projetos da plataforma.',
            roles: ['admin'] 
          }
        },

        // --- ROTAS DE DEV ---
        {
          path: 'curriculo',
          name: 'profile',
          component: () => import('../views/auth/dev/ProfileView.vue'),
          meta: { 
            title: 'Meu Currículo', 
            desc: 'Gerencie suas experiências e skills.',
            roles: ['dev', 'admin'] 
          }
        },

        // --- ROTAS DE RECRUTADOR ---
        {
          path: 'recruiter/search',
          name: 'talent-search',
          component: () => import('../views/auth/recruiter/TalentSearchView.vue'),
          meta: { 
            title: 'Buscar Talentos', 
            desc: 'Encontre desenvolvedores para suas vagas.',
            roles: ['recruiter', 'admin'] 
          }
        },

        // --- MENSAGENS ---
        {
          path: 'messages',
          name: 'messages',
          component: () => import('../views/auth/MessagesView.vue'),
          meta: { 
            title: 'Mensagens', 
            desc: 'Caixa de entrada.',
            // Aberto para todos os logados
            roles: ['recruiter', 'admin', 'dev']
          }
        },

        // --- ROTAS COMUNS ---
        {
          path: 'conta',
          name: 'account',
          component: () => import('../views/auth/AccountView.vue'),
          meta: { title: 'Minha Conta', desc: 'Gerencie seus dados de acesso e segurança.' }
        },
        {
          path: 'configuracoes', 
          name: 'settings',
          component: () => import('../views/auth/AccountView.vue'), 
          meta: { title: 'Configurações', desc: 'Preferências do sistema.' }
        }
      ]
    },

    // 404
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// --- GUARDA DE ROTAS (SECURITY GUARD) ---
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // 1. Tenta restaurar sessão (F5)
  if (authStore.token && !authStore.user) {
    try {
      await authStore.checkAuth()
    } catch {
      authStore.logout()
      return next({ name: 'home' })
    }
  }

  // 2. Bloqueio de Não-Logados
  if (to.meta.requiresAuth && !authStore.token) {
    return next({ name: 'home' })
  }

  // 3. REDIRECIONAMENTO INTELIGENTE (AJUSTADO)
  // Se estiver logado e tentar ir para Home ou Login, manda para a tela correta do cargo
  if (to.name === 'home' && authStore.token) {
    const role = authStore.user?.role
    
    if (role === 'admin') return next({ name: 'admin-users' })
    if (role === 'recruiter') return next({ name: 'talent-search' })
    return next({ name: 'dashboard' }) // Dev
  }

  // 4. CONTROLE DE ACESSO POR PAPEL (RBAC)
  if (to.meta.roles) {
    const allowedRoles = to.meta.roles as string[]
    const userRole = authStore.user?.role || ''

    if (!allowedRoles.includes(userRole)) {
      // Se não tiver permissão, joga para a Home (que vai redirecionar corretamente graças ao passo 3)
      return next('/') 
    }
  }

  next()
})

export default router