"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CountUp from "react-countup";

export const KPI = () => {
  const container = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: container.current,
      start: "top 70%",
      onEnter: () => setInView(true),
      once: true,
    });

    gsap.fromTo(
      ".kpi-item",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
        }
      }
    );
  }, []);

  const kpis = [
    { num: "01", title: "Nhận diện", value: 98, suffix: "%" },
    { num: "02", title: "Traffic", value: 120, suffix: "K" },
    { num: "03", title: "Lead", value: 3500, suffix: "" },
    { num: "04", title: "Khách hàng", value: 500, suffix: "+" },
  ];

  return (
    <section ref={container} className="py-32 px-6 md:px-12 bg-vinex-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-20">
        <h2 className="text-3xl md:text-5xl  font-bold text-center mb-20 text-vinex-yellow">Kết quả kỳ vọng</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="kpi-item flex flex-col items-center">
              <span className="text-vinex-white/30  text-sm tracking-[0.2em] mb-4 block">NO. {kpi.num}</span>
              <div className="text-5xl md:text-7xl  font-bold text-white mb-4">
                {inView ? <CountUp end={kpi.value} duration={3} /> : "0"}
                <span className="text-vinex-red">{kpi.suffix}</span>
              </div>
              <h3 className="text-lg md:text-xl  text-vinex-white/70 uppercase tracking-wider">{kpi.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
