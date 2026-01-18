<script setup lang="ts">
// --- IMPORTS ---
import { ref, reactive, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePortfolioStore, type UserProfile } from '@/stores/portfolio'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

// --- STORES & REFS ---
const portfolioStore = usePortfolioStore()
const authStore = useAuthStore()
const toast = useToastStore()
const { userProfile } = storeToRefs(portfolioStore)

// --- LOCAL STATE (FORM & UI) ---
const form = reactive<UserProfile>({
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

const newSkill = ref('')
const isSaving = ref(false)
const hasUnsavedChanges = ref(false)
const isLoading = ref(true)
let originalSnapshot = '' 

const expandedExpId = ref<number | null>(null)
const expandedEduId = ref<number | null>(null)

// --- METHODS: UI TOGGLES ---
function toggleExp(id: number) { expandedExpId.value = expandedExpId.value === id ? null : id }
function toggleEdu(id: number) { expandedEduId.value = expandedEduId.value === id ? null : id }

// --- METHODS: DATA HANDLING & SNAPSHOTS ---
function fillForm(data: UserProfile) {
  if (!data) return
  
  form.name = data.name || ''
  form.role = data.role || ''         
  form.headline = data.headline || '' 
  form.location = data.location || ''
  form.bio = data.bio || ''
  form.avatarUrl = data.avatarUrl || ''
  form.skills = [...(data.skills || [])]
  form.social = { ...(data.social || {}) }
  form.experiences = JSON.parse(JSON.stringify(data.experiences || []))
  form.education = JSON.parse(JSON.stringify(data.education || []))

  updateSnapshot()
}

function updateSnapshot() {
  originalSnapshot = JSON.stringify(form)
  hasUnsavedChanges.value = false
}

// --- LIFECYCLE: INITIALIZATION ---
onMounted(async () => {
  isLoading.value = true
  try {
    if (!authStore.user) {
      await authStore.checkAuth()
    }
    if (authStore.user?.id) {
      await portfolioStore.fetchUserProfile(authStore.user.id)
    }
    if (userProfile.value) {
      fillForm(userProfile.value)
    }
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar dados.')
  } finally {
    isLoading.value = false
  }
})

// --- WATCHERS ---
watch(userProfile, (newData) => {
  if (newData && !hasUnsavedChanges.value) fillForm(newData)
}, { deep: true })

watch(form, (newVal) => {
  if (isLoading.value) return 
  const currentJson = JSON.stringify(newVal)
  hasUnsavedChanges.value = currentJson !== originalSnapshot
}, { deep: true })

// --- METHODS: SKILLS ---
async function handleAddSkill() {
  const skill = newSkill.value.trim()
  if (skill && !form.skills.includes(skill)) {
    form.skills.push(skill)
    newSkill.value = ''
  }
}

function handleRemoveSkill(index: number) { 
  form.skills.splice(index, 1) 
}

// --- METHODS: EXPERIENCE ---
function addExperience() {
  const newId = Date.now()
  form.experiences.push({ id: newId, role: '', company: '', period: '', description: '' })
  expandedExpId.value = newId
}

function removeExperience(index: number) { 
  form.experiences.splice(index, 1) 
}

// --- METHODS: EDUCATION ---
function addEducation() {
  const newId = Date.now()
  form.education.push({ id: newId, course: '', institution: '', year: '', certificateUrl: '' })
  expandedEduId.value = newId
}

function removeEducation(index: number) { 
  form.education.splice(index, 1) 
}

// --- METHODS: SAVE ACTION ---
async function handleSave() {
  if (!hasUnsavedChanges.value) return;
  isSaving.value = true
  try {
    await portfolioStore.updateUserProfile(form)

    if (authStore.user) {
      authStore.user.name = form.name
      authStore.user.avatar = form.avatarUrl
      authStore.user.headline = form.headline 
    }

    updateSnapshot()
    expandedExpId.value = null
    expandedEduId.value = null
    toast.success('Salvo com sucesso!')
  } catch (error) { 
    toast.error('Erro ao salvar.')
  } finally { 
    isSaving.value = false 
  }
}
</script>

<template>
  <div class="view-content">
    
    <div class="toolbar">
      <div class="save-wrapper">
        <button 
          class="btn-action-white" 
          @click="handleSave" 
          :disabled="isSaving || !hasUnsavedChanges"
          :class="{ 'pulse-active': hasUnsavedChanges }"
        >
          <i class="bi" :class="isSaving ? 'bi-hourglass-split' : 'bi-check-lg'"></i>
          <span>{{ isSaving ? 'Salvando...' : 'Salvar Alterações' }}</span>
        </button>

        <Transition name="fade-slide">
          <div v-if="hasUnsavedChanges && !isSaving" class="unsaved-badge">
            <i class="bi bi-info-circle-fill"></i>
            Alterações não salvas
          </div>
        </Transition>
      </div>
    </div>

    <div class="profile-layout-grid">
      
      <section class="glass-section h-full">
        <div class="section-title">
          <i class="bi bi-person-badge-fill"></i> Informações Pessoais
        </div>
        <div class="inputs-grid two-col-mobile">
          <div class="form-group"><label>Nome Completo</label><input v-model="form.name" type="text" class="input-premium" placeholder="Seu nome" /></div>
          
          <div class="form-group">
            <label>Cargo / Título</label>
            <input 
              v-model="form.headline" 
              type="text" 
              class="input-premium" 
              placeholder="Ex: Fullstack Developer" 
            />
          </div>
          
          <div class="form-group full"><label>Localização</label><input v-model="form.location" type="text" class="input-premium" placeholder="Ex: São Paulo, Brasil" /></div>
          <div class="form-group full"><label>Sobre Mim</label><textarea v-model="form.bio" rows="3" class="input-premium area" placeholder="Resumo profissional..."></textarea></div>
        </div>
      </section>

      <section class="glass-section h-full social-section">
        <div class="section-title"><i class="bi bi-share-fill"></i> Redes Sociais</div>
        <div class="inputs-grid single-col social-grid-content">
          <div class="form-group"><label><i class="bi bi-github"></i> GitHub</label><input v-model="form.social.github" type="text" class="input-premium" placeholder="URL do perfil" /></div>
          <div class="form-group"><label><i class="bi bi-linkedin"></i> LinkedIn</label><input v-model="form.social.linkedin" type="text" class="input-premium" placeholder="URL do perfil" /></div>
          <div class="form-group"><label><i class="bi bi-globe"></i> Site / Portfólio</label><input v-model="form.social.website" type="text" class="input-premium" placeholder="URL do site" /></div>
        </div>
      </section>

      <section class="glass-section full-span">
        <div class="section-title"><i class="bi bi-lightning-charge-fill"></i> Habilidades</div>
        <div class="skills-wrapper input-premium">
          <span v-for="(skill, idx) in form.skills" :key="idx" class="tag-pill">
            {{ skill }} <i class="bi bi-x" @click="handleRemoveSkill(idx)"></i>
          </span>
          <input v-model="newSkill" @keydown.enter.prevent="handleAddSkill" placeholder="Digite uma habilidade e pressione Enter..." class="tag-input-transparent"/>
        </div>
      </section>

      <section class="glass-section">
        <div class="section-header-row">
          <div class="section-title"><i class="bi bi-briefcase-fill"></i> Experiência</div>
          <button class="btn-small-add" @click="addExperience"><i class="bi bi-plus"></i></button>
        </div>

        <div v-if="form.experiences.length > 0" class="accordion-list">
          <div v-for="(exp, index) in form.experiences" :key="exp.id" class="accordion-glass">
            <div class="accordion-head" @click="toggleExp(exp.id)">
              <div class="head-info"><strong>{{ exp.role || 'Nova Vaga' }}</strong><span v-if="exp.company">{{ exp.company }}</span></div>
              <div class="head-actions">
                 <button class="btn-icon-danger" @click.stop="removeExperience(index)"><i class="bi bi-trash"></i></button>
                 <i class="bi chevron" :class="expandedExpId === exp.id ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </div>
            </div>
            <div class="accordion-content" v-show="expandedExpId === exp.id">
              <div class="inputs-grid single-col">
                <div class="form-group"><label>Cargo</label><input v-model="exp.role" class="input-premium" /></div>
                <div class="form-group"><label>Empresa</label><input v-model="exp.company" class="input-premium" /></div>
                <div class="form-group"><label>Período</label><input v-model="exp.period" class="input-premium" /></div>
                <div class="form-group"><label>Descrição</label><textarea v-model="exp.description" rows="3" class="input-premium area"></textarea></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-section" @click="addExperience">
          <i class="bi bi-briefcase"></i>
          <p>Nenhuma experiência.</p>
          <span>Adicionar</span>
        </div>
      </section>

      <section class="glass-section">
        <div class="section-header-row">
          <div class="section-title"><i class="bi bi-mortarboard-fill"></i> Formação</div>
          <button class="btn-small-add" @click="addEducation"><i class="bi bi-plus"></i></button>
        </div>

        <div v-if="form.education.length > 0" class="accordion-list">
          <div v-for="(edu, index) in form.education" :key="edu.id" class="accordion-glass">
            <div class="accordion-head" @click="toggleEdu(edu.id)">
              <div class="head-info"><strong>{{ edu.course || 'Curso' }}</strong><span v-if="edu.institution">{{ edu.institution }}</span></div>
              <div class="head-actions">
                 <button class="btn-icon-danger" @click.stop="removeEducation(index)"><i class="bi bi-trash"></i></button>
                 <i class="bi chevron" :class="expandedEduId === edu.id ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </div>
            </div>
            <div class="accordion-content" v-show="expandedEduId === edu.id">
              <div class="inputs-grid single-col">
                <div class="form-group"><label>Curso</label><input v-model="edu.course" class="input-premium" /></div>
                <div class="form-group"><label>Instituição</label><input v-model="edu.institution" class="input-premium" /></div>
                <div class="form-group"><label>Ano</label><input v-model="edu.year" class="input-premium" /></div>
                <div class="form-group"><label>URL Certificado</label><input v-model="edu.certificateUrl" class="input-premium" /></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-section" @click="addEducation">
          <i class="bi bi-mortarboard"></i>
          <p>Nenhuma formação.</p>
          <span>Adicionar</span>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
/* --- BASE LAYOUT & TOOLBAR --- */
.view-content { width: 100%; display: flex; flex-direction: column; }
.toolbar { display: flex; justify-content: flex-start; margin-bottom: 2rem; align-items: center; }
.save-wrapper { display: flex; align-items: center; gap: 1.5rem; }

/* --- UNSAVED STATUS BADGE --- */
.unsaved-badge { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24; padding: 0.6rem 1.2rem; border-radius: 50px; font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; gap: 8px; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }

/* --- MAIN ACTION BUTTONS --- */
.btn-action-white { background: #ffffff; color: var(--color-primary); border: none; padding: 0.7rem 1.5rem; border-radius: 50px; font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; gap: 10px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.1); transition: transform 0.2s ease, opacity 0.2s; }
.btn-action-white:hover { transform: scale(1.05); }
.btn-action-white:active { transform: scale(0.95); }
.btn-action-white:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
.pulse-active { box-shadow: 0 0 0 3px rgba(255,255,255,0.2); }

/* --- GRID & SECTION BASICS --- */
.profile-layout-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; padding-bottom: 3rem; }
.full-span { grid-column: 1 / -1; }
.glass-section { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 1.8rem; color: white; display: flex; flex-direction: column; }
.h-full { height: 100%; box-sizing: border-box; }

/* --- SOCIAL SECTION SPECIFICS --- */
.social-section .social-grid-content { flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; gap: 1.5rem; }

/* --- TITLES & HEADERS --- */
.section-title { font-size: 1.1rem; font-weight: 700; color: white; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; text-shadow: 0 2px 5px rgba(0,0,0,0.2); }
.section-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.section-header-row .section-title { margin-bottom: 0; }

/* --- FORM & INPUT STYLES --- */
.inputs-grid { display: grid; gap: 1rem; width: 100%; }
.inputs-grid.two-col-mobile { grid-template-columns: 1fr 1fr; }
.inputs-grid.single-col { grid-template-columns: 1fr; }
.form-group { display: flex; flex-direction: column; }
.form-group.full { grid-column: 1 / -1; }
.form-group label { margin-bottom: 0.4rem; font-weight: 600; font-size: 0.9rem; color: rgba(255,255,255,0.9); }
.input-premium { width: 100%; box-sizing: border-box; padding: 0.7rem 1rem; background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.15); color: white; border-radius: 12px; font-size: 0.95rem; font-family: inherit; transition: all 0.2s; }
.input-premium:focus { background: rgba(255, 255, 255, 0.12); border-color: var(--color-primary); outline: none; box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb), 0.15); }
.input-premium::placeholder { color: rgba(255, 255, 255, 0.3); }
.input-premium.area { resize: vertical; min-height: 80px; }

