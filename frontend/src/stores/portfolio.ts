import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'
import { useAuthStore } from './auth'

export interface Project {
  id: number
  title: string
  shortDescription: string
  detailedDescription: string
  images: string[] 
  tags: string[] 
  linkRepo?: string
  linkDeploy?: string
}

export interface Experience {
  id: number
  role: string
  company: string
  period: string
  description: string
}

export interface Education {
  id: number
  institution: string
  course: string
  year: string
  certificateUrl: string
}

export interface UserProfile {
  name: string
  role: string    
  headline: string  
  location: string
  bio: string
  avatarUrl: string
  skills: string[]
  social: {
    github?: string
    linkedin?: string
    website?: string
  }
  experiences: Experience[]
  education: Education[]
}

export const usePortfolioStore = defineStore('portfolio', () => {
  const authStore = useAuthStore()

  // --- State ---
  const projects = ref<Project[]>([])
  const isLoading = ref(false)
  
  const userProfile = ref<UserProfile>({
    name: '',
    role: '',     
    headline: '', 
    location: '',
    bio: '',
    avatarUrl: '',
    skills: [],
    social: {},
    experiences: [],
    education: []
  })

  // --- Project Actions ---
  async function fetchProjects() {
    isLoading.value = true
    try {
      const userId = authStore.user?.id
      const url = userId ? `/projects?limit=50&user_id=${userId}` : '/projects?limit=50'
      const { data } = await api.get(url)
      projects.value = data.data.map((p: any) => ({
        id: p.id,
        title: p.title,
        shortDescription: p.description, 
        detailedDescription: p.detailedDescription || p.description, 
        images: p.images || [], 
        tags: Array.isArray(p.tags) ? p.tags : [],
        linkRepo: p.linkRepo,
        linkDeploy: p.linkDeploy
      }))
    } catch (error) {
      console.error('Fetch projects error:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function createNewProject(newProjectData: Partial<Project>) {
    try {
      const payload = {
        title: newProjectData.title || 'Novo Projeto',
        description: newProjectData.shortDescription || 'Sem descrição',
        detailedDescription: newProjectData.detailedDescription || '',
        linkRepo: newProjectData.linkRepo || '',
        linkDeploy: newProjectData.linkDeploy || '',
        images: newProjectData.images || [],
        tags: newProjectData.tags || [] 
      }
      const response = await api.post('/projects', payload)
      const created = response.data
      const frontendProject: Project = {
        id: created.id,
        title: created.title,
        shortDescription: created.description,
        detailedDescription: created.detailedDescription || created.description,
        images: created.images || [],
        tags: created.tags || payload.tags, 
        linkRepo: created.linkRepo,
        linkDeploy: created.linkDeploy
      }
      projects.value.unshift(frontendProject)
      return true
    } catch (error) {
      console.error('Create project error:', error)
      throw error
    }
  }

  async function removeProject(id: number) {
    try {
      await api.delete(`/projects/${id}`)
      projects.value = projects.value.filter(p => p.id !== id)
    } catch (error: any) {
      const message = error.response?.status === 403 ? 'Sem permissão.' : 'Erro ao deletar.'
      throw new Error(message)
    }
  }

  async function updateProject(project: Partial<Project>) {
    if (!project.id) return
    try {
      const payload = {
        title: project.title,
        description: project.shortDescription,
        detailedDescription: project.detailedDescription,
        linkRepo: project.linkRepo,
        linkDeploy: project.linkDeploy,
        images: project.images || [],
        tags: project.tags || [] 
      }
      await api.put(`/projects/${project.id}`, payload)
      const index = projects.value.findIndex(p => p.id === project.id)
      if (index !== -1) {
        projects.value[index] = { ...projects.value[index], ...project, tags: payload.tags } as Project
      }
      return true
    } catch (error: any) {
      throw new Error(error.response?.status === 403 ? 'Sem permissão.' : 'Erro ao salvar.')
    }
  }

  // --- Profile Actions ---
  async function fetchUserProfile(id?: number) {
    const targetId = id || authStore.user?.id
    if (!targetId) return

    try {
      const { data } = await api.get(`/users/${targetId}/portfolio`)
      
      userProfile.value = {
        name: data.name,
        role: data.role || 'dev',         
        headline: data.headline || '',    
        location: data.location || '',
        bio: data.bio || '',
        avatarUrl: data.avatarUrl || '',
        skills: data.skills || [],
        social: data.social || {},
        experiences: data.experiences || [],
        education: data.education || []
      }
    } catch (error) {
      console.error('Fetch profile error:', error)
      throw error
    }
  }

  async function updateUserProfile(newProfile: UserProfile) {
    const cleanData = JSON.parse(JSON.stringify(newProfile))
    userProfile.value = { ...newProfile }

    try {
      await api.put('/users/profile', cleanData)
    } catch (error: any) {
      console.error('Update profile error:', error.response?.data || error.message)
      throw new Error('Falha ao salvar no servidor')
    }
  }

  async function updateAvatar(url: string) {
    try {
      if (authStore.user) {
        authStore.user.avatar = url
      }
      userProfile.value.avatarUrl = url
      await api.put('/users/profile', { avatarUrl: url })
      return true
    } catch (error) {
      console.error('Erro ao salvar avatar:', error)
      throw error
    }
  }

  async function addSkill(skill: string) {
    const s = skill.trim()
    if (s && !userProfile.value.skills.includes(s)) {
      const updatedSkills = [...userProfile.value.skills, s]
      try {
        await updateUserProfile({ ...userProfile.value, skills: updatedSkills })
      } catch (error) { throw error }
    }
  }

  async function removeSkill(skillToRemove: string) {
    const updatedSkills = userProfile.value.skills.filter(s => s !== skillToRemove)
    try {
      await updateUserProfile({ ...userProfile.value, skills: updatedSkills })
    } catch (error) { throw error }
  }

  return { 
    projects, 
    userProfile, 
    isLoading,
    fetchProjects, 
    createNewProject, 
    removeProject, 
    updateProject, 
    fetchUserProfile,
    updateUserProfile,
    updateAvatar, 
    addSkill,
    removeSkill
  }
})