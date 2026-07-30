import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function checkAuth(request: Request): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return false;

  return authHeader === `Bearer ${adminPassword}`;
}

// GET: Get dashboard stats and data
export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const [
      articlesCount,
      commentsCount,
      subscribersCount,
      messagesCount,
      unreadMessagesCount,
      recentArticles,
      subscribers,
      messages,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.comment.count(),
      prisma.subscriber.count({ where: { isActive: true } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.article.findMany({
        orderBy: { date: "desc" },
        take: 20,
        select: {
          id: true,
          title: true,
          category: true,
          date: true,
          viewCount: true,
          sourceName: true,
        },
      }),
      prisma.subscriber.findMany({
        orderBy: { subscribedAt: "desc" },
        take: 50,
      }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    ]);

    return NextResponse.json({
      stats: {
        articles: articlesCount,
        comments: commentsCount,
        subscribers: subscribersCount,
        messages: messagesCount,
        unreadMessages: unreadMessagesCount,
      },
      recentArticles,
      subscribers,
      messages,
    });
  } catch (error: any) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete an article
export async function DELETE(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("articleId");
    const messageId = searchParams.get("messageId");

    if (articleId) {
      await prisma.article.delete({ where: { id: articleId } });
      return NextResponse.json({ success: true, message: "تم حذف المقال." });
    }

    if (messageId) {
      await prisma.contactMessage.delete({ where: { id: messageId } });
      return NextResponse.json({ success: true, message: "تم حذف الرسالة." });
    }

    return NextResponse.json({ error: "يرجى تحديد عنصر للحذف." }, { status: 400 });
  } catch (error: any) {
    console.error("Admin delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Mark message as read
export async function PATCH(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { messageId } = body;

    if (messageId) {
      await prisma.contactMessage.update({
        where: { id: messageId },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "يرجى تحديد الرسالة." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
