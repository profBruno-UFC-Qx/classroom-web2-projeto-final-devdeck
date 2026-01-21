<script setup lang="ts">
/**
 * VIEW: Portfólio Público
 * DESCRIÇÃO: Página de visualização externa para desenvolvedores.
 * Permite que visitantes e recrutadores vejam projetos, currículo e entrem em contato.
 */

import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import logoImg from '@/assets/img/img-logo-header-50px.png'

// Componentes de Interface
import PublicProjectModal from '@/components/portfolio/PublicProjectModal.vue'
import MessageModal from '@/components/portfolio/MessageModal.vue'

// --- DEFINIÇÃO DE MODELOS ---
interface Project {
  id: number
  title: string
  shortDescription: string
  detailedDescription: string
  imageUrl: string
  images: string[]
  tags: string[]
  linkRepo?: string
  linkDeploy?: string
}

interface UserProfile {
  id: number
  name: string
  role: string
  headline: string
  location: string
  bio: string
  avatarUrl: string
  social: { github?: string; linkedin?: string; website?: string }
  skills: string[]
  experiences: any[]
  education: any[]
}

// --- ESTADO REATIVO  ---
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const isLoading = ref(true)
const error = ref(false)

// Dados do Desenvolvedor
const userProfile = ref<UserProfile>({
  id: 0, name: '', role: '', headline: '', location: '', bio: '', avatarUrl: '',
  social: {}, skills: [], experiences: [], education: []
})
const projects = ref<Project[]>([])

// Controles de UI (Modais)
const showDetails = ref(false)
const showMessageModal = ref(false)
const selectedProject = ref<Project | null>(null)

// --- LÓGICA COMPUTADA ---
const canContact = computed(() => {
  if (!authStore.user) return true
  return authStore.user.id !== userProfile.value.id
})

// --- MÉTODOS E AÇÕES ---

function openProjectDetails(project: Project) {
  selectedProject.value = project
  showDetails.value = true
}

/**
 * Valida autenticação antes de permitir o contato via modal.
 */
function handleContactClick() {
  if (!authStore.isAuthenticated) {
    toast.info('Você precisa fazer login para enviar mensagens.')
    router.push('/login')
    return
  }
  showMessageModal.value = true
}

// --- CICLO DE VIDA ---

