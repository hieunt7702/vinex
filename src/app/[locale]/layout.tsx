import type { Metadata } from 'next';
import Script from 'next/script';
import "../globals.css";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Montserrat, Marcellus, Dancing_Script } from 'next/font/google';
import { getPublicSettings } from '@/lib/dataService';
import { warmPrismaConnection } from '@/lib/prismaWarmup';

// Pre-warm Prisma connection pool on first server render (eliminates cold-start latency)
warmPrismaConnection();

export const dynamic = 'force-dynamic';


const montserrat = Montserrat({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

const marcellus = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marcellus',
  display: 'swap',
});

const dancingScript = Dancing_Script({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-script',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return {
    title: settings.globalMetaTitle || settings.siteName || "VINEX | Tiếp nối tinh hoa",
    description: settings.globalMetaDesc || "VINEX phát triển từ nhà máy bóc tách điều thô, nhân điều trắng, sản phẩm từ nông sản Việt đến bao bì và quà tặng doanh nghiệp.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const settings = await getPublicSettings();
  
  const hasGA = settings.googleAnalytics && 
    settings.googleAnalytics.startsWith('G-') && 
    settings.googleAnalytics !== 'G-XXXXXXX';
  const hasPixel = !!settings.facebookPixel && settings.facebookPixel.trim().length > 3;

  return (
    <html lang={locale} suppressHydrationWarning className={`${montserrat.variable} ${marcellus.variable} ${dancingScript.variable}`}>
      <head>
        {hasGA && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalytics}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.googleAnalytics}');
              `}
            </Script>
          </>
        )}
        {hasPixel && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${settings.facebookPixel}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body
        suppressHydrationWarning
        className={`min-h-screen flex flex-col bg-[#FAF8F2] text-[#24313A] font-sans antialiased relative overflow-x-hidden`}
      >
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}

