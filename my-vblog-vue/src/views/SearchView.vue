<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { searchArticles, loadArticles } from '@/utils/contentLoader'
import type { Article } from '@/utils/contentLoader'
import { useI18n } from 'vue-i18n'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ArticleCard from '@/components/ArticleCard.vue'

const route = useRoute()
const { t } = useI18n()
const query = ref('')
const results = ref<Article[]>([])
const loading = ref(true)

async function doSearch() {
  loading.value = true
  if (query.value.trim()) {
    results.value = await searchArticles(query.value)
  } else {
    results.value = await loadArticles()
  }
  loading.value = false
}

onMounted(async () => {
  const q = route.query.q as string
  if (q) query.value = q
  await doSearch()
})

watch(() => route.query.q, async (newQ) => {
  if (newQ) {
    query.value = newQ as string
    await doSearch()
  }
})
</script>

<template>
  <DefaultLayout>
    <div class="search-page">
      <h1 class="page-title">{{ t('nav.search') }}</h1>
      <div class="search-box">
        <input
          v-model="query"
          type="text"
          :placeholder="t('ui.searchPlaceholder')"
          class="search-input"
          @keyup.enter="doSearch"
        />
        <button class="search-btn" @click="doSearch">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </div>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="results.length === 0" class="no-results">{{ t('ui.noResults') }}</div>
      <div v-else class="results">
        <ArticleCard v-for="article in results" :key="article.slug" :article="article" />
      </div>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.search-page {
  padding: 1rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--card-text-color);
  margin-bottom: 1.5rem;
}

.search-box {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--card-background);
  color: var(--card-text-color);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--accent-color);
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 0.5rem;
  background-color: var(--accent-color);
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;
}

.search-btn:hover {
  opacity: 0.9;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading, .no-results {
  text-align: center;
  padding: 3rem;
  color: var(--body-text-color);
  opacity: 0.5;
}
</style>
