"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useDict } from "@/hooks/useDict";
import { GlassButton } from "@/components/ui/glass";

export const FinalCTA: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "vi";
  const t = useDict();

  return (
    <section className="relative w-full overflow-hidden flex items-center bg-[#074751]">

      {/* 1. Panoramic Mountain & Plantation Landscape Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg_connect.png"
          alt="Hãy tạo nên dấu ấn khó quên - VINEX"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transform scale-[1.01]"
        />

        {/* Soft atmospheric gradient wash on the left for live typography readability */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent w-full sm:w-[65%] lg:w-[50%] pointer-events-none"
          aria-hidden="true"
        />

        {/* Subtle overall dark vignette */}
        <div
          className="absolute inset-0 bg-black/10 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* 2. Content Layer */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 w-full relative z-20 py-8 sm:py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">

          {/* Left Text Block */}
          <div className="flex flex-col items-start text-left max-w-2xl">
            <div className="flex items-center gap-4 mb-2">
              <span className="font-marcellus uppercase text-white/90 text-[11px] sm:text-[13px] tracking-[0.2em] drop-shadow-sm">
                {t.cta.prefix || "KẾT NỐI"}
              </span>
              <div className="w-[40px] h-[1px] bg-vinex-gold"></div>
            </div>

            <h2 className="text-[26px] sm:text-[34px] md:text-[40px] lg:text-[44px] text-white uppercase tracking-tight leading-[1.15] drop-shadow-md font-semibold">
              {t.cta.headline || "CÙNG VINEX"}
            </h2>

            <p className="text-white/90 text-[13.5px] sm:text-[15px] md:text-[16px] font-medium mt-1.5 sm:mt-2.5 drop-shadow-sm">
              {t.cta.desc || "Cùng VINEX kiến tạo những giá trị bền vững."}
            </p>
          </div>

          <div className="relative group shrink-0 mt-6 lg:mt-0">
            <Link href={`/${lang}/lien-he`}>
              <GlassButton
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />}
                className="shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                {t.cta.btn || t.cta.primary || "LIÊN HỆ VINEX"}
              </GlassButton>
            </Link>
          </div>

        </div>
      </div>

    </section>
  );
};

export default FinalCTA;

