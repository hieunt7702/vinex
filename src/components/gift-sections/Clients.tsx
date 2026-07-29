"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const Clients = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ".client-logo",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        stagger: 0.05,
        duration: 0.5,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        }
      }
    );
  }, []);

  const fixedQuantities = [1250, 4300, 850, 2100, 5000, 1500, 3200, 950, 4800, 1100, 2750, 3900];
  const clients = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    name: `Client ${i + 1}`,
    qty: fixedQuantities[i]
  }));

  return (
    <section ref={container} className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl  font-bold text-vinex-blue mb-4">Đối tác đồng hành</h2>
        <p className="text-lg text-black/60  mb-16">Hơn 50+ tập đoàn, doanh nghiệp đã tin tưởng lựa chọn quà Tết Vinex.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {clients.map((client) => (
            <div key={client.id} className="client-logo group relative aspect-square bg-gray-50 rounded-lg flex items-center justify-center cursor-pointer border border-transparent hover:border-vinex-yellow transition-colors overflow-hidden">
              <span className=" font-bold text-vinex-black/30 group-hover:opacity-0 transition-opacity duration-300">{client.name}</span>
              
              <div className="absolute inset-0 bg-vinex-yellow flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-vinex-black">
                <span className=" font-bold text-2xl">{client.qty.toLocaleString()}</span>
                <span className=" text-xs uppercase tracking-wider">Hộp quà</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
