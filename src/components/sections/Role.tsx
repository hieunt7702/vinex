"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Fingerprint, ShieldCheck, Magnet, TrendingUp } from "lucide-react";

export const Role = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ".role-card",
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
        },
      }
    );
  }, []);

  const roles = [
    { icon: Fingerprint, title: "Xây dựng nhận diện", desc: "Định hình tính cách và bản sắc độc bản cho thương hiệu của bạn." },
    { icon: ShieldCheck, title: "Tăng niềm tin", desc: "Bảo chứng chất lượng, xây dựng sự uy tín tuyệt đối trong mắt khách hàng." },
    { icon: Magnet, title: "Thu hút khách hàng", desc: "Tạo lực hút tự nhiên, biến sự quan tâm thành hành động mua hàng." },
    { icon: TrendingUp, title: "Tăng doanh thu", desc: "Đột phá doanh số và duy trì sự tăng trưởng bền vững theo thời gian." },
  ];

  return (
    <section ref={container} className="py-16 lg:py-20 px-6 md:px-12 lg:px-24 bg-vinex-black text-vinex-white relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-vinex-blue/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl  font-bold text-vinex-white mb-6">Vai trò của Thương hiệu & Marketing</h2>
          <div className="w-24 h-1 bg-vinex-yellow mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, idx) => (
            <div key={idx} className="role-card group relative p-8 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden hover:bg-white/10 transition-colors duration-500">
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-vinex-yellow/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="mb-6 inline-flex p-4 rounded-lg bg-vinex-blue/40 text-vinex-yellow group-hover:scale-110 transition-transform duration-500">
                  <role.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl  font-bold mb-3">{role.title}</h3>
                <p className="text-sm  text-white/60 leading-relaxed">{role.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
