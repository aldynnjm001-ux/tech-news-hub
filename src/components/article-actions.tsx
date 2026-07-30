"use client";

import { useState, useEffect } from "react";
import { Share2, Bookmark, BookmarkCheck } from "lucide-react";

interface ArticleActionsProps {
  articleId: string;
  articleTitle: string;
}

export default function ArticleActions({ articleId, articleTitle }: ArticleActionsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'save' | 'unsave' | 'share' } | null>(null);

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

  const showToast = (message: string, type: 'save' | 'unsave' | 'share') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
      showToast("✅ تم نسخ الرابط للحافظة!", 'share');
    }
  };

  const handleSave = () => {
    const saved = localStorage.getItem("saved_articles");
    let savedArticles = saved ? JSON.parse(saved) : [];

    if (isSaved) {
      // Remove from saved
      savedArticles = savedArticles.filter((id: string) => id !== articleId);
      setIsSaved(false);
      showToast("🗑️ تم إلغاء حفظ الخبر", 'unsave');
    } else {
      // Add to saved
      savedArticles.push(articleId);
      setIsSaved(true);
      showToast("🔖 تم حفظ الخبر! يمكنك إيجاده في صفحة \"أخباري المحفوظة\"", 'save');
    }

    localStorage.setItem("saved_articles", JSON.stringify(savedArticles));
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: toast.type === 'unsave' ? 'var(--foreground)' : 'var(--primary)',
          color: 'white',
          padding: '0.85rem 1.75rem',
          borderRadius: '50px',
          fontWeight: 600,
          fontSize: '0.95rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          zIndex: 9999,
          whiteSpace: 'nowrap',
          animation: 'fadeInUp 0.3s ease',
        }}>
          {toast.message}
        </div>
      )}

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
    </>
  );
}
