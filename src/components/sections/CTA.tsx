"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Text Reveal Animation
    gsap.fromTo(
      textRef.current,
      { opacity: 0, scale: 0.9, y: 50 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
        },
      }
    );

    // Magnetic Button Effect setup
    const btn = btnRef.current;
    if (!btn) return;

    const hoverBtn = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      gsap.to(btn, { x, y, duration: 0.4, ease: "power2.out" });
    };

    const resetBtn = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    };

    btn.addEventListener("mousemove", hoverBtn);
    btn.addEventListener("mouseleave", resetBtn);

    return () => {
      btn.removeEventListener("mousemove", hoverBtn);
      btn.removeEventListener("mouseleave", resetBtn);
    };
  }, []);

  return (
    <section ref={container} className="relative py-40 px-6 overflow-hidden bg-vinex-blue flex items-center justify-center">
      {/* Luxury Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-vinex-yellow/20 via-vinex-blue to-vinex-black opacity-90"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h2 ref={textRef} className="text-4xl md:text-6xl lg:text-7xl  font-bold text-white mb-12 leading-tight">
          Sẵn sàng phát triển thương hiệu cùng <span className="text-vinex-yellow">VINEX</span>?
        </h2>
        
        <button 
          ref={btnRef} 
          className="group relative inline-flex items-center justify-center px-12 py-6 font-bold text-vinex-blue bg-white rounded-full overflow-hidden  text-xl shadow-[0_0_40px_rgba(255,199,3,0.3)] hover:shadow-[0_0_60px_rgba(255,199,3,0.6)] transition-shadow duration-300"
        >
          <div className="absolute inset-0 w-full h-full bg-vinex-yellow transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100"></div>
          <span className="relative flex items-center gap-3 group-hover:text-vinex-black transition-colors duration-300">
            Liên hệ ngay <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </span>
        </button>
      </div>
    </section>
  );
};
