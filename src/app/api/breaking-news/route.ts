import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get articles published in the last 6 hours
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

    const articles = await prisma.article.findMany({
      where: {
        date: { gte: sixHoursAgo }
      },
      select: { id: true, title: true },
      orderBy: { date: 'desc' },
      take: 8,
    });

    // If no articles in last 6 hours, fall back to the latest 5
    if (articles.length === 0) {
      const latest = await prisma.article.findMany({
        select: { id: true, title: true },
        orderBy: { date: 'desc' },
        take: 5,
      });
      return NextResponse.json({ articles: latest });
    }

    return NextResponse.json({ articles });
  } catch (error: any) {
    return NextResponse.json({ articles: [], error: error.message });
  }
}
