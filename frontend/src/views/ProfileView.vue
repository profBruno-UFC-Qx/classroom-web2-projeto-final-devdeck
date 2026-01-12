<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePortfolioStore, type UserProfile } from '@/stores/portfolio'
import { api } from '@/services/api'

// --- Setup & State ---
const store = usePortfolioStore()
const { userProfile } = storeToRefs(store)

const form = reactive<UserProfile>({
  name: '',
  role: '',
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
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// --- UI Control (Accordion) ---
const expandedExpId = ref<number | null>(null)
const expandedEduId = ref<number | null>(null)

function toggleExp(id: number) {
  expandedExpId.value = expandedExpId.value === id ? null : id
}

function toggleEdu(id: number) {
  expandedEduId.value = expandedEduId.value === id ? null : id
}

// --- Lifecycle ---
onMounted(async () => {
  await store.fetchUserProfile()
  Object.assign(form, JSON.parse(JSON.stringify(userProfile.value)))
})

// --- Avatar Management ---
function triggerAvatarUpload() {
  fileInput.value?.click()
}

async function onAvatarSelected(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const formData = new FormData()
    formData.append('image', file)

    isUploading.value = true
    try {
      const { data } = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      form.avatarUrl = data.url
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erro ao enviar foto de perfil.')
    } finally {
      isUploading.value = false
      if (fileInput.value) fileInput.value.value = ''
    }
  }
}

// --- Skills Management ---
async function handleAddSkill() {
  const skill = newSkill.value.trim()
  if (skill) {
    try {
      await store.addSkill(skill)
      form.skills = [...userProfile.value.skills]
      newSkill.value = ''
    } catch (error) {
      alert('Erro ao adicionar habilidade no servidor.')
    }
  }
}

async function handleRemoveSkill(skill: string) {
  try {
    await store.removeSkill(skill)
    form.skills = [...userProfile.value.skills]
  } catch (error) {
    alert('Erro ao remover habilidade no servidor.')
  }
}

// --- Experience Management ---
function addExperience() {
  const newId = Date.now()
  form.experiences.push({
    id: newId,
    role: '',
    company: '',
    period: '',
    description: ''
  })
  expandedExpId.value = newId
}

function removeExperience(index: number) {
  const itemToRemove = form.experiences[index]
  if (itemToRemove && expandedExpId.value === itemToRemove.id) {
    expandedExpId.value = null
  }
  form.experiences.splice(index, 1)
}

// --- Education Management ---
function addEducation() {
  const newId = Date.now()
  form.education.push({
    id: newId,
    course: '',
    institution: '',
    year: '',
    certificateUrl: ''
  })
  expandedEduId.value = newId
}

function removeEducation(index: number) {
  const itemToRemove = form.education[index]
  if (itemToRemove && expandedEduId.value === itemToRemove.id) {
    expandedEduId.value = null
  }
  form.education.splice(index, 1)
}

// --- Persistence ---
async function handleSave() {
  isSaving.value = true
  try {
    await store.updateUserProfile(form)
    expandedExpId.value = null
    expandedEduId.value = null
    alert('Perfil atualizado com sucesso!')
  } catch (error) {
    alert('Erro ao salvar perfil.')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="profile-container">
    
    <div class="profile-header">
      <div class="greeting">
        <h1>Editar Currículo</h1>
        <p>Mantenha suas informações e habilidades sempre em dia.</p>
      </div>
      <button class="btn-save-top" @click="handleSave" :disabled="isSaving">
        <i class="bi" :class="isSaving ? 'bi-hourglass-split' : 'bi-check-lg'"></i>
        {{ isSaving ? 'Salvando...' : 'Salvar Alterações' }}
      </button>
    </div>

    <div class="profile-card">
      
      <div class="section-header">
        <div class="icon-box"><i class="bi bi-person-badge-fill"></i></div>
        <h3>Informações Básicas</h3>
      </div>

      <div class="form-grid">
        <div class="avatar-section">
          <div class="avatar-wrapper" @click="triggerAvatarUpload">
            <img 
              :src="form.avatarUrl || 'https://ui-avatars.com/api/?name=' + form.name" 
              alt="Avatar" 
              class="avatar-preview" 
              :class="{ 'op-5': isUploading }"
            />
            <div class="avatar-overlay">
              <i class="bi" :class="isUploading ? 'bi-hourglass-split' : 'bi-camera'"></i>
            </div>
            <input type="file" ref="fileInput" hidden accept="image/*" @change="onAvatarSelected" />
          </div>
          <div class="form-group" style="flex: 1;">
            <label>Foto de Perfil</label>
            <input v-model="form.avatarUrl" type="text" class="styled-input" placeholder="Clique na imagem para upload..." />
          </div>
        </div>

        <div class="form-group"><label>Nome Completo</label><input v-model="form.name" type="text" class="styled-input" /></div>
        <div class="form-group"><label>Cargo</label><input v-model="form.role" type="text" class="styled-input" /></div>
        <div class="form-group full-width"><label>Localização</label><input v-model="form.location" type="text" class="styled-input" /></div>
        <div class="form-group full-width"><label>Sobre Mim</label><textarea v-model="form.bio" rows="3" class="styled-input"></textarea></div>
      </div>

      <div class="divider"></div>

      <div class="section-header">
        <div class="icon-box"><i class="bi bi-briefcase-fill"></i></div>
        <h3>Experiência Profissional</h3>
      </div>

      <div class="dynamic-list">
        <div v-for="(exp, index) in form.experiences" :key="exp.id" class="accordion-item" :class="{ 'is-expanded': expandedExpId === exp.id }">
          <div class="accordion-header" @click="toggleExp(exp.id)">
            <div class="info-summary">
              <h4 v-if="exp.role || exp.company">{{ exp.role || 'Cargo' }} <span class="at" v-if="exp.company">em {{ exp.company }}</span></h4>
              <h4 v-else class="placeholder-text">Nova Experiência</h4>
              <span class="period-badge" v-if="exp.period">{{ exp.period }}</span>
            </div>
            <div class="actions">
              <button class="btn-remove" @click.stop="removeExperience(index)"><i class="bi bi-trash"></i></button>
              <i class="bi chevron" :class="expandedExpId === exp.id ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
          </div>
          <div class="accordion-body" v-show="expandedExpId === exp.id">
            <div class="form-grid">
              <div class="form-group"><label>Cargo</label><input v-model="exp.role" type="text" class="styled-input" /></div>
              <div class="form-group"><label>Empresa</label><input v-model="exp.company" type="text" class="styled-input" /></div>
              <div class="form-group full-width"><label>Período</label><input v-model="exp.period" type="text" class="styled-input" /></div>
              <div class="form-group full-width"><label>Descrição</label><textarea v-model="exp.description" rows="3" class="styled-input"></textarea></div>
            </div>
          </div>
        </div>
        <button class="btn-add" @click="addExperience"><i class="bi bi-plus-lg"></i> Adicionar Experiência</button>
      </div>

      <div class="divider"></div>

      <div class="section-header">
        <div class="icon-box"><i class="bi bi-mortarboard-fill"></i></div>
        <h3>Formação e Certificados</h3>
      </div>

      <div class="dynamic-list">
        <div v-for="(edu, index) in form.education" :key="edu.id" class="accordion-item" :class="{ 'is-expanded': expandedEduId === edu.id }">
          <div class="accordion-header" @click="toggleEdu(edu.id)">
            <div class="info-summary">
              <h4 v-if="edu.course || edu.institution">{{ edu.course || 'Curso' }} <span class="at" v-if="edu.institution">| {{ edu.institution }}</span></h4>
              <h4 v-else class="placeholder-text">Novo Certificado</h4>
              <span class="period-badge" v-if="edu.year">{{ edu.year }}</span>
            </div>
            <div class="actions">
              <button class="btn-remove" @click.stop="removeEducation(index)"><i class="bi bi-trash"></i></button>
              <i class="bi chevron" :class="expandedEduId === edu.id ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
          </div>
          <div class="accordion-body" v-show="expandedEduId === edu.id">
            <div class="cert-grid">
               <div class="cert-preview">
                  <img :src="edu.certificateUrl || 'https://via.placeholder.com/150?text=Certificado'" alt="Certificado" />
               </div>
               <div class="cert-inputs">
                 <div class="form-group"><label>Curso</label><input v-model="edu.course" type="text" class="styled-input" /></div>
                 <div class="form-group"><label>Instituição</label><input v-model="edu.institution" type="text" class="styled-input" /></div>
                 <div class="form-group"><label>Ano</label><input v-model="edu.year" type="text" class="styled-input" /></div>
                 <div class="form-group"><label>URL Imagem</label><input v-model="edu.certificateUrl" type="text" class="styled-input" /></div>
               </div>
            </div>
          </div>
        </div>
        <button class="btn-add" @click="addEducation"><i class="bi bi-plus-lg"></i> Adicionar Certificado</button>
      </div>

      <div class="divider"></div>

      <div class="section-header">
        <div class="icon-box"><i class="bi bi-lightning-charge-fill"></i></div>
        <h3>Habilidades</h3>
      </div>
      <div class="form-group full-width">
        <div class="tags-container">
          <span v-for="skill in form.skills" :key="skill" class="tag-gradient">
            {{ skill }} <i class="bi bi-x" @click="handleRemoveSkill(skill)"></i>
          </span>
          <input v-model="newSkill" @keydown.enter.prevent="handleAddSkill" type="text" placeholder="Adicionar habilidade e Enter..." class="input-transparent" />
        </div>
      </div>

      <div class="divider"></div>

      <div class="section-header">
        <div class="icon-box"><i class="bi bi-share-fill"></i></div>
        <h3>Redes Sociais</h3>
      </div>
      <div class="form-grid">
        <div class="form-group"><label>GitHub</label><input v-model="form.social.github" type="text" class="styled-input" /></div>
        <div class="form-group"><label>LinkedIn</label><input v-model="form.social.linkedin" type="text" class="styled-input" /></div>
        <div class="form-group full-width"><label>Portfólio / Site</label><input v-model="form.social.website" type="text" class="styled-input" /></div>
      </div>

      <div class="form-actions-bottom">
        <button class="btn-save-bottom" @click="handleSave" :disabled="isSaving">
          {{ isSaving ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* --- Layout & Core Panels --- */
.profile-container { padding-top: 120px; padding-bottom: 4rem; width: 90%; max-width: 1200px; margin: 0 auto; min-height: 100vh; }
.profile-header { background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%); padding: 2.5rem 3rem; border-radius: 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; color: white; }
.greeting h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
.btn-save-top { background: white; color: var(--color-primary); border: none; padding: 0.9rem 1.8rem; border-radius: 50px; font-weight: 700; cursor: pointer; display: flex; gap: 10px; }
.profile-card { background: white; border-radius: 24px; padding: 3.5rem; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }

/* --- Section Styling --- */
.section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.icon-box { width: 45px; height: 45px; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }
.divider { height: 1px; background: #eee; margin: 3rem 0; }

/* --- Forms & Inputs --- */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.form-group.full-width { grid-column: span 2; }
.form-group label { display: block; font-size: 0.85rem; font-weight: 700; color: #555; margin-bottom: 8px; text-transform: uppercase; }
.styled-input { width: 100%; padding: 14px 18px; background: #f9f9f9; border: 1px solid #e1e1e1; border-radius: 12px; font-family: inherit; }

/* --- Accordion Components --- */
.dynamic-list { display: flex; flex-direction: column; gap: 1rem; }
.accordion-item { border: 1px solid #eee; border-radius: 12px; overflow: hidden; }
.accordion-item.is-expanded { border-color: var(--color-secondary); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
.accordion-header { padding: 1.2rem 1.5rem; background: #fcfcfc; cursor: pointer; display: flex; justify-content: space-between; }
.accordion-body { padding: 1.5rem; animation: slideDown 0.3s ease; }

@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

/* --- Avatar & Media --- */
.avatar-section { grid-column: span 2; display: flex; align-items: center; gap: 2rem; margin-bottom: 1rem; }
.avatar-wrapper { position: relative; width: 90px; height: 90px; cursor: pointer; }
.avatar-preview { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; background: #eee; transition: 0.3s; }
.avatar-preview.op-5 { opacity: 0.5; }
.avatar-overlay { position: absolute; inset: 0; border-radius: 50%; background: rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center; color: white; opacity: 0; transition: 0.3s; }
.avatar-wrapper:hover .avatar-overlay { opacity: 1; }

/* --- Tags & Buttons --- */
.tags-container { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px; background: #f9f9f9; border: 1px solid #e1e1e1; border-radius: 12px; min-height: 52px; }
.tag-gradient { background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); color: white; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; }
.input-transparent { border: none; background: transparent; outline: none; flex: 1; }

.btn-add { background: #f0f7ff; color: var(--color-primary); border: 1px dashed var(--color-primary); padding: 1rem; border-radius: 12px; cursor: pointer; width: 100%; }
.btn-save-bottom { background: var(--color-primary); color: white; border: none; padding: 1rem 3rem; border-radius: 50px; font-weight: 700; cursor: pointer; }

/* --- Responsive Breakpoints --- */
@media (max-width: 768px) { 
  .form-grid { grid-template-columns: 1fr; } 
  .avatar-section { flex-direction: column; align-items: center; } 
}
</style>