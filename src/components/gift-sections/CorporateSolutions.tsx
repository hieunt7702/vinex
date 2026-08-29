"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Handshake, Crown, UserCheck, Building2 } from "lucide-react";

export const CorporateSolutions = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(
      ".solution-card",
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        }
      }
    );
  }, []);

  const solutions = [
    { icon: Users, title: "Employees", desc: "Meaningful gifts to appreciate and motivate your workforce during the festive season." },
    { icon: Handshake, title: "Partners", desc: "Strengthen business relationships with premium gifts that leave a lasting impression." },
    { icon: Crown, title: "VIP Clients", desc: "Exclusive, highly personalized collections designed for your most valuable clients." },
    { icon: UserCheck, title: "Executives", desc: "Sophisticated offerings crafted specifically for C-level and senior management." },
    { icon: Building2, title: "Government Agencies", desc: "Elegant and compliant gift solutions tailored for public sector relationships." },
  ];

  return (
    <section ref={container} className="py-16 lg:py-20 px-6 md:px-12 bg-vinex-blue text-vinex-white">
      <div className="max-w-[90rem] mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold tracking-widest text-vinex-yellow uppercase mb-4">Corporate Solutions</h2>
          <h3 className="text-4xl md:text-6xl font-light mb-6">Tailored for Every <span className="font-bold">Relationship</span></h3>
          <div className="w-12 h-[1px] bg-vinex-yellow mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {solutions.map((sol, idx) => (
            <div key={idx} className="solution-card group relative p-8 bg-white/5 border border-white/10 hover:border-vinex-yellow/50 transition-all duration-500 overflow-hidden flex flex-col items-center text-center backdrop-blur-sm hover:bg-white/10 hover:-translate-y-2 cursor-pointer">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-vinex-yellow to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
              
              <div className="w-16 h-16 rounded-full bg-vinex-yellow/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-vinex-yellow">
                <sol.icon className="text-vinex-yellow group-hover:text-vinex-blue transition-colors duration-500" size={28} strokeWidth={1.5} />
              </div>
              <h4 className="text-xl font-bold mb-3">{sol.title}</h4>
              <p className="text-sm text-white/70 font-light leading-relaxed">{sol.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
