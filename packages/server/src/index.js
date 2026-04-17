const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { loadConfig } = require('./config');
const newsRoutes = require('./routes/news');
const rssService = require('./services/rssService');

class RSSHub {
  constructor(userConfig = {}) {
    this.config = loadConfig(userConfig);
    this.app = express();
    this.cronJob = null;
    
    // 将配置挂载到 app.locals
    this.app.locals.config = this.config;
  }

  /**
   * 初始化中间件
   */
  setupMiddleware() {
    // CORS
    this.app.use(cors(this.config.server.cors));
    
    // JSON 解析
    this.app.use(express.json());
    
    // 日志
    this.app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * 初始化路由
   */
  setupRoutes() {
    // 健康检查
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      });
    });
    
    // 新闻路由
    this.app.use('/api/news', newsRoutes);
    
    // 404
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Not Found',
      });
    });
  }

  /**
   * 连接数据库
   */
  async connectDatabase() {
    try {
      await mongoose.connect(this.config.database.uri);
      console.log('[Database] MongoDB 连接成功');
    } catch (err) {
      console.error('[Database] MongoDB 连接失败:', err);
      throw err;
    }
  }

  /**
   * 启动定时任务
   */
  startScheduler() {
    if (!this.config.scheduler.enabled) {
      console.log('[Scheduler] 定时任务已禁用');
      return;
    }
    
    const { cron: cronExpression, timezone } = this.config.scheduler;
    
    this.cronJob = cron.schedule(
      cronExpression,
      async () => {
        console.log('[Scheduler] 开始抓取新闻...');
        
        for (const source of this.config.sources) {
          try {
            const result = await rssService.fetchAndSave(source);
            console.log(`[Scheduler] ${source.name}: 新增 ${result.newCount} 条`);
          } catch (err) {
            console.error(`[Scheduler] ${source.name} 抓取失败:`, err.message);
          }
        }
      },
      {
        scheduled: true,
        timezone,
      }
    );
    
    console.log(`[Scheduler] 定时任务已启动: ${cronExpression} (${timezone})`);
  }

  /**
   * 停止定时任务
   */
  stopScheduler() {
    if (this.cronJob) {
      this.cronJob.stop();
      console.log('[Scheduler] 定时任务已停止');
    }
  }

  /**
   * 启动服务器
   */
  async start() {
    try {
      // 连接数据库
      await this.connectDatabase();
      
      // 初始化中间件和路由
      this.setupMiddleware();
      this.setupRoutes();
      
      // 启动定时任务
      this.startScheduler();
      
      // 启动 HTTP 服务器
      const { port } = this.config.server;
      this.server = this.app.listen(port, () => {
        console.log(`[Server] 服务已启动: http://localhost:${port}`);
      });
      
      return this.server;
    } catch (err) {
      console.error('[Server] 启动失败:', err);
      throw err;
    }
  }

  /**
   * 停止服务器
   */
  async stop() {
    try {
      // 停止定时任务
      this.stopScheduler();
      
      // 关闭 HTTP 服务器
      if (this.server) {
        await new Promise((resolve) => this.server.close(resolve));
        console.log('[Server] HTTP 服务已关闭');
      }
      
      // 断开数据库连接
      await mongoose.connection.close();
      console.log('[Database] MongoDB 连接已关闭');
    } catch (err) {
      console.error('[Server] 停止失败:', err);
      throw err;
    }
  }
}

module.exports = RSSHub;
