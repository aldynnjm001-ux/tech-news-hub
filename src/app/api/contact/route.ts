import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير صالح." },
        { status: 400 }
      );
    }

    await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    return NextResponse.json({ success: true, message: "تم إرسال الرسالة بنجاح." });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في الخادم. حاول مرة أخرى." },
      { status: 500 }
    );
  }
}
