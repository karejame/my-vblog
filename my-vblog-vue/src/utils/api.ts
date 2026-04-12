import type { Article } from './contentLoader';

interface User {
  id: string;
  username: string;
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

interface LoginResponse {
  token: string;
  user: User;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = '/api';
    this.token = localStorage.getItem('token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: `HTTP ${response.status}: ${data.error || 'An error occurred'}` };
      }

      return { data };
    } catch (error) {
      console.error('API request error:', error);
      if (error instanceof TypeError) {
        return { error: '网络连接失败，请检查网络设置' };
      } else if (error instanceof SyntaxError) {
        return { error: '服务器返回格式错误' };
      } else {
        return { error: '请求失败，请稍后重试' };
      }
    }
  }

  // 认证相关
  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.data) {
      this.token = response.data.token;
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async register(username: string, email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    if (response.data) {
      this.token = response.data.token;
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/me');
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // 文章相关
  async getArticles(): Promise<ApiResponse<{ articles: Article[] }>> {
    return this.request<{ articles: Article[] }>('/articles');
  }

  async getArticle(slug: string): Promise<ApiResponse<{ article: Article }>> {
    return this.request<{ article: Article }>(`/articles/${slug}`);
  }

  async createArticle(article: Partial<Article>): Promise<ApiResponse<{ article: Article }>> {
    return this.request<{ article: Article }>('/articles', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  }

  async updateArticle(slug: string, article: Partial<Article>): Promise<ApiResponse<{ article: Article }>> {
    return this.request<{ article: Article }>(`/articles/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(article),
    });
  }

  async deleteArticle(slug: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/articles/${slug}`, {
      method: 'DELETE',
    });
  }

  // 分类相关
  async getCategories(): Promise<ApiResponse<{ categories: string[] }>> {
    return this.request<{ categories: string[] }>('/categories');
  }

  // 标签相关
  async getTags(): Promise<ApiResponse<{ tags: string[] }>> {
    return this.request<{ tags: string[] }>('/tags');
  }

  // 笔记相关
  async getNote(articleSlug: string): Promise<ApiResponse<{ note: Note | null }>> {
    return this.request<{ note: Note | null }>(`/notes/${articleSlug}`);
  }

  async saveNote(articleSlug: string, content: string): Promise<ApiResponse<{ note: Note }>> {
    return this.request<{ note: Note }>(`/notes/${articleSlug}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async deleteNote(articleSlug: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/notes/${articleSlug}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
export type { User, Note, LoginResponse };
