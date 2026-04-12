export interface Article {
  slug: string
  title: string
  date: string
  categories: string[]
  tags: string[]
  content: string
  draft: boolean
}

const articleCache = new Map<string, Article>()
const allArticlesCache = { value: null as Article[] | null }

const rawModules = import.meta.glob('../../content/post/*/index.md', {
  query: '?raw',
  eager: false,
})

export async function loadArticles(): Promise<Article[]> {
  if (allArticlesCache.value) return allArticlesCache.value

  const articles: Article[] = []

  for (const path of Object.keys(rawModules)) {
    const match = path.match(/\.\.\/\.\.\/content\/post\/([^/]+)\/index\.md/)
    if (!match) continue

    const slug = match[1]
    const article = await loadArticle(slug)
    if (article && !article.draft) {
      articles.push(article)
    }
  }

  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  allArticlesCache.value = articles
  return articles
}

export async function loadArticle(slug: string): Promise<Article | null> {
  if (articleCache.has(slug)) return articleCache.get(slug)!

  try {
    const modulePath = `../../content/post/${slug}/index.md`
    const loader = rawModules[modulePath]
    if (!loader) return null

    const mod = (await loader()) as { default: string }
    const raw = mod.default

    const { data, content } = parseFrontMatter(raw)

    const article: Article = {
      slug,
      title: data.title || slug,
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
      categories: data.categories || [],
      tags: data.tags || [],
      content,
      draft: data.draft || false,
    }

    articleCache.set(slug, article)
    return article
  } catch (error) {
    console.error('Error loading article:', error)
    return null
  }
}

function parseFrontMatter(raw: string): { data: Record<string, any>; content: string } {
  const trimmed = raw.trim()
  if (!trimmed.startsWith('---')) {
    return { data: {}, content: trimmed }
  }

  const endIndex = trimmed.indexOf('---', 3)
  if (endIndex === -1) {
    return { data: {}, content: trimmed }
  }

  const frontMatter = trimmed.slice(3, endIndex).trim()
  const content = trimmed.slice(endIndex + 3).trim()
  const data: Record<string, any> = {}

  let currentKey = ''
  let inArray = false
  let arrayItems: string[] = []

  for (const line of frontMatter.split('\n')) {
    const arrayMatch = line.match(/^  - (.+)$/)
    if (arrayMatch && inArray) {
      arrayItems.push(arrayMatch[1].trim().replace(/^["']|["']$/g, ''))
      continue
    }

    if (inArray && currentKey) {
      data[currentKey] = arrayItems
      inArray = false
      arrayItems = []
    }

    const kvMatch = line.match(/^(\w+):\s*(.*)$/)
    if (kvMatch) {
      currentKey = kvMatch[1]
      const currentValue = kvMatch[2].trim()

      if (currentValue === '') {
        inArray = true
        arrayItems = []
      } else if (currentValue.startsWith('[') && currentValue.endsWith(']')) {
        // 解析数组格式的字符串
        try {
          // 移除首尾的方括号
          const arrayContent = currentValue.slice(1, -1).trim()
          if (arrayContent) {
            // 分割数组元素
            const items = arrayContent.split(',').map(item => {
              // 移除引号和空格
              return item.trim().replace(/^["']|["']$/g, '')
            })
            data[currentKey] = items
          } else {
            data[currentKey] = []
          }
        } catch (error) {
          // 如果解析失败，作为普通字符串处理
          let parsed: any = currentValue.replace(/^["']|["']$/g, '')
          if (parsed === 'true') parsed = true
          else if (parsed === 'false') parsed = false
          else if (/^\d+$/.test(parsed)) parsed = parseInt(parsed)
          data[currentKey] = parsed
        }
      } else {
        let parsed: any = currentValue.replace(/^["']|["']$/g, '')
        if (parsed === 'true') parsed = true
        else if (parsed === 'false') parsed = false
        else if (/^\d+$/.test(parsed)) parsed = parseInt(parsed)
        data[currentKey] = parsed
      }
    }
  }

  if (inArray && currentKey) {
    data[currentKey] = arrayItems
  }

  return { data, content }
}

export async function getCategories(): Promise<string[]> {
  const articles = await loadArticles()
  const categories = new Set<string>()
  for (const article of articles) {
    for (const cat of article.categories) {
      categories.add(cat)
    }
  }
  return Array.from(categories)
}

export async function getTags(): Promise<string[]> {
  const articles = await loadArticles()
  const tags = new Set<string>()
  for (const article of articles) {
    for (const tag of article.tags) {
      tags.add(tag)
    }
  }
  return Array.from(tags)
}

export async function searchArticles(query: string): Promise<Article[]> {
  const articles = await loadArticles()
  const q = query.toLowerCase()
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)) ||
      a.categories.some((c) => c.toLowerCase().includes(q)) ||
      a.content.toLowerCase().includes(q)
  )
}
