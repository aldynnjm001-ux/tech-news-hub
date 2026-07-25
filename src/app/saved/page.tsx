"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/data";
import { Bookmark } from "lucide-react";

// Type matches our Prisma schema (roughly, the parts we need)
interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
}

export default function SavedPage() {
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedArticles = async () => {
      const savedIdsStr = localStorage.getItem("saved_articles");
      if (!savedIdsStr) {
        setIsLoading(false);
        return;
      }
      
      try {
        const savedIds = JSON.parse(savedIdsStr);
        if (savedIds.length === 0) {
          setIsLoading(false);
          return;
        }

        // We fetch the full article details via a new API route 
        // to get the latest data for these IDs from our DB.
        const res = await fetch('/api/get-articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: savedIds })
        });
        
        if (res.ok) {
          const data = await res.json();
          setSavedArticles(data.articles);
        }
      } catch (error) {
        console.error("Failed to load saved articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedArticles();
  }, []);

  if (isLoading) {
    return <div className="container" style={{ padding: "6rem 0", textAlign: "center" }}>جاري التحميل...</div>;
  }

  return (
    <div className="saved-page" style={{ paddingBottom: '4rem' }}>
      <header className="category-header" style={{ padding: '4rem 0', background: 'linear-gradient(to right, rgba(37, 99, 235, 0.1), transparent)', marginBottom: '2rem' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
            أخباري المحفوظة
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
            قائمة بجميع الأخبار التقنية التي قمت بالاحتفاظ بها لقرائتها لاحقاً.
          </p>
        </div>
      </header>

      <div className="container">
        {savedArticles.length > 0 ? (
          <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {savedArticles.map((article) => (
              <Link href={`/article/${article.id}`} key={article.id} className="news-card glass">
                <div className="news-image-container" style={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden' }}>
                  <Image 
                    src={article.imageUrl} 
                    alt={article.title} 
                    fill
                    style={{ objectFit: 'cover' }}
                    className="news-image"
                  />
                </div>
                <div className="news-content" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {categories[article.category as keyof typeof categories] || article.category}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.4 }}>{article.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '1.5rem', flexGrow: 1 }}>{article.excerpt}</p>
                  <time style={{ fontSize: '0.85rem', color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    {new Date(article.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius)' }}>
            <Bookmark size={48} color="var(--muted)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ marginBottom: '1rem' }}>لا توجد أخبار محفوظة</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>لم تقم بحفظ أي خبر بعد. تصفح الموقع واضغط على زر الحفظ للرجوع للأخبار هنا.</p>
            <Link href="/" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}>
              تصفح أحدث الأخبار
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