/* --- ACCORDION (EXPERIENCE/EDUCATION) --- */
.accordion-list { display: flex; flex-direction: column; gap: 1rem; }
.accordion-glass { background: rgba(255, 255, 255, 0.08); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
.accordion-head { padding: 1rem 1.2rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: 0.2s; }
.accordion-head:hover { background: rgba(255, 255, 255, 0.1); }
.head-info strong { display: block; color: white; font-size: 0.95rem; }
.head-info span { font-size: 0.8rem; color: rgba(255,255,255,0.6); }
.head-actions { display: flex; align-items: center; gap: 10px; color: white; }
.btn-icon-danger { background: none; border: none; color: #ffadad; cursor: pointer; font-size: 1rem; padding: 5px; border-radius: 50%; transition: 0.2s; }
.btn-icon-danger:hover { background: rgba(255,0,0,0.2); color: #ff6b6b; }
.accordion-content { padding: 1.2rem; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.05); }

/* --- EMPTY STATES --- */
.empty-section { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2.5rem; border: 2px dashed rgba(255, 255, 255, 0.2); border-radius: 12px; color: rgba(255, 255, 255, 0.6); cursor: pointer; transition: all 0.3s; text-align: center; }
.empty-section:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.4); color: white; }
.empty-section i { font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.8; }
.empty-section p { font-size: 0.95rem; margin: 0; font-weight: 500; }
.empty-section span { font-size: 0.8rem; opacity: 0.7; margin-top: 5px; }

/* --- HELPER BUTTONS & TAGS --- */
.btn-small-add { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 4px 10px; border-radius: 8px; font-size: 0.9rem; cursor: pointer; transition: 0.2s; }
.btn-small-add:hover { background: white; color: var(--color-primary); }
.skills-wrapper { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; min-height: 50px; }
.tag-input-transparent { border: none; background: transparent; flex: 1; min-width: 200px; outline: none; color: white; font-size: 0.95rem; }
.tag-input-transparent::placeholder { color: rgba(255, 255, 255, 0.367)}
.tag-pill { background: var(--color-primary); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.tag-pill i { cursor: pointer; }

/* --- TRANSITIONS & RESPONSIVE --- */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(-10px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-10px); }

@media (max-width: 900px) {
  .profile-layout-grid { grid-template-columns: 1fr; }
  .inputs-grid.two-col-mobile { grid-template-columns: 1fr; }
  .full-span { grid-column: span 1; }
  .social-section .social-grid-content { justify-content: flex-start; gap: 1rem; }
}
</style>