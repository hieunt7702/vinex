"use client";

import React, { useState } from 'react';
import { GlassButton, GlassSelect } from '@/components/ui/glass';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';

const NEED_OPTIONS = [
  { value: 'Hộp quà Tết & Set quà doanh nghiệp', label: 'Tư vấn quà tặng doanh nghiệp (Hộp quà Tết, Set quà VIP)' },
  { value: 'Hạt điều tẩm vị & Hạt dinh dưỡng', label: 'Nông sản chế biến & Hạt điều (Bán buôn, Bán lẻ)' },
  { value: 'Trà Ô Long, Cà phê & Thảo mộc', label: 'Trà Ô Long, Cà phê & Thảo mộc cao cấp' },
  { value: 'Cung ứng nguyên liệu / Nông sản xuất khẩu', label: 'Cung ứng nguyên liệu & Nông sản xuất khẩu' },
  { value: 'Gia công sản phẩm theo yêu cầu (OEM/ODM)', label: 'Gia công sản phẩm theo yêu cầu (OEM / ODM)' },
  { value: 'Hợp tác thương mại & Phân phối', label: 'Hợp tác phân phối & Đại lý thương mại' },
  { value: 'Liên hệ tư vấn chung', label: 'Liên hệ & Tư vấn dịch vụ khác' }
];

interface ContactFormProps {
  submitText?: string;
}

export function ContactForm({ submitText = 'Gửi Yêu Cầu Tư Vấn' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contact: '',
    need: 'Hộp quà Tết & Set quà doanh nghiệp',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập họ tên đại diện');
      return;
    }
    if (!formData.contact.trim()) {
      toast.error('Vui lòng nhập số điện thoại hoặc email liên hệ');
      return;
    }

    setIsSubmitting(true);
    try {
      const isEmail = formData.contact.includes('@');
      const payload = {
        customerName: formData.name,
        companyName: formData.company || null,
        phone: !isEmail ? formData.contact : '',
        email: isEmail ? formData.contact : '',
        location: 'Khách hàng Website',
        source: 'Website - Trang Liên Hệ',
        productGroup: formData.need,
        purpose: formData.need,
        projectType: formData.need,
        notes: formData.message || 'Yêu cầu tư vấn trực tiếp từ website',
        status: 'NEW',
        priority: 'HIGH',
        leadClassification: 'HOT'
      };

      const res = await fetch(getApiUrl('/leads'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Không thể gửi yêu cầu');

      setIsSuccess(true);
      toast.success('Gửi thông tin thành công! Chuyên viên VINEX sẽ liên hệ lại trong thời gian sớm nhất.');
      setFormData({ name: '', company: '', contact: '', need: 'Hộp quà Tết & Set quà doanh nghiệp', message: '' });
    } catch (err) {
      console.error('Lỗi khi gửi lead:', err);
      toast.error('Có lỗi xảy ra khi gửi thông tin. Vui lòng liên hệ hotline: 0966 967 966');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-12 px-6 text-center flex flex-col items-center justify-center bg-white/40 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-lg">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-marcellus text-[#074751] mb-2">Gửi thông tin thành công!</h3>
        <p className="text-sm text-[#074751]/80 max-w-md mx-auto mb-6">
          Cảm ơn quý khách đã quan tâm đến sản phẩm và dịch vụ của VINEX. Đội ngũ chuyên viên tư vấn sẽ liên hệ lại với quý khách trong vòng 24 giờ.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="px-6 py-2.5 rounded-full bg-[#074751] text-white text-sm font-medium hover:bg-[#0d5962] transition-colors shadow-md cursor-pointer"
        >
          Gửi yêu cầu khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-7 relative z-20">
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-vinex-teal">
          Họ tên đại diện <span className="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          placeholder="Nhập họ tên của bạn..." 
          className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-xl px-5 py-3.5 text-vinex-charcoal placeholder:text-vinex-charcoal/40 focus:outline-none focus:border-vinex-teal/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] text-sm" 
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-vinex-teal">Doanh nghiệp</label>
        <input 
          type="text" 
          value={formData.company}
          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
          placeholder="Tên công ty hoặc doanh nghiệp..." 
          className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-xl px-5 py-3.5 text-vinex-charcoal placeholder:text-vinex-charcoal/40 focus:outline-none focus:border-vinex-teal/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] text-sm" 
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-vinex-teal">
          Điện thoại / Email <span className="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          value={formData.contact}
          onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
          required
          placeholder="Nhập số điện thoại hoặc email liên hệ..." 
          className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-xl px-5 py-3.5 text-vinex-charcoal placeholder:text-vinex-charcoal/40 focus:outline-none focus:border-vinex-teal/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] text-sm" 
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-vinex-teal">Nhu cầu</label>
        <GlassSelect
          options={NEED_OPTIONS}
          value={formData.need}
          onChange={(val) => setFormData(prev => ({ ...prev, need: val }))}
          placeholder="Chọn nhóm nhu cầu quan tâm..."
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-vinex-teal">Nội dung chi tiết</label>
        <textarea 
          rows={4} 
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Mô tả cụ thể về nhu cầu hợp tác của bạn..." 
          className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-xl px-5 py-3.5 text-vinex-charcoal placeholder:text-vinex-charcoal/40 focus:outline-none focus:border-vinex-teal/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] resize-none text-sm" 
        ></textarea>
      </div>

      <div className="pt-2">
        <GlassButton 
          type="submit" 
          disabled={isSubmitting}
          variant="primary" 
          size="lg" 
          leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          className="w-full sm:w-auto px-8 py-3.5 flex items-center justify-center font-medium shadow-[0_8px_25px_rgba(7,71,81,0.25)] hover:shadow-[0_12px_32px_rgba(7,71,81,0.38)] cursor-pointer"
        >
          {isSubmitting ? 'Đang gửi yêu cầu...' : submitText}
        </GlassButton>
      </div>
    </form>
  );
}
