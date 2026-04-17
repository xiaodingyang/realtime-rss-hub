const rssService = require('../services/rssService');

class NewsController {
  /**
   * SSE 实时推送新闻
   */
  async streamNews(req, res) {
    try {
      // 设置 SSE 响应头
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      
      // 发送初始连接消息
      res.write(`: connected\n\n`);
      
      // 获取查询参数
      const limit = parseInt(req.query.limit) || 20;
      const sourceId = req.query.source || null;
      const tags = req.query.tags ? req.query.tags.split(',') : null;
      
      // 获取最新新闻
      const news = await rssService.getLatestNews({ limit, sourceId, tags });
      
      if (news.length === 0) {
        res.write(`: no news available\n\n`);
        res.write('event: done\ndata: {"status":"no_news"}\n\n');
        res.end();
        return;
      }
      
      // 一次性发送所有新闻
      const payload = JSON.stringify({ type: 'news', data: news });
      res.write(`data: ${payload}\n\n`);
      
      // 发送结束消息
      res.write(`event: done\ndata: {"status":"completed","count":${news.length}}\n\n`);
      res.end();
      
      console.log(`[SSE] 推送完成: ${news.length} 条新闻`);
    } catch (err) {
      console.error('[SSE] 推送失败:', err);
      res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  }

  /**
   * REST API - 获取新闻列表
   */
  async getNews(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const sourceId = req.query.source || null;
      const tags = req.query.tags ? req.query.tags.split(',') : null;
      
      const news = await rssService.getLatestNews({ limit, sourceId, tags });
      
      res.json({
        success: true,
        data: news,
        count: news.length,
      });
    } catch (err) {
      console.error('[API] 获取新闻失败:', err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  /**
   * 手动触发抓取
   */
  async refreshNews(req, res) {
    try {
      const { sources } = req.app.locals.config;
      
      if (!sources || sources.length === 0) {
        return res.status(400).json({
          success: false,
          error: '未配置数据源',
        });
      }
      
      const results = [];
      
      for (const source of sources) {
        const result = await rssService.fetchAndSave(source);
        results.push({
          source: source.name,
          ...result,
        });
      }
      
      res.json({
        success: true,
        data: results,
      });
    } catch (err) {
      console.error('[API] 刷新新闻失败:', err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
}

module.exports = new NewsController();
