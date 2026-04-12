# 技术博客系统

一个基于 Vue 3 + TypeScript + Cloudflare Pages + Workers + KV 的动态博客系统。

## 功能特性

- **动态内容管理**：通过 Cloudflare Workers 和 KV 实现文章、分类、标签的 CRUD 操作
- **在线笔记**：支持用户在文章页面添加个人笔记
- **评论系统**：集成 Disqus 评论
- **多语言支持**：中英文切换
- **主题切换**：暗色/亮色模式
- **响应式设计**：适配不同设备

## 技术栈

- **前端**：Vue 3 + TypeScript + Vite
- **后端**：Cloudflare Workers
- **存储**：Cloudflare KV
- **部署**：Cloudflare Pages
- **认证**：JWT
- **评论**：Disqus

## 目录结构

```
my-vblog/
├── content/           # Markdown 文章内容
├── my-vblog-vue/      # Vue 3 前端项目
├── workers/           # Cloudflare Workers 后端
├── Vue重构方案.md     # 重构方案文档
└── README.md          # 本文件
```

## 使用方法

### 1. 前端开发

1. **进入前端项目目录**
   ```bash
   cd my-vblog-vue
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **构建生产版本**
   ```bash
   npm run build
   ```

### 2. 后端开发

1. **进入 Workers 项目目录**
   ```bash
   cd workers
   ```

2. **初始化 Workers 项目**
   ```bash
   npx wrangler init
   ```

3. **配置 KV 命名空间**
   ```bash
   npx wrangler kv:namespace create blog-articles
   npx wrangler kv:namespace create blog-users
   npx wrangler kv:namespace create blog-settings
   ```

4. **部署 Workers**
   ```bash
   npx wrangler deploy
   ```

### 3. 内容管理

1. **登录管理后台**：访问 `/admin` 路径
2. **创建文章**：在管理后台点击「新建文章」按钮
3. **编辑文章**：使用 Markdown 编辑器编写内容
4. **管理分类和标签**：在管理后台的分类和标签页面进行管理

### 4. 在线笔记使用

1. **登录系统**：点击页面顶部的登录按钮
2. **阅读文章**：打开任意文章页面
3. **添加笔记**：在文章页面底部的笔记区域输入笔记内容
4. **保存笔记**：点击保存按钮，笔记会自动同步到云端

## 部署方法

### 1. 前端部署（Cloudflare Pages）

1. **创建 Cloudflare Pages 项目**
   - 登录 Cloudflare 控制台
   - 点击「Pages」→「创建项目」
   - 连接 GitHub 仓库
   - 选择 `my-vblog-vue` 目录

2. **配置构建参数**
   - 构建命令：`npm run build`
   - 构建输出目录：`dist`
   - 环境变量：根据需要配置

3. **部署**
   - 点击「保存并部署」
   - 等待部署完成

### 2. 后端部署（Cloudflare Workers）

1. **配置 Workers**
   - 在 `workers/wrangler.toml` 中配置 KV 绑定
   - 配置路由和环境变量

2. **部署 Workers**
   ```bash
   cd workers
   npx wrangler deploy
   ```

3. **配置 API 路由**
   - 在 Cloudflare 控制台中配置 Workers 路由
   - 例如：`api.example.com/*` → `your-worker`

### 3. 域名配置

1. **添加自定义域名**
   - 在 Cloudflare Pages 中添加自定义域名
   - 在 Cloudflare Workers 中添加自定义域名

2. **配置 DNS**
   - 在 Cloudflare DNS 中添加相应的 DNS 记录

### 4. 环境变量配置

在 Cloudflare Pages 和 Workers 中配置以下环境变量：

- `JWT_SECRET`：JWT 签名密钥
- `DISQUS_SHORTNAME`：Disqus 短名称
- `ADMIN_EMAIL`：管理员邮箱

## 开发指南

### 前端开发

- **组件开发**：在 `src/components` 目录下创建组件
- **页面开发**：在 `src/views` 目录下创建页面
- **API 调用**：使用 `src/utils/api.ts` 封装 API 调用
- **状态管理**：使用 Pinia 进行状态管理

### 后端开发

- **API 端点**：在 `workers/src/index.ts` 中实现 API 端点
- **KV 操作**：使用 Cloudflare KV 客户端进行数据操作
- **认证逻辑**：实现 JWT 认证中间件
- **错误处理**：实现统一的错误处理

## 安全性

- **密码加密**：使用 bcrypt 加密用户密码
- **JWT 认证**：使用安全的 JWT 签名算法
- **CORS 配置**：合理配置 CORS 策略
- **输入验证**：前后端都进行输入验证
- **敏感数据**：加密存储敏感信息

## 性能优化

- **前端优化**：代码分割、缓存策略、懒加载
- **Workers 优化**：边缘缓存、批量操作、响应压缩
- **KV 优化**：合理设计键名、控制值大小、批量更新

## 故障排查

### 常见问题

1. **API 调用失败**
   - 检查 Workers 部署状态
   - 检查 KV 命名空间绑定
   - 检查环境变量配置

2. **笔记同步失败**
   - 检查用户登录状态
   - 检查网络连接
   - 检查 Workers 日志

3. **评论不显示**
   - 检查 Disqus 短名称配置
   - 检查文章 slug 是否正确
   - 检查 Disqus 后台设置

### 日志查看

- **前端日志**：浏览器开发者工具控制台
- **Workers 日志**：Cloudflare Workers 控制台
- **Pages 日志**：Cloudflare Pages 部署日志

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License