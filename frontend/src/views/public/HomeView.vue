<script setup lang="ts">
import { ref, onMounted } from 'vue'
import logoImg from '@/assets/img/img-logo-vet.png'
import AuthForm from '@/components/AuthForm.vue'

// --- Lógica Typewriter  ---
const fullSlogan = "Sua carreira,\nseu código,\nsua vitrine."
const displayedSlogan = ref('')

const startTypewriter = () => {
  let i = 0
  const speed = 70 
  
  const type = () => {
    if (i < fullSlogan.length) {
      displayedSlogan.value += fullSlogan.charAt(i)
      i++
      setTimeout(type, speed)
    }
  }
  setTimeout(type, 500)
}

onMounted(() => {
  startTypewriter()
})
</script>

<template>
  <div class="home-background">
    
    <div class="circle-1"></div>
    <div class="circle-2"></div>
    
    <div class="floating-symbol sym-1">&lt;/&gt;</div>
    <div class="floating-symbol sym-2">{ }</div>
    <div class="floating-symbol sym-3">#</div>
    <div class="floating-symbol sym-4">;</div>

    <div class="code-snippet snip-1">
      <pre>const dev = { 
        level: 'Senior', 
        skills: ['Vue'] 
      };</pre>
    </div>
    <div class="code-snippet snip-2">
      <pre>git commit -m "Start"</pre>
    </div>

    <div class="content-container">
      
      <div class="brand-section">
        <div class="text-content">
          
          <div class="brand-header animate-entry">
            <img :src="logoImg" alt="DevDeck" class="hero-logo" />
            
            <div class="separator-vertical"></div>
            
            <h2>
              <span v-html="displayedSlogan.replace(/\n/g, '<br>')"></span>
              <span class="cursor">|</span>
            </h2>
          </div>
          
          <p class="animate-entry delay-text">
            Gerencie seu currículo profissional ou encontre o talento ideal para o seu time em um só lugar.
          </p>
        </div>
      </div>

      <AuthForm class="animate-entry delay-form" />

    </div>

  </div>
</template>

<style scoped>
/* --- Layout & Background --- */
.home-background {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  min-height: 100%; 
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  box-sizing: border-box; 
}

.content-container {
  width: 100%;
  max-width: 1100px; 
  display: flex;
  align-items: center;
  justify-content: space-between; 
  gap: 2rem; 
  position: relative;
  z-index: 10; 
}

/* --- Seção da Marca --- */
.brand-section {
  flex: 1;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
}

.text-content {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
}

/* --- Header com Logo e Slogan --- */
.brand-header {
  display: flex;
  align-items: center; 
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
  min-height: 100px; 
}

.hero-logo {
  width: 160px; 
  height: auto;
  display: block; 
  filter: brightness(0) invert(1) drop-shadow(0 10px 20px rgba(0,0,0,0.3));
}

.separator-vertical {
  width: 2px;
  height: 80px;
  background-color: rgba(255,255,255,0.3);
  border-radius: 2px;
}

.brand-header h2 {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 2.1rem;
  line-height: 1.2;
  font-weight: 700;
  margin: 0;
  text-align: left;
  letter-spacing: -1px;
  display: inline-block;
  vertical-align: middle;
}

/* Cursor Piscante */
.cursor {
  display: inline-block;
  margin-left: 2px;
  color: var(--color-accent);
  animation: blink 1s step-end infinite;
  font-weight: 100;
}

@keyframes blink { 50% { opacity: 0; } }

/* Descrição */
.text-content p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
  font-family: 'Montserrat', sans-serif;
  text-align: justify;
  width: 100%;
}

/* --- ANIMAÇÕES DE ENTRADA --- */
.animate-entry { 
  opacity: 0; 
  animation: fadeUp 0.8s ease-out forwards; 
}

.delay-text { animation-delay: 2.5s; } 
.delay-form { animation-delay: 0.5s; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 0.9; transform: translateY(0); }
}

.animate-entry.delay-form, img.hero-logo, .brand-header h2 {
  animation-name: fadeUpSolid;
}

@keyframes fadeUpSolid {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* --- Decoração --- */
.circle-1, .circle-2 { position: absolute; border-radius: 50%; background: white; opacity: 0.05; pointer-events: none; will-change: transform; }
.circle-1 { width: 500px; height: 500px; top: -100px; left: -100px; animation: floatAnimation 20s ease-in-out infinite; }
.circle-2 { width: 700px; height: 700px; bottom: -200px; right: -100px; animation: floatAnimation 28s ease-in-out infinite reverse; animation-delay: -5s; }

.floating-symbol { position: absolute; color: white; font-family: 'Courier New', monospace; font-weight: bold; opacity: 0.1; pointer-events: none; z-index: 0; will-change: transform; }
.sym-1 { font-size: 2rem; top: 15%; left: 10%; animation: floatAnimation 15s ease-in-out infinite; }
.sym-2 { font-size: 3rem; bottom: 15%; right: 10%; animation: floatAnimation 20s ease-in-out infinite reverse; }
.sym-3 { font-size: 4rem; top: 5%; right: 35%; animation: floatAnimation 12s ease-in-out infinite 2s; }
.sym-4 { font-size: 4rem; bottom: 5%; left: 10%; animation: floatAnimation 18s ease-in-out infinite -5s; }

.code-snippet { position: absolute; background: rgba(255, 255, 255, 0.02); padding: 1rem 1.5rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(2px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05); font-family: 'Fira Code', 'Consolas', monospace; font-size: 0.7rem; color: rgba(255, 255, 255, 0.3); pointer-events: none; z-index: 0; will-change: transform; }
.snip-1 { top: 10%; right: 5%; transform: rotate(10deg); animation: floatAnimation 25s ease-in-out infinite; }
.snip-2 { bottom: 25%; left: 5%; transform: rotate(-10deg); animation: floatAnimation 30s ease-in-out infinite reverse; }

@keyframes floatAnimation {
  0% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -40px) rotate(8deg); }
  66% { transform: translate(-20px, 20px) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

@media (max-width: 999px) {
  .home-background { padding: 5rem 2rem; height: auto; min-height: 100vh; justify-content: center; flex-direction: column;}
  .content-container { flex-direction: column; gap: 3rem; margin-top: 0; }
  .brand-section { align-items: center; text-align: center; }
  
  .brand-header { flex-direction: column; text-align: center; gap: 1rem;}
  .separator-vertical { display: none; }
  .brand-header h2 { text-align: center; font-size: 1.5rem;}
  
  .text-content p { text-align: center; }
  .code-snippet { display: none;}
}
</style>