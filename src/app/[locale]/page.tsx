import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Footer } from "@/components/layout/Footer";

// Sections in order
import { HomeHero } from "@/components/home/HomeHero";
import { MissWorldSection } from "@/components/home/MissWorldSection";
import { BrandPhilosophy } from "@/components/home/BrandPhilosophy";
import { CollectionsPreview } from "@/components/home/CollectionsPreview";
import { CorporateGiftingHome } from "@/components/home/CorporateGiftingHome";
import { BespokeServiceHome } from "@/components/home/BespokeServiceHome";
import { VietnamStory } from "@/components/home/VietnamStory";
import { WhyVinexHome } from "@/components/home/WhyVinexHome";
import { CaseStudyHome } from "@/components/home/CaseStudyHome";
import { LatestArticles } from "@/components/home/LatestArticles";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen selection:bg-[#D4AF37] selection:text-black bg-white">
        {/* 1. Hero */}
        <HomeHero />
        
        {/* 2. VINEX × Miss World 2026 */}
        <MissWorldSection />
        
        {/* 3. Brand Philosophy */}
        <BrandPhilosophy />
        
        {/* 4. Collections */}
        <CollectionsPreview />
        
        {/* 5. Corporate Gifting */}
        <CorporateGiftingHome />
        
        {/* 6. Bespoke Service */}
        <BespokeServiceHome />
        
        {/* 7. Vietnam Story */}
        <VietnamStory />
        
        {/* 8. Why VINEX */}
        <WhyVinexHome />
        
        {/* 9. Case Study */}
        <CaseStudyHome />
        
        {/* 10. Journal */}
        <LatestArticles />
        
        {/* 11. Final CTA */}
        <FinalCTA />
      </main>
      
      {/* 12. Footer */}
      <Footer />
    </SmoothScroll>
  );
}
