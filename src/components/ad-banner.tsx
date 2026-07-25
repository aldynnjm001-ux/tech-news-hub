'use client';

import { useEffect, useState } from 'react';

type AdBannerProps = {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
};

export default function AdBanner({
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = true,
}: AdBannerProps) {
  const [adSenseId, setAdSenseId] = useState<string | null>(null);

  useEffect(() => {
    // We get the publisher ID from the environment variables.
    // NEXT_PUBLIC_ variables are available on the client side.
    const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;
    setAdSenseId(publisherId || null);
    
    // Only try to push the ad if we have a publisher ID
    if (publisherId) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error: any) {
        console.error('AdSense error:', error.message);
      }
    }
  }, []);

  // If there's no AdSense ID provided yet, show a clean placeholder 
  // (or you could choose to return null to hide it completely in production until ready)
  if (!adSenseId) {
    return (
      <div className="glass" style={{
        background: 'linear-gradient(45deg, rgba(37, 99, 235, 0.05), rgba(139, 92, 246, 0.05))',
        border: '1px dashed var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        borderRadius: 'var(--radius)',
        color: 'var(--muted)',
        textAlign: 'center',
        minHeight: '100px',
        width: '100%',
        margin: '1rem 0'
      }}>
        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>مساحة إعلانية</span>
        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>سيتم تفعيل الإعلانات فور إضافة حساب جوجل أدسنس</span>
      </div>
    );
  }

  return (
    <div style={{ overflow: 'hidden', margin: '1rem 0', display: 'flex', justifyContent: 'center' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minWidth: '250px' }}
        data-ad-client={adSenseId}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  );
}
