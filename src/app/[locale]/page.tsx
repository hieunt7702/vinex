import { SmoothScroll } from "@/components/layout/SmoothScroll";
// Sections in order
import { HomeHero } from "@/components/home/HomeHero";
import { MissWorldIntro } from "@/components/home/MissWorldIntro";
import { BrandPhilosophy } from "@/components/home/BrandPhilosophy";
import { CollectionsPreview } from "@/components/home/CollectionsPreview";
import { CorporateGiftingHome } from "@/components/home/CorporateGiftingHome";
import { BespokeServiceHome } from "@/components/home/BespokeServiceHome";
import { VietnamStory } from "@/components/home/VietnamStory";
import { WhyVinexHome } from "@/components/home/WhyVinexHome";
import { CaseStudyHome } from "@/components/home/CaseStudyHome";
import { LatestArticles } from "@/components/home/LatestArticles";
import { FinalCTA } from "@/components/home/FinalCTA";

const Divider = () => (
  <div className="w-full relative z-10 flex justify-center py-0">
    <div className="w-full max-w-[1400px] h-[1px] bg-gradient-to-r from-transparent via-vinex-gold/40 to-transparent"></div>
  </div>
);

export default function Home() {

  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen selection:bg-vinex-gold selection:text-white bg-vinex-ivory">
        {/* 1. Hero */}
        <HomeHero />
        
        {/* 2. Miss World 2026 Intro */}
        <MissWorldIntro />
        <Divider />
        
        {/* 3. Brand Philosophy */}
        <BrandPhilosophy />
        <Divider />
        
        {/* 4. Collections */}
        <CollectionsPreview />
        
        {/* 5. Corporate Gifting */}
        <CorporateGiftingHome />
        
        {/* 6. Bespoke Service */}
        <BespokeServiceHome />
        
        {/* 7. Vietnam Story */}
        <VietnamStory />
        <Divider />
        
        {/* 8. Why VINEX */}
        <WhyVinexHome />
        <Divider />
        
        {/* 9. Case Study (Miss World) */}
        <CaseStudyHome />
        
        {/* 10. Journal */}
        <Divider />
        <LatestArticles />
        
        {/* 11. Final CTA */}
        <FinalCTA />
      </main>
    </SmoothScroll>
  );
}
