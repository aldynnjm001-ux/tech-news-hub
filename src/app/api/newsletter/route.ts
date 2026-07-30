import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مطلوب." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير صالح." },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: "هذا البريد مشترك بالفعل." },
          { status: 409 }
        );
      } else {
        // Re-activate subscription
        await prisma.subscriber.update({
          where: { email },
          data: { isActive: true },
        });
        return NextResponse.json({ success: true, message: "تم إعادة تفعيل اشتراكك." });
      }
    }

    await prisma.subscriber.create({
      data: { email },
    });

    return NextResponse.json({ success: true, message: "تم الاشتراك بنجاح." });
  } catch (error: any) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم." },
      { status: 500 }
    );
  }
}
