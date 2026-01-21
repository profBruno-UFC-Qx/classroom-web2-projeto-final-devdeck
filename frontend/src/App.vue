<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import GlobalDialog from '@/components/common/GlobalDialog.vue'
</script>

<template>
  <GlobalDialog /> <GlobalToast />
  <ToastContainer />
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
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