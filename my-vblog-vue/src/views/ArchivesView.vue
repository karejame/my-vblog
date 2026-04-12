<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loadArticles } from '@/utils/contentLoader'
import type { Article } from '@/utils/contentLoader'
import { useI18n } from 'vue-i18n'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const { t } = useI18n()
const articles = ref<Article[]>([])
const groupedArticles = ref<Record<string, Article[]>>({})
const loading = ref(true)

onMounted(async () => {
  articles.value = await loadArticles()
  const grouped: Record<string, Article[]> = {}
  for (const article of articles.value) {
    const year = article.date.split('-')[0]
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(article)
  }
  groupedArticles.value = grouped
  loading.value = false
})
</script>

<template>
  <DefaultLayout>
    <div class="archives">
      <h1 class="page-title">{{ t('nav.archives') }}</h1>
      <p class="page-subtitle">{{ t('ui.articleCount', { count: articles.length }) }}</p>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else>
        <section v-for="(yearArticles, year) in groupedArticles" :key="year" class="year-section">
          <h2 class="year-title">{{ year }}</h2>
          <ul class="archive-list">
            <li v-for="article in yearArticles" :key="article.slug" class="archive-item">
              <span class="archive-date">{{ article.date }}</span>
              <router-link :to="`/post/${article.slug}`" class="archive-link">{{ article.title }}</router-link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.archives {
  padding: 1rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--card-text-color);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--body-text-color);
  opacity: 0.7;
  margin-bottom: 2rem;
}

.year-section {
  margin-bottom: 2rem;
}

.year-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--accent-color);
  margin-bottom: 0.75rem;
}

.archive-list {
  list-style: none;
  padding: 0;
  border-left: 2px solid var(--border-color);
  margin-left: 0.5rem;
}

.archive-item {
  padding: 0.5rem 0 0.5rem 1.5rem;
  position: relative;
}

.archive-item::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 1rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--accent-color);
}

.archive-date {
  font-size: 0.8125rem;
  color: var(--body-text-color);
  opacity: 0.6;
  margin-right: 1rem;
}

.archive-link {
  color: var(--card-text-color);
  text-decoration: none;
  font-size: 0.9375rem;
  transition: color 0.2s;
}

.archive-link:hover {
  color: var(--accent-color);
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--body-text-color);
  opacity: 0.5;
}
</style>
