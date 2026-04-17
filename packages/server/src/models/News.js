const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: Date,
    required: true,
  },
  summary: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  source: {
    id: String,
    name: String,
  },
  tags: [String],
  imageUrl: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: '',
  },
  articleId: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

// 索引优化
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ articleId: 1 });
newsSchema.index({ 'source.id': 1, publishedAt: -1 });
newsSchema.index({ tags: 1 });

const News = mongoose.model('News', newsSchema);

module.exports = News;
