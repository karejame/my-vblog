import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
  },
  {
    path: '/post/:slug',
    name: 'article',
    component: () => import('@/views/ArticleView.vue'),
  },
  {
    path: '/archives',
    name: 'archives',
    component: () => import('@/views/ArchivesView.vue'),
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchView.vue'),
  },
  {
    path: '/links',
    name: 'links',
    component: () => import('@/views/LinksView.vue'),
  },
  // Auth routes
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
  },
  // Admin routes
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/AdminView.vue'),
  },
  {
    path: '/admin/articles',
    name: 'admin-articles',
    component: () => import('@/views/AdminArticlesView.vue'),
  },
  {
    path: '/admin/articles/create',
    name: 'admin-article-create',
    component: () => import('@/views/AdminArticleEditView.vue'),
  },
  {
    path: '/admin/articles/edit/:slug',
    name: 'admin-article-edit',
    component: () => import('@/views/AdminArticleEditView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
