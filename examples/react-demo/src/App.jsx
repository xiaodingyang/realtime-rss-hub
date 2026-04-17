import React from 'react';
import { NewsList } from '@xdy-npm/realtime-rss-hub-react';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>🚀 Realtime RSS Hub</h1>
        <p>实时 RSS 新闻推送演示</p>
      </header>

      <main className="main">
        <div className="container">
          <div className="content">
            <h2>欢迎使用 Realtime RSS Hub</h2>
            <p>这是一个基于 SSE (Server-Sent Events) 的实时 RSS 新闻推送系统。</p>
            
            <h3>特性</h3>
            <ul>
              <li>📡 实时推送，无需轮询</li>
              <li>🔄 自动抓取最新新闻</li>
              <li>🎯 智能去重和标签提取</li>
              <li>📦 开箱即用的 React 组件</li>
            </ul>
          </div>

          <aside className="sidebar">
            <NewsList
              endpoint="/api/news/stream"
              limit={10}
              title="🤖 AI 资讯"
              emptyText="暂无新闻"
              loadingText="加载中..."
            />
          </aside>
        </div>
      </main>

      <footer className="footer">
        <p>
          Made with ❤️ by{' '}
          <a href="https://xiaodingyang.art" target="_blank" rel="noopener noreferrer">
            肖定阳
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
