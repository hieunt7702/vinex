"use client";

import { Mail, MapPin, Phone, MessageCircle, Globe } from "lucide-react";
import { usePathname } from 'next/navigation';
import { GlassCard, GlassButton, GlassInput, GlassTextarea, Glass } from "@/components/ui/glass";

export default function ContactPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  return (
    <main className="w-full flex flex-col min-h-screen pt-[120px] pb-24 ">
      <div className="max-w-7xl mx-auto px-4 w-full">

        <div className="text-center mb-10 md:mb-16">
          <span className="text-xs tracking-[0.2em] text-vinex-teal uppercase mb-4 font-semibold block">GET IN TOUCH</span>
          <h1 className="text-4xl md:text-5xl font-marcellus text-vinex-teal mb-6">Liên Hệ VINEX</h1>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-8"></div>
          <p className="text-vinex-charcoal/70 font-light max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Vui lòng để lại thông tin hoặc liên hệ trực tiếp qua các kênh dưới đây.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Contact Info */}
          <div>
            <GlassCard radius={16} displacementScale={15} blurAmount={0.06} className="bg-white/80 p-8 rounded-xl shadow-md border border-black/5 h-full">
              <h2 className="text-2xl font-marcellus text-vinex-teal mb-6">Thông Tin Liên Hệ</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-10"></div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-vinex-teal/10 flex items-center justify-center text-vinex-teal shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-vinex-charcoal mb-1 uppercase tracking-wider">Hotline</p>
                    <p className="text-vinex-charcoal/80 font-semibold">(+84) 966 967 966</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-vinex-teal/10 flex items-center justify-center text-vinex-teal shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-vinex-charcoal mb-1 uppercase tracking-wider">Email</p>
                    <p className="text-vinex-charcoal/80 font-semibold">info@vinexgroup.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-vinex-teal/10 flex items-center justify-center text-vinex-teal shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-vinex-charcoal mb-1 uppercase tracking-wider">Website</p>
                    <p className="text-vinex-charcoal/80 font-light leading-relaxed">www.vinexgroup.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-vinex-teal/10 flex items-center justify-center text-vinex-teal shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-vinex-charcoal mb-1 uppercase tracking-wider">Văn Phòng Hà Nội</p>
                    <p className="text-vinex-charcoal/80 font-light leading-relaxed">
                      Sảnh 2B tòa nhà Sun Grand City - 69B Thụy Khuê - Hà Nội
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-vinex-teal/10 flex items-center justify-center text-vinex-teal shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-vinex-charcoal mb-1 uppercase tracking-wider">Nhà máy sản xuất</p>
                    <p className="text-vinex-charcoal/80 font-light leading-relaxed">
                      Khu 6 Bằng Doãn, Xã Bằng Luân, Tỉnh Phú Thọ
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-black/5">
                  <div className="w-10 h-10 rounded-full bg-vinex-teal/10 flex items-center justify-center text-vinex-teal shrink-0 cursor-pointer hover:bg-vinex-teal hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="px-4 py-2 rounded-full bg-vinex-teal/10 text-vinex-teal font-semibold text-xs shrink-0 cursor-pointer hover:bg-vinex-teal hover:text-white transition-colors">
                    ZALO
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Contact Form */}
          <div>
            <GlassCard radius={16} displacementScale={15} blurAmount={0.06} className="bg-white/80 p-8 md:p-10 rounded-xl shadow-md border border-black/5">
              <h2 className="text-2xl font-marcellus text-vinex-teal mb-6">Gửi Tin Nhắn</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-10"></div>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassInput label="Họ và tên" placeholder="Nhập họ và tên..." />
                  <GlassInput label="Số điện thoại" type="tel" placeholder="Nhập số điện thoại..." />
                </div>
                <GlassInput label="Email" type="email" placeholder="Nhập địa chỉ email..." />
                <GlassTextarea label="Nội dung tin nhắn" rows={4} placeholder="Bạn cần hỗ trợ gì?" />
                <GlassButton variant="primary" size="lg" className="w-full">
                  Gửi Thông Tin
                </GlassButton>
              </form>
            </GlassCard>
          </div>

        </div>
      </div>
    </main>
  );
}
