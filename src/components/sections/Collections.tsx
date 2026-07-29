"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

export const Collections = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ".collection-item",
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%",
        }
      }
    );
  }, []);

  const collections = [
    { title: "Hộp quà truyền thống", desc: "Lưu giữ hương vị Tết xưa", span: "md:col-span-2 md:row-span-2" },
    { title: "Hộp quà doanh nghiệp", desc: "Tri ân đối tác, gắn kết thành công", span: "col-span-1" },
    { title: "Hộp quà Premium", desc: "Phiên bản giới hạn", span: "col-span-1" },
    { title: "Hộp quà Luxury", desc: "Đỉnh cao chế tác", span: "md:col-span-2" },
    { title: "Gift Basket", desc: "Giỏ quà sung túc", span: "col-span-1" },
    { title: "Combo đặc biệt", desc: "Thiết kế riêng", span: "col-span-1" },
  ];

  return (
    <section ref={container} className="py-24 px-4 md:px-8 bg-[#fafafa]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl  font-bold text-vinex-red mb-4">Bộ sưu tập 2027</h2>
            <div className="w-16 h-1 bg-vinex-orange"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 md:grid-rows-3 gap-4 h-[1200px] md:h-[800px]">
          {collections.map((col, idx) => (
            <div 
              key={idx} 
              className={`collection-item group relative overflow-hidden rounded-lg cursor-pointer ${col.span}`}
            >
              {/* Background Image Placeholder */}
              <div className="absolute inset-0 bg-vinex-black transition-transform duration-700 group-hover:scale-105">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent mix-blend-overlay"></div>
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500"></div>
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <p className="text-vinex-yellow  text-sm uppercase tracking-widest mb-2 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">{col.desc}</p>
                <h3 className="text-2xl md:text-3xl  font-bold text-white mb-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">{col.title}</h3>
                
                <div className="overflow-hidden h-0 group-hover:h-12 transition-all duration-500">
                  <button className="flex items-center gap-2 text-white  uppercase text-sm tracking-wider hover:text-vinex-yellow transition-colors">
                    Xem chi tiết <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
