<script setup lang="ts">
// --- Imports e Configuração ---
import { ref } from 'vue'
import { usePortfolioStore } from '../stores/portfolio'

const store = usePortfolioStore()

// --- Estado: Projetos ---
const projTitle = ref('')
const projDesc = ref('')
const projLink = ref('')

// --- Estado: Experiências ---
const expTitle = ref('')
const expInst = ref('')
const expPeriod = ref('')
const expDesc = ref('')

// --- Ações ---
function handleAddProject() {
  if (projTitle.value.trim()) {
    store.addProject(
      projTitle.value,
      projDesc.value || 'Sem descrição',
      projLink.value || '#'
    )
    projTitle.value = ''
    projDesc.value = ''
    projLink.value = ''
  }
}

function handleAddExperience() {
  if (expTitle.value.trim() && expInst.value.trim()) {
    store.addExperience(
      expTitle.value,
      expInst.value,
      expPeriod.value || 'Atualmente',
      expDesc.value || '...'
    )
    expTitle.value = ''
    expInst.value = ''
    expPeriod.value = ''
    expDesc.value = ''
  }
}
</script>

<template>
  <div class="dashboard-container">
    
    <div class="header-dash">
      <h1>⚙️ Painel de Controle</h1>
      <p>Gerencie seu Portfólio e seu Currículo em um só lugar.</p>
    </div>

    <div class="grid-layout">
      
      <section class="panel">
        <h2>Meus Projetos</h2>
        
        <div class="form-box">
          <input v-model="projTitle" placeholder="Nome do Projeto (ex: DevDeck)" />
          <input v-model="projDesc" placeholder="Descrição curta" />
          <input v-model="projLink" placeholder="Link (GitHub/Deploy)" />
          <button @click="handleAddProject" class="btn-add">Adicionar Projeto</button>
        </div>

        <div class="list-items">
          <div v-for="item in store.projects" :key="item.id" class="card-item project-border">
            <div class="card-content">
              <h3>{{ item.title }}</h3>
              <small>{{ item.description }}</small>
              <a :href="item.link" target="_blank" class="link-text">Acessar Link</a>
            </div>
            <button @click="store.removeProject(item.id)" class="btn-delete">🗑️</button>
          </div>
          <p v-if="store.projects.length === 0" class="empty-msg">Nenhum projeto.</p>
        </div>
      </section>

      <section class="panel">
        <h2>Experiência & Formação</h2>
        
        <div class="form-box">
          <input v-model="expTitle" placeholder="Cargo ou Curso (ex: Dev Jr)" />
          <input v-model="expInst" placeholder="Empresa ou Instituição" />
          <input v-model="expPeriod" placeholder="Período (ex: 2023 - Atual)" />
          <input v-model="expDesc" placeholder="Descrição das atividades" />
          <button @click="handleAddExperience" class="btn-add btn-secondary">Adicionar Experiência</button>
        </div>

        <div class="list-items">
          <div v-for="item in store.experiences" :key="item.id" class="card-item exp-border">
            <div class="card-content">
              <h3>{{ item.title }}</h3>
              <span class="institution">{{ item.institution }}</span>
              <small class="period">{{ item.period }}</small>
              <p class="desc">{{ item.description }}</p>
            </div>
            <button @click="store.removeExperience(item.id)" class="btn-delete">🗑️</button>
          </div>
          <p v-if="store.experiences.length === 0" class="empty-msg">Nenhuma experiência.</p>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
/* --- Layout Principal --- */
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header-dash { margin-bottom: 2rem; text-align: center; }

.grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr; 
  gap: 2rem;
}

/* --- Painéis e Formulários --- */
.panel {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

h2 { 
  color: var(--color-primary); 
  border-bottom: 2px solid #f0f0f0; 
  padding-bottom: 0.5rem; 
  margin-bottom: 1rem; 
}

.form-box {
  display: flex; flex-direction: column; gap: 10px;
  margin-bottom: 1.5rem;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
}

input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.btn-add {
  padding: 0.8rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
}
.btn-add:hover { opacity: 0.9; }
.btn-secondary { background: var(--color-secondary); }

/* --- Listas e Cards --- */
.list-items { display: flex; flex-direction: column; gap: 1rem; }

.card-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eee;
}

/* Variações de Borda */
.project-border { border-left: 4px solid var(--color-accent); }
.exp-border { border-left: 4px solid var(--color-secondary); }

/* Conteúdo do Card */
.card-content h3 { margin: 0 0 0.3rem 0; font-size: 1.1rem; }
.institution { font-weight: bold; color: #555; display: block; font-size: 0.9rem; }
.period { color: #888; font-size: 0.85rem; display: block; margin-bottom: 0.3rem; }
.desc { font-size: 0.9rem; color: #666; margin: 0; }
.link-text { font-size: 0.85rem; display: block; margin-top: 0.5rem; }
.empty-msg { text-align: center; color: #aaa; font-style: italic; }

.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.5;
  transition: 0.2s;
}
.btn-delete:hover { opacity: 1; transform: scale(1.1); }

/* --- Responsividade --- */
@media (max-width: 768px) {
  .grid-layout { grid-template-columns: 1fr; } 
}
</style>