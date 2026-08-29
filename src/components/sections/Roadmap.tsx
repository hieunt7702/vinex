"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const Roadmap = () => {
  const container = useRef<HTMLDivElement>(null);
  const scrollWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Horizontal scroll pinning
    const sections = gsap.utils.toArray(".roadmap-step");
    
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        pin: true,
        scrub: 1,
        // snap: 1 / (sections.length - 1),
        end: () => "+=" + scrollWrapper.current?.offsetWidth,
      }
    });

  }, []);

  const steps = [
    { num: "01", title: "Xây dựng thương hiệu" },
    { num: "02", title: "Nhận diện" },
    { num: "03", title: "Ra thị trường" },
    { num: "04", title: "Bán hàng" },
    { num: "05", title: "Đánh giá" },
  ];

  return (
    <section ref={container} className="h-screen bg-[#fafafa] overflow-hidden flex flex-col justify-center relative">
      <div className="absolute top-24 left-12 md:left-24 z-10">
        <h2 className="text-4xl md:text-5xl  font-bold text-vinex-blue">Lộ trình tổng thể</h2>
        <div className="w-16 h-1 bg-vinex-yellow mt-4"></div>
      </div>

      <div ref={scrollWrapper} className="flex w-[250vw] md:w-[200vw] lg:w-[150vw] h-full items-center">
        {steps.map((step, idx) => (
          <div key={idx} className="roadmap-step flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/5 px-8 md:px-12 relative flex justify-center">
            {/* Connection Line */}
            {idx !== steps.length - 1 && (
              <div className="absolute top-1/2 left-[50%] w-full h-[2px] bg-black/5 -translate-y-1/2 -z-10">
                <div className="h-full bg-vinex-yellow w-1/2"></div>
              </div>
            )}
            
            <div className="flex flex-col items-center group">
              <div className="w-24 h-24 rounded-full bg-white border-[4px] border-vinex-indigo shadow-lg flex items-center justify-center text-3xl font-bold  text-vinex-indigo mb-6 relative z-10 transition-all duration-500 group-hover:bg-vinex-yellow group-hover:text-white group-hover:border-vinex-yellow group-hover:scale-110">
                {step.num}
              </div>
              <h3 className="text-2xl  font-bold text-center text-vinex-teal group-hover:text-vinex-blue transition-colors duration-300">{step.title}</h3>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
