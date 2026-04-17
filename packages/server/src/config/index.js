require('dotenv').config();

const defaultConfig = {
  // 数据库配置
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/rss-hub',
  },
  
  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
    },
  },
  
  // 数据源配置
  sources: [
    {
      id: 'infoq',
      name: 'InfoQ',
      url: 'https://www.infoq.cn/feed',
      limit: 20,
      keywords: ['AI', '人工智能', '机器学习', 'GPT', 'LLM'],
    },
  ],
  
  // 定时任务配置
  scheduler: {
    enabled: process.env.SCHEDULER_ENABLED !== 'false',
    cron: process.env.SCHEDULER_CRON || '*/10 * * * *', // 每 10 分钟
    timezone: process.env.SCHEDULER_TIMEZONE || 'Asia/Shanghai',
  },
};

/**
 * 加载配置
 * 优先级: 用户配置 > 环境变量 > 默认配置
 */
function loadConfig(userConfig = {}) {
  return {
    database: {
      ...defaultConfig.database,
      ...userConfig.database,
    },
    server: {
      ...defaultConfig.server,
      ...userConfig.server,
    },
    sources: userConfig.sources || defaultConfig.sources,
    scheduler: {
      ...defaultConfig.scheduler,
      ...userConfig.scheduler,
    },
  };
}

module.exports = {
  defaultConfig,
  loadConfig,
};
