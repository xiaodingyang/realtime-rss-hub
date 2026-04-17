const Parser = require('rss-parser');
const crypto = require('crypto');
const News = require('../models/News');

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; RealtimeRSSHub/1.0)',
  },
});

class RSSService {
  /**
   * 从 RSS Feed 抓取新闻
   * @param {Object} source - 数据源配置
   * @param {string} source.id - 数据源 ID
   * @param {string} source.name - 数据源名称
   * @param {string} source.url - RSS Feed URL
   * @param {number} source.limit - 抓取数量限制
   * @param {string[]} source.keywords - 关键词过滤
   * @returns {Promise<Array>}
   */
  async fetchFromRSS(source) {
    try {
      const feed = await parser.parseURL(source.url);
      
      const articles = feed.items
        .slice(0, source.limit || 20)
        .map(item => this.transformRSSItem(item, source))
        .filter(article => this.matchKeywords(article, source.keywords));
      
      return articles;
    } catch (err) {
      console.error(`[RSS] 抓取失败 [${source.name}]:`, err.message);
      return [];
    }
  }

  /**
   * 转换 RSS 条目为标准格式
   */
  transformRSSItem(item, source) {
    return {
      title: item.title || '',
      url: item.link || '',
      publishedAt: new Date(item.pubDate || item.isoDate || Date.now()),
      summary: item.contentSnippet || item.content?.substring(0, 200) || '',
      content: item.content || '',
      source: {
        id: source.id,
        name: source.name,
      },
      tags: this.extractTags(item, source.keywords),
      imageUrl: item.enclosure?.url || item['media:thumbnail']?.$?.url || '',
      author: item.creator || item.author || '',
      articleId: this.generateArticleId(item.link),
    };
  }

  /**
   * 生成文章唯一 ID（URL MD5）
   */
  generateArticleId(url) {
    return crypto.createHash('md5').update(url).digest('hex');
  }

  /**
   * 提取标签
   */
  extractTags(item, keywords = []) {
    const text = `${item.title} ${item.contentSnippet || ''}`.toLowerCase();
    return keywords.filter(keyword => text.includes(keyword.toLowerCase()));
  }

  /**
   * 关键词匹配过滤
   */
  matchKeywords(article, keywords) {
    if (!keywords || keywords.length === 0) return true;
    
    const text = `${article.title} ${article.summary}`.toLowerCase();
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
  }

  /**
   * 保存新闻（带去重）
   */
  async saveNews(articles) {
    const result = { added: 0, duplicates: 0, errors: 0 };
    
    for (const article of articles) {
      try {
        const exists = await News.findOne({ articleId: article.articleId });
        
        if (!exists) {
          await News.create(article);
          result.added++;
        } else {
          result.duplicates++;
        }
      } catch (err) {
        result.errors++;
        console.error(`[RSS] 保存失败: ${article.title}`, err.message);
      }
    }
    
    return result;
  }

  /**
   * 获取最新新闻
   */
  async getLatestNews(options = {}) {
    const {
      limit = 20,
      sourceId = null,
      tags = null,
    } = options;
    
    const query = {};
    if (sourceId) query['source.id'] = sourceId;
    if (tags && tags.length > 0) query.tags = { $in: tags };
    
    return await News.find(query)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .select('-__v')
      .lean();
  }

  /**
   * 抓取并保存（完整流程）
   */
  async fetchAndSave(source) {
    console.log(`[RSS] 开始抓取 [${source.name}] - ${new Date().toLocaleString('zh-CN')}`);
    
    const articles = await this.fetchFromRSS(source);
    
    if (articles.length === 0) {
      console.log(`[RSS] 未抓取到新闻 [${source.name}]`);
      return { added: 0, duplicates: 0, errors: 0 };
    }
    
    const result = await this.saveNews(articles);
    console.log(`[RSS] 抓取完成 [${source.name}]: 新增 ${result.added} 条，重复 ${result.duplicates} 条`);
    
    return result;
  }
}

module.exports = new RSSService();
