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

  // If there's no AdSense ID, hide the banner completely
  if (!adSenseId) {
    return null;
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
