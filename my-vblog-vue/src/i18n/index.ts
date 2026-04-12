import { createI18n } from 'vue-i18n'
import en from './en.json'
import zh from './zh.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh',
  fallbackLocale: 'zh',
  messages: { en, zh },
})

export function setLocale(locale: 'en' | 'zh') {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.setAttribute('lang', locale)
}

export function toggleLocale() {
  const current = i18n.global.locale.value
  const next = current === 'zh' ? 'en' : 'zh'
  setLocale(next as 'en' | 'zh')
}

export default i18n
