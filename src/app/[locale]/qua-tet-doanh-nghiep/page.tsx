import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Hero } from "@/components/sections/Hero";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Featured } from "@/components/sections/Featured";
import { Process } from "@/components/gift-sections/Process";
import { CTABanner } from "@/components/gift-sections/CTABanner";

export const metadata: Metadata = {
  title: "Quà Tết doanh nghiệp | VINEX",
  description: "Giải pháp quà Tết doanh nghiệp với sản phẩm, bao bì và ngân sách theo nhu cầu.",
};

export default function CorporateGiftPage() {
  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen selection:bg-vinex-yellow selection:text-vinex-black bg-white">
        <Hero />
        <WhyChooseUs />
        <Featured />
        <Process />
        <CTABanner />
      </main>
    </SmoothScroll>
  );
}
