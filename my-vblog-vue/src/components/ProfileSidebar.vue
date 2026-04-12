<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loadArticles } from '@/utils/contentLoader'
import type { Article } from '@/utils/contentLoader'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const recentArticles = ref<Article[]>([])

onMounted(async () => {
  const articles = await loadArticles()
  recentArticles.value = articles.slice(0, 5)
})
</script>

<template>
  <aside class="profile-sidebar">
    <div class="card sidebar-card">
      <div class="author-info">
        <img src="/img/avatar.png" alt="Avatar" class="avatar" />
        <h3 class="author-name">Tech Blog</h3>
        <p class="author-subtitle">Lorem ipsum dolor sit amet</p>
        <div class="social-links">
          <a href="#" class="social-link" title="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
          </a>
          <a href="#" class="social-link" title="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
          </a>
          <a href="#" class="social-link" title="Email">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
        </div>
      </div>
    </div>

    <div class="card sidebar-card">
      <h3 class="section-title">{{ t('ui.recentArticles') }}</h3>
      <ul class="recent-list">
        <li v-for="article in recentArticles" :key="article.slug">
          <RouterLink :to="`/post/${article.slug}`" class="recent-link">
            {{ article.title }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 88px;
  height: fit-content;
}

.sidebar-card {
  padding: 1.25rem;
}

.author-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
}

.author-subtitle {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: 0.75rem;
}

.social-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-bg);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s, transform 0.2s;
}

.social-link:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
}

.section-title {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
  color: var(--color-text-secondary);
}

.recent-list {
  list-style: none;
  padding: 0;
}

.recent-list li {
  margin-bottom: 0.625rem;
}

.recent-link {
  display: block;
  font-size: 0.8125rem;
  color: var(--color-text);
  text-decoration: none;
  line-height: 1.5;
  transition: color 0.2s;
}

.recent-link:hover {
  color: var(--color-primary);
}
</style>
