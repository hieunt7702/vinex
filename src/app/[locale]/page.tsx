import { SmoothScroll } from "@/components/layout/SmoothScroll";
// Sections in order
import { HomeHero } from "@/components/home/HomeHero";
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
      <main className="w-full flex flex-col min-h-screen selection:bg-vinex-gold selection:text-white bg-vinex-ivory">
        {/* 1. Hero */}
        <HomeHero />
        
        {/* 2. Brand Philosophy */}
        <BrandPhilosophy />
        
        {/* 3. Collections */}
        <CollectionsPreview />
        
        {/* 4. Corporate Gifting */}
        <CorporateGiftingHome />
        
        {/* 5. Bespoke Service */}
        <BespokeServiceHome />
        
        {/* 6. Vietnam Story */}
        <VietnamStory />
        
        {/* 7. Why VINEX */}
        <WhyVinexHome />
        
        {/* 8. Case Study (Miss World) */}
        <CaseStudyHome />
        
        {/* 9. Journal */}
        <LatestArticles />
        
        {/* 10. Final CTA */}
        <FinalCTA />
      </main>
    </SmoothScroll>
  );
}
