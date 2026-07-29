"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const Ingredients = () => {
  const container = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const items = [
    { name: "Premium Tea", desc: "Ancient Shan Tuyet tea, hand-harvested from the misty mountains.", img: "/hero1.png" },
    { name: "Artisan Coffee", desc: "Finest Arabica beans roasted to perfection for a rich, bold aroma.", img: "/hero1.png" },
    { name: "Fine Wine", desc: "Exclusive selections from renowned vineyards to celebrate success.", img: "/hero1.png" },
    { name: "Bird's Nest", desc: "Premium Khanh Hoa bird's nest, the ultimate gift of health and vitality.", img: "/hero1.png" },
    { name: "Healthy Nuts", desc: "Imported Macadamia and Almonds, carefully roasted for a perfect crunch.", img: "/hero1.png" },
    { name: "Luxury Cookies", desc: "French butter cookies melting softly with every bite.", img: "/hero1.png" },
    { name: "Artisanal Chocolate", desc: "Rich, dark chocolate crafted with passion by master chocolatiers.", img: "/hero1.png" },
    { name: "Wild Honey", desc: "Pure, organic wild honey harvested from the untouched highlands.", img: "/hero1.png" },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(
      container.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: container.current, start: "top 75%" } }
    );
  }, []);

  return (
    <section ref={container} className="py-32 bg-white text-vinex-black">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold tracking-widest text-vinex-blue uppercase mb-4">Inside the Gift</h2>
          <h3 className="text-4xl md:text-6xl font-light mb-6">A Symphony of <span className="font-bold text-vinex-blue">Flavors</span></h3>
          <div className="w-12 h-[1px] bg-vinex-yellow mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Interactive List */}
          <div className="lg:col-span-5 space-y-2">
            {items.map((item, idx) => (
              <div 
                key={idx}
                onMouseEnter={() => setActive(idx)}
                className={`p-6 cursor-pointer transition-all duration-500 border-l-4 ${
                  active === idx 
                    ? "bg-vinex-blue/5 border-vinex-yellow text-vinex-black" 
                    : "bg-transparent border-transparent text-gray-400 hover:text-vinex-black hover:bg-gray-50"
                }`}
              >
                <h3 className={`text-2xl font-bold transition-all duration-300 ${active === idx ? "text-vinex-blue translate-x-2" : "translate-x-0"}`}>
                  {item.name}
                </h3>
                <div className={`overflow-hidden transition-all duration-500 ${active === idx ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"}`}>
                  <p className="text-sm font-light leading-relaxed pl-2 border-l border-vinex-yellow/30">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Presentation */}
          <div className="lg:col-span-7 relative aspect-square md:aspect-[4/3] bg-gray-100 overflow-hidden group">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-vinex-yellow/10 to-transparent mix-blend-multiply z-10"></div>
            
            {items.map((item, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${active === idx ? "opacity-100 scale-100" : "opacity-0 scale-110 pointer-events-none"}`}
              >
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-[10s] ease-linear group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.img})` }}
                ></div>
                
                {/* Image info overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent text-white z-20">
                  <span className="uppercase tracking-widest text-xs font-bold text-vinex-yellow mb-2 block">Ingredient</span>
                  <h4 className="text-3xl font-light">{item.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
