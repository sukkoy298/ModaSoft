<script setup>
import SalesView from './views/SalesView.vue'
</script>

<template>
  <header class="app-header">
    <img alt="Moda Soft" class="logo" src="./assets/logo.jpg" width="90" height="90" />
    <h1>Moda Soft</h1>
  </header>

  <main>
    <SalesView />
  </main>
</template>

<style scoped>
.app-header {
  display:flex;
  align-items:center;
  gap:1rem;
  padding:1rem;
  border-bottom:1px solid #eee;
}
.logo { border-radius:8px; }
main { padding:1rem; }
</style>
