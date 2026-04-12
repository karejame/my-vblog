<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { api } from '@/utils/api';

const router = useRouter();
const route = useRoute();
const slug = route.params.slug as string;
const isCreating = !slug;

const loading = ref(false);
const error = ref('');
const success = ref('');

const form = reactive({
  title: '',
  slug: '',
  content: '',
  date: new Date().toISOString().split('T')[0],
  categories: [] as string[],
  tags: [] as string[],
  draft: false,
});

const categories = ref<string[]>([]);
const tags = ref<string[]>([]);

onMounted(async () => {
  await loadCategoriesAndTags();
  
  if (!isCreating) {
    await loadArticle();
  }
});

const loadCategoriesAndTags = async () => {
  try {
    const categoriesResponse = await api.getCategories();
    if (categoriesResponse.data) {
      categories.value = categoriesResponse.data.categories;
    }
    
    const tagsResponse = await api.getTags();
    if (tagsResponse.data) {
      tags.value = tagsResponse.data.tags;
    }
  } catch (err) {
    console.error('Failed to load categories and tags:', err);
  }
};

const loadArticle = async () => {
  loading.value = true;
  
  try {
    const response = await api.getArticle(slug);
    if (response.error) {
      error.value = response.error;
    } else if (response.data) {
      const article = response.data.article;
      form.title = article.title;
      form.slug = article.slug;
      form.content = article.content;
      form.date = article.date;
      form.categories = article.categories;
      form.tags = article.tags;
      form.draft = article.draft || false;
    }
  } catch (err) {
    error.value = 'Failed to load article';
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';
  
  try {
    let response;
    
    if (isCreating) {
      response = await api.createArticle(form);
    } else {
      response = await api.updateArticle(slug, form);
    }
    
    if (response.error) {
      error.value = response.error;
    } else {
      success.value = isCreating ? 'Article created successfully' : 'Article updated successfully';
      // 跳转到文章列表
      setTimeout(() => {
        router.push('/admin/articles');
      }, 1000);
    }
  } catch (err) {
    error.value = 'Failed to save article';
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.push('/admin/articles');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <h1 class="text-xl font-bold text-gray-900">
            {{ isCreating ? 'Create Article' : 'Edit Article' }}
          </h1>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <div v-if="error" class="mb-4 text-red-500">
          {{ error }}
        </div>
        
        <div v-if="success" class="mb-4 text-green-500">
          {{ success }}
        </div>

        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>

        <form v-else @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              id="title"
              v-model="form.title"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div class="mb-4">
            <label for="slug" class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              id="slug"
              v-model="form.slug"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div class="mb-4">
            <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              id="content"
              v-model="form.content"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-64"
              required
            ></textarea>
          </div>

          <div class="mb-4">
            <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              id="date"
              v-model="form.date"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Categories</label>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="category in categories"
                :key="category"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="form.categories.includes(category) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                @click="() => {
                  const index = form.categories.indexOf(category);
                  if (index > -1) {
                    form.categories.splice(index, 1);
                  } else {
                    form.categories.push(category);
                  }
                }"
              >
                {{ category }}
              </span>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in tags"
                :key="tag"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="form.tags.includes(tag) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                @click="() => {
                  const index = form.tags.indexOf(tag);
                  if (index > -1) {
                    form.tags.splice(index, 1);
                  } else {
                    form.tags.push(tag);
                  }
                }"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="mb-6">
            <div class="flex items-center">
              <input
                type="checkbox"
                id="draft"
                v-model="form.draft"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="draft" class="ml-2 block text-sm font-medium text-gray-700">
                Draft
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="handleCancel"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ loading ? 'Saving...' : (isCreating ? 'Create' : 'Update') }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>
