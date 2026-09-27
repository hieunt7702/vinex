"use client";

import React, { useState } from 'react';
import { GlassButton, GlassSelect } from '@/components/ui/glass';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ContactFormProps {
  submitText?: string;
}

export function ContactForm({ submitText = 'Gửi Yêu Cầu Tư Vấn' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contact: '',
    need: 'qua-tang',
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
        customerName: formData.company ? `${formData.name} (${formData.company})` : formData.name,
        phone: !isEmail ? formData.contact : '',
        email: isEmail ? formData.contact : '',
        location: 'Khách hàng Website',
        source: 'Website - Trang Liên Hệ',
        projectType: formData.need === 'cung-ung' 
          ? 'Cung ứng nguyên liệu' 
          : formData.need === 'qua-tang' 
          ? 'Tư vấn quà tặng doanh nghiệp' 
          : 'Hợp tác thương mại',
        needs: formData.message || 'Yêu cầu tư vấn trực tiếp từ website',
        notes: `Doanh nghiệp: ${formData.company || 'Không nêu'}. Liên hệ: ${formData.contact}`,
        status: 'NEW',
        priority: 'MEDIUM',
        leadClassification: 'WARM'
      };

      const res = await fetch('/api/v1/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Không thể gửi yêu cầu');

      setIsSuccess(true);
      toast.success('Gửi thông tin thành công! Chuyên viên VINEX sẽ liên hệ lại trong thời gian sớm nhất.');
      setFormData({ name: '', company: '', contact: '', need: 'qua-tang', message: '' });
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
          className="px-6 py-2.5 rounded-full bg-[#074751] text-white text-sm font-medium hover:bg-[#0d5962] transition-colors shadow-md"
        >
          Gửi yêu cầu khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-20">
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
          className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-xl px-5 py-4 text-vinex-charcoal placeholder:text-vinex-charcoal/40 focus:outline-none focus:border-vinex-teal/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]" 
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-vinex-teal">Doanh nghiệp</label>
        <input 
          type="text" 
          value={formData.company}
          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
          placeholder="Tên công ty hoặc doanh nghiệp..." 
          className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-xl px-5 py-4 text-vinex-charcoal placeholder:text-vinex-charcoal/40 focus:outline-none focus:border-vinex-teal/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]" 
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
          className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-xl px-5 py-4 text-vinex-charcoal placeholder:text-vinex-charcoal/40 focus:outline-none focus:border-vinex-teal/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]" 
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-vinex-teal">Nhu cầu</label>
        <select
          value={formData.need}
          onChange={(e) => setFormData(prev => ({ ...prev, need: e.target.value }))}
          className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-xl px-5 py-4 text-vinex-charcoal focus:outline-none focus:border-vinex-teal/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]"
        >
          <option value="cung-ung">Cung ứng nguyên liệu</option>
          <option value="qua-tang">Tư vấn quà tặng doanh nghiệp</option>
          <option value="hop-tac">Hợp tác thương mại</option>
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-vinex-teal">Nội dung chi tiết</label>
        <textarea 
          rows={5} 
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Mô tả cụ thể về nhu cầu hợp tác của bạn..." 
          className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-xl px-5 py-4 text-vinex-charcoal placeholder:text-vinex-charcoal/40 focus:outline-none focus:border-vinex-teal/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] resize-none"
        ></textarea>
      </div>

      <div className="pt-4">
        <GlassButton 
          type="submit" 
          disabled={isSubmitting}
          variant="primary" 
          size="lg" 
          className="w-full md:w-auto flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang gửi yêu cầu...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {submitText}
            </>
          )}
        </GlassButton>
      </div>
    </form>
  );
}
