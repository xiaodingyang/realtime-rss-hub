# Realtime RSS Hub

[![CI](https://github.com/xiaodingyang/realtime-rss-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/xiaodingyang/realtime-rss-hub/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)

🚀 Real-time RSS news aggregation with SSE (Server-Sent Events) push

将 RSS 订阅源转换为实时推送的新闻流，适合个人博客、企业官网、内容平台等场景。

## ✨ 特性

- 📡 **SSE 实时推送** - 服务器主动推送，无需轮询
- 🔄 **自动抓取** - 定时任务自动抓取最新新闻
- 🎯 **智能去重** - 基于 URL 哈希自动去重
- 🏷️ **标签提取** - 自动识别关键词并打标签
- 📦 **开箱即用** - 提供 React 组件库，快速集成
- ⚙️ **灵活配置** - 支持多数据源、自定义过滤规则
- 🐳 **Docker 支持** - 一键部署

## 📦 安装

```bash
# 使用 pnpm (推荐)
pnpm add @xdy-npm/realtime-rss-hub-server @xdy-npm/realtime-rss-hub-react

# 使用 npm
npm install @xdy-npm/realtime-rss-hub-server @xdy-npm/realtime-rss-hub-react

# 使用 yarn
yarn add @xdy-npm/realtime-rss-hub-server @xdy-npm/realtime-rss-hub-react
```

## 🚀 快速开始

### 后端服务

```javascript
// server.js
const RSSHub = require('@xdy-npm/realtime-rss-hub-server');

const hub = new RSSHub({
  database: {
    uri: 'mongodb://localhost:27017/rss-hub',
  },
  server: {
    port: 3000,
  },
  sources: [
    {
      id: 'infoq',
      name: 'InfoQ',
      url: 'https://www.infoq.cn/feed',
      limit: 20,
      keywords: ['AI', '人工智能', '机器学习'],
    },
  ],
  scheduler: {
    enabled: true,
    cron: '*/10 * * * *', // 每 10 分钟
  },
});

hub.start();
```

### 前端组件 (React)

```tsx
import { NewsList } from '@xdy-npm/realtime-rss-hub-react';

function App() {
  return (
    <NewsList
      endpoint="/api/news/stream"
      limit={10}
      title="🤖 AI 资讯"
    />
  );
}
```

## 📖 API 文档

### 后端 API

#### SSE 实时推送

```
GET /api/news/stream
```

**查询参数**:
- `limit` - 返回数量 (默认: 20)
- `source` - 数据源 ID (可选)
- `tags` - 标签过滤，逗号分隔 (可选)

**响应格式**:
```
data: {"type":"news","data":[...]}

event: done
data: {"status":"completed","count":20}
```

#### REST API

```
GET /api/news
```

返回 JSON 格式的新闻列表。

```
POST /api/news/refresh
```

手动触发抓取任务。

### React 组件

#### NewsList

完整的新闻列表组件，包含加载状态、错误处理。

```tsx
<NewsList
  endpoint="/api/news/stream"
  limit={10}
  sourceId="infoq"
  tags={['AI', 'GPT']}
  title="最新资讯"
  emptyText="暂无新闻"
  loadingText="加载中..."
  onItemClick={(item) => console.log(item)}
/>
```

#### NewsCard

单个新闻卡片组件。

```tsx
<NewsCard
  item={newsItem}
  onClick={(item) => window.open(item.url)}
/>
```

#### useSSENews Hook

自定义 Hook，用于构建自己的 UI。

```tsx
const { news, loading, error } = useSSENews({
  endpoint: '/api/news/stream',
  limit: 10,
});
```

## ⚙️ 配置

### 数据源配置

```javascript
sources: [
  {
    id: 'infoq',              // 唯一标识
    name: 'InfoQ',            // 显示名称
    url: 'https://www.infoq.cn/feed',  // RSS Feed URL
    limit: 20,                // 抓取数量
    keywords: ['AI', 'GPT'],  // 关键词过滤和标签提取
  },
]
```

### 定时任务配置

```javascript
scheduler: {
  enabled: true,                    // 是否启用
  cron: '*/10 * * * *',            // Cron 表达式
  timezone: 'Asia/Shanghai',       // 时区
}
```

### 环境变量

```bash
# .env
MONGODB_URI=mongodb://localhost:27017/rss-hub
PORT=3000
CORS_ORIGIN=*
SCHEDULER_ENABLED=true
SCHEDULER_CRON=*/10 * * * *
SCHEDULER_TIMEZONE=Asia/Shanghai
```

## 🐳 Docker 部署

```bash
# 构建镜像
docker build -t realtime-rss-hub .

# 运行容器
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI=mongodb://mongo:27017/rss-hub \
  --name rss-hub \
  realtime-rss-hub
```

使用 Docker Compose:

```yaml
version: '3.8'
services:
  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db
  
  rss-hub:
    build: .
    ports:
      - "3000:3000"
    environment:
      MONGODB_URI: mongodb://mongo:27017/rss-hub
    depends_on:
      - mongo

volumes:
  mongo-data:
```

## 🎯 使用场景

- **个人博客** - 在侧边栏展示行业资讯
- **企业官网** - 实时展示公司动态和行业新闻
- **内容聚合平台** - 多源新闻聚合和分发
- **学习项目** - SSE 技术实践和学习

## 🔧 技术栈

- **后端**: Node.js + Express + MongoDB
- **实时推送**: Server-Sent Events (SSE)
- **RSS 解析**: rss-parser
- **定时任务**: node-cron
- **前端**: React + TypeScript

## 📊 性能

- 支持 1000+ 并发 SSE 连接
- MongoDB 索引优化，查询响应 < 10ms
- 自动去重，避免重复存储
- 定时任务异步执行，不阻塞主服务

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT © [肖定阳](https://xiaodingyang.art)

## 🔗 相关链接

- [GitHub](https://github.com/xiaodingyang/realtime-rss-hub)
- [作者博客](https://xiaodingyang.art)
- [技术文档](./docs)

---

**Star ⭐ 如果这个项目对你有帮助！**
