import Link from "next/link";
import { categories } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import "./page.css";
import Image from "next/image";
import { TrendingUp, Flame } from "lucide-react";
import PersonalizationModal from "@/components/personalization-modal";
import AdBanner from "@/components/ad-banner";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

function isNew(date: Date): boolean {
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
  return date > threeHoursAgo;
}

export default async function Home() {
  const cookieStore = await cookies();
  const prefCookie = cookieStore.get('preferredCategories');
  
  let preferredCategories: string[] = [];
  if (prefCookie && prefCookie.value) {
    try {
      preferredCategories = JSON.parse(decodeURIComponent(prefCookie.value));
    } catch (e) {
      console.error("Failed to parse preferences cookie", e);
    }
  }

  // Determine the where clause for fetching latest articles
  const whereClause = preferredCategories.length > 0 
    ? { category: { in: preferredCategories } } 
    : {};

  const [articles, trending] = await Promise.all([
    prisma.article.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: 12,
    }),
    prisma.article.findMany({
      orderBy: { viewCount: 'desc' },
      take: 5,
    }),
  ]);

  return (
    <div className="home-page">
      <section className="hero container">
        <div className="hero-content animate-fade-in-up">
          <h1 className="hero-title">ابقَ على اطلاع بأحدث <span className="text-gradient">تقنيات العصر</span></h1>
          <p className="hero-subtitle">تغطية شاملة وموثوقة لآخر تطورات الذكاء الاصطناعي، الأمن السيبراني، الفضاء، العملات الرقمية والمزيد.</p>
        </div>
      </section>

      <section className="ad-section container">
        <AdBanner dataAdSlot="1234567890" dataAdFormat="horizontal" />
      </section>

      <section className="main-content container" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2.5rem', alignItems: 'start' }}>
        {/* Latest News Grid */}
        <div>
          <h2 className="section-title">أحدث الأخبار</h2>
          <div className="news-grid">
            {articles.length > 0 ? (
              articles.map((article) => (
                <Link href={`/article/${article.id}`} key={article.id} className="news-card glass">
                  <div className="news-image-container" style={{ position: 'relative' }}>
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="news-image"
                    />
                    {isNew(article.date) && (
                      <span className="badge-urgent">⚡ عاجل</span>
                    )}
                  </div>
                  <div className="news-content">
                    <span className="news-category">
                      {categories[article.category as keyof typeof categories] || article.category}
                    </span>
                    <h3 className="news-title">{article.title}</h3>
                    <p className="news-excerpt">{article.excerpt}</p>
                    <time className="news-date">
                      {new Date(article.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                  </div>
                </Link>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius)' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--muted)' }}>لا توجد أخبار حتى الآن. قم بتحديث قاعدة البيانات.</p>
                <a 
                  href="/api/fetch-news?force=true" 
                  style={{
                    display: 'inline-block',
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  جلب آخر الأخبار الآن
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Trending Sidebar */}
        <aside className="trending-sidebar">
          <div className="glass trending-card">
            <h3 className="trending-title">
              <Flame size={20} color="#ef4444" />
              الأكثر قراءةً
            </h3>
            {trending.length > 0 ? (
              <ol className="trending-list">
                {trending.map((article, index) => (
                  <li key={article.id} className="trending-item">
                    <span className="trending-num">{index + 1}</span>
                    <div className="trending-info">
                      <Link href={`/article/${article.id}`} className="trending-link">
                        {article.title}
                      </Link>
                      <div className="trending-meta">
                        <span>{categories[article.category as keyof typeof categories] || article.category}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <TrendingUp size={12} />
                          {article.viewCount} قراءة
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', padding: '1rem 0' }}>لا توجد بيانات قراءة بعد.</p>
            )}
          </div>

          {/* Categories Quick Links */}
          <div className="glass trending-card" style={{ marginTop: '1.5rem' }}>
            <h3 className="trending-title">استكشف الأقسام</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(categories).map(([key, label]) => (
                <Link key={key} href={`/category/${key}`} className="category-quick-link">
                  {label}
                </Link>
              ))}
            </div>
            
            <PersonalizationModal />
          </div>
        </aside>
      </section>
    </div>
  );
}
