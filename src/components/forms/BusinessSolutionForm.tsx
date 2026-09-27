"use client";

import React, { useState } from 'react';
import { GlassButton, GlassCard, GlassInput, GlassTextarea } from '@/components/ui/glass';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';

export function BusinessSolutionForm() {
  const [formData, setFormData] = useState({
    productGroup: '',
    purpose: '',
    quantity: '',
    budget: '',
    timeline: '',
    contact: '',
    requirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contact.trim()) {
      toast.error('Vui lòng nhập thông tin liên hệ (Tên, SĐT hoặc Email)');
      return;
    }

    setIsSubmitting(true);
    try {
      const isEmail = formData.contact.includes('@');
      const isPhone = /^[0-9+() -]+$/.test(formData.contact.trim());

      const payload = {
        customerName: formData.contact,
        phone: isPhone ? formData.contact : '',
        email: isEmail ? formData.contact : '',
        location: 'Khách hàng B2B Website',
        source: 'Website - Giải Pháp Doanh Nghiệp',
        projectType: 'Giải pháp sản phẩm theo nhu cầu doanh nghiệp',
        budget: formData.budget || 'Thương lượng theo số lượng',
        timeline: formData.timeline || 'Theo tiến độ dự án',
        priority: 'HIGH',
        leadClassification: 'HOT',
        needs: `Nhóm sản phẩm: ${formData.productGroup || 'Chưa chọn'}. Mục đích: ${formData.purpose || 'N/A'}. Số lượng: ${formData.quantity || 'N/A'}. Yêu cầu quy cách: ${formData.requirements || 'N/A'}`,
        notes: `Thông tin đại diện: ${formData.contact}. Thời gian dự kiến: ${formData.timeline || 'N/A'}`,
        status: 'NEW'
      };

      const res = await fetch(getApiUrl('/leads'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Không thể gửi yêu cầu');

      setIsSuccess(true);
      toast.success('Gửi nhu cầu thành công! Đội ngũ phát triển sản phẩm B2B của VINEX sẽ liên hệ lại với bạn ngay.');
      setFormData({
        productGroup: '',
        purpose: '',
        quantity: '',
        budget: '',
        timeline: '',
        contact: '',
        requirements: ''
      });
    } catch (err) {
      console.error('Lỗi gửi nhu cầu:', err);
      toast.error('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng liên hệ hotline: 0966 967 966');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <GlassCard variant="elevated" className="p-8 sm:p-12 md:p-16 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl md:text-3xl font-marcellus text-vinex-teal mb-3">Đã Ghi Nhận Nhu Cầu Sản Phẩm!</h3>
        <p className="text-gray-600 max-w-lg mb-8 leading-relaxed font-light text-sm">
          Đội ngũ giải pháp doanh nghiệp của VINEX đã tiếp nhận bản mô tả nhu cầu. Chúng tôi sẽ nghiên cứu phương án quy cách, danh mục sản phẩm và liên hệ lại trong vòng 2-4 giờ làm việc.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="px-6 py-2.5 rounded-full bg-vinex-teal text-white text-sm font-semibold hover:bg-vinex-teal/90 transition-all shadow-md cursor-pointer"
        >
          Gửi yêu cầu giải pháp khác
        </button>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="elevated" className="p-8 sm:p-12 md:p-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-marcellus text-vinex-teal mb-4">Gửi nhu cầu sản phẩm</h2>
        <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
        <p className="text-gray-600 font-light text-[15px]">Vui lòng cung cấp một số thông tin cơ bản để đội ngũ VINEX có thể đề xuất giải pháp phù hợp nhất.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-vinex-charcoal">Nhóm sản phẩm quan tâm</label>
            <select 
              value={formData.productGroup}
              onChange={(e) => setFormData(prev => ({ ...prev, productGroup: e.target.value }))}
              className="w-full px-4 py-3 rounded-[12px] bg-white/60 border border-vinex-charcoal/10 text-vinex-charcoal focus:outline-none focus:border-vinex-teal transition-colors font-light appearance-none text-sm cursor-pointer"
            >
              <option value="">Chọn nhóm sản phẩm...</option>
              <option value="Hạt điều & sản phẩm từ hạt">Hạt điều & sản phẩm từ hạt</option>
              <option value="Trà, thảo mộc, cà phê">Trà, thảo mộc, cà phê</option>
              <option value="Bánh, bánh quy, kẹo">Bánh, bánh quy, kẹo</option>
              <option value="Trái cây sấy, nông sản chế biến">Trái cây sấy, nông sản chế biến</option>
              <option value="Hộp quà & Set quà phối hợp">Hộp quà & Set quà phối hợp</option>
            </select>
          </div>
          <div>
            <GlassInput
              label="Mục đích sử dụng / Kênh phân phối"
              placeholder="Bán lẻ, đóng bộ quà, tri ân..."
              value={formData.purpose}
              onChange={(e: any) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <GlassInput
              label="Số lượng dự kiến"
              placeholder="10.000 túi, 5.000 hộp..."
              value={formData.quantity}
              onChange={(e: any) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
            />
          </div>
          <div>
            <GlassInput
              label="Ngân sách dự kiến"
              placeholder="Khoảng ngân sách / sản phẩm hoặc tổng dự toán"
              value={formData.budget}
              onChange={(e: any) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <GlassInput
              label="Thời gian dự kiến"
              placeholder="Tháng / Quý triển khai..."
              value={formData.timeline}
              onChange={(e: any) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
            />
          </div>
          <div>
            <GlassInput
              label="Thông tin liên hệ *"
              required
              placeholder="Họ tên / Email / SĐT..."
              value={formData.contact}
              onChange={(e: any) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <GlassTextarea
            label="Yêu cầu quy cách và bao bì"
            placeholder="Ví dụ: Cần đóng túi zip 100g, hộp quà 3 set, in logo doanh nghiệp..."
            rows={4}
            value={formData.requirements}
            onChange={(e: any) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
          />
        </div>

        <div className="text-center pt-6">
          <GlassButton 
            type="submit" 
            disabled={isSubmitting}
            variant="primary" 
            size="lg" 
            className="w-full md:w-auto inline-flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang gửi yêu cầu...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Gửi yêu cầu sản phẩm
              </>
            )}
          </GlassButton>
        </div>
      </form>
    </GlassCard>
  );
}
