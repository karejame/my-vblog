import { Router, type Request, type Response } from 'itty-router';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

interface Env {
  BLOG_ARTICLES: KVNamespace;
  BLOG_USERS: KVNamespace;
  BLOG_SETTINGS: KVNamespace;
  JWT_SECRET: string;
  ADMIN_EMAIL: string;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  date: string;
  categories: string[];
  tags: string[];
  author: string;
  status: string;
  views: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

interface Note {
  id: string;
  user_id: string;
  article_slug: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const router = Router();

// 生成JWT令牌
async function generateToken(user: User, env: Env): Promise<string> {
  const token = await new SignJWT({ id: user.id, username: user.username, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(env.JWT_SECRET));
  return token;
}

// 验证JWT令牌
async function verifyToken(request: Request, env: Env): Promise<User | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(env.JWT_SECRET));
    const userId = payload.id as string;
    const userData = await env.BLOG_USERS.get(`users/${userId}`);
    if (!userData) {
      return null;
    }
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// 认证中间件
async function authMiddleware(request: Request, env: Env, ctx: ExecutionContext): Promise<Response | undefined> {
  const user = await verifyToken(request, env);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // 将用户信息存储在请求上下文中
  (request as any).user = user;
  return undefined;
}

// 认证API
router.post('/api/auth/login', async (request: Request, env: Env) => {
  try {
    const { username, password } = await request.json();
    
    // 查找用户
    const userData = await env.BLOG_USERS.get(`users/${username}`);
    if (!userData) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = JSON.parse(userData) as User;
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 生成令牌
    const token = await generateToken(user, env);

    return new Response(JSON.stringify({ token, user: { id: user.id, username: user.username, role: user.role } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

router.post('/api/auth/register', async (request: Request, env: Env) => {
  try {
    const { username, email, password } = await request.json();
    
    // 检查用户是否已存在
    const existingUser = await env.BLOG_USERS.get(`users/${username}`);
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      email,
      password: hashedPassword,
      role: 'user',
    };

    // 保存用户
    await env.BLOG_USERS.put(`users/${username}`, JSON.stringify(newUser));

    // 生成令牌
    const token = await generateToken(newUser, env);

    return new Response(JSON.stringify({ token, user: { id: newUser.id, username: newUser.username, role: newUser.role } }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

router.get('/api/auth/me', authMiddleware, async (request: Request, env: Env) => {
  const user = (request as any).user as User;
  return new Response(JSON.stringify({ user: { id: user.id, username: user.username, role: user.role } }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});

// 文章API
router.get('/api/articles', async (request: Request, env: Env) => {
  try {
    // 获取所有文章
    const articles: Article[] = [];
    const keys = await env.BLOG_ARTICLES.list({ prefix: 'articles/' });
    
    for (const key of keys.keys) {
      const articleData = await env.BLOG_ARTICLES.get(key.name);
      if (articleData) {
        articles.push(JSON.parse(articleData) as Article);
      }
    }

    // 按日期排序
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return new Response(JSON.stringify({ articles }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get articles error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

router.get('/api/articles/:slug', async (request: Request, env: Env) => {
  try {
    const { slug } = request.params;
    const articleData = await env.BLOG_ARTICLES.get(`articles/${slug}`);
    
    if (!articleData) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const article = JSON.parse(articleData) as Article;
    return new Response(JSON.stringify({ article }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get article error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

router.post('/api/articles', authMiddleware, async (request: Request, env: Env) => {
  try {
    const user = (request as any).user as User;
    const articleData = await request.json();

    const newArticle: Article = {
      id: crypto.randomUUID(),
      slug: articleData.slug,
      title: articleData.title,
      content: articleData.content,
      date: articleData.date || new Date().toISOString(),
      categories: articleData.categories || [],
      tags: articleData.tags || [],
      author: user.username,
      status: articleData.status || 'published',
      views: 0,
    };

    await env.BLOG_ARTICLES.put(`articles/${newArticle.slug}`, JSON.stringify(newArticle));

    return new Response(JSON.stringify({ article: newArticle }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create article error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

router.put('/api/articles/:slug', authMiddleware, async (request: Request, env: Env) => {
  try {
    const { slug } = request.params;
    const articleData = await request.json();

    const existingArticleData = await env.BLOG_ARTICLES.get(`articles/${slug}`);
    if (!existingArticleData) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existingArticle = JSON.parse(existingArticleData) as Article;
    const updatedArticle = {
      ...existingArticle,
      ...articleData,
      updated_at: new Date().toISOString(),
    };

    await env.BLOG_ARTICLES.put(`articles/${slug}`, JSON.stringify(updatedArticle));

    return new Response(JSON.stringify({ article: updatedArticle }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update article error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

router.delete('/api/articles/:slug', authMiddleware, async (request: Request, env: Env) => {
  try {
    const { slug } = request.params;
    const existingArticleData = await env.BLOG_ARTICLES.get(`articles/${slug}`);
    
    if (!existingArticleData) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.BLOG_ARTICLES.delete(`articles/${slug}`);

    return new Response(JSON.stringify({ message: 'Article deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete article error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 分类API
router.get('/api/categories', async (request: Request, env: Env) => {
  try {
    // 从所有文章中提取分类
    const categories = new Set<string>();
    const keys = await env.BLOG_ARTICLES.list({ prefix: 'articles/' });
    
    for (const key of keys.keys) {
      const articleData = await env.BLOG_ARTICLES.get(key.name);
      if (articleData) {
        const article = JSON.parse(articleData) as Article;
        article.categories.forEach(category => categories.add(category));
      }
    }

    return new Response(JSON.stringify({ categories: Array.from(categories) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 标签API
router.get('/api/tags', async (request: Request, env: Env) => {
  try {
    // 从所有文章中提取标签
    const tags = new Set<string>();
    const keys = await env.BLOG_ARTICLES.list({ prefix: 'articles/' });
    
    for (const key of keys.keys) {
      const articleData = await env.BLOG_ARTICLES.get(key.name);
      if (articleData) {
        const article = JSON.parse(articleData) as Article;
        article.tags.forEach(tag => tags.add(tag));
      }
    }

    return new Response(JSON.stringify({ tags: Array.from(tags) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get tags error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 笔记API
router.get('/api/notes/:article_slug', authMiddleware, async (request: Request, env: Env) => {
  try {
    const { article_slug } = request.params;
    const user = (request as any).user as User;

    const noteData = await env.BLOG_USERS.get(`notes/${user.id}/${article_slug}`);
    if (!noteData) {
      return new Response(JSON.stringify({ note: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const note = JSON.parse(noteData) as Note;
    return new Response(JSON.stringify({ note }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get note error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

router.post('/api/notes/:article_slug', authMiddleware, async (request: Request, env: Env) => {
  try {
    const { article_slug } = request.params;
    const user = (request as any).user as User;
    const { content } = await request.json();

    const existingNoteData = await env.BLOG_USERS.get(`notes/${user.id}/${article_slug}`);
    let note: Note;

    if (existingNoteData) {
      // 更新现有笔记
      const existingNote = JSON.parse(existingNoteData) as Note;
      note = {
        ...existingNote,
        content,
        updated_at: new Date().toISOString(),
      };
    } else {
      // 创建新笔记
      note = {
        id: crypto.randomUUID(),
        user_id: user.id,
        article_slug,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    await env.BLOG_USERS.put(`notes/${user.id}/${article_slug}`, JSON.stringify(note));

    return new Response(JSON.stringify({ note }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Save note error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

router.delete('/api/notes/:article_slug', authMiddleware, async (request: Request, env: Env) => {
  try {
    const { article_slug } = request.params;
    const user = (request as any).user as User;

    await env.BLOG_USERS.delete(`notes/${user.id}/${article_slug}`);

    return new Response(JSON.stringify({ message: 'Note deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Delete note error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// 404处理
router.all('*', () => {
  return new Response('Not Found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain' },
  });
});

export default {
  fetch: router.handle,
};
