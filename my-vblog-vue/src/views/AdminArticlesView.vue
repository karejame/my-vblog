<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/utils/api';
import type { Article } from '@/utils/contentLoader';

const router = useRouter();
const articles = ref<Article[]>([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  await loadArticles();
});

const loadArticles = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await api.getArticles();
    if (response.error) {
      error.value = response.error;
    } else if (response.data) {
      articles.value = response.data.articles;
    }
  } catch (err) {
    error.value = 'Failed to load articles';
  } finally {
    loading.value = false;
  }
};

const handleEdit = (slug: string) => {
  router.push(`/admin/articles/edit/${slug}`);
};

const handleDelete = async (slug: string) => {
  if (confirm('Are you sure you want to delete this article?')) {
    try {
      const response = await api.deleteArticle(slug);
      if (response.error) {
        error.value = response.error;
      } else {
        // 重新加载文章列表
        await loadArticles();
      }
    } catch (err) {
      error.value = 'Failed to delete article';
    }
  }
};

const handleCreate = () => {
  router.push('/admin/articles/create');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <h1 class="text-xl font-bold text-gray-900">Manage Articles</h1>
          <button
            @click="handleCreate"
            class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Create Article
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <div v-if="error" class="mb-4 text-red-500">
          {{ error }}
        </div>

        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>

        <div v-else-if="articles.length === 0" class="text-center py-8">
          <p class="text-gray-600">No articles found.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="article in articles" :key="article.slug">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ article.title }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ article.date }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="article.draft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">
                    {{ article.draft ? 'Draft' : 'Published' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="handleEdit(article.slug)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="handleDelete(article.slug)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>
