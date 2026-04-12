import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

export function renderMarkdown(content: string): string {
  return md.render(content)
}

export function getExcerpt(content: string, length = 200): string {
  const text = content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/\n+/g, ' ')
    .trim()

  return text.length > length ? text.slice(0, length) + '...' : text
}

export function estimateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, '')
  const charCount = text.length
  return Math.max(1, Math.ceil(charCount / 500))
}
