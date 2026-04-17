# 快速开始

本指南将帮助你在 5 分钟内搭建一个实时 RSS 新闻推送系统。

## 前置要求

- Node.js >= 16.0.0
- MongoDB >= 5.0
- pnpm >= 8.0.0 (推荐)

## 步骤 1: 安装依赖

```bash
# 创建项目目录
mkdir my-rss-hub && cd my-rss-hub

# 初始化项目
npm init -y

# 安装依赖
pnpm add @realtime-rss-hub/server
```

## 步骤 2: 创建服务器

创建 `server.js`:

```javascript
const RSSHub = require('@realtime-rss-hub/server');

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
      keywords: ['AI', '人工智能', '机器学习', 'GPT', 'LLM'],
    },
  ],
  scheduler: {
    enabled: true,
    cron: '*/10 * * * *',
  },
});

hub.start().catch(console.error);
```

## 步骤 3: 启动服务

```bash
node server.js
```

输出:
```
[Database] MongoDB 连接成功
[Scheduler] 定时任务已启动: */10 * * * * (Asia/Shanghai)
[Server] 服务已启动: http://localhost:3000
```

## 步骤 4: 测试 API

### 测试 REST API

```bash
curl http://localhost:3000/api/news
```

### 测试 SSE 推送

```bash
curl -N http://localhost:3000/api/news/stream
```

输出:
```
: connected

data: {"type":"news","data":[...]}

event: done
data: {"status":"completed","count":20}
```

## 步骤 5: 前端集成

### React 项目

```bash
pnpm add @realtime-rss-hub/react
```

在组件中使用:

```tsx
import { NewsList } from '@realtime-rss-hub/react';

function App() {
  return (
    <div>
      <h1>AI 资讯</h1>
      <NewsList
        endpoint="http://localhost:3000/api/news/stream"
        limit={10}
      />
    </div>
  );
}
```

### 原生 JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>RSS Hub</title>
</head>
<body>
  <div id="news-list"></div>
  
  <script>
    const eventSource = new EventSource('http://localhost:3000/api/news/stream');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'news') {
        const newsList = document.getElementById('news-list');
        
        data.data.forEach(item => {
          const div = document.createElement('div');
          div.innerHTML = `
            <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
            <p>${item.summary}</p>
            <small>${item.source.name} · ${new Date(item.publishedAt).toLocaleString()}</small>
          `;
          newsList.appendChild(div);
        });
      }
    };
  </script>
</body>
</html>
```

## 常见问题

### Q: MongoDB 连接失败？

确保 MongoDB 已启动:

```bash
# macOS/Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Q: 如何添加多个数据源？

在 `sources` 数组中添加多个配置:

```javascript
sources: [
  {
    id: 'infoq',
    name: 'InfoQ',
    url: 'https://www.infoq.cn/feed',
    keywords: ['AI'],
  },
  {
    id: 'oschina',
    name: 'OSCHINA',
    url: 'https://www.oschina.net/blog/rss',
    keywords: ['开源', 'AI'],
  },
]
```

### Q: 如何修改抓取频率？

修改 `scheduler.cron`:

```javascript
scheduler: {
  cron: '*/5 * * * *',  // 每 5 分钟
  // cron: '0 * * * *',  // 每小时
  // cron: '0 0 * * *',  // 每天 0 点
}
```

### Q: 如何禁用定时任务？

```javascript
scheduler: {
  enabled: false,
}
```

手动触发抓取:

```bash
curl -X POST http://localhost:3000/api/news/refresh
```

## 下一步

- 查看 [配置文档](./configuration.md) 了解更多配置选项
- 查看 [API 文档](./api-reference.md) 了解完整 API
- 查看 [示例项目](../examples) 学习最佳实践

## 需要帮助？

- [GitHub Issues](https://github.com/xiaodingyang/realtime-rss-hub/issues)
- [作者博客](https://xiaodingyang.art)
