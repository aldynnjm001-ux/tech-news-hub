import { categories } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import "./page.css";

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug as keyof typeof categories;
  const categoryName = categories[slug];
  
  const articles = await prisma.article.findMany({
    where: { category: slug },
    orderBy: { date: 'desc' },
  });

  if (!categoryName) {
    return <div className="container" style={{ padding: "4rem 0" }}><h2>القسم غير موجود</h2></div>;
  }

  return (
    <div className="category-page">
      <header className="category-header">
        <div className="container">
          <h1 className="category-title">{categoryName}</h1>
          <p className="category-subtitle">أحدث الأخبار والتطورات في مجال {categoryName}</p>
        </div>
      </header>

      <div className="container">
        <div className="filter-bar glass">
          <span className="filter-label">تصفية:</span>
          <button className="filter-btn active">الأحدث (آخر شهرين)</button>
          <button className="filter-btn">الأكثر قراءة</button>
        </div>

        <div className="news-grid">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link href={`/article/${article.id}`} key={article.id} className="news-card glass">
                <div className="news-image-container">
                  <Image 
                    src={article.imageUrl} 
                    alt={article.title} 
                    fill
                    className="news-image"
                  />
                </div>
                <div className="news-content">
                  <h3 className="news-title">{article.title}</h3>
                  <p className="news-excerpt">{article.excerpt}</p>
                  <time className="news-date">
                    {new Date(article.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                </div>
              </Link>
            ))
          ) : (
            <p>لا توجد أخبار حالياً في هذا القسم.</p>
          )}
        </div>
      </div>
    </div>
  );
}
