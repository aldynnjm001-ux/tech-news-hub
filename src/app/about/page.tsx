import { Metadata } from "next";
import Link from "next/link";
import { Eye, Target, Shield, Zap, Globe, Clock, Users, Newspaper } from "lucide-react";
import "./page.css";

export const metadata: Metadata = {
  title: "من نحن | أخبار التكنولوجيا",
  description: "تعرّف على فريق أخبار التكنولوجيا - المصدر الأول لأحدث الأخبار والتطورات التقنية في العالم العربي.",
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container animate-fade-in-up">
          <h1><span className="text-gradient">من نحن</span></h1>
          <p>
            نحن فريق من عشّاق التكنولوجيا نسعى لتقديم أحدث الأخبار التقنية بلغة عربية واضحة
            ومحتوى موثوق من أفضل المصادر العالمية والعربية.
          </p>
        </div>
      </section>

      <div className="container">
        {/* Mission & Vision Cards */}
        <div className="about-cards">
          <div className="about-card glass">
            <div className="about-card-icon blue">
              <Target size={28} />
            </div>
            <h3>رسالتنا</h3>
            <p>
              نشر المعرفة التقنية والوعي الرقمي في العالم العربي من خلال تقديم محتوى إخباري
              تقني دقيق وموثوق ومحدّث على مدار الساعة، يُمكّن القارئ العربي من مواكبة
              أحدث التطورات في عالم التكنولوجيا.
            </p>
          </div>

          <div className="about-card glass">
            <div className="about-card-icon purple">
              <Eye size={28} />
            </div>
            <h3>رؤيتنا</h3>
            <p>
              أن نكون المنصة العربية الأولى والأكثر موثوقية لأخبار التكنولوجيا، حيث يجد
              كل قارئ عربي المعلومة التقنية التي يبحث عنها بأسلوب سهل ومبسّط وبتغطية
              شاملة لجميع المجالات التقنية.
            </p>
          </div>

          <div className="about-card glass">
            <div className="about-card-icon green">
              <Shield size={28} />
            </div>
            <h3>مبدأنا</h3>
            <p>
              نؤمن بأهمية المصداقية والدقة في النقل. كل خبر يُنشر على منصتنا يمرّ
              بعملية تحقق من مصادر متعددة وموثوقة. نحرص على تقديم المعلومة الصحيحة
              بعيداً عن الإثارة والعناوين المضللة.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="about-stats">
          <div className="stat-item glass">
            <span className="stat-number text-gradient">8+</span>
            <span className="stat-label">أقسام تقنية متخصصة</span>
          </div>
          <div className="stat-item glass">
            <span className="stat-number text-gradient">24/7</span>
            <span className="stat-label">تغطية مستمرة</span>
          </div>
          <div className="stat-item glass">
            <span className="stat-number text-gradient">10+</span>
            <span className="stat-label">مصادر موثوقة</span>
          </div>
          <div className="stat-item glass">
            <span className="stat-number text-gradient">∞</span>
            <span className="stat-label">شغف بالتقنية</span>
          </div>
        </div>

        {/* Values */}
        <div className="about-values">
          <h2>ما يُميزنا</h2>
          <div className="values-grid">
            <div className="value-item glass">
              <div className="value-icon"><Zap size={20} /></div>
              <div>
                <h4>سرعة في النقل</h4>
                <p>نحرص على نشر الأخبار فور صدورها من المصادر الأصلية مع تحديثات فورية.</p>
              </div>
            </div>

            <div className="value-item glass">
              <div className="value-icon"><Globe size={20} /></div>
              <div>
                <h4>تغطية شاملة</h4>
                <p>نغطّي جميع المجالات من الذكاء الاصطناعي والأمن السيبراني إلى الفضاء والألعاب.</p>
              </div>
            </div>

            <div className="value-item glass">
              <div className="value-icon"><Clock size={20} /></div>
              <div>
                <h4>محتوى محدّث</h4>
                <p>تحديث يومي تلقائي من مصادر عربية وعالمية لضمان أحدث المعلومات.</p>
              </div>
            </div>

            <div className="value-item glass">
              <div className="value-icon"><Users size={20} /></div>
              <div>
                <h4>مجتمع تفاعلي</h4>
                <p>نظام تعليقات وتفاعلات يتيح للقراء المشاركة وإبداء آرائهم.</p>
              </div>
            </div>

            <div className="value-item glass">
              <div className="value-icon"><Shield size={20} /></div>
              <div>
                <h4>مصادر موثوقة</h4>
                <p>كل خبر مُرفق بمصدره الأصلي للتحقق والشفافية الكاملة.</p>
              </div>
            </div>

            <div className="value-item glass">
              <div className="value-icon"><Newspaper size={20} /></div>
              <div>
                <h4>تخصيص ذكي</h4>
                <p>يمكنك تخصيص الأقسام التي تهمّك لتحصل على أخبار مُصممة لك.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="about-cta glass">
          <h2>ابقَ على اطلاع دائم</h2>
          <p>تصفّح أحدث الأخبار التقنية أو تواصل معنا لأي استفسار أو اقتراح.</p>
          <div className="cta-buttons">
            <Link href="/" className="cta-btn primary">تصفح الأخبار</Link>
            <Link href="/contact" className="cta-btn secondary">تواصل معنا</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
