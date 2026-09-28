"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, Loader2, Send, Paperclip, 
  X, Copy, Check, Clock, Phone, Sparkles, ChevronRight, ShieldCheck,
  Building2, Mail, FileCheck, User, MapPin, Calendar, Package, Tag,
  Globe, FileText, Truck, ArrowRight, PhoneCall, ExternalLink, Info,
  ShoppingBag, Gift, Store, Headphones, Handshake, MessageSquare, Edit3,
  Minus, Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/apiConfig';
import { GlassSelect } from '@/components/ui/glass/GlassSelect';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import type { PublicProduct } from '@/lib/types';
import { normalizeImageUrl } from '@/lib/imageUtils';
import {
  InquiryPurpose,
  PURPOSE_DEFINITIONS,
  OCCASION_OPTIONS,
  QUANTITY_OPTIONS,
  BUDGET_PER_ITEM_OPTIONS,
  BUDGET_TOTAL_OPTIONS,
  BRANDING_OPTIONS,
  DELIVERY_PLAN_OPTIONS,
  INVOICE_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  ISSUE_CATEGORY_OPTIONS,
  PARTNERSHIP_TYPE_OPTIONS,
  UNIT_OPTIONS
} from '@/lib/constants/inquiryConstants';

interface CustomerInquiryFormProps {
  initialPurpose?: InquiryPurpose;
  initialProduct?: string;
  initialProducts?: PublicProduct[];
  submitButtonText?: string;
  sourceContext?: string;
  initialSettings?: any;
}

