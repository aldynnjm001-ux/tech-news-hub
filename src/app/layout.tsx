import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BreakingNewsBar from "@/components/breaking-news-bar";
import CookieConsent from "@/components/cookie-consent";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "أخبار التكنولوجيا | Hub",
  description: "المصدر الأول لأحدث الأخبار والتطورات في مجالات الذكاء الاصطناعي، الأمن السيبراني، العتاد، والبرمجيات. تغطية يومية من مصادر موثوقة.",
  keywords: ["أخبار تقنية", "تكنولوجيا", "ذكاء اصطناعي", "أمن سيبراني", "برمجيات", "عتاد"],
  openGraph: {
    title: "أخبار التكنولوجيا | Hub",
    description: "المصدر الأول لأحدث الأخبار والتطورات التقنية.",
    url: "https://technewshub.com",
    siteName: "أخبار التكنولوجيا | Hub",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "أخبار التكنولوجيا | Hub",
    description: "المصدر الأول لأحدث الأخبار والتطورات التقنية.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {adSenseId && (
          <Script
            id="adsense-init"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${tajawal.className}`}>
        <ThemeProvider>
          <Navbar />
          <BreakingNewsBar />
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
          <CookieConsent />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
