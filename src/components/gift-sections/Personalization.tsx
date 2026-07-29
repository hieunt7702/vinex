"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PenTool, Mail, Palette, Stamp, Edit3, Factory } from "lucide-react";

export const Personalization = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 60%",
      }
    });

    tl.fromTo(".pers-step", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.2)" })
      .fromTo(".pers-line", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.out" }, "-=0.8");
  }, []);

  const steps = [
    { icon: PenTool, title: "Logo doanh nghiệp" },
    { icon: Mail, title: "Thiệp chúc Tết" },
    { icon: Palette, title: "Màu sắc hộp" },
    { icon: Stamp, title: "In ấn logo" },
    { icon: Edit3, title: "Thiết kế riêng" },
    { icon: Factory, title: "Sản xuất" },
  ];

  return (
    <section ref={container} className="py-24 px-6 md:px-12 bg-vinex-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl  font-bold text-vinex-yellow mb-4">Dấu ấn độc bản</h2>
          <p className="text-lg text-white/70 ">Mỗi món quà đều mang đậm bản sắc thương hiệu của riêng bạn.</p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="pers-line absolute top-12 left-0 w-full h-[2px] bg-white/10 origin-left hidden lg:block">
             <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-vinex-yellow/0 via-vinex-yellow to-vinex-yellow/0 opacity-50"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="pers-step relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center mb-6 relative z-10 group-hover:border-vinex-yellow transition-colors duration-500 group-hover:shadow-[0_0_30px_rgba(255,199,3,0.2)]">
                  <step.icon className="text-vinex-yellow" size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm md:text-base  font-bold text-white group-hover:text-vinex-yellow transition-colors">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
