"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const BrandStory = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 60%",
      }
    });

    tl.fromTo(".story-text", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.5, stagger: 0.3, ease: "power3.out" })
      .fromTo(".story-img", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }, "-=1");
  }, []);

  return (
    <section ref={container} className="py-32 px-6 md:px-12 bg-vinex-white text-vinex-black overflow-hidden relative">
      <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Storytelling Text */}
        <div className="order-2 lg:order-1">
          <div className="mb-12">
            <h2 className="story-text text-sm font-bold tracking-widest text-vinex-blue uppercase mb-4">Our Story</h2>
            <h3 className="story-text text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Crafting <span className="text-vinex-blue font-light italic">Legacy</span>
            </h3>
            <div className="story-text w-16 h-[1px] bg-vinex-yellow mb-8"></div>
          </div>
          
          <div className="space-y-8">
            <p className="story-text text-lg md:text-xl font-light leading-relaxed text-black/80">
              VINEX was born from a profound respect for Vietnamese traditions, blended seamlessly with modern luxury. We believe that a gift is more than just an object; it is a bridge that connects hearts, builds trust, and fosters meaningful relationships.
            </p>
            <p className="story-text text-lg md:text-xl font-light leading-relaxed text-black/80">
              Every detail, from the finest ingredients to the meticulous packaging, is carefully curated to reflect elegance and sophistication, making each VINEX box a masterpiece of gratitude.
            </p>
          </div>

          <div className="story-text mt-12 grid grid-cols-2 gap-8 border-t border-black/10 pt-8">
            <div>
              <span className="block text-4xl font-bold text-vinex-blue mb-2">10+</span>
              <span className="text-sm uppercase tracking-widest text-black/50 font-bold">Years of Heritage</span>
            </div>
            <div>
              <span className="block text-4xl font-bold text-vinex-blue mb-2">500+</span>
              <span className="text-sm uppercase tracking-widest text-black/50 font-bold">Corporate Partners</span>
            </div>
          </div>
        </div>

        {/* Beautiful Photography */}
        <div className="order-1 lg:order-2 relative story-img">
          <div className="aspect-[3/4] w-full max-w-lg mx-auto lg:ml-auto relative z-10">
            <div className="absolute inset-0 bg-[url('/hero1.png')] bg-cover bg-center shadow-2xl"></div>
            {/* Minimal Timeline Overlay */}
            <div className="absolute -left-8 md:-left-16 bottom-16 bg-white p-8 shadow-xl max-w-xs z-20 border border-black/5">
              <span className="text-vinex-yellow text-xs font-bold tracking-widest uppercase mb-2 block">Since 2014</span>
              <h4 className="text-xl font-bold mb-2">A Journey of Perfection</h4>
              <p className="text-sm text-black/60 font-light">Continuously elevating the standard of corporate gifting.</p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-vinex-blue/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-12 right-12 w-48 h-48 bg-vinex-yellow/10 rounded-full blur-2xl -z-10"></div>
        </div>
      </div>
    </section>
  );
};
