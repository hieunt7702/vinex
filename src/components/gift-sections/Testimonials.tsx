"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, Play } from "lucide-react";

export const Testimonials = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(
      ".testi-card",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: "power3.out", scrollTrigger: { trigger: container.current, start: "top 75%" } }
    );
  }, []);

  const reviews = [
    { name: "Nguyen Van A", role: "CEO", company: "Vinamilk", text: "The design of Vinex's Tet gift boxes is truly impressive. Our partners were highly satisfied with the craftsmanship and elegance." },
    { name: "Tran Thi B", role: "Marketing Director", company: "Vietcombank", text: "Professional process and timely delivery. The customization options helped us perfectly convey our brand message." },
    { name: "Le Van C", role: "Head of Procurement", company: "Vingroup", text: "The quality of the ingredients inside the gift box is exceptional. A complete and premium gifting solution." }
  ];

  return (
    <section ref={container} className="py-16 lg:py-20 bg-vinex-black text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-vinex-blue/20 to-transparent"></div>
      
      <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-vinex-yellow uppercase mb-4">Testimonials</h2>
            <h3 className="text-4xl md:text-6xl font-light text-white tracking-tight">Trusted by <span className="font-bold">Leaders</span></h3>
          </div>
          
          <div className="flex items-center gap-6 opacity-60 grayscale">
            <span className="text-xl font-bold tracking-widest">SAMSUNG</span>
            <span className="text-xl font-bold tracking-widest">VIETCOMBANK</span>
            <span className="text-xl font-bold tracking-widest">VINGROUP</span>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {reviews.map((rev, idx) => (
            <div key={idx} className="testi-card bg-white/5 p-10 border border-white/10 relative hover:bg-white/10 transition-colors duration-500 group">
              <Quote className="absolute top-8 right-8 text-white/5 group-hover:text-vinex-yellow/10 transition-colors duration-500" size={80} />
              <p className="text-lg text-white/80 font-light leading-relaxed mb-12 relative z-10 italic">&quot;{rev.text}&quot;</p>
              
              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="w-14 h-14 rounded-full bg-white/10 overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: "url('/hero1.png')"}}></div>
                </div>
                <div>
                  <h4 className="font-bold text-vinex-yellow">{rev.name}</h4>
                  <p className="text-sm text-white/50">{rev.role}, {rev.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Testimonial Promo */}
        <div className="testi-card relative w-full h-[30vh] md:h-[40vh] bg-gray-900 overflow-hidden group cursor-pointer flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('/hero1.png')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700 group-hover:scale-105"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 group-hover:bg-vinex-yellow group-hover:border-vinex-yellow transition-colors duration-500">
              <Play className="text-white group-hover:text-vinex-black ml-2" size={32} />
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-white">Watch Brand Story</span>
          </div>
        </div>
      </div>
    </section>
  );
};
