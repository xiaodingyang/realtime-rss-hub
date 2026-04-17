# 项目结构

```
realtime-rss-hub/
├── packages/                    # Monorepo 包目录
│   ├── server/                  # 后端服务包
│   │   ├── src/
│   │   │   ├── models/          # 数据模型
│   │   │   │   └── News.js      # 新闻模型
│   │   │   ├── services/        # 业务逻辑
│   │   │   │   └── rssService.js # RSS 抓取服务
│   │   │   ├── controllers/     # 控制器
│   │   │   │   └── newsController.js # 新闻控制器
│   │   │   ├── routes/          # 路由
│   │   │   │   └── news.js      # 新闻路由
│   │   │   ├── config/          # 配置
│   │   │   │   └── index.js     # 配置管理
│   │   │   └── index.js         # 主入口
│   │   └── package.json
│   │
│   └── react/                   # React 组件库
│       ├── src/
│       │   ├── useSSENews.ts    # SSE Hook
│       │   ├── NewsCard.tsx     # 新闻卡片组件
│       │   ├── NewsList.tsx     # 新闻列表组件
│       │   └── index.ts         # 导出文件
│       ├── tsconfig.json
│       └── package.json
│
├── examples/                    # 示例项目
│   └── react-demo/              # React 示例
│       ├── src/
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   └── index.css
│       ├── index.html
│       ├── vite.config.js
│       └── package.json
│
├── docs/                        # 文档
│   └── getting-started.md       # 快速开始
│
├── .gitignore
├── .npmrc                       # pnpm 配置
├── LICENSE
├── package.json                 # 根 package.json
└── README.md
```

## 核心模块说明

### packages/server

后端服务核心包，提供：
- RSS Feed 抓取和解析
- SSE 实时推送
- MongoDB 数据存储
- 定时任务调度
- REST API

### packages/react

React 组件库，提供：
- `useSSENews` - SSE 连接 Hook
- `NewsCard` - 新闻卡片组件
- `NewsList` - 新闻列表组件

### examples/react-demo

完整的 React 示例项目，展示如何集成和使用组件库。

## 开发工作流

### 1. 安装依赖

```bash
pnpm install
```

### 2. 开发模式

```bash
# 开发后端服务
pnpm dev:server

# 开发 React 组件
pnpm dev:react
```

### 3. 构建

```bash
# 构建所有包
pnpm build
```

### 4. 测试

```bash
# 运行所有测试
pnpm test
```

## 发布流程

1. 更新版本号
2. 构建所有包
3. 发布到 npm

```bash
# 发布 server 包
cd packages/server
npm publish --access public

# 发布 react 包
cd packages/react
npm publish --access public
```

## 技术选型

- **Monorepo**: pnpm workspace
- **后端**: Node.js + Express + MongoDB
- **前端**: React + TypeScript
- **构建工具**: Rollup (React 组件库)
- **示例项目**: Vite

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request
