"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { GlassCard, GlassButton } from "@/components/ui/glass";

export const Featured = () => {
  const collections = [
    { title: "PREMIUM", img: "/images/product/bao_bi_qua_tang/p1.png" },
    { title: "EXECUTIVE", img: "/images/product/bao_bi_qua_tang/p2.png" },
    { title: "BUSINESS", img: "/images/product/bao_bi_qua_tang/p3.png" },
    { title: "FAMILY", img: "/images/product/bao_bi_qua_tang/p4.png" },
    { title: "SPECIAL", img: "/images/product/bao_bi_qua_tang/p5.png" },
  ];

  return (
    <section className="py-16 lg:py-20 bg-vinex-ivory text-vinex-black">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="text-sm font-semibold tracking-[0.2em] text-vinex-gold mb-2 block uppercase">
              Giải pháp
            </span>
            <h2 className="text-3xl md:text-5xl font-marcellus text-vinex-teal tracking-tight leading-tight mb-4">
              QUÀ TẶNG DOANH NGHIỆP
            </h2>
            <p className="text-sm text-vinex-charcoal/70 font-light max-w-xl">
              Một món quà cần phù hợp với người nhận, thể hiện đúng tinh thần thương hiệu và tạo trải nghiệm khi mở hộp.
            </p>
          </div>

          <Link href="/vi/qua-tang-doanh-nghiep">
            <GlassButton variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              XEM TẤT CẢ BỘ SƯU TẬP
            </GlassButton>
          </Link>
        </div>

        {/* 5-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {collections.map((col, idx) => (
            <GlassCard
              key={idx}
              variant="interactive"
              radius={14}
              displacementScale={15}
              blurAmount={0.06}
              className="group flex flex-col bg-white/80 border border-black/5 rounded-2xl transition-all overflow-hidden cursor-pointer shadow-sm hover:shadow-lg"
            >
              {/* Product Image Wrapper */}
              <div className="w-full aspect-[4/5] md:aspect-square overflow-hidden relative bg-black/5">
                <Image
                  src={col.img}
                  alt={`BỘ SƯU TẬP ${col.title}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Card Footer Details */}
              <div className="p-4 flex items-center justify-between bg-white/60 relative z-10">
                <div>
                  <span className="text-[10px] tracking-widest text-vinex-charcoal/50 block font-semibold mb-0.5">BỘ SƯU TẬP</span>
                  <h3 className="text-sm font-semibold text-vinex-teal tracking-wider uppercase group-hover:text-vinex-gold transition-colors duration-300">
                    {col.title}
                  </h3>
                </div>

                <div className="w-7 h-7 rounded-full bg-vinex-teal flex items-center justify-center text-white shadow-sm group-hover:bg-vinex-gold group-hover:text-vinex-teal transition-colors duration-300">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </section>
  );
};
