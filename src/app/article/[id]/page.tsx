import { categories } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import ArticleActions from "@/components/article-actions";
import ArticleReactions from "@/components/article-reactions";
import AdBanner from "@/components/ad-banner";
import { Metadata } from "next";
import "./page.css";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await prisma.article.findUnique({ where: { id: resolvedParams.id } });
  
  if (!article) return { title: 'الخبر غير موجود' };

  return {
    title: `${article.title} | أخبار التكنولوجيا`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.imageUrl],
      type: 'article',
      publishedTime: new Date(article.date).toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.imageUrl],
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  let article = null;
  try {
    article = await prisma.article.findUnique({
      where: { id: resolvedParams.id }
    });
  } catch (e) {
    console.error("Database connection failed", e);
  }

  if (!article) {
    return <div className="container" style={{ padding: "4rem 0" }}><h2>الخبر غير موجود أو قاعدة البيانات غير متصلة</h2></div>;
  }

  const relatedArticles = await prisma.article.findMany({
    where: { 
      category: article.category,
      id: { not: article.id }
    },
    take: 3,
    orderBy: { date: 'desc' }
  });

  return (
    <article className="article-page">
      <div className="article-hero">
        <div className="container article-header">
          <Link href={`/category/${article.category}`} className="back-link">
            <ArrowRight size={16} /> العودة إلى {categories[article.category as keyof typeof categories] || article.category}
          </Link>
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <time>{new Date(article.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            <ArticleActions articleId={article.id} articleTitle={article.title} />
          </div>
        </div>
      </div>

      <div className="container article-body-container">
        <div className="article-main">
          <div className="article-image-wrapper">
            <Image 
              src={article.imageUrl} 
              alt={article.title} 
              fill
              className="article-cover"
              priority
            />
          </div>
          
          <div className="article-content">
            <p className="lead">{article.excerpt}</p>
            {/* Using dangerouslySetInnerHTML because RSS feeds often return HTML content */}
            <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
          </div>

          <ArticleReactions 
            articleId={article.id}
            initialUseful={article.reactionUseful}
            initialMindblown={article.reactionMindblown}
            initialDanger={article.reactionDanger}
          />

          <div className="article-sources glass">
            <h3>المصادر الموثوقة:</h3>
            <ul>
              <li>
                <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ExternalLink size={16} /> اقرأ الخبر الأصلي من: {article.sourceName}
                </a>
              </li>
            </ul>
          </div>

          <div className="comments-section">
            <h3>التعليقات (نظام تجريبي)</h3>
            <div className="comment-form glass">
              <textarea placeholder="أضف تعليقك هنا..." className="comment-input" rows={3}></textarea>
              <button className="submit-btn">إرسال التعليق</button>
            </div>
            <div className="comments-list">
              <p className="no-comments">كن أول من يعلق على هذا الخبر!</p>
            </div>
          </div>
        </div>

        <aside className="article-sidebar">
          <AdBanner dataAdSlot="0987654321" dataAdFormat="rectangle" />
          
          {relatedArticles.length > 0 && (
            <div className="related-news glass">
              <h3>أخبار ذات صلة</h3>
              <div className="related-list">
                {relatedArticles.map(a => (
                  <Link href={`/article/${a.id}`} key={a.id} className="related-item">
                    <h4>{a.title}</h4>
                    <time>{new Date(a.date).toLocaleDateString('ar-EG')}</time>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
