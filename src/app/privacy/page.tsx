import { Metadata } from 'next';
import './page.css';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | أخبار التكنولوجيا',
  description: 'سياسة الخصوصية وشروط الاستخدام الخاصة بموقع أخبار التكنولوجيا.',
};

export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', color: 'var(--primary)' }}>سياسة الخصوصية</h1>
      
      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
        <p style={{ marginBottom: '1.5rem', color: 'var(--muted)' }}>تاريخ آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>1. مقدمة</h2>
          <p>
            مرحباً بك في موقع أخبار التكنولوجيا (Tech News Hub). نحن نولي أهمية قصوى لخصوصية زوارنا.
            توضح هذه الصفحة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية عند زيارتك لموقعنا.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>2. جمع المعلومات واستخدامها</h2>
          <p>
            نحن نستخدم تقنيات مثل ملفات تعريف الارتباط (Cookies) لتحسين تجربتك وتخصيص المحتوى والإعلانات التي تراها.
            قد نقوم بجمع بعض المعلومات غير الشخصية مثل نوع المتصفح، نظام التشغيل، والصفحات التي تزورها.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>3. ملفات تعريف الارتباط (Cookies) التابعة لجهات خارجية</h2>
          <p>
            قد يستخدم موقعنا خدمات تقدمها جهات خارجية، مثل <strong>Google AdSense</strong> لعرض الإعلانات، و <strong>Google Analytics</strong> لتحليل الزيارات.
          </p>
          <ul style={{ listStyleType: 'disc', paddingRight: '1.5rem', marginTop: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>تستخدم جوجل (كجهة خارجية مورّدة) ملفات تعريف الارتباط لعرض الإعلانات على موقعنا.</li>
            <li style={{ marginBottom: '0.5rem' }}>يمكن للمستخدمين إلغاء الاشتراك في استخدام جوجل لملف تعريف الارتباط DART بزيارة سياسة الخصوصية الخاصة بإعلانات جوجل وشبكة المحتوى.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>4. موافقتك</h2>
          <p>
            باستخدامك لموقعنا، فإنك توافق على سياسة الخصوصية الخاصة بنا وشروطها.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>5. الاتصال بنا</h2>
          <p>
            إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى الاتصال بنا عبر البريد الإلكتروني أو من خلال قنواتنا الرسمية.
          </p>
        </section>
      </div>
    </div>
  );
}
