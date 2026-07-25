import { categories } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@prisma/client";

// This becomes a server component
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  
  let searchResults: Article[] = [];

  if (query) {
    searchResults = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { excerpt: { contains: query } },
          { content: { contains: query } },
        ],
      },
      orderBy: { date: 'desc' }
    });
  }

  return (
    <div className="search-page" style={{ paddingBottom: '4rem' }}>
      <header className="category-header" style={{ padding: '4rem 0', background: 'linear-gradient(to right, rgba(37, 99, 235, 0.1), transparent)', marginBottom: '2rem' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
            نتائج البحث
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
            {query ? `البحث عن: "${query}"` : "الرجاء إدخال كلمة بحث"}
          </p>
        </div>
      </header>

      <div className="container">
        {query ? (
          <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {searchResults.length > 0 ? (
              searchResults.map((article) => (
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
              ))
            ) : (
              <p>لم يتم العثور على أية أخبار تطابق بحثك.</p>
            )}
          </div>
        ) : (
          <p>أدخل كلمة في شريط البحث لتظهر النتائج.</p>
        )}
      </div>
    </div>
  );
}
