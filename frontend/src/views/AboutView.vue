<script setup lang="ts"></script>

<template>
  <div class="page-container">
    <div class="about-content">
      <h1>Sobre o DevDeck</h1>
      <p class="subtitle">Conectando talentos universitários ao mercado de trabalho.</p>
      
      <div class="text-block">
        <p>O <strong>DevDeck</strong> nasceu como um projeto prático da disciplina de Desenvolvimento de Software para a WEB II na UFC Quixadá com um objetivo simples: permitir que estudantes e desenvolvedores organizem suas carreiras de forma visual e profissional.</p>
        <p>Diferente de currículos tradicionais em papel ou PDF, o DevDeck oferece uma vitrine viva, onde seus projetos, códigos e experiências contam a sua história real.</p>
      </div>

      <div class="stats">
        <div class="stat-item">
          <h3>100%</h3>
          <span>Gratuito</span>
        </div>
        <div class="stat-item">
          <h3>Open</h3>
          <span>Source</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container { padding: 4rem 2rem; max-width: 800px; margin: 0 auto; text-align: center; }
.subtitle { font-size: 1.2rem; color: var(--color-accent); margin-bottom: 2rem; }
.text-block { text-align: left; line-height: 1.8; color: #555; margin-bottom: 3rem; }
.stats { display: flex; justify-content: center; gap: 3rem; }
.stat-item h3 { font-size: 2.5rem; color: var(--color-primary); margin: 0; }
</style>