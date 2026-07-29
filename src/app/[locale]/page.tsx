import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Featured } from "@/components/sections/Featured";
import { Process } from "@/components/gift-sections/Process";
import { CTABanner } from "@/components/gift-sections/CTABanner";

import { getDictionary, Locale } from "@/dictionaries";

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen selection:bg-vinex-yellow selection:text-vinex-black bg-white">
        <Hero />
        <WhyChooseUs />
        <Featured />
        <Process />
        <CTABanner />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
