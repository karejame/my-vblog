<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProfileSidebar from '@/components/ProfileSidebar.vue'
import WidgetSidebar from '@/components/WidgetSidebar.vue'
</script>

<template>
  <div class="layout">
    <Header />
    <main class="main container">
      <aside class="left-sidebar">
        <ProfileSidebar />
      </aside>
      <div class="main-content">
        <slot />
      </div>
      <aside class="right-sidebar">
        <WidgetSidebar />
      </aside>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.main {
  display: grid;
  grid-template-columns: 280px 1fr 300px;
  gap: 1.5rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  min-height: calc(100vh - 64px - 100px);
}

.left-sidebar {
  min-width: 0;
}

.main-content {
  min-width: 0;
}

.right-sidebar {
  min-width: 0;
}

@media (max-width: 1024px) {
  .main {
    grid-template-columns: 280px 1fr;
  }
  .right-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .main {
    grid-template-columns: 1fr;
  }
  .left-sidebar {
    order: 2;
  }
  .main-content {
    order: 1;
  }
}
</style>
