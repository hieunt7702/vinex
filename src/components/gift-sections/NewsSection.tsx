"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

export const NewsSection = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(
      ".news-card",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: container.current, start: "top 75%" } }
    );
  }, []);

  const news = [
    { category: "Tet Trends", title: "The Evolution of Corporate Gifting in 2027", date: "Oct 12, 2026", img: "/hero1.png" },
    { category: "Gift Inspiration", title: "Curating the Perfect Gift Box for VIP Clients", date: "Oct 05, 2026", img: "/hero1.png" },
    { category: "Culture", title: "The Art of Giving in Asian Traditions", date: "Sep 28, 2026", img: "/hero1.png" },
  ];

  return (
    <section ref={container} className="py-32 bg-vinex-white text-vinex-black">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-black/10 pb-8">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-vinex-blue uppercase mb-4">Vinex Journal</h2>
            <h3 className="text-4xl md:text-6xl font-light text-vinex-black tracking-tight">Stories & <span className="font-bold">Inspiration</span></h3>
          </div>
          <button className="hidden md:flex items-center gap-2 uppercase tracking-widest text-sm font-bold hover:text-vinex-yellow transition-colors group mt-8 md:mt-0">
            View All Articles <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {news.map((item, idx) => (
            <article key={idx} className="news-card group cursor-pointer flex flex-col h-full">
              <div className="w-full aspect-[4/3] bg-gray-100 mb-8 overflow-hidden relative">
                 <div 
                   className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                   style={{ backgroundImage: `url(${item.img})` }}
                 ></div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-vinex-blue text-xs font-bold tracking-widest uppercase">{item.category}</span>
                <span className="w-1 h-1 rounded-full bg-black/20"></span>
                <span className="text-xs font-light tracking-widest text-black/50 uppercase">{item.date}</span>
              </div>
              <h3 className="text-2xl font-light text-vinex-black group-hover:text-vinex-yellow transition-colors duration-300 leading-snug mb-4 flex-grow">
                {item.title}
              </h3>
              <div className="mt-auto">
                <span className="inline-block pb-1 border-b border-black/20 uppercase tracking-widest text-xs font-bold group-hover:border-vinex-yellow transition-colors">
                  Read Article
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
