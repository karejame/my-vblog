<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loadArticles } from '@/utils/contentLoader'
import type { Article } from '@/utils/contentLoader'
import { estimateReadingTime, getExcerpt } from '@/utils/markdown'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()
const articles = ref<Article[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    articles.value = await loadArticles()
  } catch (error) {
    console.error('Error loading articles:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="post-list">
    <div v-if="loading" class="loading">{{ t('ui.searchPlaceholder') }}</div>
    <div v-else class="articles">
      <RouterLink
        v-for="(article, index) in articles"
        :key="article.slug"
        :to="`/post/${article.slug}`"
        class="article-card card"
        :class="{ 'featured': index === 0 }"
      >
        <div v-if="index === 0" class="featured-image">
          <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop" alt="Featured" />
        </div>
        <div class="article-card-body">
          <div class="article-tags" v-if="article.tags.length">
            <span v-for="tag in article.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <h2 class="article-title">{{ article.title }}</h2>
          <p class="article-meta">
            <span class="article-date">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {{ article.date }}
            </span>
            <span class="article-reading-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ t('ui.readingTime', { time: estimateReadingTime(article.content) }) }}
            </span>
          </p>
          <p class="article-excerpt">{{ getExcerpt(article.content, 150) }}</p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.post-list {
  min-width: 0;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
  opacity: 0.5;
}

.articles {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.article-card {
  display: block;
  text-decoration: none;
}

.article-card.featured {
  overflow: hidden;
}

.featured-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-card-body {
  padding: 1.5rem;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.article-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.article-card.featured .article-title {
  font-size: 1.75rem;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.article-date,
.article-reading-time {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.article-excerpt {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
