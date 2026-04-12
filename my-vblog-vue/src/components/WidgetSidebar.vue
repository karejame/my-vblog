<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategories, getTags, loadArticles } from '@/utils/contentLoader'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const categories = ref<string[]>([])
const tags = ref<string[]>([])
const searchQuery = ref('')
const archives = ref<Record<string, number>>({})

async function handleSearch() {
  if (searchQuery.value.trim()) {
    await router.push({ name: 'search', query: { q: searchQuery.value } })
  }
}

onMounted(async () => {
  categories.value = await getCategories()
  tags.value = await getTags()
  
  const articles = await loadArticles()
  const archiveMap: Record<string, number> = {}
  for (const article of articles) {
    const year = article.date.split('-')[0]
    archiveMap[year] = (archiveMap[year] || 0) + 1
  }
  archives.value = archiveMap
})
</script>

<template>
  <aside class="widget-sidebar">
    <div class="card sidebar-card">
      <div class="search-widget">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('ui.searchPlaceholder')"
          class="search-input"
          @keyup.enter="handleSearch"
        />
      </div>
    </div>

    <div class="card sidebar-card">
      <h3 class="section-title">{{ t('nav.archives') }}</h3>
      <ul class="archive-list">
        <li v-for="[year, count] in Object.entries(archives).sort(([a], [b]) => b.localeCompare(a))" :key="year">
          <RouterLink :to="`/archives`" class="archive-item">
            <span class="archive-year">{{ year }}</span>
            <span class="archive-badge">{{ count }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <div class="card sidebar-card">
      <h3 class="section-title">{{ t('ui.categories') }}</h3>
      <div class="tag-list">
        <RouterLink v-for="cat in categories" :key="cat" :to="`/search?q=${cat}`" class="tag tag-link">
          {{ cat }}
        </RouterLink>
      </div>
    </div>

    <div class="card sidebar-card">
      <h3 class="section-title">{{ t('ui.tags') }}</h3>
      <div class="tag-list">
        <RouterLink v-for="tag in tags" :key="tag" :to="`/search?q=${tag}`" class="tag tag-link">
          {{ tag }}
        </RouterLink>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.widget-sidebar {
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

.search-widget {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.875rem 0.75rem 2.75rem;
  border: none;
  border-radius: 0.75rem;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 0.875rem;
  outline: none;
  transition: box-shadow 0.2s;
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.search-input:focus {
  box-shadow: 0 0 0 2px var(--color-primary);
}

.section-title {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
  color: var(--color-text-secondary);
}

.archive-list {
  list-style: none;
  padding: 0;
}

.archive-list li {
  margin-bottom: 0.5rem;
}

.archive-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem 0;
  text-decoration: none;
  transition: color 0.2s;
}

.archive-year {
  font-size: 0.875rem;
  color: var(--color-text);
}

.archive-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background-color: var(--color-badge-bg);
  color: var(--color-badge-text);
}

.archive-item:hover .archive-year {
  color: var(--color-primary);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-link {
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.tag-link:hover {
  opacity: 0.8;
  transform: scale(1.05);
}
</style>
