<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
/* --- Global App Layout --- */
:global(#app) {
  display: flex;
  flex-direction: column;
  height: 100vh; 
}

main {
  flex: 1; 
  overflow-y: auto; 
  width: 100%;
  scroll-behavior: smooth;
  position: relative; 
}
</style>