import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { prisma } from '@/lib/prisma';

export const maxDuration = 60; // Set max duration for Vercel Hobby

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'creator', 'media:content', 'enclosure'],
  }
});

const RSS_SOURCES = [
  // Arabic tech sources (general & specific)
  { url: 'https://aitnews.com/feed/', name: 'البوابة العربية للأخبار التقنية' },
  { url: 'https://www.tech-wd.com/wd/feed/', name: 'عالم التقنية' },
  { url: 'https://www.unlimit-tech.com/feed/', name: 'التقنية بلا حدود' },
  { url: 'https://www.arabhardware.net/feed/', name: 'عرب هاردوير' },
  { url: 'https://arabic.cnn.com/api/v1/rss/scitech/rss.xml', name: 'CNN بالعربية - علوم وتكنولوجيا' },
  { url: 'https://www.skynewsarabia.com/rss/technology', name: 'سكاي نيوز عربية - تكنولوجيا' },
  { url: 'https://www.alhurra.com/api/z$q_o_q_kvy', name: 'الحرة - علوم وتكنولوجيا' },
  { url: 'https://ar.cointelegraph.com/rss', name: 'كوين تيليغراف - العملات الرقمية', forcedCategory: 'crypto' },
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
    const authHeader = request.headers.get('authorization');
    
    // Validate CRON_SECRET on production
    if (process.env.NODE_ENV !== 'development') {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    const searchParams = new URL(request.url).searchParams;
    const force = searchParams.get('force') === 'true';

    // Allow force deletion only in development to prevent data loss
    if (force && process.env.NODE_ENV === 'development') {
      await prisma.article.deleteMany({});
    }

    const newArticles = [];
    const errors = [];

    // Multiple varied images per category to avoid repetition
    const PLACEHOLDER_POOLS: Record<string, string[]> = {
      ai: [
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
        'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80',
        'https://images.unsplash.com/photo-1716855650939-a9498b9e3d86?w=800&q=80',
        'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80',
        'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&q=80',
      ],
      cybersecurity: [
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
        'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80',
        'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&q=80',
        'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80',
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
      ],
      hardware: [
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
        'https://images.unsplash.com/photo-1591238372338-f1c049bdf4db?w=800&q=80',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80',
        'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&q=80',
      ],
      software: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
        'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80',
      ],
      space: [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
        'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
        'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80',
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
        'https://images.unsplash.com/photo-1541873676-a18131494184?w=800&q=80',
        'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
      ],
      crypto: [
        'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&q=80',
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
        'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80',
        'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&q=80',
        'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80',
        'https://images.unsplash.com/photo-1591994843349-f415893b3a6b?w=800&q=80',
      ],
      gaming: [
        'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
        'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80',
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80',
        'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=800&q=80',
        'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&q=80',
      ],
      global: [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
        'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80',
        'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=800&q=80',
        'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&q=80',
      ],
    };

    // Deterministic hash to pick a consistent image per article (based on URL)
    function pickPlaceholder(category: string, seed: string): string {
      const pool = PLACEHOLDER_POOLS[category] || PLACEHOLDER_POOLS['global'];
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
      }
      return pool[Math.abs(hash) % pool.length];
    }

    for (const source of RSS_SOURCES) {
      try {
        const feed = await parser.parseURL(source.url);
        
        // Fetch up to 5 items to avoid Vercel timeout on Hobby plan
        const topItems = feed.items.slice(0, 5);

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
            
            // Removed HTML scraping step here to save execution time on Vercel
            
            if (!imageUrl) {
              imageUrl = pickPlaceholder(autoCategory, item.link || item.title || '');
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

    // Cleanup old articles (older than 60 days) to save database space
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    let deletedOldArticles = 0;
    try {
      const deleteResult = await prisma.article.deleteMany({
        where: {
          date: {
            lt: sixtyDaysAgo
          }
        }
      });
      deletedOldArticles = deleteResult.count;
    } catch (e) {
      console.error("Failed to cleanup old articles:", e);
    }

    return NextResponse.json({ 
      success: true, 
      message: `تم جلب وإضافة ${newArticles.length} مقالات جديدة بنجاح. وتم حذف ${deletedOldArticles} مقال قديم.`,
      addedArticles: newArticles.length,
      deletedArticles: deletedOldArticles,
      errors 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
