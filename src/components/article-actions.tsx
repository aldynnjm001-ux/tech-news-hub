"use client";

import { useState, useEffect } from "react";
import { Share2, Bookmark, BookmarkCheck } from "lucide-react";

interface ArticleActionsProps {
  articleId: string;
  articleTitle: string;
}

export default function ArticleActions({ articleId, articleTitle }: ArticleActionsProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Check if article is already saved in localStorage
    const saved = localStorage.getItem("saved_articles");
    if (saved) {
      const savedArticles = JSON.parse(saved);
      if (savedArticles.includes(articleId)) {
        setIsSaved(true);
      }
    }
  }, [articleId]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          text: `شاهد هذا الخبر التقني الرائع: ${articleTitle}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("تم نسخ الرابط للحافظة!");
    }
  };

  const handleSave = () => {
    const saved = localStorage.getItem("saved_articles");
    let savedArticles = saved ? JSON.parse(saved) : [];

    if (isSaved) {
      // Remove from saved
      savedArticles = savedArticles.filter((id: string) => id !== articleId);
      setIsSaved(false);
    } else {
      // Add to saved
      savedArticles.push(articleId);
      setIsSaved(true);
    }

    localStorage.setItem("saved_articles", JSON.stringify(savedArticles));
  };

  return (
    <div className="article-actions">
      <button 
        className="action-btn" 
        aria-label="Share" 
        onClick={handleShare}
        title="مشاركة الخبر"
      >
        <Share2 size={20} />
      </button>
      <button 
        className={`action-btn ${isSaved ? 'text-primary' : ''}`} 
        aria-label="Save" 
        onClick={handleSave}
        title={isSaved ? "إلغاء الحفظ" : "حفظ الخبر"}
      >
        {isSaved ? <BookmarkCheck size={20} color="var(--primary)" /> : <Bookmark size={20} />}
      </button>
    </div>
  );
}
