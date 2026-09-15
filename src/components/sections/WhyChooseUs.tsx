"use client";

import React from "react";
import { Gift, Leaf, UserCheck, ShieldCheck, Truck } from "lucide-react";
import { GlassCard } from "@/components/ui/glass";

export const WhyChooseUs = () => {
  const values = [
    { icon: Gift, title: "Thiết kế sang trọng", desc: "Tinh tế trong từng đường nét và chất liệu" },
    { icon: Leaf, title: "Nguyên liệu tuyển chọn", desc: "Sản phẩm chất lượng từ những thương hiệu uy tín" },
    { icon: UserCheck, title: "Cá nhân hóa theo yêu cầu", desc: "In logo, thiệp chúc, thiết kế riêng cho doanh nghiệp" },
    { icon: ShieldCheck, title: "Đóng gói cao cấp", desc: "Chỉn chu trong từng chi tiết" },
    { icon: Truck, title: "Giao hàng toàn quốc", desc: "Đúng hẹn, an toàn, chuyên nghiệp" },
  ];

  return (
    <section className="py-16 lg:py-20 bg-vinex-teal text-white relative overflow-hidden">

      {/* Shared Gradient for Icons */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="goldGradientWhy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#FDE047" offset="0%" />
            <stop stopColor="#EAB308" offset="50%" />
            <stop stopColor="#A16207" offset="100%" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-marcellus tracking-widest uppercase mb-4 text-white">
            VÌ SAO CHỌN VINEX
          </h2>
          <div className="flex items-center justify-center gap-4">
            <span className="w-16 h-[1px] bg-vinex-gold/60"></span>
            <span className="w-2 h-2 rounded-full bg-vinex-gold"></span>
            <span className="w-16 h-[1px] bg-vinex-gold/60"></span>
          </div>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {values.map((val, idx) => (
            <GlassCard
              key={idx}
              variant="interactive"
              radius={14}
              displacementScale={15}
              blurAmount={0.06}
              className="flex flex-col items-center text-center p-6 bg-white/10 border border-white/15 shadow-sm group hover:shadow-lg transition-all"
            >
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                <val.icon
                  size={44}
                  strokeWidth={1.5}
                  style={{ stroke: "url(#goldGradientWhy)" }}
                />
              </div>
              <h3 className="text-[15px] md:text-base font-semibold mb-2.5 tracking-wide text-white group-hover:text-vinex-gold transition-colors duration-300">
                {val.title}
              </h3>
              <p className="text-[13px] md:text-[14px] text-white/80 font-light leading-relaxed">
                {val.desc}
              </p>
            </GlassCard>
          ))}
        </div>

      </div>
    </section>
  );
};
