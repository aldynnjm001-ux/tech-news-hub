import { categories } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import "./page.css";

import Pagination from "@/components/pagination";
import { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug as keyof typeof categories;
  const categoryName = categories[slug];

  if (!categoryName) {
    return { title: 'القسم غير موجود' };
  }

  return {
    title: `${categoryName} | أخبار التكنولوجيا`,
    description: `أحدث الأخبار والتطورات التقنية في قسم ${categoryName}`,
    openGraph: {
      title: `${categoryName} | أخبار التكنولوجيا`,
      description: `أحدث الأخبار والتطورات التقنية في قسم ${categoryName}`,
    },
    twitter: {
      title: `${categoryName} | أخبار التكنولوجيا`,
      description: `أحدث الأخبار والتطورات التقنية في قسم ${categoryName}`,
    }
  };
}

export default async function CategoryPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug as keyof typeof categories;
  const categoryName = categories[slug];
  
  const page = Number(resolvedSearchParams.page) || 1;
  const filter = resolvedSearchParams.filter === 'popular' ? 'popular' : 'recent';
  const ITEMS_PER_PAGE = 12;
  
  let articles: any[] = [];
  let totalArticles = 0;
  
  try {
    const where = { category: slug };
    
    const [fetchedArticles, count] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: filter === 'popular' ? { viewCount: 'desc' } : { date: 'desc' },
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      }),
      prisma.article.count({ where })
    ]);
    
    articles = fetchedArticles;
    totalArticles = count;
  } catch (e) {
    console.error("Database connection failed", e);
  }

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
          <Link href={`/category/${slug}?filter=recent`} className={`filter-btn ${filter === 'recent' ? 'active' : ''}`}>الأحدث</Link>
          <Link href={`/category/${slug}?filter=popular`} className={`filter-btn ${filter === 'popular' ? 'active' : ''}`}>الأكثر قراءة</Link>
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
        
        <div style={{ marginTop: '3rem' }}>
          <Pagination 
            currentPage={page} 
            totalPages={Math.ceil(totalArticles / ITEMS_PER_PAGE)} 
            basePath={`/category/${slug}`}
            queryParams={`filter=${filter}`}
          />
        </div>
      </div>
    </div>
  );
}
