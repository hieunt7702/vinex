"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Q1", sales: 4000, leads: 2400 },
  { name: "Q2", sales: 3000, leads: 1398 },
  { name: "Q3", sales: 9800, leads: 5000 },
  { name: "Q4", sales: 12000, leads: 8000 },
];

export const DetailStages = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = gsap.utils.toArray(".stage-block");
    sections.forEach((section: Element | string | object) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        }
      );
    });
  }, []);

  return (
    <section ref={container} className="py-16 lg:py-20 bg-white text-vinex-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Stage 1 */}
        <div className="stage-block mb-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-xl  text-vinex-yellow font-bold uppercase mb-2">Giai đoạn 1</h3>
            <h2 className="text-4xl md:text-5xl  font-bold text-vinex-blue mb-6">Xây dựng chiến lược</h2>
            <ul className="space-y-4  text-lg text-black/70">
              <li className="flex gap-4">
                <span className="w-2 h-2 mt-2 bg-vinex-red rounded-full flex-shrink-0"></span>
                <span><strong className="text-vinex-black">Mục tiêu:</strong> Xác định cốt lõi và định vị thương hiệu.</span>
              </li>
              <li className="flex gap-4">
                <span className="w-2 h-2 mt-2 bg-vinex-red rounded-full flex-shrink-0"></span>
                <span><strong className="text-vinex-black">Công việc:</strong> Nghiên cứu thị trường, phân tích đối thủ, xây dựng Brand DNA.</span>
              </li>
              <li className="flex gap-4">
                <span className="w-2 h-2 mt-2 bg-vinex-red rounded-full flex-shrink-0"></span>
                <span><strong className="text-vinex-black">Đầu ra:</strong> Brand Guideline chiến lược toàn diện.</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-100 rounded-lg aspect-video overflow-hidden relative shadow-2xl group">
             {/* Mockup Placeholder */}
             <div className="absolute inset-0 bg-vinex-black flex items-center justify-center text-vinex-white group-hover:scale-105 transition-transform duration-700">
               <span className=" text-2xl opacity-50">Brand Guideline Mockup</span>
             </div>
          </div>
        </div>

        {/* Stage 2 */}
        <div className="stage-block mb-32">
          <div className="text-center mb-16">
            <h3 className="text-xl  text-vinex-yellow font-bold uppercase mb-2">Giai đoạn 2</h3>
            <h2 className="text-4xl md:text-5xl  font-bold text-vinex-blue">Nhận diện thương hiệu</h2>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {["Logo", "Namecard", "Catalogue", "Bao bì", "Đồng phục"].map((item, idx) => (
              <div key={idx} className={`break-inside-avoid bg-gray-100 rounded-lg overflow-hidden relative group ${idx % 2 === 0 ? 'aspect-square' : 'aspect-[3/4]'}`}>
                <div className="absolute inset-0 bg-vinex-indigo/5 flex items-center justify-center group-hover:bg-vinex-indigo/20 transition-colors duration-500">
                  <span className=" text-xl font-bold text-vinex-blue">{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage 3 */}
        <div className="stage-block mb-32 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 grid grid-cols-2 gap-4">
            {["Website", "Facebook", "TikTok", "Youtube"].map((channel, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-100 shadow-lg hover:-translate-y-2 transition-transform duration-300 flex items-center justify-center h-32">
                 <span className=" font-bold text-vinex-black">{channel}</span>
              </div>
            ))}
          </div>
          <div className="order-1 md:order-2">
            <h3 className="text-xl  text-vinex-yellow font-bold uppercase mb-2">Giai đoạn 3</h3>
            <h2 className="text-4xl md:text-5xl  font-bold text-vinex-blue mb-6">Ra mắt & Phủ sóng</h2>
            <p className="text-lg text-black/70 ">Triển khai đồng loạt trên đa nền tảng, tạo hiệu ứng truyền thông mạnh mẽ để đưa thương hiệu đến gần hơn với công chúng mục tiêu.</p>
          </div>
        </div>

        {/* Stage 4 */}
        <div className="stage-block mb-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-xl  text-vinex-yellow font-bold uppercase mb-2">Giai đoạn 4</h3>
            <h2 className="text-4xl md:text-5xl  font-bold text-vinex-blue mb-6">Bán hàng & Vận hành</h2>
            <p className="text-lg text-black/70  mb-6">Hệ thống hóa quy trình bán hàng bằng công nghệ, từ quản trị CRM, tự động hóa Email Marketing đến các chương trình Loyalty nuôi dưỡng khách hàng.</p>
          </div>
          <div className="flex flex-wrap gap-3">
             {["CRM", "Khách hàng", "Đơn hàng", "Chăm sóc", "Loyalty", "Email Automation"].map((tag, idx) => (
               <span key={idx} className="px-6 py-3 rounded-full bg-vinex-blue text-white  text-sm shadow-md">
                 {tag}
               </span>
             ))}
          </div>
        </div>

        {/* Stage 5 */}
        <div className="stage-block relative p-8 md:p-16 rounded-[2.5rem] bg-vinex-blue overflow-hidden text-white">
          {/* Glassmorphism background effect */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-vinex-yellow/30 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-xl  text-vinex-yellow font-bold uppercase mb-2">Giai đoạn 5</h3>
              <h2 className="text-4xl md:text-5xl  font-bold mb-6">Đánh giá & Tối ưu</h2>
              <p className="text-lg text-white/70 ">Theo dõi hiệu suất chiến dịch theo thời gian thực (Real-time). Cung cấp hệ thống Dashboard trực quan giúp ra quyết định nhanh chóng.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-lg h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" stroke="#ffffff" opacity={0.5} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{ backgroundColor: '#114c5a', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="sales" fill="#ffc703" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="leads" fill="#ffffff" radius={[4, 4, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
