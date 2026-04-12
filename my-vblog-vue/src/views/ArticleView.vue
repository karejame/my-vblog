<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadArticle } from '@/utils/contentLoader'
import type { Article } from '@/utils/contentLoader'
import { renderMarkdown, estimateReadingTime } from '@/utils/markdown'
import { useI18n } from 'vue-i18n'
import ArticleLayout from '@/layouts/ArticleLayout.vue'
import NoteComponent from '@/components/NoteComponent.vue'

const route = useRoute()
const { t } = useI18n()
const article = ref<Article | null>(null)
const renderedContent = ref('')
const loading = ref(true)

async function load() {
  loading.value = true
  const slug = route.params.slug as string
  article.value = await loadArticle(slug)
  if (article.value) {
    renderedContent.value = renderMarkdown(article.value.content)
  }
  loading.value = false
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<template>
  <ArticleLayout>
    <div v-if="loading" class="loading">Loading...</div>
    <article v-else-if="article" class="article-detail card">
      <header class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span class="meta-item">{{ article.date }}</span>
          <span class="meta-item">{{ t('ui.readingTime', { time: estimateReadingTime(article.content) }) }}</span>
        </div>
        <div class="article-categories" v-if="article.categories.length">
          <span v-for="cat in article.categories" :key="cat" class="category-tag">{{ cat }}</span>
        </div>
      </header>
      <div class="article-content markdown-body" v-html="renderedContent"></div>
      <footer class="article-footer" v-if="article.tags.length">
        <div class="article-tags">
          <span class="tags-label">{{ t('ui.tags') }}:</span>
          <router-link v-for="tag in article.tags" :key="tag" :to="`/search?q=${tag}`" class="tag">{{ tag }}</router-link>
        </div>
      </footer>
      
      <NoteComponent :article-slug="article.slug" />

    </article>
    <div v-else class="not-found">
      <h2>404</h2>
      <p>Article not found</p>
    </div>
  </ArticleLayout>
</template>

<style scoped>
.article-detail {
  padding: 2rem;
}

.article-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.article-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--card-text-color);
  line-height: 1.3;
  margin-bottom: 0.75rem;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--body-text-color);
  opacity: 0.7;
  margin-bottom: 0.75rem;
}

.article-categories {
  display: flex;
  gap: 0.5rem;
}

.category-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.8125rem;
  border-radius: 9999px;
  background-color: var(--tag-background);
  color: var(--tag-text-color);
}

.article-content {
  margin-bottom: 2rem;
}

.article-footer {
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.article-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tags-label {
  font-size: 0.875rem;
  color: var(--body-text-color);
  opacity: 0.7;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.8125rem;
  border-radius: 9999px;
  background-color: var(--tag-background);
  color: var(--tag-text-color);
  text-decoration: none;
  transition: opacity 0.2s;
}

.tag:hover {
  opacity: 0.8;
}

.loading, .not-found {
  text-align: center;
  padding: 3rem;
  color: var(--body-text-color);
  opacity: 0.5;
}

.not-found h2 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}
</style>