onMounted(async () => {
  const userId = route.params.id 

  if (!userId) {
    error.value = true
    isLoading.value = false
    return
  }

  try {
    // Busca consolidada de dados do portfólio e projetos
    const { data } = await api.get(`/users/${userId}/portfolio`)

    // Mapeamento e fallback para projetos
    projects.value = (data.projects || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      shortDescription: p.description,
      detailedDescription: p.detailedDescription || p.description,
      imageUrl: (p.images && p.images.length > 0) ? p.images[0] : 'https://placehold.co/600x400/1e293b/FFF?text=Projeto',
      images: p.images || [],
      tags: p.tags || [],
      linkRepo: p.linkRepo,
      linkDeploy: p.linkDeploy
    }))

    // Mapeamento e fallback para perfil
    userProfile.value = {
      id: data.id,
      name: data.name,
      role: data.role, 
      headline: data.headline || 'Desenvolvedor', 
      location: data.location || '',
      bio: data.bio || `Olá! Sou ${data.name}.`,
      avatarUrl: data.avatarUrl || `https://ui-avatars.com/api/?name=${data.name}&background=6366f1&color=fff&size=256&bold=true`,
      social: data.social || {},
      skills: data.skills || [], 
      experiences: data.experiences || [],
      education: data.education || []
    }
  } catch (err) {
    console.error('Erro ao carregar portfólio:', err)
    error.value = true
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="public-container">
    
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="error-screen">
      <h1>404</h1>
      <p>Portfólio não encontrado.</p>
      <a href="/" class="btn-create">Voltar para Home</a>
    </div>

    <div v-else class="content-wrapper">
      
      <div class="background-effects">
        <div class="circle-1"></div>
        <div class="circle-2"></div>
      </div>

      <header class="public-header">
        <div class="header-content">
          <img :src="logoImg" alt="DevDeck Logo" class="brand-logo" />
          <a href="/" class="btn-create">Crie seu DevDeck</a>
        </div>
      </header>

      <div class="layout-body">
        
        <aside class="sidebar-panel">
          <div class="glass-card profile-full-height">
            <div class="profile-top">
              <div class="avatar-ring">
                <img :src="userProfile.avatarUrl" :alt="userProfile.name" class="avatar" />
              </div>
              <h1 class="dev-name">{{ userProfile.name }}</h1>
              <h2 class="dev-role">{{ userProfile.headline }}</h2>
              <p class="dev-location"><i class="bi bi-geo-alt-fill"></i> {{ userProfile.location }}</p>
              <p class="dev-bio">{{ userProfile.bio }}</p>
            </div>

            <div class="profile-middle">
              <div class="social-row">
                <a v-if="userProfile.social.github" :href="userProfile.social.github" target="_blank" class="social-icon"><i class="bi bi-github"></i></a>
                <a v-if="userProfile.social.linkedin" :href="userProfile.social.linkedin" target="_blank" class="social-icon"><i class="bi bi-linkedin"></i></a>
                <a v-if="userProfile.social.website" :href="userProfile.social.website" target="_blank" class="social-icon"><i class="bi bi-globe"></i></a>
              </div>

              <button v-if="canContact" class="btn-contact-glow mt-4" @click="handleContactClick">
                <i class="bi bi-envelope-paper-fill"></i> Entrar em Contato
              </button>
            </div>
          </div>
        </aside>

        <main class="content-panel">
          <div class="scrollable-content">
            
            <section class="glass-card mb-4" v-if="userProfile.skills.length">
              <div class="card-header-icon"><i class="bi bi-cpu-fill"></i> Tech Stack</div>
              <div class="skills-wrapper">
                <span v-for="skill in userProfile.skills" :key="skill" class="skill-tag">{{ skill }}</span>
              </div>
            </section>

            <section class="glass-card mb-4" v-if="projects.length">
              <div class="card-header-icon"><i class="bi bi-folder-fill"></i> Projetos </div>
              <div class="projects-horizontal">
                <div v-for="project in projects" :key="project.id" class="project-card clickable-card" @click="openProjectDetails(project)">
                  <div class="cover"><img :src="project.imageUrl" :alt="project.title" /></div>
                  <div class="info">
                    <h4>{{ project.title }}</h4>
                    <p>{{ project.shortDescription }}</p>
                    <div class="click-hint"><span>Ver Detalhes</span><i class="bi bi-arrow-right-short"></i></div>
                  </div>
                </div>
              </div>
            </section>

            <section class="history-grid-container">
              <div class="glass-card" v-if="userProfile.experiences.length">
                <h3 class="group-title sticky-title"><i class="bi bi-briefcase-fill"></i> Experiência</h3>
                <div class="timeline scroll-box">
                  <div v-for="exp in userProfile.experiences" :key="exp.id" class="timeline-item">
                    <div class="marker"></div>
                    <div class="details">
                      <div class="head"><h4>{{ exp.role }}</h4><span class="date">{{ exp.period }}</span></div>
                      <span class="sub" v-if="exp.company">{{ exp.company }}</span>
                      <p v-if="exp.description">{{ exp.description }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="glass-card" v-if="userProfile.education.length">
                <h3 class="group-title sticky-title"><i class="bi bi-mortarboard-fill"></i> Formação</h3>
                <div class="timeline scroll-box">
                  <div v-for="edu in userProfile.education" :key="edu.id" class="timeline-item">
                    <div class="marker edu"></div>
                    <div class="details">
                      <div class="head"><h4>{{ edu.course }}</h4><span class="date">{{ edu.year }}</span></div>
                      <span class="sub" v-if="edu.institution">{{ edu.institution }}</span>
                      <a v-if="edu.certificateUrl" :href="edu.certificateUrl" target="_blank" class="cert-link">
                        <i class="bi bi-file-earmark-text"></i> Ver Certificado
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <footer class="internal-footer">Feito com <a href="#">DevDeck</a></footer>
          </div>
        </main>
      </div>
    </div>

    <PublicProjectModal :is-open="showDetails" :project="selectedProject" @close="showDetails = false" />
    <MessageModal :is-open="showMessageModal" :receiver-id="userProfile.id" :receiver-name="userProfile.name" @close="showMessageModal = false" />

  </div>
</template>

<style scoped>
.mt-4 { margin-top: 1.5rem; }

.btn-contact-glow {
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.106);
  border: 2px solid rgba(255, 255, 255, 0.148);
  color: white;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-contact-glow:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.889);
  color: var(--color-primary);
}

