# 多阶段构建
FROM node:18-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm

WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/server/package.json ./packages/server/
COPY packages/react/package.json ./packages/react/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY packages/server ./packages/server
COPY packages/react ./packages/react

# 构建 React 组件库
RUN pnpm --filter @realtime-rss-hub/react build

# 生产镜像
FROM node:18-alpine

# 安装 pnpm
RUN npm install -g pnpm

WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/server/package.json ./packages/server/

# 只安装生产依赖
RUN pnpm install --prod --frozen-lockfile

# 从构建阶段复制服务端代码
COPY --from=builder /app/packages/server/src ./packages/server/src

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["pnpm", "--filter", "@realtime-rss-hub/server", "start"]
