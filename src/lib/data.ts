export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'ai' | 'cybersecurity' | 'hardware' | 'software';
  date: string; // ISO format
  imageUrl: string;
  sources: { name: string; url: string }[];
}

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "اكتشاف ثغرة خطيرة في معالجات حديثة تهدد سرية البيانات",
    excerpt: "تم اكتشاف ثغرة أمنية جديدة في معالجات الجيل الأخير تتيح للمخترقين الوصول إلى بيانات حساسة. الشركات تعمل على إصدار تصحيحات عاجلة.",
    content: "تفاصيل الخبر الكاملة هنا... (محتوى وهمي يعبر عن اكتشاف ثغرة)",
    category: "cybersecurity",
    date: "2026-07-15T10:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    sources: [{ name: "TechCrunch", url: "https://techcrunch.com" }]
  },
  {
    id: "2",
    title: "إطلاق نموذج ذكاء اصطناعي جديد يتفوق في التفكير المنطقي",
    excerpt: "أعلنت شركة كبرى عن نموذج لغوي جديد قادر على حل المعضلات الرياضية المعقدة وكتابة أكواد برمجية بكفاءة غير مسبوقة.",
    content: "تفاصيل الخبر الكاملة هنا... (محتوى وهمي يعبر عن تطور الذكاء الاصطناعي)",
    category: "ai",
    date: "2026-07-18T14:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    sources: [{ name: "Wired", url: "https://wired.com" }]
  },
  {
    id: "3",
    title: "الكشف عن بطاقات رسوميات جديدة بتقنية تبريد سائلة مدمجة",
    excerpt: "تسريبات تؤكد إطلاق سلسلة جديدة من كروت الشاشة الموجهة للاعبين وصناع المحتوى مزودة بتبريد سائل داخلي لا يحتاج صيانة.",
    content: "تفاصيل الخبر الكاملة هنا... (محتوى وهمي)",
    category: "hardware",
    date: "2026-06-25T09:15:00Z",
    imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    sources: [{ name: "The Verge", url: "https://theverge.com" }]
  },
  {
    id: "4",
    title: "تحديث ضخم لنظام التشغيل يركز على الخصوصية والذكاء الاصطناعي",
    excerpt: "النسخة القادمة من نظام التشغيل الشهير ستتضمن أدوات ذكاء اصطناعي مدمجة في النواة مع تعزيزات قوية لخصوصية المستخدم.",
    content: "تفاصيل الخبر الكاملة هنا... (محتوى وهمي)",
    category: "software",
    date: "2026-06-10T11:20:00Z",
    imageUrl: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    sources: [{ name: "CNET", url: "https://cnet.com" }]
  }
];

export const categories = {
  ai: "الذكاء الاصطناعي",
  cybersecurity: "الأمن السيبراني",
  hardware: "العتاد والأجهزة",
  software: "البرمجيات",
  space: "الفضاء والعلوم",
  crypto: "العملات الرقمية",
  gaming: "الألعاب والترفيه",
  global: "تقنيات عالمية",
};
