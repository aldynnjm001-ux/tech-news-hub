import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ success: false, error: "Invalid IDs" }, { status: 400 });
    }

    const articles = await prisma.article.findMany({
      where: {
        id: { in: ids }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
