<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <section class="copyright">{{ t('footer.copyright') }}</section>
      <section class="powerby">
        <span>{{ t('footer.builtWith') }}</span> <br>
        <b>{{ t('footer.themeBy') }}</b>
      </section>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 2rem 0;
  margin-top: 2rem;
  transition: background-color 0.3s;
}

.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.powerby {
  opacity: 0.7;
}
</style>
