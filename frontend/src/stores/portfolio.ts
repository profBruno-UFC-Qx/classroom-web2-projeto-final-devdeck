import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePortfolioStore = defineStore('portfolio', () => {
  
  // --- Estado: Perfil do Usuário ---
  const userProfile = ref({
    name: 'Edinaldo Dev',
    role: 'Estudante de Ciência da Computação',
    bio: 'Apaixonado por tecnologia, focado em desenvolvimento Web Fullstack com Vue e Node.js. Buscando oportunidades de estágio.',
    location: 'Quixadá, CE',
    email: 'contato@edinaldo.dev',
    avatar: 'https://github.com/edinaldogit.png',
    linkedin: 'linkedin.com/in/seunome',
    github: 'github.com/edinaldogit'
  })

  // --- Estado: Listas de Dados ---
  const projects = ref([
    { 
      id: 1, 
      title: 'DevDeck', 
      description: 'Plataforma para criação de portfólios e currículos online.', 
      link: 'https://github.com/edinaldogit/devdeck' 
    },
    { 
      id: 2, 
      title: 'TaskFlow', 
      description: 'Aplicação de gestão de tarefas estilo Kanban.', 
      link: 'https://github.com/edinaldogit/taskflow' 
    }
  ])

  const experiences = ref([
    {
      id: 1,
      title: 'Monitoria de Programação',
      institution: 'UFC Quixadá',
      period: 'Fev 2024 - Atual',
      description: 'Auxílio aos alunos na disciplina de Fundamentos de Programação, tirando dúvidas de C e Python.'
    },
    {
      id: 2,
      title: 'Desenvolvimento Web 2',
      institution: 'Projeto Acadêmico',
      period: 'Out 2025 - Nov 2025',
      description: 'Desenvolvimento de uma aplicação Fullstack completa utilizando Vue 3 e Node.js.'
    }
  ])

  const publicUsers = ref([
    { username: 'edinaldo', name: 'Edinaldo Dev', role: 'Fullstack Developer', avatar: 'https://i.pravatar.cc/150?img=11' },
    { username: 'maria', name: 'Maria Silva', role: 'UX Designer', avatar: 'https://i.pravatar.cc/150?img=5' },
    { username: 'joao', name: 'João Souza', role: 'Backend Engineer', avatar: 'https://i.pravatar.cc/150?img=3' },
    { username: 'ana', name: 'Ana Clara', role: 'Data Scientist', avatar: 'https://i.pravatar.cc/150?img=9' },
  ])

  // --- Actions: Gerenciamento de Projetos ---
  function addProject(title: string, description: string, link: string) {
    projects.value.push({
      id: Date.now(),
      title,
      description,
      link
    })
  }

  function removeProject(id: number) {
    projects.value = projects.value.filter(p => p.id !== id)
  }

  // --- Actions: Gerenciamento de Experiências ---
  function addExperience(title: string, institution: string, period: string, description: string) {
    experiences.value.push({
      id: Date.now(),
      title,
      institution,
      period,
      description
    })
  }

  function removeExperience(id: number) {
    experiences.value = experiences.value.filter(e => e.id !== id)
  }

  // --- Actions: Atualização de Perfil ---
  function updateProfile(newData: any) {
    Object.assign(userProfile.value, newData)
  }

  return { 
    userProfile, 
    projects, 
    experiences,
    publicUsers, 
    addProject, 
    removeProject,
    addExperience,
    removeExperience,
    updateProfile
  }
})