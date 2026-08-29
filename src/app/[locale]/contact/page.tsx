"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, MessageCircle, Globe } from "lucide-react";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <main className="w-full flex flex-col min-h-screen pt-[120px] pb-24 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 w-full">
        
        <div className="text-center mb-10 md:mb-16">
          <span className="text-xs tracking-[0.2em] text-vinex-blue uppercase mb-4 font-bold block">GET IN TOUCH</span>
          <h1 className="text-4xl md:text-5xl font-bold text-vinex-black mb-6">Liên Hệ VINEX</h1>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
          <p className="text-gray-500 font-light max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Vui lòng để lại thông tin hoặc liên hệ trực tiếp qua các kênh dưới đây.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full">
              <h2 className="text-2xl font-bold text-vinex-black mb-8">Thông Tin Liên Hệ</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-10"></div>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-vinex-blue/5 flex items-center justify-center text-vinex-blue flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-vinex-black mb-1 uppercase tracking-wider">Hotline</p>
                    <p className="text-gray-600 font-light">(+84) 966 967 966</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-vinex-blue/5 flex items-center justify-center text-vinex-blue flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-vinex-black mb-1 uppercase tracking-wider">Email</p>
                    <p className="text-gray-600 font-light">info@vinexgroup.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-vinex-blue/5 flex items-center justify-center text-vinex-blue flex-shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-vinex-black mb-1 uppercase tracking-wider">Website</p>
                    <p className="text-gray-600 font-light leading-relaxed">www.vinexgroup.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-vinex-blue/5 flex items-center justify-center text-vinex-blue flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-vinex-black mb-1 uppercase tracking-wider">Văn Phòng Hà Nội</p>
                    <p className="text-gray-600 font-light leading-relaxed">
                      Sảnh 2B tòa nhà Sun Grand City - 69B Thụy Khuê - Hà Nội
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-vinex-blue/5 flex items-center justify-center text-vinex-blue flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-vinex-black mb-1 uppercase tracking-wider">Nhà máy sản xuất</p>
                    <p className="text-gray-600 font-light leading-relaxed">
                      Khu 6 Bằng Doãn, Xã Bằng Luân, Tỉnh Phú Thọ
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 cursor-pointer hover:bg-blue-100 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-800 flex-shrink-0 cursor-pointer hover:bg-blue-100 transition-colors">
                    <span className="font-bold text-xs">ZALO</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-vinex-black mb-8">Gửi Tin Nhắn</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-10"></div>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-vinex-black uppercase tracking-wider mb-2">Họ và tên</label>
                    <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-vinex-blue/20 focus:border-vinex-blue transition-all" placeholder="Nhập họ và tên..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-vinex-black uppercase tracking-wider mb-2">Số điện thoại</label>
                    <input type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-vinex-blue/20 focus:border-vinex-blue transition-all" placeholder="Nhập số điện thoại..." />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-vinex-black uppercase tracking-wider mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-vinex-blue/20 focus:border-vinex-blue transition-all" placeholder="Nhập địa chỉ email..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-vinex-black uppercase tracking-wider mb-2">Nội dung tin nhắn</label>
                  <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-vinex-blue/20 focus:border-vinex-blue transition-all resize-none" placeholder="Bạn cần hỗ trợ gì?"></textarea>
                </div>
                <Button variant="primary" className="w-full">
                  Gửi Thông Tin
                </Button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
