"use client";

import React from "react";
import { Gift, Box, Stamp, Mail, Layers, Settings, Truck } from "lucide-react";
import { GlassCard } from "@/components/ui/glass";

export const Process = () => {
  const steps = [
    { icon: Gift, label: "Chọn bộ quà" },
    { icon: Box, label: "Chọn sản phẩm" },
    { icon: Stamp, label: "In logo doanh nghiệp" },
    { icon: Mail, label: "Thiệp chúc Tết" },
    { icon: Layers, label: "Thiết kế bao bì" },
    { icon: Settings, label: "Sản xuất" },
    { icon: Truck, label: "Giao hàng" },
  ];

  return (
    <section className="py-16 lg:py-20 bg-vinex-ivory text-vinex-black relative overflow-hidden">

      {/* SVG Definitions for Gradient Icons */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#FDE047" offset="0%" />
            <stop stopColor="#EAB308" offset="50%" />
            <stop stopColor="#A16207" offset="100%" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="text-center mb-16">
          <div>
            <span className="text-sm font-semibold tracking-[0.2em] text-vinex-gold mb-2 block uppercase">
              Quy trình
            </span>
            <h2 className="text-3xl md:text-5xl font-marcellus text-vinex-teal tracking-tight leading-tight mb-4">
              CÁ NHÂN HÓA QUÀ TẶNG
            </h2>
          </div>
          <div className="flex items-center justify-center gap-4">
            <span className="w-16 h-[1px] bg-vinex-gold/60"></span>
            <span className="w-2 h-2 rounded-full bg-vinex-gold"></span>
            <span className="w-16 h-[1px] bg-vinex-gold/60"></span>
          </div>
        </div>

        {/* 7-Step Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <GlassCard
                key={idx}
                variant="interactive"
                radius={14}
                displacementScale={15}
                blurAmount={0.06}
                className="flex flex-col items-center text-center p-5 bg-white/80 border border-black/5 shadow-sm group hover:shadow-md transition-all"
              >
                {/* Step Circle */}
                <div className="w-16 h-16 rounded-full bg-vinex-teal/5 border border-vinex-teal/10 flex items-center justify-center relative mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon
                    className="drop-shadow-sm"
                    style={{ stroke: "url(#goldGradient)" }}
                    size={28}
                    strokeWidth={1.5}
                  />

                  {/* Step Number Badge */}
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-vinex-teal text-white text-[10px] flex items-center justify-center font-semibold order border-white shadow-sm">
                    {idx + 1}
                  </span>
                </div>

                {/* Step Label */}
                <h3 className="text-xs font-semibold text-vinex-teal tracking-wide leading-relaxed group-hover:text-vinex-gold transition-colors duration-300">
                  {step.label}
                </h3>
              </GlassCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};
