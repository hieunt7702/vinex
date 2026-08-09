"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";

export const GalleryGift = () => {
  const container = useRef<HTMLDivElement>(null);
  const [selectedImg, setSelectedImg] = useState<any>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const items = gsap.utils.toArray(".gallery-pic");
    
    gsap.fromTo(
      items,
      { opacity: 0, y: 100 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.1, 
        duration: 1.2, 
        ease: "power3.out",
        scrollTrigger: { 
          trigger: container.current, 
          start: "top 80%" 
        } 
      }
    );
  }, []);

  const images = [
    { id: 1, title: "The Art of Giving", img: "/images/product/bao_bi_qua_tang/p11.png", aspect: "aspect-[3/4]", size: "row-span-2" },
    { id: 2, title: "Premium Textures", img: "/images/product/bao_bi_qua_tang/p12.png", aspect: "aspect-square", size: "row-span-1" },
    { id: 3, title: "Golden Details", img: "/images/product/bao_bi_qua_tang/p13.png", aspect: "aspect-[4/3]", size: "row-span-1" },
    { id: 4, title: "Elegant Unboxing", img: "/images/product/bao_bi_qua_tang/p14.png", aspect: "aspect-square", size: "row-span-1" },
    { id: 5, title: "Joyful Moments", img: "/images/product/bao_bi_qua_tang/p15.png", aspect: "aspect-[3/4]", size: "row-span-2" },
    { id: 6, title: "Timeless Quality", img: "/images/product/bao_bi_qua_tang/p16.png", aspect: "aspect-[4/3]", size: "row-span-1" },
  ];

  return (
    <section ref={container} className="py-32 bg-vinex-white text-vinex-black">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-widest text-vinex-blue uppercase mb-4">Product Gallery</h2>
            <h3 className="text-4xl md:text-6xl font-light text-vinex-black tracking-tight leading-none">Moments of <br/><span className="text-vinex-blue italic font-bold">Appreciation</span></h3>
          </div>
          <div className="hidden md:block w-32 h-[1px] bg-vinex-yellow mb-2"></div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {images.map((img) => (
            <div 
              key={img.id}
              className={`gallery-pic relative w-full ${img.aspect} bg-gray-100 overflow-hidden cursor-pointer group break-inside-avoid shadow-lg hover:shadow-2xl transition-shadow duration-500`}
              onClick={() => setSelectedImg(img)}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                style={{ backgroundImage: `url(${img.img})` }}
              ></div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-vinex-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="text-vinex-yellow text-xs font-bold tracking-widest uppercase mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Vinex Gallery</span>
                <h4 className="text-white text-2xl font-light translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{img.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          <div className="absolute inset-0 bg-vinex-black/95 backdrop-blur-md cursor-pointer" onClick={() => setSelectedImg(null)}></div>
          
          <div className="relative w-full max-w-7xl h-full flex items-center justify-center z-10">
            <button className="absolute top-4 right-4 md:-top-8 md:-right-8 text-white/50 hover:text-white transition-colors p-2" onClick={() => setSelectedImg(null)}>
              <X size={40} strokeWidth={1} />
            </button>
            
            <img 
              src={selectedImg.img} 
              alt={selectedImg.title} 
              className="max-w-full max-h-full object-contain shadow-2xl" 
            />
            
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
              <h3 className="text-2xl md:text-4xl font-light text-white drop-shadow-lg">{selectedImg.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
