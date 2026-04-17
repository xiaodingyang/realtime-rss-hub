import React from 'react';
import { useSSENews, UseSSENewsOptions, NewsItem } from './useSSENews';
import { NewsCard } from './NewsCard';

export interface NewsListProps extends UseSSENewsOptions {
  className?: string;
  title?: string;
  emptyText?: string;
  loadingText?: string;
  onItemClick?: (item: NewsItem) => void;
  renderItem?: (item: NewsItem) => React.ReactNode;
}

export const NewsList: React.FC<NewsListProps> = ({
  endpoint,
  limit,
  sourceId,
  tags,
  autoConnect = true,
  className = '',
  title = '最新资讯',
  emptyText = '暂无新闻',
  loadingText = '加载中...',
  onItemClick,
  renderItem,
}) => {
  const { news, loading, error } = useSSENews({
    endpoint,
    limit,
    sourceId,
    tags,
    autoConnect,
  });

  return (
    <div className={`news-list ${className}`} style={{ width: '100%' }}>
      {title && (
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid #eee',
            fontWeight: 600,
            fontSize: '16px',
          }}
        >
          {title}
        </div>
      )}

      {loading && (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            color: '#999',
          }}
        >
          {loadingText}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            color: '#f56c6c',
          }}
        >
          {error.message}
        </div>
      )}

      {!loading && !error && news.length === 0 && (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            color: '#999',
          }}
        >
          {emptyText}
        </div>
      )}

      {!loading && !error && news.length > 0 && (
        <div>
          {news.map((item) =>
            renderItem ? (
              <div key={item._id}>{renderItem(item)}</div>
            ) : (
              <NewsCard key={item._id} item={item} onClick={onItemClick} />
            )
          )}
        </div>
      )}
    </div>
  );
};
