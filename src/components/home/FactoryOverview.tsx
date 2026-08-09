"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/layout/ScrollReveal";

export const FactoryOverview = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { name: "Tiếp nhận", alt: "Hình ảnh bước tiếp nhận điều thô", img: "/images/factory/step-1-tiep-nhan.jpg" },
    { name: "Bóc tách", alt: "Hình ảnh công đoạn bóc tách vỏ điều", img: "/images/factory/step-2-boc-tach.jpg" },
    { name: "Bóc lụa", alt: "Hình ảnh công đoạn bóc lụa nhân điều", img: "/images/factory/step-3-boc-lua.jpg" },
    { name: "Phân loại", alt: "Hình ảnh hệ thống phân loại nhân điều", img: "/images/factory/step-4-phan-loai.jpg" },
    { name: "Kiểm tra", alt: "Hình ảnh kiểm tra chất lượng KCS", img: "/images/factory/step-5-kiem-tra.jpg" },
    { name: "Đóng gói", alt: "Hình ảnh đóng gói và hút chân không", img: "/images/factory/step-6-dong-goi.jpg" },
  ];

  return (
    <section id="nha-may" className="py-24 bg-vinex-ivory px-4 overflow-hidden">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-vinex-blue mb-6">Nền tảng từ nhà máy bóc tách điều thô</h2>
            <p className="text-vinex-charcoal/80 mb-8 max-w-xl leading-relaxed">
              Điều thô được tiếp nhận, xử lý, bóc tách và phân loại để tạo ra nhân điều trắng phù hợp với yêu cầu cung ứng. Quy trình khép kín đảm bảo chất lượng hàng đầu.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`py-3 px-4 rounded-lg text-center text-sm font-bold transition-all duration-300 ${
                    activeStep === index
                      ? "bg-vinex-yellow text-vinex-blue shadow-lg scale-105"
                      : "bg-white text-vinex-charcoal hover:bg-gray-50 border border-gray-100"
                  }`}
                >
                  {step.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full h-[450px] bg-white rounded-2xl overflow-hidden shadow-xl flex items-center justify-center p-2 relative group cursor-pointer border border-gray-100">
            {/* The image will naturally break if not found, showing the alt text */}
            <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
              <img 
                src={steps[activeStep].img} 
                alt={steps[activeStep].alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
               {/* This text is just a fallback if image is totally broken and alt is not rendering beautifully */}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
