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
        {/* 1. Hero: Ấn tượng đầu tiên & Định vị thương hiệu */}
        <HomeHero />
        
        {/* 2. Miss World 2026: Trẻ trung hôm nay - Kiến tạo ngày mai (Dự án tiêu biểu & Bảo chứng thương hiệu) */}
        <MissWorldIntro />
        
        {/* 3. Brand Philosophy: Triết lý thương hiệu & Giới thiệu VINEX */}
        <BrandPhilosophy />
        <Divider />
        
        {/* 4. Corporate Gifting: Quà tặng Doanh nghiệp trọng tâm */}
        <CorporateGiftingHome />
        
        {/* 5. Bespoke Service: Dịch vụ chế tác quà tặng may đo */}
        <BespokeServiceHome />
        <Divider />
        
        {/* 6. Collections: Bộ sưu tập sản phẩm & Tặng phẩm nông sản */}
        <CollectionsPreview />
        
        {/* 7. Vietnam Story: Câu chuyện nông sản & Nguồn cội đất Việt */}
        <VietnamStory />
        <Divider />
        
        {/* 8. Why VINEX: Năng lực sản xuất & Lý do lựa chọn */}
        <WhyVinexHome />
        <Divider />
        
        {/* 9. Case Study: Phân tích dự án & Tặng phẩm chính thức */}
        <CaseStudyHome />
        
        {/* 10. Journal: Tạp chí & Tri thức nông sản */}
        <Divider />
        <LatestArticles />
        
        {/* 11. Final CTA: Kêu gọi tư vấn & Hợp tác */}
        <FinalCTA />
      </main>
    </SmoothScroll>
  );
}