.btn-contact-glow:active {
  transform: scale(0.98);
}

.clickable-card { cursor: pointer; }

.projects-horizontal { 
  display: flex; 
  gap: 1.5rem; 
  overflow-x: auto; 
  padding: 10px 0; 
  scrollbar-width: thin; 
  scrollbar-color: #ccc transparent; 
}
.projects-horizontal::-webkit-scrollbar { height: 6px; }
.projects-horizontal::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }

.project-card { 
  flex: 0 0 260px; 
  background: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px; 
  overflow: visible; 
  display: flex; 
  flex-direction: column; 
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
  position: relative;
}
.project-card:hover { 
  transform: translateY(-8px); 
  background: rgba(255, 255, 255, 0.1); 
  border-color: rgba(255, 255, 255, 0.308); 
}
.cover { 
  width: 100%; 
  aspect-ratio: 1 / 1; 
  overflow: hidden; 
  border-radius: 20px 20px 24px 24px; 
  margin: 0; 
  position: relative;
}
.cover img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  transition: transform 0.5s ease;
}
.project-card:hover .cover img {
  transform: scale(1.05); 
}
.info { 
  padding: 1rem 0.8rem; 
  display: flex; 
  flex-direction: column; 
  flex: 1; 
  text-align: left;
}
.info h4 { 
  margin: 0 0 0.1rem 0; 
  font-size: 1rem; 
  font-weight: 700;
  color: #fff; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
}
.info p { 
  font-size: 0.8rem; 
  color: rgba(255,255,255,0.7); 
  line-height: 1.4; 
  margin-bottom: 0.8rem; 
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  line-clamp: 2;
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}
.click-hint {
  margin-top: auto; 
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0.8;
  transition: 0.2s;
  background: rgba(255,255,255,0.05);
  padding: 4px 10px;
  border-radius: 12px;
  width: fit-content;
}
.project-card:hover .click-hint {
  opacity: 1;
  background: var(--color-primary);
  color: white;
}
.public-container { background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); height: 100vh; width: 100vw; margin: 0; padding: 0; overflow: hidden; display: flex; flex-direction: column; }
.content-wrapper { display: flex; flex-direction: column; height: 100%; width: 100%; position: relative; z-index: 1; }
.layout-body { flex: 1; display: flex; padding: 1.5rem; gap: 1.5rem; overflow: hidden; }
.sidebar-panel { width: 450px; display: flex; flex-direction: column; height: 100%; }
.profile-full-height { flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 2rem; text-align: center; overflow-y: auto; }
.loading-overlay, .error-screen { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; z-index: 100; position: relative; }
.spinner { width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 1s infinite linear; }
@keyframes spin { to { transform: rotate(360deg); } }
.background-effects { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; z-index: 0; background-color: rgba(0, 0, 0, 0.233); }
.public-header { height: 80px; flex-shrink: 0; z-index: 50; display: flex; align-items: center; justify-content: flex-end; padding: 0 2rem; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.brand-logo { height: 40px; position: absolute; left: 50%; transform: translateX(-50%); filter: brightness(0) invert(1); }
.btn-create { background: rgba(255, 255, 255, 0.2); color: white; padding: 10px 20px; border-radius: 50px; font-size: 0.9rem; font-weight: 600; text-decoration: none; border: 1px solid rgba(255, 255, 255, 0.3); transition: 0.3s; position: relative; z-index: 2; }
.btn-create:hover { background: white; color: var(--color-primary); }
.glass-card { background: rgba(255, 255, 255, 0.016); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0); border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); padding: 1.5rem; }
.avatar-ring { width: 140px; height: 140px; margin: 0 auto 1rem; padding: 4px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,0.9); }
.dev-name { font-size: 1.5rem; font-weight: 800; margin: 0; color: #fff; line-height: 1.2; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
.dev-role { width: 100%; max-width: 250px; margin: 0.5rem auto 1rem auto; padding: 4px 12px; font-size: 0.8rem; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 1px; filter: brightness(1.2); background-color: rgba(255, 255, 255, 0.168); border-radius: 12px; }
.dev-location { font-size: 0.9rem; color: #ddd; }
.profile-middle { margin: 2rem 0; }
.dev-bio { font-size: 0.95rem; color: #eee; line-height: 1.6; margin: 1rem 0; text-align: justify; }
.social-row { display: flex; justify-content: center; gap: 1rem; }
.social-icon { width: 42px; height: 42px; border-radius: 12px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.3rem; transition: 0.3s; border: 1px solid rgba(255,255,255,0.1); }
.social-icon:hover { background: white; color: var(--color-primary); transform: translateY(-3px); border-color: transparent; }
.content-panel { flex: 1; height: 100%; overflow: hidden; border-radius: 20px; }
.scrollable-content { height: 100%; overflow-y: auto; padding-right: 10px; padding-bottom: 2rem; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.5) transparent; }
.scrollable-content::-webkit-scrollbar { width: 6px; }
.scrollable-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.5); border-radius: 10px; }
.mb-4 { margin-bottom: 1.5rem; }
.card-header-icon { font-size: 0.9rem; font-weight: 800; text-transform: uppercase; color: #fff; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; letter-spacing: 0.5px; text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
.card-header-icon i { color:white; font-size: 1.1rem; }
.skills-wrapper { display: flex; flex-wrap: wrap; gap: 10px; }
.skill-tag { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); padding: 8px 18px; border-radius: 50px; font-size: 0.9rem; font-weight: 600; color: #fff; transition: 0.2s; }
.skill-tag:hover { background: rgba(255,255,255,0.3); border-color: var(--color-primary); }
.history-grid-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.scroll-box { max-height: 450px; overflow-y: auto; padding-right: 5px; scrollbar-width: thin; scrollbar-color: #ccc transparent; display: flex; flex-direction: column; }
.scroll-box::-webkit-scrollbar { width: 4px; }
.scroll-box::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
.sticky-title { position: sticky; top: -1.5rem; background: rgba(255, 255, 255, 0.033); backdrop-filter: blur(15px); margin: -1.5rem -1.5rem 1rem -1.5rem; padding: 1.5rem; z-index: 5; border-bottom: 1px solid rgba(255,255,255,0.1); }
.group-title { font-size: 1.1rem; font-weight: 800; color: white; display: flex; align-items: center; gap: 10px; margin: 0; filter: brightness(1.2); border-radius: 15px; min-height: 50px; }
.timeline { display: flex; flex-direction: column; gap: 1.5rem; padding-left: 10px; border-left: 2px solid rgba(255,255,255,0.2); margin-top: 0.5rem; }
.timeline-item { position: relative; padding-left: 1.5rem; padding-bottom: 2rem; border-bottom: 2px solid rgba(255, 255, 255, 0.171); }
.marker { position: absolute; left: -7px; top: 6px; width: 12px; height: 12px; border-radius: 50%; background: var(--color-primary); border: 2px solid rgba(255,255,255,0.8); box-shadow: 0 0 0 2px rgba(0,0,0,0.1); }
.marker.edu { background: var(--color-secondary); }
.details p{ color: white; }
.head h4 { margin: 0; font-size: 1rem; color: #fff; font-weight: 700; }
.date { font-size: 0.8rem; color: #ccc; font-weight: 600; display: block; margin: 2px 0; }
.sub { display: block; font-size: 0.9rem; color: var(--color-primary); background-color: rgba(255, 255, 255, 0.595); font-weight: 600; margin-bottom: 0.5rem; padding: 1px 8px; border-radius: 8px; margin-left: 2px; max-width: fit-content; }
.cert-link { display: inline-flex; align-items: center; gap: 5px; font-size: 0.85rem; color: white; text-decoration: none; font-weight: 700; margin-top: 0.8rem; padding: 6px 12px; background: rgba(255,255,255,0.1); border-radius: 8px; transition: 0.2s; border: 1px solid rgba(255,255,255,0.2); }
.cert-link:hover { background: rgba(255,255,255,0.2); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.internal-footer { text-align: center; margin-top: 2rem; font-size: 0.85rem; color: rgba(255,255,255,0.6); }
.internal-footer a { color: var(--color-primary); text-decoration: none; font-weight: 700; }
@media (max-width: 900px) { .public-container { height: auto; overflow: auto; } .layout-body { flex-direction: column; height: auto; overflow: visible; padding: 1rem; } .sidebar-panel, .content-panel { width: 100%; height: auto; overflow: visible; } .profile-full-height { height: auto; flex: none; } }
</style>