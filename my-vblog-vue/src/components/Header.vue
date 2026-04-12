<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { toggleLocale } from '@/i18n'
import { RouterLink, useRoute } from 'vue-router'

const { t } = useI18n()
const app = useAppStore()
const route = useRoute()
</script>

<template>
  <header class="header">
    <div class="container header-inner">
      <RouterLink to="/" class="logo">
        <span class="logo-emoji">🍥</span>
        <span class="logo-text">Tech Blog</span>
      </RouterLink>

      <nav class="nav">
        <RouterLink to="/" class="nav-link" :class="{ active: route.path === '/' }">
          {{ t('nav.home') }}
        </RouterLink>
        <RouterLink to="/about" class="nav-link" :class="{ active: route.path === '/about' }">
          About
        </RouterLink>
        <RouterLink to="/archives" class="nav-link" :class="{ active: route.path === '/archives' }">
          {{ t('nav.archives') }}
        </RouterLink>
        <RouterLink to="/search" class="nav-link" :class="{ active: route.path === '/search' }">
          {{ t('nav.search') }}
        </RouterLink>
        <RouterLink to="/links" class="nav-link" :class="{ active: route.path === '/links' }">
          {{ t('nav.links') }}
        </RouterLink>
      </nav>

      <div class="header-actions">
        <button class="action-btn" @click="toggleLocale()" :title="t('ui.darkMode')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>
        </button>
        <button class="action-btn" @click="app.toggleTheme()" :title="app.theme === 'dark' ? t('ui.lightMode') : t('ui.darkMode')">
          <svg v-if="app.theme === 'dark'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 50;
  transition: background-color 0.3s;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  gap: 1.5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
  font-weight: 700;
  font-size: 1.25rem;
  text-decoration: none;
}

.logo-emoji {
  font-size: 1.5rem;
}

.nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

.nav-link:hover {
  background-color: var(--color-bg);
  color: var(--color-text);
}

.nav-link.active {
  color: var(--color-primary);
  background-color: var(--color-tag-bg);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.action-btn:hover {
  background-color: var(--color-bg);
  color: var(--color-text);
}

@media (max-width: 768px) {
  .nav-link span {
    display: none;
  }
  .logo-text {
    display: none;
  }
}
</style>
