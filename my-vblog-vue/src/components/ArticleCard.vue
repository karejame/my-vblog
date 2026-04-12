<script setup lang="ts">
import type { Article } from '@/utils/contentLoader'
import { estimateReadingTime, getExcerpt } from '@/utils/markdown'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ article: Article }>()
const { t } = useI18n()
</script>

<template>
  <router-link :to="`/post/${article.slug}`" class="article-card card">
    <div class="article-card-body">
      <h2 class="article-title">{{ article.title }}</h2>
      <p class="article-meta">
        <span class="article-date">{{ article.date }}</span>
        <span class="article-reading-time">{{ t('ui.readingTime', { time: estimateReadingTime(article.content) }) }}</span>
      </p>
      <p class="article-excerpt">{{ getExcerpt(article.content, 150) }}</p>
      <div class="article-tags" v-if="article.tags.length">
        <span v-for="tag in article.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.article-card {
  display: block;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-card-body {
  padding: 1.25rem;
}

.article-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--card-text-color);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8125rem;
  color: var(--body-text-color);
  opacity: 0.7;
  margin-bottom: 0.75rem;
}

.article-excerpt {
  font-size: 0.875rem;
  color: var(--body-text-color);
  line-height: 1.6;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.tag {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 9999px;
  background-color: var(--tag-background);
  color: var(--tag-text-color);
}
</style>
