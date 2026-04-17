const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// SSE 实时推送
router.get('/stream', newsController.streamNews.bind(newsController));

// REST API - 获取新闻列表
router.get('/', newsController.getNews.bind(newsController));

// 手动刷新
router.post('/refresh', newsController.refreshNews.bind(newsController));

module.exports = router;
