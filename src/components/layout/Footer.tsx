"use client";

import React, { useRef } from "react";
import { Logo } from "@/components/Logo";
import { MapPin, Mail, Phone } from "lucide-react";
import { motion, useInView } from "framer-motion";

export const Footer = () => {
  const container = useRef<HTMLDivElement>(null);
  const isInView = useInView(container, { once: true, margin: "-10%" });

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const colVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 80, damping: 20 }
    }
  };

  return (
    <footer ref={container} className="bg-vinex-blue text-white relative pt-16 pb-6 overflow-hidden">
      {/* Top Bar with Gold Star SVG */}
      <div className="absolute top-0 left-0 w-full border-t border-vinex-yellow/30">
        <div className="absolute left-1/2 -top-[7px] -translate-x-1/2 bg-vinex-blue px-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 0C7 3.86599 3.86599 7 0 7C3.86599 7 7 10.134 7 14C7 10.134 10.134 7 14 7C10.134 7 7 3.86599 7 0Z" fill="#FFC703"/>
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <motion.div 
          variants={footerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-16"
        >
          
          {/* Column 1: Brand & Info */}
          <motion.div variants={colVariants} className="lg:col-span-3">
            <div className="mb-6 inline-block">
              <Logo lang="vi" />
            </div>
            <p className="text-sm text-white/70 font-light leading-relaxed mb-6 max-w-[16rem]">
              VINEX mang đến những bộ quà Tết cao cấp, được tuyển chọn tinh tế, trao gửi giá trị và gắn kết yêu thương.
            </p>
            <div className="flex items-center gap-3">
              {/* Social Icons */}
              <motion.a whileHover={{ y: -4, backgroundColor: "#FFC703", color: "#0A323B" }} transition={{ type: "spring", stiffness: 400, damping: 10 }} href="#" className="w-8 h-8 rounded-full border border-vinex-yellow flex items-center justify-center text-vinex-yellow transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>
              </motion.a>
              <motion.a whileHover={{ y: -4, backgroundColor: "#FFC703", color: "#0A323B" }} transition={{ type: "spring", stiffness: 400, damping: 10 }} href="#" className="w-8 h-8 rounded-full border border-vinex-yellow flex items-center justify-center text-vinex-yellow transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21.582 6.186a2.506 2.506 0 0 0-1.766-1.766C18.257 4 12 4 12 4s-6.257 0-7.816.42a2.506 2.506 0 0 0-1.766 1.766C2 7.743 2 12 2 12s0 4.257.418 5.814a2.506 2.506 0 0 0 1.766 1.766C5.743 20 12 20 12 20s6.257 0 7.816-.42a2.506 2.506 0 0 0 1.766-1.766C22 16.257 22 12 22 12s0-4.257-.418-5.814zM9.999 15.594v-7.189l6.502 3.595-6.502 3.594z"/></svg>
              </motion.a>
              <motion.a whileHover={{ y: -4, backgroundColor: "#FFC703", color: "#0A323B" }} transition={{ type: "spring", stiffness: 400, damping: 10 }} href="#" className="w-8 h-8 rounded-full border border-vinex-yellow flex items-center justify-center text-vinex-yellow transition-colors text-xs font-bold font-sans">
                Zalo
              </motion.a>
              <motion.a whileHover={{ y: -4, backgroundColor: "#FFC703", color: "#0A323B" }} transition={{ type: "spring", stiffness: 400, damping: 10 }} href="#" className="w-8 h-8 rounded-full border border-vinex-yellow flex items-center justify-center text-vinex-yellow transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Column 2: VỀ VINEX */}
          <motion.div variants={colVariants} className="lg:col-span-2">
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm font-sans">VỀ VINEX</h4>
            <ul className="space-y-3 text-white/70 font-light text-sm">
              <li><a href="#" className="hover:text-vinex-yellow transition-colors hover:translate-x-1 inline-block transform duration-300">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-vinex-yellow transition-colors hover:translate-x-1 inline-block transform duration-300">Sứ mệnh</a></li>
              <li><a href="#" className="hover:text-vinex-yellow transition-colors hover:translate-x-1 inline-block transform duration-300">Tầm nhìn</a></li>
              <li><a href="#" className="hover:text-vinex-yellow transition-colors hover:translate-x-1 inline-block transform duration-300">Giá trị cốt lõi</a></li>
              <li><a href="#" className="hover:text-vinex-yellow transition-colors hover:translate-x-1 inline-block transform duration-300">Tin tức</a></li>
            </ul>
          </motion.div>

          {/* Column 3: BỘ SƯU TẬP */}
          <motion.div variants={colVariants} className="lg:col-span-2">
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm font-sans">BỘ SƯU TẬP</h4>
            <ul className="space-y-3 text-white/70 font-light text-sm">
              <li><a href="#" className="hover:text-vinex-yellow transition-colors hover:translate-x-1 inline-block transform duration-300">Premium</a></li>
              <li><a href="#" className="hover:text-vinex-yellow transition-colors hover:translate-x-1 inline-block transform duration-300">Executive</a></li>
              <li><a href="#" className="hover:text-vinex-yellow transition-colors hover:translate-x-1 inline-block transform duration-300">Business</a></li>
              <li><a href="#" className="hover:text-vinex-yellow transition-colors hover:translate-x-1 inline-block transform duration-300">Family</a></li>
              <li><a href="#" className="hover:text-vinex-yellow transition-colors hover:translate-x-1 inline-block transform duration-300">Special</a></li>
            </ul>
          </motion.div>

          {/* Column 4: HỖ TRỢ */}
          <motion.div variants={colVariants} className="lg:col-span-2">
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm font-sans">HỖ TRỢ</h4>
            <ul className="space-y-3 text-white/70 font-light text-sm">
              <li><a href="#" className="hover:text-vinex-yellow transition-colors hover:translate-x-1 inline-block transform duration-300">Chính sách đặt hàng</a></li>
              <li><a href="#" className="hover:text-vinex-yellow transition-colors hover:translate-x-1 inline-block transform duration-300">Chính sách giao hàng</a></li>
              <li><a href="#" className="hover:text-vinex-yellow transition-colors hover:translate-x-1 inline-block transform duration-300">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-vinex-yellow transition-colors hover:translate-x-1 inline-block transform duration-300">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="hover:text-vinex-yellow transition-colors hover:translate-x-1 inline-block transform duration-300">Liên hệ</a></li>
            </ul>
          </motion.div>

          {/* Column 5: LIÊN HỆ & QR */}
          <motion.div variants={colVariants} className="lg:col-span-3 flex justify-between">
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm font-sans">LIÊN HỆ</h4>
              <ul className="space-y-4 text-white/70 font-light text-sm">
                <li className="flex items-start gap-3 group">
                  <Phone size={16} className="text-vinex-yellow shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-white transition-colors">1900 1234 56</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <Mail size={16} className="text-vinex-yellow shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-white transition-colors">hello@vinex.vn</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <svg className="w-4 h-4 text-vinex-yellow shrink-0 mt-0.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="group-hover:text-white transition-colors">www.vinex.vn</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <MapPin size={16} className="text-vinex-yellow shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="leading-snug group-hover:text-white transition-colors">Số 123, Đường ABC, Quận 1,<br/>TP. Hồ Chí Minh</span>
                </li>
              </ul>
            </div>
            
            <div className="ml-4 shrink-0">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-24 h-24 bg-white rounded p-1.5 flex items-center justify-center cursor-pointer"
              >
                <div className="w-full h-full border border-dashed border-gray-300 flex items-center justify-center hover:border-vinex-yellow transition-colors">
                  <span className="text-vinex-black text-[10px] text-center font-bold">QR CODE</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Bottom Bar with Gold Star SVG */}
      <div className="relative border-t border-vinex-yellow/30 mt-8 pt-6">
        {/* Absolute center star */}
        <div className="absolute left-1/2 -top-[7px] -translate-x-1/2 bg-vinex-blue px-4">
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 0C7 3.86599 3.86599 7 0 7C3.86599 7 7 10.134 7 14C7 10.134 10.134 7 14 7C10.134 7 7 3.86599 7 0Z" fill="#FFC703"/>
            </svg>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="max-w-[90rem] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-[11px] font-light tracking-wide"
        >
          <p>© 2024 VINEX. All rights reserved.</p>
          <p>Thiết kế và phát triển bởi VINEX Team</p>
        </motion.div>
      </div>
    </footer>
  );
};
