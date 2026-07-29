"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const FAQ = () => {
  const container = useRef<HTMLDivElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(
      ".faq-item",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: container.current, start: "top 75%" } }
    );
  }, []);

  const faqs = [
    { q: "Do you offer corporate logo customization on the gift boxes?", a: "Yes. We offer premium customization including hot foil stamping, embossing, and custom greeting cards tailored to your brand identity." },
    { q: "What is the Minimum Order Quantity (MOQ)?", a: "Our standard MOQ is 50 boxes for existing collections and 200 boxes for entirely bespoke designs. Please contact us for flexible arrangements." },
    { q: "How long does production and delivery take?", a: "Production typically takes 7-15 business days depending on the customization complexity and quantity ordered." },
    { q: "Can you deliver directly to our clients' addresses?", a: "Absolutely. We provide comprehensive fulfillment services, ensuring each gift is safely delivered to individual recipients nationwide." },
    { q: "Are VAT invoices provided?", a: "Yes, all corporate orders include a valid VAT invoice." },
  ];

  return (
    <section ref={container} className="py-32 bg-vinex-white text-vinex-black">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold tracking-widest text-vinex-blue uppercase mb-4">FAQ</h2>
          <h3 className="text-4xl md:text-5xl font-light mb-6">Common <span className="font-bold text-vinex-blue">Inquiries</span></h3>
          <div className="w-12 h-[1px] bg-vinex-yellow mx-auto"></div>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item border-b border-black/10">
              <button 
                className="w-full flex items-center justify-between py-6 text-left group"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                <h3 className={`font-light text-xl md:text-2xl transition-colors duration-300 ${openIdx === idx ? 'text-vinex-yellow' : 'text-vinex-black group-hover:text-vinex-blue'}`}>{faq.q}</h3>
                <div className={`relative w-6 h-6 flex items-center justify-center transition-transform duration-500 ${openIdx === idx ? 'rotate-180' : ''}`}>
                  <span className={`absolute w-full h-[1px] transition-colors duration-300 ${openIdx === idx ? 'bg-vinex-yellow' : 'bg-black/30 group-hover:bg-vinex-blue'}`}></span>
                  <span className={`absolute w-[1px] h-full transition-transform duration-500 ${openIdx === idx ? 'rotate-90 bg-transparent' : 'bg-black/30 group-hover:bg-vinex-blue'}`}></span>
                </div>
              </button>
              
              <div 
                className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ maxHeight: openIdx === idx ? '200px' : '0', opacity: openIdx === idx ? 1 : 0 }}
              >
                <p className="pb-8 pt-2 text-black/60 font-light leading-relaxed max-w-3xl">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
