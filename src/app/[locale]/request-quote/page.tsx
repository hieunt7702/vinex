"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useDict } from '@/hooks/useDict';
import { GlassCard, GlassButton, GlassInput, GlassTextarea } from '@/components/ui/glass';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';

export default function RequestQuotePage() {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();
  const pg = t.pages.request_quote;

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    quantity: '100 - 500 hộp',
    budget: '500.000đ - 1.000.000đ',
    occasion: '',
    deliveryDate: '',
    brandingLogo: false,
    brandingRibbon: false,
    brandingCard: false,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      toast.error('Vui lòng nhập tên công ty hoặc doanh nghiệp');
      return;
    }
    if (!formData.contactName.trim()) {
      toast.error('Vui lòng nhập họ tên người liên hệ');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại');
      return;
    }

    setIsSubmitting(true);
    try {
      const branding = [];
      if (formData.brandingLogo) branding.push('In/Ép kim logo');
      if (formData.brandingRibbon) branding.push('Ruy băng logo');
      if (formData.brandingCard) branding.push('Thiệp chúc mừng');

      const payload = {
        customerName: formData.contactName,
        companyName: formData.companyName,
        phone: formData.phone,
        email: formData.email,
        location: 'Khách hàng B2B Website',
        source: 'Website Form Báo Giá',
        projectType: formData.occasion || 'Quà tặng doanh nghiệp',
        productGroup: 'Hộp quà & Set quà phối hợp',
        purpose: formData.occasion || 'Quà tặng doanh nghiệp',
        quantity: formData.quantity,
        budget: formData.budget,
        timeline: formData.deliveryDate || 'Càng sớm càng tốt',
        customization: branding.length > 0 ? branding.join(', ') : 'Tiêu chuẩn',
        priority: 'HIGH',
        leadClassification: 'HOT',
        needs: `Số lượng dự kiến: ${formData.quantity}. Tùy chỉnh: ${branding.length > 0 ? branding.join(', ') : 'Tiêu chuẩn'}. Ghi chú: ${formData.notes || 'Không có'}`,
        notes: `Tên công ty: ${formData.companyName}. Đại diện: ${formData.contactName}. Dịp: ${formData.occasion || 'N/A'}. Ngày giao: ${formData.deliveryDate || 'N/A'}. Ghi chú: ${formData.notes || 'Không có'}`,
        status: 'NEW'
      };

      const res = await fetch(getApiUrl('/leads'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Không thể gửi yêu cầu');

      setIsSuccess(true);
      toast.success('Gửi yêu cầu báo giá thành công! Quản lý B2B của VINEX sẽ liên hệ lại với bạn ngay.');
      setFormData({
        companyName: '',
        contactName: '',
        phone: '',
        email: '',
        quantity: '100 - 500 hộp',
        budget: '500.000đ - 1.000.000đ',
        occasion: '',
        deliveryDate: '',
        brandingLogo: false,
        brandingRibbon: false,
        brandingCard: false,
        notes: ''
      });
    } catch (err) {
      console.error('Lỗi gửi báo giá:', err);
      toast.error('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng liên hệ hotline B2B: 0966 967 966');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full flex flex-col min-h-screen pt-[120px] pb-24">
      <div className="max-w-[1536px] mx-auto px-4 md:px-8 xl:px-12 w-full flex flex-col items-center">
        <div className="max-w-4xl w-full">

        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.2em] text-vinex-teal uppercase mb-4 font-semibold block">CORPORATE SOLUTIONS</span>
          <div className="w-[80px] h-[2px] bg-gradient-to-r from-vinex-gold via-vinex-gold/80 to-transparent mx-auto mb-6"></div>
          <h1 className="text-4xl md:text-5xl font-marcellus text-vinex-teal mb-6">{pg.hero_title}</h1>
          <p className="text-vinex-charcoal/70 font-light">{pg.hero_desc}</p>
        </div>

        <GlassCard
          radius={16}
          displacementScale={15}
          blurAmount={0.06}
          className="bg-white/80 p-8 md:p-12 rounded-xl shadow-xl border border-black/5"
        >
          {isSuccess ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-marcellus text-vinex-teal mb-3">Yêu Cầu Báo Giá Đã Được Ghi Nhận!</h3>
              <p className="text-sm text-vinex-charcoal/80 max-w-lg mb-8 leading-relaxed">
                Đội ngũ tư vấn giải pháp quà tặng doanh nghiệp B2B của VINEX sẽ nghiên cứu yêu cầu và gửi bản báo giá chi tiết kèm chiết khấu tốt nhất cho quý công ty trong vòng 2-4 giờ làm việc.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-6 py-2.5 rounded-full bg-vinex-teal text-white text-sm font-semibold hover:bg-vinex-teal/90 transition-all shadow-md"
              >
                Gửi yêu cầu báo giá khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Section 1: Thông tin liên hệ */}
              <div>
                <h3 className="text-lg font-marcellus text-vinex-teal mb-6 border-b border-black/5 pb-2">1. Thông tin Doanh nghiệp</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassInput 
                    label="Tên Công Ty *" 
                    required 
                    value={formData.companyName}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="VD: Tập đoàn FPT, Vietcombank..." 
                  />
                  <GlassInput 
                    label="Người Liên Hệ *" 
                    required 
                    value={formData.contactName}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    placeholder="Họ và tên người đại diện..." 
                  />
                  <GlassInput 
                    label="Số Điện Thoại *" 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="0901234567..." 
                  />
                  <GlassInput 
                    label="Email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="name@company.com..." 
                  />
                </div>
              </div>

              {/* Section 2: Nhu cầu */}
              <div>
                <h3 className="text-lg font-marcellus text-vinex-teal mb-6 border-b border-black/5 pb-2">2. Yêu cầu Quà Tặng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-vinex-charcoal uppercase tracking-wider mb-2">Số lượng dự kiến</label>
                    <select 
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/60 border border-black/10 rounded-lg focus:outline-none focus:border-vinex-teal focus:ring-2 focus:ring-vinex-teal/15 transition-all text-vinex-charcoal text-sm"
                    >
                      <option value="50 - 100 hộp">50 - 100 hộp</option>
                      <option value="100 - 500 hộp">100 - 500 hộp</option>
                      <option value="500 - 1000 hộp">500 - 1000 hộp</option>
                      <option value="Trên 1000 hộp">Trên 1000 hộp</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-vinex-charcoal uppercase tracking-wider mb-2">Ngân sách dự kiến (VNĐ/Hộp)</label>
                    <select 
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/60 border border-black/10 rounded-lg focus:outline-none focus:border-vinex-teal focus:ring-2 focus:ring-vinex-teal/15 transition-all text-vinex-charcoal text-sm"
                    >
                      <option value="Dưới 500.000đ">Dưới 500.000đ</option>
                      <option value="500.000đ - 1.000.000đ">500.000đ - 1.000.000đ</option>
                      <option value="1.000.000đ - 2.000.000đ">1.000.000đ - 2.000.000đ</option>
                      <option value="Trên 2.000.000đ">Trên 2.000.000đ</option>
                    </select>
                  </div>
                  <GlassInput 
                    label="Dịp tặng quà" 
                    value={formData.occasion}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, occasion: e.target.value }))}
                    placeholder="VD: Quà Tết, Sự kiện kỷ niệm..." 
                  />
                  <GlassInput 
                    label="Ngày cần giao hàng (dự kiến)" 
                    type="date" 
                    value={formData.deliveryDate}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* Section 3: Branding */}
              <div>
                <h3 className="text-lg font-marcellus text-vinex-teal mb-6 border-b border-black/5 pb-2">3. Yêu cầu tùy chỉnh (Branding)</h3>
                <div className="flex flex-wrap gap-6 mb-6">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={formData.brandingLogo}
                      onChange={(e) => setFormData(prev => ({ ...prev, brandingLogo: e.target.checked }))}
                      className="w-4 h-4 text-vinex-teal rounded border-black/20 focus:ring-vinex-teal" 
                    />
                    <span className="text-vinex-charcoal/80 font-light group-hover:text-vinex-teal transition-colors text-sm">In/Ép kim Logo lên hộp</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={formData.brandingRibbon}
                      onChange={(e) => setFormData(prev => ({ ...prev, brandingRibbon: e.target.checked }))}
                      className="w-4 h-4 text-vinex-teal rounded border-black/20 focus:ring-vinex-teal" 
                    />
                    <span className="text-vinex-charcoal/80 font-light group-hover:text-vinex-teal transition-colors text-sm">Ruy băng in Logo</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={formData.brandingCard}
                      onChange={(e) => setFormData(prev => ({ ...prev, brandingCard: e.target.checked }))}
                      className="w-4 h-4 text-vinex-teal rounded border-black/20 focus:ring-vinex-teal" 
                    />
                    <span className="text-vinex-charcoal/80 font-light group-hover:text-vinex-teal transition-colors text-sm">Thiệp chúc mừng riêng</span>
                  </label>
                </div>

                <GlassTextarea
                  label="Ghi chú bổ sung"
                  rows={4}
                  value={formData.notes}
                  onChange={(e: any) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Mô tả thêm về yêu cầu đặc biệt của bạn..."
                />
              </div>

              <div className="pt-4">
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
                      Đang xử lý yêu cầu...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {pg.form_submit}
                    </>
                  )}
                </GlassButton>
              </div>

            </form>
          )}
        </GlassCard>

        </div>
      </div>
    </main>
  );
}

