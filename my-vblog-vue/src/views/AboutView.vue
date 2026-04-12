<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <div class="about-page">
      <div class="card about-card">
        <h1 class="about-title">关于本站</h1>
        
        <div class="about-content">
          <p>欢迎来到 Tech Blog！这是一个专注于技术分享的个人博客。</p>
          
          <h2>网站定位</h2>
          <p>本站致力于分享以下内容：</p>
          <ul>
            <li>前端技术（Vue、TypeScript、Tailwind CSS等）</li>
            <li>后端开发（Python、Java等）</li>
            <li>DevOps工具（Git、Docker等）</li>
            <li>AI技术与应用</li>
            <li>开发工具与技巧</li>
          </ul>
          
          <h2>技术栈</h2>
          <p>本站使用以下技术构建：</p>
          <div class="tech-stack">
            <span class="tag">Vue 3</span>
            <span class="tag">TypeScript</span>
            <span class="tag">Tailwind CSS</span>
            <span class="tag">Vite</span>
            <span class="tag">Vue Router</span>
            <span class="tag">Pinia</span>
          </div>
          
          <h2>关于作者</h2>
          <p>作者是一名热爱技术的开发者，专注于前端技术和AI应用。希望通过这个博客分享自己的学习心得和开发经验。</p>
          
          <h2>联系方式</h2>
          <p>如果您有任何问题或建议，欢迎通过以下方式联系：</p>
          <ul>
            <li>邮箱：contact@techblog.com</li>
            <li>GitHub：github.com/techblog</li>
            <li>Twitter：@techblog</li>
          </ul>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.about-page {
  padding: 2rem 0;
}

.about-card {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.about-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--color-text);
  text-align: center;
}

.about-content {
  line-height: 1.8;
}

.about-content h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: var(--color-text);
}

.about-content p {
  margin: 0.75rem 0;
  color: var(--color-text-secondary);
}

.about-content ul {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
  color: var(--color-text-secondary);
}

.about-content li {
  margin: 0.25rem 0;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.75rem 0;
}
</style>
