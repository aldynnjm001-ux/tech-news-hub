'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      right: '1rem',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border)',
      padding: '1.5rem',
      borderRadius: 'var(--radius)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      zIndex: 9999,
      boxShadow: 'var(--shadow-lg)',
      maxWidth: '800px',
      margin: '0 auto',
      animation: 'slideUp 0.5s ease-out forwards'
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (min-width: 640px) {
          .cookie-content-wrapper {
            flex-direction: row !important;
            align-items: center;
            justify-content: space-between;
          }
        }
      `}</style>
      
      <div className="cookie-content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>نستخدم ملفات تعريف الارتباط</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>
            يستخدم هذا الموقع ملفات تعريف الارتباط (Cookies) لتحسين تجربة المستخدم وتحليل الزيارات وعرض إعلانات مخصصة. باستمرارك في استخدام الموقع، فإنك توافق على <Link href="/privacy" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>سياسة الخصوصية</Link> الخاصة بنا.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <button 
            onClick={acceptCookies}
            style={{
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1.5rem',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}
          >
            موافق
          </button>
        </div>
      </div>
    </div>
  );
}
