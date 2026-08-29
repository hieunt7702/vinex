"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CountUp from "react-countup";

export const About = () => {
  const container = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: container.current,
      start: "top 75%",
      onEnter: () => setInView(true),
      once: true,
    });

    gsap.fromTo(
      ".about-text",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  const stats = [
    { num: 6, suffix: "+", label: "Năm phát triển" },
    { num: 50, suffix: "+", label: "Đối tác chiến lược" },
    { num: 100, suffix: "+", label: "Khách hàng" },
    { num: 1000, suffix: "+", label: "Dự án thành công" },
  ];

  return (
    <section ref={container} className="py-16 lg:py-20 px-6 md:px-12 lg:px-24 bg-vinex-white text-vinex-black relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="about-text text-4xl md:text-5xl  font-bold text-vinex-blue mb-6">
            Giới thiệu VINEX
          </h2>
          <p className="about-text text-lg text-vinex-black/80  leading-relaxed mb-8">
            Chúng tôi tự hào là đơn vị tiên phong trong việc cung cấp các giải pháp marketing, xây dựng thương hiệu và phát triển hệ thống toàn diện. Với sự am hiểu sâu sắc về thị trường, Vinex cam kết mang lại giá trị bền vững và sự khác biệt cho doanh nghiệp.
          </p>
          
          <div className="about-text relative pl-6 border-l-2 border-vinex-yellow">
            <h3 className="text-xl font-bold  text-vinex-indigo mb-2">Tầm nhìn chiến lược</h3>
            <p className="text-vinex-black/70 ">Trở thành bệ phóng vững chắc nhất, đồng hành cùng khát vọng vươn xa của các thương hiệu Việt Nam trên trường quốc tế.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 md:gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="about-text p-6 rounded-lg bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-black/5 hover:-translate-y-2 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold  text-vinex-yellow mb-2">
                {inView ? <CountUp end={stat.num} duration={2.5} /> : "0"}
                <span className="text-vinex-red">{stat.suffix}</span>
              </div>
              <p className="text-sm md:text-base  text-vinex-black/60 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
