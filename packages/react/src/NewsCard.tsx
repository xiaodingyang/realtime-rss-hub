import React from 'react';
import { NewsItem } from './useSSENews';

export interface NewsCardProps {
  item: NewsItem;
  className?: string;
  onClick?: (item: NewsItem) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ item, className = '', onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    } else {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    if (hours < 48) return '昨天';
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
  };

  return (
    <div
      className={`news-card ${className}`}
      onClick={handleClick}
      style={{
        padding: '12px',
        borderBottom: '1px solid #eee',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f5f5f5';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <h3
        style={{
          fontSize: '14px',
          fontWeight: 500,
          margin: '0 0 8px 0',
          lineHeight: '1.4',
          color: '#333',
        }}
      >
        {item.title}
      </h3>
      
      {item.summary && (
        <p
          style={{
            fontSize: '12px',
            color: '#666',
            margin: '0 0 8px 0',
            lineHeight: '1.5',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {item.summary}
        </p>
      )}
      
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#999',
        }}
      >
        <span>{item.source.name}</span>
        <span>{formatDate(item.publishedAt)}</span>
      </div>
      
      {item.tags && item.tags.length > 0 && (
        <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                backgroundColor: '#f0f0f0',
                borderRadius: '3px',
                color: '#666',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
