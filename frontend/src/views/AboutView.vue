<script setup lang="ts">
// Componente de apresentação estática
</script>

<template>
  <div class="about-background">
    
    <div class="circle-1"></div>
    <div class="circle-2"></div>

    <div class="content-wrapper">
      
      <div class="header-section">
        <h1>Sobre o DevDeck</h1>
        <p class="tagline">Conectando talentos universitários ao mercado de trabalho.</p>
      </div>

      <div class="info-card">
        <div class="text-block">
          <h3>A Missão</h3>
          <p>
            O <strong>DevDeck</strong> nasceu como um projeto prático da disciplina de Desenvolvimento de Software para Web II na UFC Quixadá. 
            Nosso objetivo é simples: permitir que estudantes e desenvolvedores organizem suas carreiras de forma visual, profissional e compartilhável.
          </p>
          <p>
            Diferente de currículos tradicionais em papel ou PDF, o DevDeck oferece uma <strong>vitrine viva</strong>, onde seus projetos, códigos e experiências contam a sua história real.
          </p>
        </div>

        <div class="stats-grid">
          <div class="stat-item">
            <i class="bi bi-unlock-fill"></i>
            <h4>100% Gratuito</h4>
            <span>Acesso total</span>
          </div>
          <div class="stat-item">
            <i class="bi bi-github"></i>
            <h4>Open Source</h4>
            <span>Código aberto</span>
          </div>
          <div class="stat-item">
            <i class="bi bi-mortarboard-fill"></i>
            <h4>Acadêmico</h4>
            <span>Projeto UFC</span>
          </div>
        </div>
      </div>

      <div class="tech-section">
        <h3>Stack Tecnológico</h3>
        
        <div class="tech-group">
          <span class="group-label">Frontend</span>
          <div class="tech-icons">
            <div class="tech-badge"><i class="bi bi-filetype-vue"></i> Vue 3</div>
            <div class="tech-badge"><i class="bi bi-file-earmark-code"></i> TypeScript</div>
            <div class="tech-badge"><i class="bi bi-lightning-charge"></i> Vite</div>
            <div class="tech-badge"><i class="bi bi-database"></i> Pinia</div>
          </div>
        </div>

        <div class="tech-group">
          <span class="group-label">Backend</span>
          <div class="tech-icons">
            <div class="tech-badge"><i class="bi bi-hexagon-fill"></i> Node.js</div>
            <div class="tech-badge"><i class="bi bi-server"></i> Express</div>
            <div class="tech-badge"><i class="bi bi-filetype-sql"></i> SQLite</div>
            <div class="tech-badge"><i class="bi bi-hdd-network"></i> TypeORM</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* --- Layout e Fundo --- */
.about-background {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding-top: 120px; 
  padding-bottom: 4rem;
}

.content-wrapper {
  width: 100%;
  max-width: 900px;
  padding: 0 2rem;
  z-index: 2;
  color: white;
  text-align: center;
}

/* --- Elementos Decorativos --- */
.circle-1, .circle-2 {
  position: absolute;
  border-radius: 50%;
  background: white;
  opacity: 0.05;
  pointer-events: none;
}

.circle-1 { width: 600px; height: 600px; top: -100px; left: -200px; }
.circle-2 { width: 800px; height: 800px; bottom: -300px; right: -200px; }

/* --- Cabeçalho e Tipografia --- */
.header-section { margin-bottom: 3rem; }
.header-section h1 { font-size: 3rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -1px; }
.tagline { font-size: 1.2rem; opacity: 0.9; font-weight: 300; }

/* --- Card Principal (Info) --- */
.info-card {
  background-color: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  color: var(--color-text);
  text-align: left;
  margin-bottom: 3rem;
}

.text-block h3 { color: var(--color-secondary); font-size: 1.5rem; margin-bottom: 1rem; }
.text-block p { line-height: 1.8; color: #555; margin-bottom: 1.5rem; font-size: 1.05rem; }

/* --- Stats Grid --- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

.stat-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item i { font-size: 2rem; color: var(--color-accent); margin-bottom: 0.5rem; }
.stat-item h4 { font-size: 1.2rem; font-weight: 700; margin: 0; color: var(--color-primary); }
.stat-item span { font-size: 0.9rem; color: #888; }

/* --- Seção Tech --- */
.tech-section h3 { color: white; margin-bottom: 2rem; opacity: 0.9; }
.tech-group { margin-bottom: 2rem; }

.group-label {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  font-weight: 600;
}

.tech-icons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.tech-badge {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.3s;
  cursor: default;
}

.tech-badge:hover {
  background: white;
  color: var(--color-secondary);
  transform: translateY(-3px);
}

/* --- Responsividade --- */
@media (max-width: 768px) {
  .header-section h1 { font-size: 2.2rem; }
  .info-card { padding: 2rem; }
  .stats-grid { grid-template-columns: 1fr; gap: 1.5rem; }
}
</style>