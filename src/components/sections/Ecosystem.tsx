"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const Ecosystem = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 60%",
      }
    });

    tl.fromTo(".eco-center", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" })
      .fromTo(".eco-line", { scaleX: 0 }, { scaleX: 1, stagger: 0.1, duration: 0.5 }, "-=0.3")
      .fromTo(".eco-node", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.1, duration: 0.5, ease: "back.out(1.5)" }, "-=0.2");
  }, []);

  const nodes = [
    { name: "Website", x: "10%", y: "20%" },
    { name: "Facebook", x: "30%", y: "10%" },
    { name: "TikTok", x: "70%", y: "10%" },
    { name: "Youtube", x: "90%", y: "20%" },
    { name: "Shopee", x: "15%", y: "80%" },
    { name: "Đại lý", x: "35%", y: "90%" },
    { name: "Khách hàng", x: "65%", y: "90%" },
    { name: "CRM", x: "85%", y: "80%" },
  ];

  return (
    <section ref={container} className="py-16 lg:py-20 bg-[#fafafa] text-vinex-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16 relative z-20">
        <h2 className="text-4xl md:text-5xl  font-bold text-vinex-blue mb-4">Hệ sinh thái Thương hiệu</h2>
        <p className="text-lg text-black/60  max-w-2xl mx-auto">Mạng lưới kết nối đa nền tảng, tạo ra một vòng lặp giá trị không ngừng nghỉ cho doanh nghiệp.</p>
      </div>

      <div className="relative w-full max-w-5xl mx-auto h-[600px] flex items-center justify-center">
        {/* Center Node */}
        <div className="eco-center z-10 w-32 h-32 rounded-full bg-vinex-blue text-white shadow-2xl flex flex-col items-center justify-center border-4 border-white">
          <span className=" font-bold text-2xl">VINEX</span>
          <span className="text-[10px]  uppercase tracking-widest text-vinex-yellow">Marketing</span>
        </div>

        {/* Outer Nodes & SVG Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#114c5a" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffc703" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {nodes.map((node, i) => (
             // Approximate center lines
            <line 
              key={`line-${i}`} 
              className="eco-line origin-center" 
              x1="50%" y1="50%" 
              x2={node.x} y2={node.y} 
              stroke="url(#lineGrad)" 
              strokeWidth="2" 
              strokeDasharray="4 4"
            />
          ))}
        </svg>

        {nodes.map((node, i) => (
          <div 
            key={i} 
            className="eco-node absolute w-24 h-24 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-sm  font-bold text-vinex-indigo hover:scale-110 transition-transform duration-300 cursor-pointer hover:border-vinex-yellow z-10"
            style={{ left: `calc(${node.x} - 3rem)`, top: `calc(${node.y} - 3rem)` }}
          >
            {node.name}
          </div>
        ))}
      </div>
    </section>
  );
};
