<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="layout">
    <Header />
    <main class="main container">
      <div class="main-content-full">
        <slot />
      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.main {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  min-height: calc(100vh - 60px - 100px);
}

.main-content-full {
  max-width: 800px;
  margin: 0 auto;
}
</style>
