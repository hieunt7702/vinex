"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const Showcase = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ".showcase-card",
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%",
        },
      }
    );
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, target: HTMLDivElement | null) => {
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    gsap.to(target, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1000,
      transformOrigin: "center"
    });
  };

  const handleMouseLeave = (target: HTMLDivElement | null) => {
    if (!target) return;
    gsap.to(target, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const products = [
    { title: "Premium Coffee", subtitle: "F&B Brand Identity", img: "/images/product/cafe_nguyen_hat_500g&1kg/cafe_nguyen_hat_honey_robussta_1kg.png" },
    { title: "Premium Tea", subtitle: "Packaging Design", img: "/images/product/tra_premium_essiora_tea/p1.png" },
    { title: "Gift Box", subtitle: "Luxury Collection", img: "/images/product/bao_bi_qua_tang/p10.png" },
    { title: "Healthy Food", subtitle: "Brand Strategy", img: "/images/product/hat_orchard_nút/p1.png" },
  ];

  return (
    <section ref={container} className="py-16 md:py-24 px-6 md:px-12 bg-vinex-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl md:text-6xl  font-bold text-white mb-4">Showcase</h2>
            <div className="w-24 h-1 bg-vinex-yellow"></div>
          </div>
          <button className="hidden md:block text-vinex-yellow  uppercase tracking-widest text-sm hover:text-white transition-colors">
            Xem tất cả dự án
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {products.map((prod, idx) => (
            <div 
              key={idx}
              className="showcase-card relative w-full aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${prod.img})` }}
              >
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-vinex-yellow  text-sm tracking-widest uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{prod.subtitle}</p>
                <h3 className="text-3xl  font-bold text-white">{prod.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
