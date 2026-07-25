import Link from "next/link";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-about">
          <h2 className="text-gradient">أخبار التكنولوجيا</h2>
          <p>المصدر الأول لآخر التطورات التقنية من مصادر موثوقة. نسعى لنشر المعرفة الرقمية وتعزيز الوعي التقني.</p>
        </div>
        
        <div className="footer-links">
          <h3>أقسام الموقع</h3>
          <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <li><Link href="/category/ai">الذكاء الاصطناعي</Link></li>
            <li><Link href="/category/cybersecurity">الأمن السيبراني</Link></li>
            <li><Link href="/category/hardware">العتاد والأجهزة</Link></li>
            <li><Link href="/category/software">البرمجيات</Link></li>
            <li><Link href="/category/space">الفضاء والعلوم</Link></li>
            <li><Link href="/category/crypto">العملات الرقمية</Link></li>
            <li><Link href="/category/gaming">الألعاب</Link></li>
            <li><Link href="/category/global">تقنيات عالمية</Link></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h3>تواصل معنا</h3>
          <p>للإعلان والرعاية:</p>
          <p>ads@technewshub.com</p>
          <p>دعم الدفع عبر: بنك الكريمي / التحويل البنكي</p>
        </div>
      </div>
      
      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} أخبار التكنولوجيا. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}
