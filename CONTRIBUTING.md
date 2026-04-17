# Contributing to Realtime RSS Hub

感谢你考虑为 Realtime RSS Hub 做贡献！

## 开发环境

1. Fork 并克隆仓库
```bash
git clone https://github.com/YOUR_USERNAME/realtime-rss-hub.git
cd realtime-rss-hub
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
# 后端服务
pnpm dev:server

# React 组件开发
pnpm dev:react
```

## 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具链相关

示例：
```
feat: 添加多数据源支持
fix: 修复 SSE 连接超时问题
docs: 更新 API 文档
```

## Pull Request 流程

1. 创建功能分支 (`git checkout -b feat/amazing-feature`)
2. 提交更改 (`git commit -m 'feat: 添加某个功能'`)
3. 推送到分支 (`git push origin feat/amazing-feature`)
4. 创建 Pull Request

## 代码规范

- 使用 ESLint 和 Prettier
- 保持代码简洁易读
- 添加必要的注释
- 编写测试用例

## 问题反馈

- 使用 GitHub Issues 报告 Bug
- 提供详细的复现步骤
- 附上错误日志和环境信息

## 许可

提交代码即表示同意以 MIT 许可证发布。
