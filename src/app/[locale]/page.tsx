import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { HomeHero } from "@/components/home/HomeHero";
import { ValueLayers } from "@/components/home/ValueLayers";
import { FactoryProof } from "@/components/home/FactoryProof";
import { WhiteCashewProof } from "@/components/home/WhiteCashewProof";
import { FlavoredCashewsHome } from "@/components/home/FlavoredCashewsHome";
import { VietnameseAgriHome } from "@/components/home/VietnameseAgriHome";
import { CorporateGiftingHome } from "@/components/home/CorporateGiftingHome";
import { MissWorldIntro } from "@/components/home/MissWorldIntro";
import { LatestArticles } from "@/components/home/LatestArticles";
import { FinalCTA } from "@/components/home/FinalCTA";

const Divider = () => (
  <div className="w-full relative z-10 flex justify-center py-0">
    <div className="w-full max-w-[1400px] h-[1px] bg-gradient-to-r from-transparent via-vinex-gold/30 to-transparent"></div>
  </div>
);

export default function Home() {
  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen selection:bg-vinex-gold selection:text-white relative overflow-hidden">
        
        {/* Ambient Global Gradient for Liquid Glass Refraction */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#074751]/30 rounded-full blur-[160px]" />
          <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] bg-vinex-gold/30 rounded-full blur-[160px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-[#5C7B6C]/30 rounded-full blur-[160px]" />
        </div>

        <div className="relative z-10">
          {/* 01. Hero thương hiệu */}
          <HomeHero />

          {/* 02. 3 Lớp Giá Trị */}
        <ValueLayers />
        <Divider />

        {/* 03. Nhà Máy */}
        <FactoryProof />
        <Divider />

        {/* 04. Nhân Điều Trắng */}
        <WhiteCashewProof />
        <Divider />

        {/* 05. Hạt Điều Tẩm Vị */}
        <FlavoredCashewsHome />
        <Divider />

        {/* 06. Hệ Nông Sản Việt */}
        <VietnameseAgriHome />
        <Divider />

        {/* 07. Quà Tặng Doanh Nghiệp */}
        <CorporateGiftingHome />
        <Divider />

        {/* 08. Miss World */}
        <MissWorldIntro />
        <Divider />

        {/* 09. Tin Tức / Câu Chuyện */}
        <LatestArticles />

        {/* 10. Final CTA */}
        <FinalCTA />
        </div>
      </main>
    </SmoothScroll>
  );
}
