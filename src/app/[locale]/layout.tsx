import type { Metadata } from 'next';
import "../globals.css";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Montserrat, Marcellus } from 'next/font/google';

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

export const metadata: Metadata = {
  title: "VINEX | Nhân điều trắng, nông sản và quà tặng doanh nghiệp",
  description: "VINEX phát triển từ nhà máy bóc tách điều thô, nhân điều trắng, sản phẩm từ nông sản Việt đến bao bì và quà tặng doanh nghiệp.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  return (
    <html lang={locale} suppressHydrationWarning className={`${montserrat.variable} ${marcellus.variable}`}>
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
