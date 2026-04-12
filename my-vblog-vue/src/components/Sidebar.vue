<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { loadArticles, getCategories, getTags } from '@/utils/contentLoader'
import type { Article } from '@/utils/contentLoader'

const { t } = useI18n()
const recentArticles = ref<Article[]>([])
const categories = ref<string[]>([])
const tags = ref<string[]>([])

onMounted(async () => {
  const articles = await loadArticles()
  recentArticles.value = articles.slice(0, 5)
  categories.value = await getCategories()
  tags.value = await getTags()
})
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-section card">
      <div class="author-info">
        <img src="/img/avatar.png" alt="Avatar" class="avatar" />
        <h3 class="author-name">Tech Blog</h3>
        <p class="author-subtitle">Lorem ipsum dolor sit amet</p>
      </div>
    </div>

    <div class="sidebar-section card">
      <h3 class="section-title">{{ t('nav.archives') }}</h3>
      <ul class="recent-list">
        <li v-for="article in recentArticles" :key="article.slug">
          <router-link :to="`/post/${article.slug}`" class="recent-link">
            {{ article.title }}
          </router-link>
        </li>
      </ul>
    </div>

    <div class="sidebar-section card">
      <h3 class="section-title">{{ t('ui.categories') }}</h3>
      <div class="tag-list">
        <span v-for="cat in categories" :key="cat" class="tag">{{ cat }}</span>
      </div>
    </div>

    <div class="sidebar-section card">
      <h3 class="section-title">{{ t('ui.tags') }}</h3>
      <div class="tag-list">
        <router-link v-for="tag in tags" :key="tag" :to="`/search?q=${tag}`" class="tag tag-link">
          {{ tag }}
        </router-link>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-section {
  padding: 1.25rem;
}

.author-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--card-text-color);
}

.author-subtitle {
  font-size: 0.875rem;
  color: var(--body-text-color);
  opacity: 0.7;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
  color: var(--body-text-color);
  opacity: 0.7;
}

.recent-list {
  list-style: none;
  padding: 0;
}

.recent-list li {
  margin-bottom: 0.5rem;
}

.recent-link {
  font-size: 0.875rem;
  color: var(--card-text-color);
  text-decoration: none;
  transition: color 0.2s;
}

.recent-link:hover {
  color: var(--accent-color);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  border-radius: 9999px;
  background-color: var(--tag-background);
  color: var(--tag-text-color);
}

.tag-link {
  text-decoration: none;
  cursor: pointer;
}

.tag-link:hover {
  opacity: 0.8;
}
</style>
