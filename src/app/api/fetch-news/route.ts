import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { prisma } from '@/lib/prisma';

// This is a simple implementation for parsing RSS
// To run this endpoint securely, you should check for a secret token in headers or query params
// For demonstration, we'll allow it to run directly.

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'creator', 'media:content', 'enclosure'],
  }
});

// Using Google News RSS (Very reliable and avoids 404 errors)
// URLs must be properly encoded to prevent "unescaped characters" error in Node.js
const RSS_SOURCES = [
  { url: 'https://aitnews.com/feed/', name: 'البوابة العربية للأخبار التقنية' },
  { url: 'https://www.tech-wd.com/wd/feed/', name: 'عالم التقنية' },
  { url: `https://news.google.com/rss/search?q=${encodeURIComponent('الأمن السيبراني اختراق ثغرات')}&hl=ar&gl=SA&ceid=SA:ar`, name: 'جوجل - أمن سيبراني', forcedCategory: 'cybersecurity' },
  { url: `https://news.google.com/rss/search?q=${encodeURIComponent('الفضاء ناسا مركبة فضائية اكتشاف علمي')}&hl=ar&gl=SA&ceid=SA:ar`, name: 'جوجل - فضاء وعلوم', forcedCategory: 'space' },
  { url: `https://news.google.com/rss/search?q=${encodeURIComponent('بيتكوين عملات رقمية بلوكتشين Web3')}&hl=ar&gl=SA&ceid=SA:ar`, name: 'جوجل - عملات رقمية', forcedCategory: 'crypto' },
  { url: `https://news.google.com/rss/search?q=${encodeURIComponent('ألعاب PlayStation Xbox Nintendo')}&hl=ar&gl=SA&ceid=SA:ar`, name: 'جوجل - ألعاب', forcedCategory: 'gaming' },
  { url: `https://news.google.com/rss/search?q=${encodeURIComponent('جوجل أبل ميتا مايكروسوفت تقنية عالمية')}&hl=ar&gl=SA&ceid=SA:ar`, name: 'جوجل - تقنيات عالمية', forcedCategory: 'global' },
];

function determineCategory(title: string, excerpt: string): string {
  const text = (title + " " + excerpt).toLowerCase();
  if (text.includes('ذكاء') || text.includes('اصطناعي') || text.includes('ai') || text.includes('روبوت') || text.includes('chatgpt') || text.includes('جيميني') || text.includes('نموذج لغوي')) return 'ai';
  if (text.includes('اختراق') || text.includes('ثغرة') || text.includes('سيبراني') || text.includes('أمن') || text.includes('فيروس') || text.includes('قراصنة') || text.includes('تشفير') || text.includes('برمجية خبيثة')) return 'cybersecurity';
  if (text.includes('فضاء') || text.includes('ناسا') || text.includes('مركبة') || text.includes('كوكب') || text.includes('نجم') || text.includes('مدار') || text.includes('علم') || text.includes('اكتشاف')) return 'space';
  if (text.includes('بيتكوين') || text.includes('عملة رقمية') || text.includes('بلوكتشين') || text.includes('web3') || text.includes('crypto') || text.includes('إيثريوم')) return 'crypto';
  if (text.includes('لعبة') || text.includes('ألعاب') || text.includes('playstation') || text.includes('xbox') || text.includes('nintendo') || text.includes('gaming') || text.includes('واقع افتراضي')) return 'gaming';
  if (text.includes('هاتف') || text.includes('لابتوب') || text.includes('معالج') || text.includes('أبل') || text.includes('سامسونج') || text.includes('شاشة') || text.includes('جهاز') || text.includes('ايفون')) return 'hardware';
  if (text.includes('جوجل') || text.includes('ميتا') || text.includes('مايكروسوفت') || text.includes('أمازون') || text.includes('تيك توك') || text.includes('تويتر') || text.includes('شركة تقنية')) return 'global';
  return 'software';
}

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const force = searchParams.get('force') === 'true';

    if (force) {
      await prisma.article.deleteMany({});
    }

    const newArticles = [];
    const errors = [];

    const PLACEHOLDERS: Record<string, string> = {
      ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      cybersecurity: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      hardware: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      software: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      space: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      crypto: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gaming: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      global: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    };

    for (const source of RSS_SOURCES) {
      try {
        const feed = await parser.parseURL(source.url);
        
        // Fetch up to 20 items from these rich sources
        const topItems = feed.items.slice(0, 20);

        for (const item of topItems) {
          const exists = await prisma.article.findUnique({
            where: { sourceUrl: item.link! }
          });

          if (!exists) {
            let excerpt = item.contentSnippet?.substring(0, 150) + '...' || 'لا يوجد ملخص متاح.';
            
            // Allow bypassing auto-categorization if a source provides a forcedCategory
            const autoCategory = (source as any).forcedCategory || determineCategory(item.title || '', excerpt);
            
            let imageUrl = item.enclosure?.url || (item as any)['media:content']?.$?.url;
            
            if (!imageUrl && item.content) {
              const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
              if (imgMatch) imageUrl = imgMatch[1];
            }
            
            if (!imageUrl) {
              imageUrl = PLACEHOLDERS[autoCategory];
            }

            const article = await prisma.article.create({
              data: {
                title: item.title || 'بدون عنوان',
                excerpt: excerpt,
                content: item['content:encoded'] || item.content || excerpt,
                category: autoCategory,
                date: item.pubDate ? new Date(item.pubDate) : new Date(),
                imageUrl: imageUrl,
                sourceUrl: item.link!,
                sourceName: source.name,
              }
            });
            newArticles.push(article);
          }
        }
      } catch (e: any) {
        errors.push({ source: source.url, error: e.message });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `تم جلب وإضافة ${newArticles.length} مقالات جديدة بنجاح.`,
      addedArticles: newArticles.length,
      errors 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
