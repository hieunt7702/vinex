import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { HomeHero } from "@/components/home/HomeHero";
import { ValueChain } from "@/components/home/ValueChain";
import { FactoryOverview } from "@/components/home/FactoryOverview";
import { WhiteCashewOverview } from "@/components/home/WhiteCashewOverview";
import { ProductCategories } from "@/components/home/ProductCategories";
import { BusinessSolutions } from "@/components/home/BusinessSolutions";
import { GiftAndPackaging } from "@/components/home/GiftAndPackaging";
import { TrustAndFAQ } from "@/components/home/TrustAndFAQ";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="w-full flex flex-col min-h-screen selection:bg-vinex-yellow selection:text-vinex-black bg-white">
        <HomeHero />
        <ValueChain />
        <FactoryOverview />
        <WhiteCashewOverview />
        <ProductCategories />
        <BusinessSolutions />
        <GiftAndPackaging />
        <TrustAndFAQ />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
