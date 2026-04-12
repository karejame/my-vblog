<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const { t } = useI18n()

const links = [
  { name: 'GitHub', url: 'https://github.com', description: 'Where the world builds software', icon: '🐙' },
  { name: 'Hugo', url: 'https://gohugo.io', description: 'The world\'s fastest framework for building websites', icon: '🏗️' },
  { name: 'Vue.js', url: 'https://vuejs.org', description: 'The progressive JavaScript framework', icon: '💚' },
  { name: 'Cloudflare', url: 'https://www.cloudflare.com', description: 'Security, performance, reliability', icon: '☁️' },
  { name: 'Vercel', url: 'https://vercel.com', description: 'Develop. Preview. Ship.', icon: '▲' },
]
</script>

<template>
  <DefaultLayout>
    <div class="links-page">
      <h1 class="page-title">{{ t('nav.links') }}</h1>
      <div class="links-grid">
        <a v-for="link in links" :key="link.name" :href="link.url" target="_blank" rel="noopener" class="link-card card">
          <span class="link-icon">{{ link.icon }}</span>
          <div class="link-info">
            <h3 class="link-name">{{ link.name }}</h3>
            <p class="link-desc">{{ link.description }}</p>
          </div>
        </a>
      </div>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.links-page {
  padding: 1rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--card-text-color);
  margin-bottom: 1.5rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.link-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.link-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.link-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.link-info {
  min-width: 0;
}

.link-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--card-text-color);
  margin-bottom: 0.25rem;
}

.link-desc {
  font-size: 0.8125rem;
  color: var(--body-text-color);
  opacity: 0.7;
  line-height: 1.4;
}
</style>
