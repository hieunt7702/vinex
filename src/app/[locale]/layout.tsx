import type { Metadata } from 'next';
import "../globals.css";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Header } from "@/components/layout/Header";
import { Montserrat, Playfair_Display, Pinyon_Script } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-serif',
  display: 'swap',
});

const pinyon = Pinyon_Script({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "VINEX | Luxury Vietnamese Gift",
  description: "Bộ sưu tập quà Tết cao cấp dành cho doanh nghiệp và đối tác chiến lược.",
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
    <html lang={locale} suppressHydrationWarning className={`${montserrat.variable} ${playfair.variable} ${pinyon.variable}`}>
      <body
        suppressHydrationWarning
        className={`min-h-screen flex flex-col bg-vinex-white text-vinex-black font-sans antialiased`}
      >
        <LanguageSwitcher />
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
