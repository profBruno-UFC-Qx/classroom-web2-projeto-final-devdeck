import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'
import { useToastStore } from './toast'
import { useAuthStore } from './auth'
import { useDialogStore } from './dialog'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'dev'
  createdAt: string
  avatar?: string | null 
  avatarUrl?: string | null 
}

export interface AdminProject {
  id: number
  title: string
  description: string 
  shortDescription?: string
  detailedDescription?: string
  tags: string[]
  images: string[]
  linkRepo: string
  linkDeploy: string
  createdAt: string
  user: { 
    name: string
    email: string
  }
}

export const useAdminStore = defineStore('admin', () => {
  const users = ref<User[]>([])
  const projects = ref<AdminProject[]>([]) 
  const isLoading = ref(false)
  const totalPagesUsers = ref(1)
  const totalPagesProjects = ref(1)

  const toast = useToastStore()
  const authStore = useAuthStore()
  const dialog = useDialogStore()

  // --- USUÁRIOS ---
  async function fetchUsers(params: any = {}) {
    isLoading.value = true
    try {
      const { data } = await api.get('/admin/users', { params })
      const userList = Array.isArray(data) ? data : (data.users || [])
      
      if (data.totalPages) totalPagesUsers.value = data.totalPages

      const currentUserId = authStore.user?.id
      users.value = userList.filter((u: User) => u.id !== currentUserId)
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar usuários')
    } finally {
      isLoading.value = false
    }
  }

  async function banUser(id: number) {
    const confirmed = await dialog.open({
      title: 'Banir Usuário',
      message: 'Tem certeza que deseja banir este usuário? Todos os projetos dele também serão removidos.',
      confirmText: 'Sim, Banir',
      isDestructive: true
    })
    if (!confirmed) return

    try {
      await api.delete(`/admin/users/${id}`)
      users.value = users.value.filter(u => u.id !== id)
      toast.success('Usuário banido.')
    } catch (error) {
      toast.error('Erro ao banir usuário.')
    }
  }

  async function changeRole(id: number, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'dev' : 'admin'
    const actionName = newRole === 'admin' ? 'Promover' : 'Rebaixar'

    const confirmed = await dialog.open({
      title: `${actionName} Usuário`,
      message: `Confirmar alteração para ${newRole.toUpperCase()}?`,
      confirmText: 'Confirmar',
      isDestructive: false
    })
    if (!confirmed) return

    try {
      const { data } = await api.patch(`/admin/users/${id}/role`, { role: newRole })
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = { 
          ...users.value[index], 
          role: data.role as 'admin'|'dev' 
        } as User
      }
      toast.success('Cargo atualizado!')
    } catch (error) {
      toast.error('Erro ao alterar cargo.')
    }
  }

  // --- PROJETOS ---
  async function fetchProjects(params: any = {}) {
    isLoading.value = true
    try {
      const { data } = await api.get('/admin/projects', { params })
      const projectList = Array.isArray(data) ? data : (data.projects || [])
      
      if (data.totalPages) totalPagesProjects.value = data.totalPages

      projects.value = projectList
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar projetos')
    } finally {
      isLoading.value = false
    }
  }

  async function deleteProject(id: number) {
    try {
      await api.delete(`/admin/projects/${id}`)
      projects.value = projects.value.filter(p => p.id !== id)
      toast.success('Projeto removido com autoridade.')
      return true
    } catch (error) {
      toast.error('Erro ao excluir projeto.')
      return false
    }
  }

  async function updateProject(id: number, projectData: any) {
    try {
      const { data } = await api.put(`/admin/projects/${id}`, projectData)
      
      const index = projects.value.findIndex(p => p.id === id)
      const oldProject = projects.value[index]

      if (index !== -1 && oldProject) {
        const updatedProject = {
            ...oldProject,
            ...data, 
            user: oldProject.user 
        }
        projects.value[index] = updatedProject as AdminProject
      }
      
      toast.success('Projeto atualizado pelo Admin!')
      return true
    } catch (error) {
      console.error(error)
      toast.error('Erro ao atualizar projeto.')
      return false
    }
  }

  return {
    users,
    projects,
    isLoading,
    totalPagesUsers,     
    totalPagesProjects,  
    fetchUsers,
    banUser,
    changeRole,
    fetchProjects,
    deleteProject,
    updateProject
  }
})