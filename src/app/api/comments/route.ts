import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET comments for an article
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json({ error: 'articleId is required' }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ comments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new comment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { articleId, content, author } = body;

    if (!articleId || !content || content.trim() === '') {
      return NextResponse.json({ error: 'articleId and content are required' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        author: author || 'زائر',
        articleId
      }
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
