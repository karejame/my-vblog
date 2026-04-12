<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/utils/api';

const router = useRouter();
const user = ref<any>(null);

onMounted(async () => {
  // 检查用户是否已登录
  const userStr = localStorage.getItem('user');
  if (userStr) {
    user.value = JSON.parse(userStr);
  } else {
    // 未登录，跳转到登录页面
    router.push('/login');
  }
});

const handleLogout = () => {
  api.logout();
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <div class="flex items-center">
            <span class="mr-4 text-sm text-gray-600">{{ user?.username }}</span>
            <button
              @click="handleLogout"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Manage Content</h2>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/admin/articles"
                class="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-600"
              >
                Articles
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/categories"
                class="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-600"
              >
                Categories
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/tags"
                class="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-600"
              >
                Tags
              </router-link>
            </li>
          </ul>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">User Management</h2>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/admin/users"
                class="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-600"
              >
                Users
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/profile"
                class="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-600"
              >
                Profile
              </router-link>
            </li>
          </ul>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">System</h2>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/admin/settings"
                class="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-600"
              >
                Settings
              </router-link>
            </li>
            <li>
              <a
                href="/"
                class="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-600"
                target="_blank"
              >
                View Site
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>
