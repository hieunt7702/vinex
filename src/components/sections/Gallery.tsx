"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ZoomIn, X } from "lucide-react";

const images = [
  { id: 1, type: "Logo", title: "VINEX Primary" },
  { id: 2, type: "Bao bì", title: "Premium Box" },
  { id: 3, type: "Catalogue", title: "Brand Profile" },
  { id: 4, type: "Poster", title: "Campaign OOH" },
  { id: 5, type: "Banner", title: "Digital Ads" },
  { id: 6, type: "POSM", title: "Retail Display" },
];

export const Gallery = () => {
  const container = useRef<HTMLDivElement>(null);
  type ImageItem = { id: number, type: string, title: string };
  const [selectedImg, setSelectedImg] = useState<ImageItem | null>(null);

  useEffect(() => {
    gsap.fromTo(
      ".gallery-item",
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%",
        }
      }
    );
  }, []);

  useEffect(() => {
    if (selectedImg) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(".lightbox-overlay", { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(".lightbox-content", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" });
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedImg]);

  return (
    <section ref={container} className="py-16 lg:py-20 px-6 md:px-12 bg-white text-vinex-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl  font-bold text-vinex-blue mb-4">Bộ nhận diện mẫu</h2>
          <p className="text-lg text-black/60 ">Chạm vào từng thiết kế để khám phá sự tinh tế trong ngôn ngữ hình ảnh.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {images.map((img) => (
            <div 
              key={img.id} 
              className="gallery-item relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImg(img)}
            >
              <div className="absolute inset-0 bg-vinex-black/0 group-hover:bg-vinex-black/40 transition-colors duration-300 z-10 flex items-center justify-center">
                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-50 group-hover:scale-100" size={48} strokeWidth={1} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-vinex-blue/20 group-hover:scale-110 transition-transform duration-700">
                <span className=" text-xl font-bold">{img.type} Image</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GSAP Lightbox */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="lightbox-overlay absolute inset-0 bg-vinex-black/95 backdrop-blur-sm cursor-pointer"
            onClick={() => setSelectedImg(null)}
          ></div>
          
          <div className="lightbox-content relative z-10 w-full max-w-5xl bg-white p-2 rounded-lg shadow-2xl">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-vinex-yellow transition-colors"
              onClick={() => setSelectedImg(null)}
            >
              <X size={32} />
            </button>
            <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-100 rounded-lg flex items-center justify-center">
               <h3 className="text-4xl  font-bold text-vinex-blue">{selectedImg.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
