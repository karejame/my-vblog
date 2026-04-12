<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '@/utils/api';

const props = defineProps<{
  articleSlug: string;
}>();

const noteContent = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');
const isLoggedIn = ref(false);

onMounted(async () => {
  checkLoginStatus();
  if (isLoggedIn.value) {
    await loadNote();
  }
});

const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
};

const loadNote = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await api.getNote(props.articleSlug);
    if (response.error) {
      error.value = response.error;
    } else if (response.data?.note) {
      noteContent.value = response.data.note.content;
    }
  } catch (err) {
    error.value = 'Failed to load note';
  } finally {
    loading.value = false;
  }
};

const saveNote = async () => {
  if (!isLoggedIn.value) {
    error.value = 'Please login to save notes';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = '';
  
  try {
    const response = await api.saveNote(props.articleSlug, noteContent.value);
    if (response.error) {
      error.value = response.error;
    } else {
      success.value = 'Note saved successfully';
      setTimeout(() => {
        success.value = '';
      }, 2000);
    }
  } catch (err) {
    error.value = 'Failed to save note';
  } finally {
    loading.value = false;
  }
};

const deleteNote = async () => {
  if (!isLoggedIn.value) {
    error.value = 'Please login to delete notes';
    return;
  }

  if (confirm('Are you sure you want to delete this note?')) {
    loading.value = true;
    error.value = '';
    
    try {
      const response = await api.deleteNote(props.articleSlug);
      if (response.error) {
        error.value = response.error;
      } else {
        noteContent.value = '';
        success.value = 'Note deleted successfully';
        setTimeout(() => {
          success.value = '';
        }, 2000);
      }
    } catch (err) {
      error.value = 'Failed to delete note';
    } finally {
      loading.value = false;
    }
  }
};
</script>

<template>
  <div class="mt-8">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">My Notes</h3>
    
    <div v-if="!isLoggedIn" class="bg-gray-100 p-4 rounded-md">
      <p class="text-gray-600">
        Please <router-link to="/login" class="text-blue-600 hover:underline">login</router-link> to add notes to this article.
      </p>
    </div>
    
    <div v-else>
      <div v-if="error" class="mb-4 text-red-500 text-sm">
        {{ error }}
      </div>
      
      <div v-if="success" class="mb-4 text-green-500 text-sm">
        {{ success }}
      </div>
      
      <div v-if="loading" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <div v-else>
        <textarea
          v-model="noteContent"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 mb-4"
          placeholder="Add your notes here..."
        ></textarea>
        
        <div class="flex justify-end gap-2">
          <button
            @click="deleteNote"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md text-sm"
          >
            Delete
          </button>
          <button
            @click="saveNote"
            class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
