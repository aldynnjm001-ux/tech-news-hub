"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

interface BreakingArticle {
  id: string;
  title: string;
}

export default function BreakingNewsBar() {
  const [articles, setArticles] = useState<BreakingArticle[]>([]);

  useEffect(() => {
    // Fetch the latest 5 articles from the last 6 hours to use as "breaking"
    fetch("/api/breaking-news")
      .then((r) => r.json())
      .then((data) => setArticles(data.articles || []));
  }, []);

  if (articles.length === 0) return null;

  const ticker = articles.map((a) => a.title).join("   ◈   ");

  return (
    <div className="breaking-bar">
      <span className="breaking-label">
        <Zap size={14} fill="currentColor" />
        عاجل
      </span>
      <div className="breaking-track-wrapper">
        <div className="breaking-track">
          <span className="ticker-content">{ticker}</span>
          <span className="ticker-content">{ticker}</span>
        </div>
      </div>
      <style>{`
        .breaking-bar {
          background: linear-gradient(90deg, #dc2626, #b91c1c);
          color: white;
          display: flex;
          align-items: center;
          height: 40px;
          overflow: hidden;
          font-size: 0.875rem;
          font-weight: 600;
          position: relative;
          z-index: 49;
        }
        .breaking-label {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 1.25rem;
          white-space: nowrap;
          border-left: 1px solid rgba(255,255,255,0.3);
          height: 100%;
          background: rgba(0,0,0,0.2);
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          flex-shrink: 0;
          z-index: 2;
        }
        .breaking-track-wrapper {
          flex: 1;
          overflow: hidden;
          height: 100%;
          display: flex;
          align-items: center;
          position: relative;
        }
        .breaking-track {
          display: flex;
          white-space: nowrap;
          width: fit-content;
          animation: ticker-rtl 30s linear infinite;
        }
        .ticker-content {
          padding-left: 50px;
        }
        /* In RTL, the content aligns to the right. We want it to move rightwards, meaning positive X translation */
        @keyframes ticker-rtl {
          0% { transform: translateX(0%); }
          100% { transform: translateX(50%); }
        }
        @media (max-width: 768px) {
          .breaking-bar { font-size: 0.8rem; }
          .breaking-label { padding: 0 0.75rem; font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}
