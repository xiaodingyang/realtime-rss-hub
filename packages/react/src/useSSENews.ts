import { useState, useEffect, useRef } from 'react';

export interface NewsItem {
  _id: string;
  title: string;
  url: string;
  publishedAt: string;
  summary: string;
  source: {
    id: string;
    name: string;
  };
  tags: string[];
  imageUrl?: string;
  author?: string;
}

export interface UseSSENewsOptions {
  endpoint: string;
  limit?: number;
  sourceId?: string;
  tags?: string[];
  autoConnect?: boolean;
}

export interface UseSSENewsReturn {
  news: NewsItem[];
  loading: boolean;
  error: Error | null;
  connect: () => void;
  disconnect: () => void;
}

export function useSSENews(options: UseSSENewsOptions): UseSSENewsReturn {
  const {
    endpoint,
    limit,
    sourceId,
    tags,
    autoConnect = true,
  } = options;

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const buildUrl = () => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (sourceId) params.append('source', sourceId);
    if (tags && tags.length > 0) params.append('tags', tags.join(','));
    
    const query = params.toString();
    return query ? `${endpoint}?${query}` : endpoint;
  };

  const connect = () => {
    if (eventSourceRef.current) {
      return;
    }

    setLoading(true);
    setError(null);

    const url = buildUrl();
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'news') {
          setNews(data.data);
          setLoading(false);
        }
      } catch (err) {
        console.error('[useSSENews] 解析消息失败:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('[useSSENews] SSE 连接失败:', err);
      setError(new Error('SSE 连接失败'));
      setLoading(false);
      eventSource.close();
      eventSourceRef.current = null;
    };

    eventSourceRef.current = eventSource;
  };

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [endpoint, limit, sourceId, tags?.join(',')]);

  return {
    news,
    loading,
    error,
    connect,
    disconnect,
  };
}