export function CustomerInquiryForm({
  initialPurpose = 'BUY_PRODUCT',
  initialProduct = '',
  initialProducts,
  submitButtonText,
  sourceContext = 'Website - Trang Liên Hệ',
  initialSettings
}: CustomerInquiryFormProps) {
  const searchParams = useSearchParams();
  const urlPurpose = searchParams?.get('purpose') as InquiryPurpose | null;
  const urlProduct = searchParams?.get('product');
  const urlProductId = searchParams?.get('productId');
  const urlSlug = searchParams?.get('slug');

  const { settings: globalSettings } = useGlobalSettings();
  const settings = initialSettings || globalSettings;

  // Selected Purpose
  const [selectedPurpose, setSelectedPurpose] = useState<InquiryPurpose>(
    urlPurpose && PURPOSE_DEFINITIONS.some((p) => p.id === urlPurpose) ? urlPurpose : initialPurpose
  );

  // Common Fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');
  const [dataConsent, setDataConsent] = useState(true);

  // Real Dynamic Products State
  const [productsList, setProductsList] = useState<PublicProduct[]>(initialProducts || []);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(!initialProducts || initialProducts.length === 0);

  // Dynamic: Mua sản phẩm
  const [selectedProduct, setSelectedProduct] = useState(urlProduct || initialProduct || '');
  const [productVariant, setProductVariant] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('hộp');
  const [shippingProvince, setShippingProvince] = useState('');
  const [desiredDate, setDesiredDate] = useState('');

  // Helper: Format số lượng với phân cách hàng nghìn (VD: 1000 -> 1.000)
  const handleQuantityChange = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (!digits) {
      setQuantity('');
      return;
    }
    const num = Math.min(parseInt(digits, 10), 10000000);
    setQuantity(num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
  };

  const handleStepQuantity = (delta: number) => {
    const current = parseInt(quantity.replace(/\D/g, '') || '0', 10);
    const next = Math.max(1, current + delta);
    setQuantity(next.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
  };

  // Dynamic: Quà tặng (cá nhân & doanh nghiệp)
  const [giftOccasion, setGiftOccasion] = useState(OCCASION_OPTIONS[0]);
  const [giftQuantity, setGiftQuantity] = useState(QUANTITY_OPTIONS[1]);
  const [budgetType, setBudgetType] = useState<'PER_ITEM' | 'TOTAL'>('PER_ITEM');
  const [budgetRange, setBudgetRange] = useState(BUDGET_PER_ITEM_OPTIONS[2]);
  const [customGiftOptions, setCustomGiftOptions] = useState<string[]>([BRANDING_OPTIONS[0]]);
  const [deliveryPlan, setDeliveryPlan] = useState(DELIVERY_PLAN_OPTIONS[0]);
  const [shippingLocation, setShippingLocation] = useState('');
  const [needInvoice, setNeedInvoice] = useState(INVOICE_OPTIONS[0]);

  // Dynamic: Mua sỉ / Đại lý
  const [businessType, setBusinessType] = useState(BUSINESS_TYPE_OPTIONS[0]);
  const [businessArea, setBusinessArea] = useState('');
  const [expectedVolume, setExpectedVolume] = useState('');
  const [salesChannels, setSalesChannels] = useState('');

  // Dynamic: Hỗ trợ
  const [orderCode, setOrderCode] = useState('');
  const [issueCategory, setIssueCategory] = useState(ISSUE_CATEGORY_OPTIONS[0]);
  const [issueDescription, setIssueDescription] = useState('');

  // Dynamic: Hợp tác
  const [partnershipType, setPartnershipType] = useState(PARTNERSHIP_TYPE_OPTIONS[0]);
  const [partnershipProposal, setPartnershipProposal] = useState('');

  // Attachments
  const [attachments, setAttachments] = useState<Array<{ name: string; url: string; size?: number; type?: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ requestCode: string; lead: any } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Fetch real products from database API
  useEffect(() => {
    let isMounted = true;
    async function fetchRealProducts() {
      try {
        setIsLoadingProducts(true);
        const res = await fetch(getApiUrl('/products'), { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
          if (isMounted && list.length > 0) {
            setProductsList(list);
          }
        }
      } catch (err) {
        console.warn('Could not load dynamic products:', err);
      } finally {
        if (isMounted) setIsLoadingProducts(false);
      }
    }
    fetchRealProducts();
    return () => { isMounted = false; };
  }, []);

  // Sync URL product and purpose
  useEffect(() => {
    if (urlPurpose && PURPOSE_DEFINITIONS.some((p) => p.id === urlPurpose)) {
      setSelectedPurpose(urlPurpose);
    }
    if (urlProduct || urlProductId || urlSlug) {
      setSelectedPurpose('BUY_PRODUCT');
    }
  }, [urlPurpose, urlProduct, urlProductId, urlSlug]);

  // Match selected product from URL or initialProduct against real products
  useEffect(() => {
    const targetName = urlProduct || initialProduct;
    if (!targetName && !urlProductId && !urlSlug) return;

    // Check if we can find exact matching real product
    const found = productsList.find((p) => {
      if (urlProductId && String(p.id) === String(urlProductId)) return true;
      if (urlSlug && p.slug && p.slug.toLowerCase() === urlSlug.toLowerCase()) return true;
      if (targetName && p.name.trim().toLowerCase() === targetName.trim().toLowerCase()) return true;
      return false;
    });

    if (found) {
      setSelectedProduct(found.name);
    } else if (targetName) {
      setSelectedProduct(targetName);
    }
  }, [urlProduct, urlProductId, urlSlug, initialProduct, productsList]);

  // When budgetType changes, update default budgetRange
  useEffect(() => {
    if (budgetType === 'PER_ITEM') {
      setBudgetRange(BUDGET_PER_ITEM_OPTIONS[2]);
    } else {
      setBudgetRange(BUDGET_TOTAL_OPTIONS[2]);
    }
  }, [budgetType]);

  // Find currently matched real product object
  const matchedProduct = useMemo(() => {
    if (!selectedProduct) return null;
    return productsList.find(
      (p) => p.name.trim().toLowerCase() === selectedProduct.trim().toLowerCase()
    ) || null;
  }, [productsList, selectedProduct]);

  // Dynamic Options for Product Dropdown from Real Data
  const productOptions = useMemo(() => {
    const opts: { value: string; label: string }[] = [
      { value: '', label: '-- Chọn sản phẩm hoặc cần tư vấn --' }
    ];

    productsList.forEach((p) => {
      const cat = p.category ? ` (${p.category})` : '';
      const price = p.price ? ` • ${p.price.toLocaleString('vi-VN')} đ` : '';
      opts.push({
        value: p.name,
        label: `${p.name}${cat}${price}`
      });
    });

    // Ensure selectedProduct is present so GlassSelect will not display blank or placeholder
    if (selectedProduct && !opts.some((o) => o.value.trim().toLowerCase() === selectedProduct.trim().toLowerCase())) {
      opts.splice(1, 0, {
        value: selectedProduct,
        label: selectedProduct
      });
    }

    return opts;
  }, [productsList, selectedProduct]);

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 15 * 1024 * 1024) {
          toast.error(`Tệp ${file.name} quá lớn (tối đa 15MB)`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(getApiUrl('/upload'), {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const resData = await res.json();
          setAttachments((prev) => [
            ...prev,
            {
              name: resData.name || file.name,
              url: resData.url,
              size: resData.size,
              type: resData.type
            }
          ]);
          toast.success(`Đã đính kèm: ${file.name}`);
        } else {
          const localUrl = URL.createObjectURL(file);
          setAttachments((prev) => [
            ...prev,
            { name: file.name, url: localUrl, size: file.size, type: file.type }
          ]);
        }
      }
    } catch (err) {
      console.error('Lỗi tải tệp:', err);
      toast.error('Không thể tải tệp lên. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleArrayItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  // Helper for dynamic Purpose icon
  const getPurposeIcon = (id: InquiryPurpose) => {
    switch (id) {
      case 'BUY_PRODUCT':
        return ShoppingBag;
      case 'CORPORATE_GIFT':
        return Building2;
      case 'PERSONAL_GIFT':
        return Gift;
      case 'WHOLESALE':
        return Store;
      case 'SUPPORT':
        return Headphones;
      case 'PARTNERSHIP':
        return Handshake;
      case 'OTHER':
      default:
        return MessageSquare;
    }
  };

  // Helper for dynamic Purpose short title in sidebar
  const getPurposeSidebarTitle = (p: typeof PURPOSE_DEFINITIONS[0]) => {
    if (p.id === 'SUPPORT') return 'Hỗ trợ đơn hàng';
    if (p.id === 'WHOLESALE') return 'Mua sỉ / Đại lý';
    return p.title;
  };

  // Dynamic Submit Button Text
  const getActionText = () => {
    if (submitButtonText) return submitButtonText;
    switch (selectedPurpose) {
      case 'SUPPORT':
        return 'Gửi yêu cầu hỗ trợ';
      case 'BUY_PRODUCT':
        return 'Gửi yêu cầu đặt hàng / tư vấn';
      case 'CORPORATE_GIFT':
        return 'Gửi yêu cầu báo giá quà tặng';
      case 'PERSONAL_GIFT':
        return 'Gửi yêu cầu tư vấn quà tặng';
      case 'WHOLESALE':
        return 'Gửi thông tin đăng ký đại lý';
      case 'PARTNERSHIP':
        return 'Gửi đề xuất hợp tác';
      case 'OTHER':
      default:
        return 'Gửi tin nhắn liên hệ';
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error('Vui lòng nhập họ và tên của bạn');
      return;
    }

    if (!phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại để chuyên viên VINEX hỗ trợ');
      return;
    }

    // Purpose specific validation
    if (['CORPORATE_GIFT', 'WHOLESALE', 'PARTNERSHIP'].includes(selectedPurpose) && !companyName.trim()) {
      toast.error('Vui lòng nhập tên công ty hoặc tổ chức của bạn');
      return;
    }

    if (selectedPurpose === 'SUPPORT' && !issueDescription.trim()) {
      toast.error('Vui lòng mô tả vấn đề bạn cần VINEX hỗ trợ');
      return;
    }

    if (selectedPurpose === 'PARTNERSHIP' && !partnershipProposal.trim()) {
      toast.error('Vui lòng tóm tắt nội dung đề xuất hợp tác');
      return;
    }

    if (selectedPurpose === 'OTHER' && !message.trim()) {
      toast.error('Vui lòng nhập nội dung bạn cần liên hệ');
      return;
    }

    if (!dataConsent) {
      toast.error('Vui lòng xác nhận đồng ý với chính sách xử lý dữ liệu');
      return;
    }

    // Cooldown check (15 seconds anti-spam)
    const lastSubmitKey = `last_submit_${phone.trim()}`;
    const lastTime = typeof window !== 'undefined' ? localStorage.getItem(lastSubmitKey) : null;
    if (lastTime && Date.now() - parseInt(lastTime, 10) < 15000) {
      toast.warning('Bạn vừa gửi một yêu cầu gần đây. Vui lòng chờ vài giây trước khi gửi tiếp.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(lastSubmitKey, Date.now().toString());
      }

      const purposeObj = PURPOSE_DEFINITIONS.find((p) => p.id === selectedPurpose);
      const purposeLabel = purposeObj ? purposeObj.title : 'Khác';

      // Build structured details JSON based on branch
      let details: Record<string, any> = {};

      if (selectedPurpose === 'BUY_PRODUCT') {
        details = {
          productName: selectedProduct || 'Cần tư vấn chọn sản phẩm',
          productId: matchedProduct?.id || null,
          productSlug: matchedProduct?.slug || null,
          variant: productVariant.trim() || null,
          quantity: quantity.trim() ? `${quantity.trim()} ${unit}` : null,
          shippingProvince: shippingProvince.trim() || null,
          desiredDate: desiredDate || null
        };
      } else if (selectedPurpose === 'CORPORATE_GIFT' || selectedPurpose === 'PERSONAL_GIFT') {
        details = {
          giftOccasion,
          giftQuantity,
          budgetType,
          budgetRange,
          customGiftOptions,
          deliveryPlan,
          shippingLocation: shippingLocation.trim() || null,
          needInvoice
        };
      } else if (selectedPurpose === 'WHOLESALE') {
        details = {
          businessType,
          businessArea: businessArea.trim() || null,
          expectedVolume: expectedVolume.trim() || null,
          salesChannels: salesChannels.trim() || null
        };
      } else if (selectedPurpose === 'SUPPORT') {
        details = {
          orderCode: orderCode.trim() || null,
          issueCategory,
          issueDescription: issueDescription.trim()
        };
      } else if (selectedPurpose === 'PARTNERSHIP') {
        details = {
          partnershipType,
          proposal: partnershipProposal.trim()
        };
      } else if (selectedPurpose === 'OTHER') {
        details = {
          message: message.trim()
        };
      }

      // Read UTM parameters
      const utmParams: Record<string, string> = {};
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
          if (params.get(key)) utmParams[key] = params.get(key)!;
        });
      }

      const payload = {
        customerName: customerName.trim(),
        companyName: companyName.trim() || null,
        phone: phone.trim(),
        email: email.trim() || null,
        location: shippingLocation || shippingProvince || null,
        source: sourceContext,
        sourceUrl: typeof window !== 'undefined' ? window.location.href : null,
        sourceProduct: selectedProduct || null,
        utmParams: Object.keys(utmParams).length > 0 ? utmParams : null,
        purpose: selectedPurpose,
        productGroup: purposeLabel,
        notes: message.trim() || issueDescription || partnershipProposal || `Khách hàng gửi yêu cầu tư vấn: ${purposeLabel}`,
        details,
        attachments,
        consentVersion: 'v1.0',
        marketingOptIn: false,
        priority: purposeObj?.defaultPriority || 'NORMAL'
      };

      const res = await fetch(getApiUrl('/leads'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Không thể ghi nhận yêu cầu');
      }

      const assignedCode = resData.requestCode || resData.lead?.requestCode || 'REQ-' + Date.now();
      setSubmittedData({
        requestCode: assignedCode,
        lead: resData.lead || payload
      });

      toast.success('Gửi yêu cầu thành công! Chuyên viên VINEX sẽ liên hệ lại quý khách sớm nhất.');
    } catch (err: any) {
      console.error('Lỗi khi gửi yêu cầu:', err);
      toast.error('Có lỗi xảy ra: ' + (err.message || 'Vui lòng kiểm tra lại kết nối và thử lại'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    toast.success('Đã sao chép mã yêu cầu!');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const currentPurpose = PURPOSE_DEFINITIONS.find((p) => p.id === selectedPurpose) || PURPOSE_DEFINITIONS[0];

  return (
    <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start w-full">
      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT SIDEBAR: BẠN CẦN HỖ TRỢ GÌ? (Purpose Picker)          */}
      {/* ------------------------------------------------------------- */}
      <aside className="w-full lg:w-[280px] xl:w-[300px] shrink-0">
        <div className="bg-white/80 dark:bg-[#121922]/80 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[24px] p-5 shadow-[0_10px_30px_rgba(7,71,81,0.04)]">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 px-1">
            Bạn cần hỗ trợ gì?
          </h2>

          <div className="space-y-2">
            {PURPOSE_DEFINITIONS.map((p) => {
              const Icon = getPurposeIcon(p.id);
              const isSelected = selectedPurpose === p.id;
              const sidebarTitle = getPurposeSidebarTitle(p);

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPurpose(p.id);
                    if (submittedData) setSubmittedData(null);
                  }}
                  className={`group relative w-full p-3.5 rounded-2xl flex items-center justify-between text-left text-sm transition-all duration-200 cursor-pointer border select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-teal-50/95 via-emerald-50/60 to-white/95 dark:from-teal-950/70 dark:via-teal-900/40 dark:to-gray-900/80 border-teal-600/40 dark:border-teal-400/50 ring-1 ring-teal-600/20 dark:ring-teal-400/25 text-[#074751] dark:text-teal-200 font-semibold shadow-[0_4px_16px_rgba(7,71,81,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.95)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1.5px_rgba(255,255,255,0.12)]'
                      : 'bg-white/65 dark:bg-white/[0.03] hover:bg-white/95 dark:hover:bg-white/[0.08] border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium hover:border-teal-600/35 dark:hover:border-teal-400/35 hover:text-[#074751] dark:hover:text-teal-200 shadow-[0_2px_8px_rgba(7,71,81,0.02),inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-none hover:shadow-[0_4px_14px_rgba(7,71,81,0.05),inset_0_1.5px_2px_rgba(255,255,255,0.9)]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-colors duration-200 ${
                        isSelected
                          ? 'text-[#074751] dark:text-teal-300'
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-[#074751] dark:group-hover:text-teal-300'
                      }`}
                    />
                    <span className="truncate">{sidebarTitle}</span>
                  </div>
                  <div className="w-5 h-5 shrink-0 ml-2 flex items-center justify-center">
                    <CheckCircle2
                      className={`w-5 h-5 transition-all duration-200 ${
                        isSelected
                          ? 'text-teal-700 dark:text-teal-300 opacity-100 scale-100'
                          : 'opacity-0 scale-75 pointer-events-none'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-start gap-2 pt-4 mt-3 border-t border-gray-100 dark:border-gray-800/80 text-[12px] text-gray-500 dark:text-gray-400 font-normal px-1">
            <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <span className="leading-snug">Biểu mẫu sẽ thay đổi theo nhu cầu bạn chọn.</span>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. CENTER COLUMN: MAIN FORM OR SUCCESS SCREEN                */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 min-w-0 w-full">
        {submittedData ? (
          /* SUCCESS SCREEN */
          <div className="bg-white/90 dark:bg-[#121922]/90 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[24px] p-8 sm:p-12 text-center shadow-[0_16px_40px_rgba(7,71,81,0.06)] animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto mb-5 shadow-[0_10px_25px_rgba(16,185,129,0.3)]">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Tiếp nhận thành công
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold font-marcellus text-[#074751] dark:text-teal-200 mb-2">
              Yêu Cầu Của Quý Khách Đã Được Lưu
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed mb-6 font-light">
              Cảm ơn quý khách đã gửi thông tin đến VINEX. Chúng tôi đã chuyển tiếp tới bộ phận chuyên trách để chuẩn bị phương án tốt nhất.
            </p>

            {/* Request Code Box */}
            <div className="max-w-md mx-auto bg-gradient-to-br from-white to-teal-50/50 dark:from-[#1a232f] dark:to-[#0f1720] border-2 border-dashed border-[#074751]/30 dark:border-teal-500/40 rounded-2xl p-5 mb-6 shadow-xs">
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-[#074751]/70 dark:text-teal-400/80 mb-1">
                Mã tra cứu yêu cầu duy nhất
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-[#074751] dark:text-white select-all">
                  {submittedData.requestCode}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(submittedData.requestCode)}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 text-[#074751] dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
                  title="Sao chép mã"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-2 font-light">
                Vui lòng lưu lại mã này để tiện tra cứu tiến độ xử lý hoặc khi trao đổi cùng tư vấn viên.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmittedData(null);
                  setMessage('');
                  setAttachments([]);
                }}
                className="px-8 py-3 rounded-full bg-[#074751] hover:bg-[#0d5962] text-white text-sm font-medium transition-all shadow-[0_8px_20px_rgba(7,71,81,0.25)] cursor-pointer"
              >
                Gửi thêm yêu cầu khác
              </button>
            </div>
          </div>
        ) : (
          /* FORM CARD */
          <div className="bg-white/90 dark:bg-[#121922]/90 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[24px] p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_rgba(7,71,81,0.06)] relative z-20">
            {/* Header: Title + Required Legend */}
            <div className="flex items-start justify-between gap-4 pb-2 border-b border-gray-200/70 dark:border-gray-800">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-marcellus text-[#074751] dark:text-teal-200">
                  {currentPurpose.title}
                </h3>
                <div className="w-[60px] h-[2px] bg-gradient-to-r from-amber-400 to-amber-500/30 mt-2"></div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-normal shrink-0 mt-1">
                <span className="text-rose-500 font-bold">*</span> Thông tin bắt buộc
              </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* SECTION A: THÔNG TIN LIÊN HỆ */}
              <div>
                <h4 className="text-sm font-bold text-[#074751] dark:text-teal-300 mb-3.5">
                  Thông tin liên hệ
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Họ và tên */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                      Họ và tên <span className="text-rose-500 font-bold ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nhập họ và tên"
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                      Số điện thoại <span className="text-rose-500 font-bold ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Nhập số điện thoại"
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                      Email <span className="text-[11px] font-normal text-gray-500 lowercase">(không bắt buộc)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ten@email.com"
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Công ty */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                      Công ty {['CORPORATE_GIFT', 'WHOLESALE', 'PARTNERSHIP'].includes(selectedPurpose) ? (
                        <span className="text-rose-500 font-bold ml-0.5">*</span>
                      ) : (
                        <span className="text-[11px] font-normal text-gray-500 lowercase">(không bắt buộc)</span>
                      )}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Tên công ty"
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal Divider */}
              <div className="h-px bg-gray-200/80 dark:bg-gray-800"></div>

              {/* SECTION B: NỘI DUNG THEO NHU CẦU ĐƯỢC CHỌN */}
              <div>
                <h4 className="text-sm font-bold text-[#074751] dark:text-teal-300 mb-4">
                  {selectedPurpose === 'SUPPORT' ? 'Nội dung cần hỗ trợ' :
                   selectedPurpose === 'BUY_PRODUCT' ? 'Chi tiết sản phẩm quan tâm' :
                   selectedPurpose === 'CORPORATE_GIFT' || selectedPurpose === 'PERSONAL_GIFT' ? 'Chi tiết yêu cầu quà tặng' :
                   selectedPurpose === 'WHOLESALE' ? 'Thông tin hợp tác đại lý / mua sỉ' :
                   selectedPurpose === 'PARTNERSHIP' ? 'Nội dung đề xuất hợp tác' : 'Nội dung yêu cầu'}
                </h4>

                {/* BRANCH A: MUA SẢN PHẨM */}
                {selectedPurpose === 'BUY_PRODUCT' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200">
                          Sản phẩm quan tâm
                        </label>
                        {isLoadingProducts && (
                          <span className="text-[11px] text-[#074751] dark:text-teal-400 flex items-center gap-1 font-normal">
                            <Loader2 className="w-3 h-3 animate-spin" /> Đang cập nhật danh mục...
                          </span>
                        )}
                      </div>
                      <GlassSelect
                        options={productOptions}
                        value={selectedProduct}
                        onChange={(val) => setSelectedProduct(val)}
                        placeholder="-- Chọn sản phẩm hoặc cần tư vấn --"
                      />
                    </div>

                    {/* Rich Product Preview Card from Real Data */}
                    {matchedProduct && (
                      <div className="sm:col-span-2 rounded-2xl bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/50 dark:from-[#15202c] dark:via-[#111923] dark:to-[#0d141c] border border-teal-600/25 dark:border-teal-500/30 p-4 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {/* Product Thumbnail */}
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-teal-600/20 shrink-0 shadow-xs">
                            <Image
                              src={normalizeImageUrl(matchedProduct.img, '/images/placeholder.jpg')}
                              alt={matchedProduct.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/70 text-[#074751] dark:text-teal-300 text-[11px] font-bold uppercase tracking-wider">
                                {matchedProduct.category || 'Nông sản VINEX'}
                              </span>
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-[0_0_6px_rgba(16,185,129,0.5)]"></span>
                                {matchedProduct.status || 'Sẵn sàng cung ứng'}
                              </span>
                            </div>

                            <h5 className="text-[15px] font-bold text-[#074751] dark:text-teal-200 leading-tight truncate">
                              {matchedProduct.name}
                            </h5>

                            {/* Price */}
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="text-[14px] font-bold text-[#074751] dark:text-teal-300">
                                {(matchedProduct.promotionalPrice && matchedProduct.promotionalPrice > 0
                                  ? matchedProduct.promotionalPrice
                                  : (matchedProduct.price || 0)
                                ).toLocaleString('vi-VN')} đ
                              </span>
                              {matchedProduct.promotionalPrice && matchedProduct.price && matchedProduct.promotionalPrice < matchedProduct.price && (
                                <span className="text-[12px] text-gray-400 line-through">
                                  {matchedProduct.price.toLocaleString('vi-VN')} đ
                                </span>
                              )}
                              <span className="text-[11px] text-gray-500 font-light">/ đơn vị</span>
                            </div>
                          </div>

                          {/* Link to view product detail page */}
                          {matchedProduct.slug && (
                            <a
                              href={`/vi/san-pham/${matchedProduct.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#074751] dark:text-teal-300 hover:underline shrink-0 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-teal-600/20 shadow-xs"
                            >
                              <span>Xem chi tiết</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {/* Quick attribute suggestions from real product specs */}
                        {matchedProduct.attributes && matchedProduct.attributes.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-teal-600/15 dark:border-teal-500/20 flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-gray-500 dark:text-gray-400 text-[11px] font-medium">
                              Gợi ý quy cách từ sản phẩm:
                            </span>
                            {matchedProduct.attributes.map((attr, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setProductVariant(`${attr.name}: ${attr.value}`)}
                                className="px-2.5 py-1 rounded-md bg-white dark:bg-gray-800 hover:bg-teal-100/60 dark:hover:bg-teal-900/40 text-gray-700 dark:text-gray-300 hover:text-[#074751] border border-gray-200 dark:border-gray-700 text-[11px] font-medium transition-colors cursor-pointer"
                                title="Nhấp để áp dụng vào ô quy cách"
                              >
                                {attr.name}: {attr.value}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                        Quy cách / Trọng lượng mong muốn
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Package className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={productVariant}
                          onChange={(e) => setProductVariant(e.target.value)}
                          placeholder="VD: Hộp quà 250g, Hũ thủy tinh 500g..."
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2.5">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200">
                              Số lượng
                            </label>
                            {quantity && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 animate-in fade-in duration-150">
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                                Đã chọn: <span className="font-bold underline decoration-emerald-500/50">{quantity}</span> {unit}
                              </span>
                            )}
                          </div>
                          <div className="relative flex items-center">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                              <Tag className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={quantity}
                              onChange={(e) => handleQuantityChange(e.target.value)}
                              placeholder="VD: 10, 50, 1.000..."
                              className="w-full pl-10 pr-22 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm font-semibold tracking-wide text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                            />
                            <div className="absolute right-1.5 flex items-center gap-1">
                              {quantity && (
                                <button
                                  type="button"
                                  onClick={() => setQuantity('')}
                                  title="Xóa nhanh"
                                  className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700 shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => handleStepQuantity(-1)}
                                  disabled={!quantity || parseInt(quantity.replace(/\D/g, '') || '0', 10) <= 1}
                                  title="Giảm 1"
                                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStepQuantity(1)}
                                  title="Tăng 1"
                                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-28 shrink-0">
                          <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                            Đơn vị
                          </label>
                          <GlassSelect
                            options={UNIT_OPTIONS}
                            value={unit}
                            onChange={(val) => setUnit(val)}
                            placeholder="Đơn vị"
                          />
                        </div>
                      </div>

                      {/* Gợi ý số lượng nhanh */}
                      <div className="pt-0.5 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" /> Gợi ý nhanh:
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            Tự động định dạng số (1.000, 50.000...)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {[10, 20, 50, 100, 200, 500, 1000].map((preset) => {
                            const formattedPreset = preset.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                            const isSelected = quantity === formattedPreset;
                            return (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => setQuantity(formattedPreset)}
                                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer border ${
                                  isSelected
                                    ? 'bg-[#074751] text-white border-[#074751] shadow-xs scale-105'
                                    : 'bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#074751]/50 hover:bg-teal-50/50 dark:hover:bg-teal-950/30'
                                }`}
                              >
                                {formattedPreset}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                        Tỉnh / Thành nhận hàng <span className="text-[11px] font-normal text-gray-500 lowercase">(không bắt buộc)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={shippingProvince}
                          onChange={(e) => setShippingProvince(e.target.value)}
                          placeholder="VD: Hà Nội, TP.HCM..."
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                        Ngày mong muốn nhận hàng
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <input
                          type="date"
                          value={desiredDate}
                          onChange={(e) => setDesiredDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* BRANCH B & C: TƯ VẤN QUÀ TẶNG (CÁ NHÂN & DOANH NGHIỆP) */}
                {(selectedPurpose === 'CORPORATE_GIFT' || selectedPurpose === 'PERSONAL_GIFT') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                          Dịp tặng quà
                        </label>
                        <GlassSelect
                          options={OCCASION_OPTIONS.map((o) => ({ value: o, label: o }))}
                          value={giftOccasion}
                          onChange={(val) => setGiftOccasion(val)}
                          placeholder="Chọn dịp tặng quà..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                          Số phần quà dự kiến
                        </label>
                        <GlassSelect
                          options={QUANTITY_OPTIONS.map((q) => ({ value: q, label: q }))}
                          value={giftQuantity}
                          onChange={(val) => setGiftQuantity(val)}
                          placeholder="Chọn số lượng dự kiến..."
                        />
                      </div>
                    </div>

                    {/* Ngân sách */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                          Khoảng ngân sách dự kiến
                        </label>
                        <div className="inline-flex items-center p-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] shrink-0">
                          <button
                            type="button"
                            onClick={() => setBudgetType('PER_ITEM')}
                            className={`px-2.5 py-0.5 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap ${
                              budgetType === 'PER_ITEM'
                                ? 'bg-white dark:bg-gray-700 text-[#074751] dark:text-teal-300 shadow-xs font-semibold'
                                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
                            }`}
                          >
                            Mỗi phần
                          </button>
                          <button
                            type="button"
                            onClick={() => setBudgetType('TOTAL')}
                            className={`px-2.5 py-0.5 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap ${
                              budgetType === 'TOTAL'
                                ? 'bg-white dark:bg-gray-700 text-[#074751] dark:text-teal-300 shadow-xs font-semibold'
                                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
                            }`}
                          >
                            Tổng ngân sách
                          </button>
                        </div>
                      </div>
                      <GlassSelect
                        options={(budgetType === 'PER_ITEM' ? BUDGET_PER_ITEM_OPTIONS : BUDGET_TOTAL_OPTIONS).map((b) => ({
                          value: b,
                          label: b
                        }))}
                        value={budgetRange}
                        onChange={(val) => setBudgetRange(val)}
                        placeholder="Chọn khoảng ngân sách..."
                      />
                    </div>

                    {/* Customization Checkboxes */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Yêu cầu cá nhân hóa & Nhận diện thương hiệu
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {BRANDING_OPTIONS.map((item) => {
                          const checked = customGiftOptions.includes(item);
                          return (
                            <label
                              key={item}
                              className={`group flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all select-none ${
                                checked
                                  ? 'bg-teal-50/90 dark:bg-teal-950/40 border-teal-600/50 dark:border-teal-400/50 text-[#074751] dark:text-teal-200 font-semibold shadow-xs'
                                  : 'bg-white/70 dark:bg-gray-900 border-gray-200/90 dark:border-gray-700 hover:border-[#074751]/40 text-gray-700 dark:text-gray-300 shadow-xs'
                              }`}
                            >
                              <div className="relative flex items-center justify-center shrink-0">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleArrayItem(customGiftOptions, item, setCustomGiftOptions)}
                                  className="peer sr-only"
                                />
                                <div
                                  className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-all duration-200 ${
                                    checked
                                      ? 'bg-gradient-to-tr from-[#074751] to-[#0d5962] border-[#074751] text-white shadow-xs'
                                      : 'bg-white/90 dark:bg-gray-800 border-gray-300 dark:border-gray-600 group-hover:border-[#074751]/60'
                                  }`}
                                >
                                  <Check
                                    className={`w-2.5 h-2.5 text-white stroke-[3.5] transition-all duration-200 ${
                                      checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                                    }`}
                                  />
                                </div>
                              </div>
                              <span className="truncate leading-normal">{item}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Delivery & Invoice */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                          Phương án giao hàng
                        </label>
                        <GlassSelect
                          options={DELIVERY_PLAN_OPTIONS.map((d) => ({ value: d, label: d }))}
                          value={deliveryPlan}
                          onChange={(val) => setDeliveryPlan(val)}
                          placeholder="Phương án giao hàng..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                          Khu vực giao hàng
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={shippingLocation}
                            onChange={(e) => setShippingLocation(e.target.value)}
                            placeholder="VD: Hà Nội, TP.HCM..."
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                          Xuất hóa đơn VAT
                        </label>
                        <GlassSelect
                          options={INVOICE_OPTIONS.map((i) => ({ value: i, label: i }))}
                          value={needInvoice}
                          onChange={(val) => setNeedInvoice(val)}
                          placeholder="Xuất hóa đơn..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* BRANCH D: ĐẠI LÝ / MUA SỈ */}
                {selectedPurpose === 'WHOLESALE' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                        Loại hình kinh doanh
                      </label>
                      <GlassSelect
                        options={BUSINESS_TYPE_OPTIONS.map((b) => ({ value: b, label: b }))}
                        value={businessType}
                        onChange={(val) => setBusinessType(val)}
                        placeholder="Chọn loại hình kinh doanh..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                        Khu vực kinh doanh dự kiến
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={businessArea}
                          onChange={(e) => setBusinessArea(e.target.value)}
                          placeholder="VD: Miền Bắc, TP.HCM, Toàn quốc..."
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                        Sản lượng dự kiến
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Package className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={expectedVolume}
                          onChange={(e) => setExpectedVolume(e.target.value)}
                          placeholder="VD: 500 kg/tháng, 1.000 hộp/tháng..."
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                        Website / Kênh bán lẻ <span className="text-[11px] font-normal text-gray-500 lowercase">(nếu có)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Globe className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={salesChannels}
                          onChange={(e) => setSalesChannels(e.target.value)}
                          placeholder="VD: www.cuahang.vn, Fanpage..."
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* BRANCH E: HỖ TRỢ ĐƠN HÀNG (Exactly matching screenshot!) */}
                {selectedPurpose === 'SUPPORT' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                          Mã đơn hàng <span className="text-[11px] font-normal text-gray-500 lowercase">(nếu có)</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={orderCode}
                            onChange={(e) => setOrderCode(e.target.value)}
                            placeholder="Ví dụ: VX12345"
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                          Vấn đề cần hỗ trợ <span className="text-rose-500 font-bold ml-0.5">*</span>
                        </label>
                        <GlassSelect
                          options={ISSUE_CATEGORY_OPTIONS.map((c) => ({ value: c, label: c }))}
                          value={issueCategory}
                          onChange={(val) => setIssueCategory(val)}
                          placeholder="Chọn vấn đề cần hỗ trợ..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                        Mô tả vấn đề <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute top-3.5 left-3.5 pointer-events-none text-gray-400">
                          <Edit3 className="w-4 h-4" />
                        </div>
                        <textarea
                          rows={3}
                          value={issueDescription}
                          onChange={(e) => setIssueDescription(e.target.value)}
                          placeholder="Cho VINEX biết tình trạng đơn hàng và cách bạn mong muốn được hỗ trợ..."
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* BRANCH F: HỢP TÁC KINH DOANH */}
                {selectedPurpose === 'PARTNERSHIP' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                        Hình thức hợp tác
                      </label>
                      <GlassSelect
                        options={PARTNERSHIP_TYPE_OPTIONS.map((p) => ({ value: p, label: p }))}
                        value={partnershipType}
                        onChange={(val) => setPartnershipType(val)}
                        placeholder="Chọn hình thức hợp tác..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                        Nội dung đề xuất hợp tác <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={partnershipProposal}
                        onChange={(e) => setPartnershipProposal(e.target.value)}
                        placeholder="Tóm tắt đề xuất hợp tác, năng lực và định hướng kết nối..."
                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* BRANCH G: LIÊN HỆ KHÁC */}
                {selectedPurpose === 'OTHER' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                      Nội dung yêu cầu của bạn <span className="text-rose-500 font-bold ml-0.5">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Nhập nội dung bạn cần liên hệ hoặc trao đổi cùng VINEX..."
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                    />
                  </div>
                )}

                {/* Notes for general non-support/other/partnership */}
                {selectedPurpose !== 'SUPPORT' && selectedPurpose !== 'PARTNERSHIP' && selectedPurpose !== 'OTHER' && (
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                      Ghi chú thêm về yêu cầu <span className="text-[11px] font-normal text-gray-500 lowercase">(không bắt buộc)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="VD: Cần gấp trong tuần này, mong muốn gửi mẫu thử hộp quà, dự án đặc biệt..."
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] focus:ring-2 focus:ring-[#074751]/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-xs focus:outline-none transition-all"
                    />
                  </div>
                )}
              </div>

              {/* SECTION C: TỆP ĐÍNH KÈM (Attachment Upload Banner) */}
              <div>
                <label className="flex items-center gap-3.5 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#074751] hover:bg-teal-50/20 dark:hover:bg-teal-950/20 bg-white/60 dark:bg-gray-800/40 cursor-pointer transition-all shadow-xs group">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-gray-700 flex items-center justify-center text-[#074751] dark:text-teal-300 group-hover:bg-[#074751] group-hover:text-white transition-colors shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {isUploading ? 'Đang tải tệp lên...' : 'Đính kèm ảnh hoặc tài liệu'}
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Không bắt buộc (Tối đa 15MB)
                    </div>
                  </div>
                  <input
                    type="file"
                    multiple
                    disabled={isUploading}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  />
                </label>

                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {attachments.map((att, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 text-xs text-[#074751] dark:text-teal-200"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span className="max-w-[160px] truncate">{att.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(i)}
                          className="hover:text-rose-600 cursor-pointer p-0.5"
                          title="Xóa tệp"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION D: ĐIỀU KHOẢN (Consent Checkbox) */}
              <div className="pt-1">
                <label className="group inline-flex items-center gap-2.5 cursor-pointer text-xs text-gray-700 dark:text-gray-300 select-none">
                  <div className="relative flex items-center justify-center shrink-0">
                    <input
                      type="checkbox"
                      checked={dataConsent}
                      onChange={(e) => setDataConsent(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div
                      className={`w-[18px] h-[18px] rounded-[5px] flex items-center justify-center border transition-all duration-200 ${
                        dataConsent
                          ? 'bg-gradient-to-tr from-[#074751] to-[#0d5962] border-[#074751] text-white shadow-[0_2px_8px_rgba(7,71,81,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                          : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-gray-300/90 dark:border-gray-600 group-hover:border-[#074751]/60 dark:group-hover:border-teal-400/60 shadow-[0_1px_3px_rgba(7,71,81,0.05),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-none'
                      } peer-focus-visible:ring-2 peer-focus-visible:ring-[#074751]/30 peer-focus-visible:ring-offset-1`}
                    >
                      <Check
                        className={`w-3.5 h-3.5 text-white stroke-[3.5] transition-all duration-200 ${
                          dataConsent ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                        }`}
                      />
                    </div>
                  </div>
                  <span className="leading-normal flex-1">
                    Tôi đồng ý để VINEX liên hệ và xử lý thông tin theo{' '}
                    <span className="text-[#074751] dark:text-teal-400 font-semibold underline underline-offset-2 hover:text-[#0a5864] transition-colors">
                      Chính sách bảo mật
                    </span>. <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </span>
                </label>
              </div>

              {/* SECTION E: NÚT GỬI (Submit Button) */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#074751] to-[#0d5962] hover:from-[#095763] hover:to-[#126e7a] text-white text-[15px] font-semibold flex items-center justify-center gap-2.5 shadow-[0_8px_20px_rgba(7,71,81,0.25)] hover:shadow-[0_12px_28px_rgba(7,71,81,0.35)] transition-all cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang tiếp nhận yêu cầu...</span>
                    </>
                  ) : (
                    <>
                      <span>{getActionText()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* 3. RIGHT SIDEBAR: LIÊN HỆ TRỰC TIẾP (Direct Contact Info)      */}
      {/* ------------------------------------------------------------- */}
      <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0">
        <div className="bg-white/80 dark:bg-[#121922]/80 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[24px] p-6 shadow-[0_10px_30px_rgba(7,71,81,0.04)] space-y-6">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Liên hệ trực tiếp
            </h2>
            <div className="w-[50px] h-[2px] bg-gradient-to-r from-amber-400 to-amber-500/30 mt-2"></div>
          </div>

          {/* Hotline */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-gray-800 text-[#074751] dark:text-teal-400 flex items-center justify-center shrink-0 border border-[#074751]/15">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Hotline
              </span>
              <a
                href={`tel:${(settings.hotline || '0988 888 888').replace(/\s+/g, '')}`}
                className="text-base sm:text-lg font-bold text-gray-900 dark:text-white hover:text-[#074751] dark:hover:text-teal-300 transition-colors block mt-0.5"
              >
                {settings.hotline || '0988 888 888'}
              </a>
              <a
                href={`tel:${(settings.hotline || '0988 888 888').replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[#074751]/30 hover:border-[#074751] bg-white dark:bg-gray-800 hover:bg-teal-50/50 text-[#074751] dark:text-teal-300 text-xs font-semibold mt-2 shadow-xs transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Gọi VINEX
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-gray-800 text-[#074751] dark:text-teal-400 flex items-center justify-center shrink-0 border border-[#074751]/15">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Email
              </span>
              <a
                href={`mailto:${settings.contactEmail || 'info@vinexgroup.vn'}`}
                className="text-sm font-semibold text-[#074751] dark:text-teal-300 hover:underline block mt-0.5 break-all"
              >
                {settings.contactEmail || 'info@vinexgroup.vn'}
              </a>
            </div>
          </div>

          {/* Giờ làm việc */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-gray-800 text-[#074751] dark:text-teal-400 flex items-center justify-center shrink-0 border border-[#074751]/15">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Giờ làm việc
              </span>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                Thứ 2 – Thứ 6: 08:00 – 17:30<br />
                Thứ 7: 08:00 – 12:00
              </p>
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-gray-800 text-[#074751] dark:text-teal-400 flex items-center justify-center shrink-0 border border-[#074751]/15">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="space-y-3 flex-1 min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Địa chỉ
              </span>

              <div>
                <h5 className="text-xs font-bold text-gray-900 dark:text-white">
                  Văn phòng Hà Nội
                </h5>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-snug">
                  Sảnh 2B Sun Grand City, 69B Thụy Khuê, Hà Nội
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Sun+Grand+City+69B+Thuy+Khue+Ha+Noi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#074751] dark:text-teal-400 hover:underline mt-1"
                >
                  Xem chỉ đường <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <h5 className="text-xs font-bold text-gray-900 dark:text-white">
                  Nhà máy Phú Thọ
                </h5>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-snug">
                  Khu 6 Bằng Doãn, Bằng Luân, Phú Thọ
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Bang+Doan+Bang+Luan+Doan+Hung+Phu+Tho"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#074751] dark:text-teal-400 hover:underline mt-1"
                >
                  Xem chỉ đường <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
