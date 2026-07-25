import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { id, type } = await request.json();
    if (!id || !type) return NextResponse.json({ error: 'Missing id or type' }, { status: 400 });

    const validTypes = ['useful', 'mindblown', 'danger'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    const updateData: any = {};
    if (type === 'useful') updateData.reactionUseful = { increment: 1 };
    if (type === 'mindblown') updateData.reactionMindblown = { increment: 1 };
    if (type === 'danger') updateData.reactionDanger = { increment: 1 };

    const updated = await prisma.article.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      reactions: {
        useful: updated.reactionUseful,
        mindblown: updated.reactionMindblown,
        danger: updated.reactionDanger,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
