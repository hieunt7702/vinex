"use client";

import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageCircle, Globe, CheckCircle2, Loader2, Send } from "lucide-react";
import { usePathname } from 'next/navigation';
import { GlassCard, GlassButton, GlassInput, GlassTextarea } from "@/components/ui/glass";
import { toast } from 'sonner';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import { getApiUrl } from '@/lib/apiConfig';

export default function ContactPage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const { settings } = useGlobalSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập họ và tên');
      return;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      toast.error('Vui lòng nhập ít nhất số điện thoại hoặc email liên hệ');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email,
        location: 'Khách hàng Website',
        source: 'Website - Trang Contact',
        projectType: 'Liên hệ tư vấn chung',
        needs: formData.message || 'Yêu cầu liên hệ từ website',
        notes: `Email: ${formData.email || 'N/A'}, Phone: ${formData.phone || 'N/A'}`,
        status: 'NEW',
        priority: 'MEDIUM',
        leadClassification: 'WARM'
      };

      const res = await fetch(getApiUrl('/leads'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Không thể gửi yêu cầu');

      setIsSuccess(true);
      toast.success('Gửi thông tin thành công! VINEX sẽ liên hệ lại với bạn sớm nhất.');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      console.error('Lỗi khi gửi lead:', err);
      toast.error(`Có lỗi xảy ra khi gửi tin nhắn. Vui lòng liên hệ hotline: ${settings.hotline || '0988 888 888'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full flex flex-col min-h-screen pt-[120px] pb-24 ">
      <div className="max-w-[1536px] mx-auto px-4 md:px-8 xl:px-12 w-full">

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
                    <a href={`tel:${(settings.hotline || '0988 888 888').replace(/\s+/g, '')}`} className="text-vinex-teal font-semibold hover:underline">
                      {settings.hotline || '0988 888 888'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-vinex-teal/10 flex items-center justify-center text-vinex-teal shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-vinex-charcoal mb-1 uppercase tracking-wider">Email</p>
                    <a href={`mailto:${settings.contactEmail || 'info@vinexgroup.vn'}`} className="text-vinex-teal font-semibold hover:underline">
                      {settings.contactEmail || 'info@vinexgroup.vn'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-vinex-teal/10 flex items-center justify-center text-vinex-teal shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-vinex-charcoal mb-1 uppercase tracking-wider">Website</p>
                    <a href={settings.siteUrl || 'https://vinexgroup.vn'} target="_blank" rel="noopener noreferrer" className="text-vinex-charcoal/80 font-light leading-relaxed hover:underline">
                      {settings.siteUrl || 'www.vinexgroup.vn'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-vinex-teal/10 flex items-center justify-center text-vinex-teal shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-vinex-charcoal mb-1 uppercase tracking-wider">Địa chỉ / Nhà máy</p>
                    <p className="text-vinex-charcoal/80 font-light leading-relaxed">
                      {settings.address || 'Sảnh 2B tòa nhà Sun Grand City - 69B Thụy Khuê - Hà Nội & Khu 6 Bằng Doãn, Bằng Luân, Phú Thọ'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-black/5">
                  {settings.facebook && (
                    <a
                      href={settings.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-vinex-teal/10 flex items-center justify-center text-vinex-teal shrink-0 cursor-pointer hover:bg-vinex-teal hover:text-white transition-colors"
                      aria-label="Facebook"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    </a>
                  )}
                  {settings.zalo && (
                    <a
                      href={`https://zalo.me/${settings.zalo.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-vinex-teal/10 text-vinex-teal font-semibold text-xs shrink-0 cursor-pointer hover:bg-vinex-teal hover:text-white transition-colors"
                    >
                      ZALO: {settings.zalo}
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Contact Form */}
          <div>
            <GlassCard radius={16} displacementScale={15} blurAmount={0.06} className="bg-white/80 p-8 md:p-10 rounded-xl shadow-md border border-black/5">
              <h2 className="text-2xl font-marcellus text-vinex-teal mb-6">Gửi Tin Nhắn</h2>
              <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mb-10"></div>
              
              {isSuccess ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-marcellus text-vinex-teal mb-2">Đã nhận được thông tin!</h3>
                  <p className="text-sm text-vinex-charcoal/70 mb-6">
                    Chúng tôi sẽ phản hồi lại bạn qua số điện thoại hoặc email trong thời gian ngắn nhất.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-5 py-2 rounded-full bg-vinex-teal text-white text-xs font-semibold uppercase tracking-wider hover:bg-vinex-teal/90 transition-all shadow-sm"
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GlassInput 
                      label="Họ và tên *" 
                      required 
                      value={formData.name}
                      onChange={(e: any) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nhập họ và tên..." 
                    />
                    <GlassInput 
                      label="Số điện thoại" 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e: any) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Nhập số điện thoại..." 
                    />
                  </div>
                  <GlassInput 
                    label="Email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Nhập địa chỉ email..." 
                  />
                  <GlassTextarea 
                    label="Nội dung tin nhắn" 
                    rows={4} 
                    value={formData.message}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Bạn cần hỗ trợ gì?" 
                  />
                  <GlassButton 
                    type="submit" 
                    disabled={isSubmitting}
                    variant="primary" 
                    size="lg" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Gửi Thông Tin
                      </>
                    )}
                  </GlassButton>
                </form>
              )}
            </GlassCard>
          </div>

        </div>
      </div>
    </main>
  );
}

