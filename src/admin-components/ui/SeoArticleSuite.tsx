"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, Globe, Smartphone, Monitor, CheckCircle2, XCircle, AlertCircle, 
  Sparkles, Share2, Code2, Link as LinkIcon, RefreshCw, FileText, Check, Tag, Eye
} from "lucide-react";

interface SeoArticleSuiteProps {
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail: string;
  metaTitle: string;
  metaDescription: string;
  keyword: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robotsIndex?: string;
  robotsFollow?: string;
  schemaType?: string;
  faqSchema?: boolean;
  tags?: string;
  onChange: (fields: Record<string, any>) => void;
}

export function SeoArticleSuite({
  title = "",
  slug = "",
  summary = "",
  content = "",
  thumbnail = "",
  metaTitle = "",
  metaDescription = "",
  keyword = "",
  canonicalUrl = "",
  ogTitle = "",
  ogDescription = "",
  ogImage = "",
  robotsIndex = "index",
  robotsFollow = "follow",
  schemaType = "Article",
  faqSchema = false,
  tags = "",
  onChange
}: SeoArticleSuiteProps) {
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"general" | "analysis" | "social" | "technical">("general");

  const cleanThumbnail = useMemo(() => {
    if (!thumbnail) return "";
    if (typeof thumbnail !== "string") return "";
    const trimmed = thumbnail.trim();
    if (trimmed === "" || trimmed === "null" || trimmed === "undefined") return "";
    return trimmed;
  }, [thumbnail]);

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [cleanThumbnail]);

  // Clean text and calculate real-time stats
  const { plainText, wordCount, readingTimeMinutes, hasHeadings } = useMemo(() => {
    // Strip HTML tags
    const text = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    const headingsExist = /<h[2-4][^>]*>/i.test(content);
    return {
      plainText: text,
      wordCount: words,
      readingTimeMinutes: readingTime,
      hasHeadings: headingsExist
    };
  }, [content]);

  // SEO Checklist Analysis
  const seoAudit = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) {
      return {
        score: 45,
        criteria: [
          { id: "kw_set", label: "Chưa thiết lập Từ khóa chính (Focus Keyword)", passed: false, tip: "Nhập từ khóa mục tiêu để Google hiểu chủ đề bài viết." }
        ]
      };
    }

    const mTitle = (metaTitle || title).toLowerCase();
    const mDesc = (metaDescription || summary).toLowerCase();
    const mSlug = slug.toLowerCase();
    const textLower = plainText.toLowerCase();

    // Check keyword in title
    const inTitle = mTitle.includes(kw);
    // Check keyword at beginning of title
    const atStartTitle = mTitle.startsWith(kw) || mTitle.indexOf(kw) < 20;
    // Check keyword in slug
    const cleanKwSlug = kw.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
      .replace(/đ/gi, 'd')
      .replace(/\s+/g, '-');
    const inSlug = mSlug.includes(cleanKwSlug) || mSlug.includes(kw.replace(/\s+/g, '-'));

    // Check keyword in meta description
    const inDesc = mDesc.includes(kw);

    // Check in first 100 words
    const first100Words = plainText.split(/\s+/).slice(0, 100).join(" ").toLowerCase();
    const inFirst100 = first100Words.includes(kw);

    // Keyword density
    const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = textLower.match(regex);
    const kwCount = matches ? matches.length : 0;
    const kwWords = kw.split(/\s+/).length;
    const density = wordCount > 0 ? ((kwCount * kwWords) / wordCount) * 100 : 0;
    const densityPassed = density >= 0.8 && density <= 3.0;

    // Word count passed
    const wordCountPassed = wordCount >= 300;
    const wordCountGreat = wordCount >= 600;

    // Has image
    const hasImage = Boolean(thumbnail || /<img[^>]*>/i.test(content));

    const criteria = [
      {
        id: "in_title",
        label: "Từ khóa chính xuất hiện trong Tiêu đề SEO (Meta Title)",
        passed: inTitle,
        tip: inTitle ? "Tuyệt vời! Tiêu đề chứa từ khóa chính giúp Google xếp hạng cao." : "Thêm từ khóa vào Tiêu đề SEO để tăng thứ hạng tìm kiếm."
      },
      {
        id: "start_title",
        label: "Từ khóa chính nằm ở vị trí đầu Tiêu đề SEO",
        passed: atStartTitle,
        tip: atStartTitle ? "Từ khóa đặt gần đầu giúp người tìm kiếm dễ bấm vào (Tăng CTR)." : "Cân nhắc đưa từ khóa lên đầu tiêu đề để nổi bật trên Google."
      },
      {
        id: "in_slug",
        label: "Đường dẫn (URL / Slug) chứa từ khóa chính",
        passed: inSlug,
        tip: inSlug ? "URL thân thiện, ngắn gọn và chuẩn SEO Google." : "Chỉnh sửa Slug để chứa từ khóa chính không dấu."
      },
      {
        id: "in_desc",
        label: "Từ khóa chính xuất hiện trong Mô tả SEO (Meta Description)",
        passed: inDesc,
        tip: inDesc ? "Google sẽ in đậm từ khóa khi người dùng tìm kiếm trên SERP." : "Đưa từ khóa vào mô tả để thu hút người đọc bấm vào bài viết."
      },
      {
        id: "in_first_100",
        label: "Từ khóa xuất hiện trong đoạn mở đầu bài viết (100 từ đầu)",
        passed: inFirst100,
        tip: inFirst100 ? "Đoạn mở đầu nêu bật ngay chủ đề cốt lõi." : "Nhắc đến từ khóa chính ngay trong câu mở bài hoặc đoạn văn đầu."
      },
      {
        id: "density",
        label: `Mật độ từ khóa đạt chuẩn (${kwCount} lần ~ ${density.toFixed(1)}%)`,
        passed: densityPassed,
        tip: densityPassed ? "Mật độ từ khóa tự nhiên, không bị Google đánh giá spam." : "Mật độ lý tưởng là 1.0% - 2.5%. Tránh nhồi nhét quá nhiều từ khóa."
      },
      {
        id: "word_count",
        label: `Độ dài bài viết đạt chuẩn SEO (${wordCount} từ)`,
        passed: wordCountPassed,
        tip: wordCountGreat ? "Độ dài trên 600 từ rất tốt cho bài viết chuyên sâu!" : (wordCountPassed ? "Độ dài đạt chuẩn tối thiểu (>300 từ)." : "Bài viết nên có tối thiểu 300-600 từ để cung cấp đủ giá trị cho độc giả.")
      },
      {
        id: "headings",
        label: "Bài viết có sử dụng các tiêu đề con (Heading H2, H3)",
        passed: hasHeadings,
        tip: hasHeadings ? "Cấu trúc phân mục rõ ràng, giúp bot Google dễ hiểu cấu trúc bài viết." : "Sử dụng các thẻ H2, H3 trong trình soạn thảo để phân chia các ý lớn."
      },
      {
        id: "image",
        label: "Bài viết có ảnh đại diện và hình ảnh minh họa",
        passed: hasImage,
        tip: hasImage ? "Đã có ảnh thumbnail hoặc ảnh trong bài viết." : "Tải lên ảnh thumbnail chất lượng cao để hiển thị trên Google và Mạng xã hội."
      }
    ];

    const passedCount = criteria.filter(c => c.passed).length;
    const score = Math.round((passedCount / criteria.length) * 100);

    return { score, criteria };
  }, [keyword, metaTitle, title, metaDescription, summary, slug, plainText, wordCount, hasHeadings, thumbnail, content]);

  // Length calculation for Meta Title (recommended 50-60 chars)
  const effectiveTitle = metaTitle || title;
  const titleLen = effectiveTitle.length;
  const titleColor = titleLen === 0 ? "bg-gray-200" : titleLen < 35 ? "bg-amber-400" : titleLen <= 60 ? "bg-emerald-500" : "bg-rose-500";
  const titleStatus = titleLen === 0 ? "Chưa nhập" : titleLen < 35 ? "Hơi ngắn (35-60 là chuẩn)" : titleLen <= 60 ? "Chuẩn SEO lý tưởng" : "Quá dài (Sẽ bị Google cắt bớt)";

  // Length calculation for Meta Description (recommended 140-160 chars)
  const effectiveDesc = metaDescription || summary;
  const descLen = effectiveDesc.length;
  const descColor = descLen === 0 ? "bg-gray-200" : descLen < 110 ? "bg-amber-400" : descLen <= 160 ? "bg-emerald-500" : "bg-rose-500";
  const descStatus = descLen === 0 ? "Chưa nhập" : descLen < 110 ? "Hơi ngắn (120-160 là chuẩn)" : descLen <= 160 ? "Chuẩn SEO lý tưởng" : "Quá dài (Sẽ bị Google cắt bớt)";

  // Auto generators
  const handleAutoTitle = () => {
    if (!title) return;
    const newMetaTitle = `${title.trim()} | Nông Sản VINEX`;
    onChange({ metaTitle: newMetaTitle.slice(0, 60) });
  };

  const handleAutoDesc = () => {
    if (!summary && !plainText) return;
    const source = summary || plainText;
    const cleaned = source.replace(/\s+/g, " ").trim();
    onChange({ metaDescription: cleaned.slice(0, 155) });
  };

  const handleSyncToOg = () => {
    onChange({
      ogTitle: metaTitle || title,
      ogDescription: metaDescription || summary,
      ogImage: thumbnail
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Score Gauge */}
      <div className="flex flex-col gap-4 p-4 rounded-[6px] border bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-[#14151a] dark:via-[#1a1b23] dark:to-[#14151a] border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
              seoAudit.score >= 80 
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-2 border-emerald-500" 
                : seoAudit.score >= 50
                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-2 border-amber-500"
                : "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-2 border-rose-500"
            }`}>
              {seoAudit.score}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Điểm Đánh Giá SEO Google On-Page: {seoAudit.score}/100
                </h4>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 inline-block ${
                  seoAudit.score >= 80 ? "bg-emerald-500 text-white" : seoAudit.score >= 50 ? "bg-amber-500 text-white" : "bg-rose-500 text-white"
                }`}>
                  {seoAudit.score >= 80 ? "Xuất sắc" : seoAudit.score >= 50 ? "Cần cải thiện" : "Chưa tối ưu"}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Thời gian đọc: <strong>~{readingTimeMinutes} phút</strong> ({wordCount} từ) • Từ khóa mục tiêu: <span className="font-semibold text-[#5865f2]">{keyword || "Chưa đặt"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-gray-100 dark:bg-[#1a1b23] p-1.5 rounded-[6px] border border-gray-200 dark:border-gray-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`py-2 px-3 rounded transition-all cursor-pointer text-center whitespace-nowrap ${
              activeTab === "general"
                ? "bg-white dark:bg-[#252830] text-[#5865f2] shadow-sm font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Google SERP
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("analysis")}
            className={`py-2 px-3 rounded transition-all cursor-pointer text-center whitespace-nowrap ${
              activeTab === "analysis"
                ? "bg-white dark:bg-[#252830] text-[#5865f2] shadow-sm font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Checklist SEO ({seoAudit.criteria.filter(c => c.passed).length}/{seoAudit.criteria.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("social")}
            className={`py-2 px-3 rounded transition-all cursor-pointer text-center whitespace-nowrap ${
              activeTab === "social"
                ? "bg-white dark:bg-[#252830] text-[#5865f2] shadow-sm font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Chia Sẻ MXH
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("technical")}
            className={`py-2 px-3 rounded transition-all cursor-pointer text-center whitespace-nowrap ${
              activeTab === "technical"
                ? "bg-white dark:bg-[#252830] text-[#5865f2] shadow-sm font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Kỹ Thuật &amp; Schema
          </button>
        </div>
      </div>

      {/* Tab 1: Google SERP Preview & Inputs */}
      {activeTab === "general" && (
        <div className="space-y-6">
          {/* SERP Snippet Preview Box */}
          <div className="bg-white dark:bg-[#16181d] border border-gray-200 dark:border-gray-800 rounded-[8px] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                  Xem trước kết quả tìm kiếm Google (Google SERP Snippet)
                </span>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1f222a] p-0.5 rounded">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    previewDevice === "desktop" ? "bg-white dark:bg-[#2b2f3a] text-blue-600 shadow-xs" : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Xem giao diện Máy tính (Desktop)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    previewDevice === "mobile" ? "bg-white dark:bg-[#2b2f3a] text-blue-600 shadow-xs" : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Xem giao diện Di động (Mobile)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Google SERP Simulated Result */}
            {previewDevice === "mobile" ? (
              /* Mobile Google SERP View */
              <div className="max-w-[420px] mx-auto bg-white dark:bg-[#16171b] rounded-[12px] p-3.5 border border-gray-200 dark:border-gray-800 shadow-xs font-sans transition-all space-y-1.5">
                {/* 1. Header: Favicon + Site Name + URL */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-[#202127] border border-gray-200 dark:border-gray-700 p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    <img src="/images/logo2.png" alt="VINEX Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 truncate leading-none">
                      VINEX Nông Sản Việt
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate leading-tight font-mono mt-0.5">
                      https://vinex.com.vn › tin-tuc {slug ? `› ${slug}` : ""}
                    </span>
                  </div>
                </div>

                {/* 2. Title: Full Width */}
                <h3 className="text-[17px] leading-snug font-normal text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer line-clamp-2 pt-0.5">
                  {effectiveTitle || "Tiêu đề bài viết sẽ hiển thị ở đây trên Google"}
                </h3>

                {/* 3. Description + Thumbnail Row */}
                <div className="flex items-start gap-3 pt-0.5">
                  <p className="flex-1 min-w-0 text-[13px] leading-relaxed text-[#4d5156] dark:text-[#bdc1c6] line-clamp-3">
                    {effectiveDesc || "Đoạn trích mô tả tóm tắt nội dung bài viết sẽ hiển thị ở đây. Google khuyến nghị viết từ 140 đến 160 ký tự súc tích, hấp dẫn."}
                  </p>

                  {/* Mobile Thumbnail: Only displayed if valid image exists and doesn't fail */}
                  {cleanThumbnail && !imageError && (
                    <div className="w-[76px] h-[76px] rounded-[8px] overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-2xs">
                      <img
                        src={cleanThumbnail}
                        alt="Thumbnail SERP"
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Desktop Google SERP View */
              <div className="max-w-2xl bg-white dark:bg-[#16171b] rounded-[8px] p-4 border border-gray-200/80 dark:border-gray-800 shadow-xs font-sans space-y-1.5">
                {/* Breadcrumb line with official VINEX logo */}
                <div className="flex items-center gap-2 text-[12px] text-[#202124] dark:text-[#bdc1c6]">
                  <div className="w-5 h-5 rounded-full bg-white dark:bg-[#202127] border border-gray-200 dark:border-gray-700 p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    <img src="/images/logo2.png" alt="VINEX Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">VINEX Nông Sản Việt</span>
                  <span className="text-gray-400">›</span>
                  <span className="text-gray-500 dark:text-gray-400">tin-tuc</span>
                  {slug && (
                    <>
                      <span className="text-gray-400">›</span>
                      <span className="text-gray-500 dark:text-gray-400 font-mono truncate max-w-[260px]">{slug}</span>
                    </>
                  )}
                </div>

                {/* Title line */}
                <h3 className="text-[19px] leading-snug font-normal text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                  {effectiveTitle || "Tiêu đề bài viết sẽ hiển thị ở đây trên Google"}
                </h3>

                {/* Description line */}
                <p className="text-[13px] leading-relaxed text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2">
                  {effectiveDesc || "Đoạn trích mô tả tóm tắt nội dung bài viết sẽ hiển thị ở đây. Google khuyến nghị viết từ 140 đến 160 ký tự súc tích, hấp dẫn."}
                </p>
              </div>
            )}
          </div>

          {/* Form Fields: Meta Title & Meta Description */}
          <div className="space-y-4">
            {/* Focus Keyword */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#5865f2]" />
                  Từ khóa chính mục tiêu (Focus Keyword)
                </label>
                <span className="text-[11px] text-gray-400">
                  Từ khóa trọng tâm người dùng sẽ tìm trên Google
                </span>
              </div>
              <input
                type="text"
                value={keyword}
                onChange={e => onChange({ keyword: e.target.value })}
                placeholder="VD: quà tặng doanh nghiệp, hạt điều bình phước..."
                className="w-full px-3.5 py-2 text-sm bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20"
              />
            </div>

            {/* Meta Title Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Tiêu đề SEO Google (Meta Title)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAutoTitle}
                    className="text-xs text-[#5865f2] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> Tự động tạo từ tiêu đề
                  </button>
                  <span className="text-[11px] font-mono text-gray-500">
                    {titleLen}/60 ký tự ({titleStatus})
                  </span>
                </div>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={e => onChange({ metaTitle: e.target.value })}
                placeholder={title ? `${title} | VINEX` : "Nhập tiêu đề hiển thị trên Google (50-60 ký tự)..."}
                className="w-full px-3.5 py-2 text-sm bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20"
              />
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${titleColor}`} 
                  style={{ width: `${Math.min(100, (titleLen / 60) * 100)}%` }} 
                />
              </div>
            </div>

            {/* Meta Description Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Mô tả SEO Google (Meta Description)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAutoDesc}
                    className="text-xs text-[#5865f2] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> Tự động trích từ tóm tắt
                  </button>
                  <span className="text-[11px] font-mono text-gray-500">
                    {descLen}/160 ký tự ({descStatus})
                  </span>
                </div>
              </div>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={e => onChange({ metaDescription: e.target.value })}
                placeholder={summary || "Nhập đoạn mô tả lôi cuốn, giải quyết thắc mắc của người tìm kiếm (140-160 ký tự)..."}
                className="w-full p-3 text-sm bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20 resize-none h-20"
              />
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${descColor}`} 
                  style={{ width: `${Math.min(100, (descLen / 160) * 100)}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Checklist SEO Analysis */}
      {activeTab === "analysis" && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-[6px] text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-blue-500" />
            Checklist được quét trực tiếp theo thời gian thực dựa trên các tiêu chí xếp hạng của Google và chuẩn SEO RankMath/Yoast.
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 rounded-[6px] bg-white dark:bg-[#16181d] overflow-hidden">
            {seoAudit.criteria.map((item, idx) => (
              <div key={item.id} className="p-3.5 flex items-start gap-3 hover:bg-gray-50/50 dark:hover:bg-[#1a1b23]/50 transition-colors">
                <div className="pt-0.5 shrink-0">
                  {item.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-semibold ${item.passed ? "text-gray-900 dark:text-white" : "text-rose-600 dark:text-rose-400"}`}>
                      {item.label}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      item.passed ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    }`}>
                      {item.passed ? "Đạt" : "Cần sửa"}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {item.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Social Media (Open Graph) Preview */}
      {activeTab === "social" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Xem trước khi chia sẻ link lên Facebook, Zalo, LinkedIn
            </span>
            <button
              type="button"
              onClick={handleSyncToOg}
              className="text-xs text-[#5865f2] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Đồng bộ từ Meta Title &amp; Ảnh
            </button>
          </div>

          {/* Social Card Preview */}
          <div className="max-w-md mx-auto border border-gray-200 dark:border-gray-700 rounded-[8px] overflow-hidden bg-white dark:bg-[#1a1b23] shadow-md">
            <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 relative overflow-hidden flex items-center justify-center">
              {ogImage || thumbnail ? (
                <img src={ogImage || thumbnail} alt="Social Card" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-400 text-xs">
                  <Share2 className="w-8 h-8 mb-1" />
                  Chưa có ảnh đại diện chia sẻ
                </div>
              )}
            </div>
            <div className="p-3.5 space-y-1 bg-gray-50 dark:bg-[#14151a]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">VINEX.VN</span>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                {ogTitle || metaTitle || title || "Tiêu đề chia sẻ mạng xã hội"}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {ogDescription || metaDescription || summary || "Mô tả ngắn gọn thu hút người dùng bấm vào đọc bài khi chia sẻ lên Facebook/Zalo..."}
              </p>
            </div>
          </div>

          {/* Custom OG inputs */}
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Tiêu đề Mạng Xã Hội (og:title)</label>
              <input
                type="text"
                value={ogTitle}
                onChange={e => onChange({ ogTitle: e.target.value })}
                placeholder="Để trống sẽ tự động lấy theo Tiêu đề SEO..."
                className="w-full px-3 py-1.5 text-xs bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Mô tả Mạng Xã Hội (og:description)</label>
              <textarea
                rows={2}
                value={ogDescription}
                onChange={e => onChange({ ogDescription: e.target.value })}
                placeholder="Để trống sẽ tự động lấy theo Mô tả SEO..."
                className="w-full p-2.5 text-xs bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20 resize-none h-16"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Technical SEO & Schema */}
      {activeTab === "technical" && (
        <div className="space-y-5">
          {/* Canonical URL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5 text-[#5865f2]" />
                Canonical URL (Liên kết gốc chống trùng lặp nội dung)
              </label>
              <button
                type="button"
                onClick={() => onChange({ canonicalUrl: `https://vinex.vn/tin-tuc/${slug}` })}
                className="text-xs text-[#5865f2] hover:underline cursor-pointer"
              >
                Mặc định theo Slug
              </button>
            </div>
            <input
              type="text"
              value={canonicalUrl}
              onChange={e => onChange({ canonicalUrl: e.target.value })}
              placeholder={`https://vinex.vn/tin-tuc/${slug || "duong-dan-bai-viet"}`}
              className="w-full px-3 py-2 text-xs font-mono bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20"
            />
            <p className="text-[11px] text-gray-400">
              Chỉ định URL gốc để báo cho Google bài viết này không bị trùng lặp nội dung với bất kỳ trang nào khác.
            </p>
          </div>

          {/* Robots Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Robots Index (Lập chỉ mục)</label>
              <select
                value={robotsIndex}
                onChange={e => onChange({ robotsIndex: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="index">Index (Cho phép Google lập chỉ mục - Khuyên dùng)</option>
                <option value="noindex">Noindex (Ngăn Google đưa vào kết quả tìm kiếm)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Robots Follow (Theo dõi liên kết)</label>
              <select
                value={robotsFollow}
                onChange={e => onChange({ robotsFollow: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="follow">Follow (Cho phép bot theo các liên kết trong bài)</option>
                <option value="nofollow">Nofollow (Không truyền PageRank qua liên kết)</option>
              </select>
            </div>
          </div>

          {/* Schema Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Cấu trúc dữ liệu Schema (Structured Data)</label>
              <select
                value={schemaType}
                onChange={e => onChange({ schemaType: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="Article">Article (Bài viết chuyên đề chuẩn)</option>
                <option value="NewsArticle">NewsArticle (Tin tức thời sự / Hoạt động)</option>
                <option value="BlogPosting">BlogPosting (Bài chia sẻ cẩm nang blog)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">FAQ Schema (Rich Snippet Google)</label>
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="faq-schema-check"
                  checked={faqSchema}
                  onChange={e => onChange({ faqSchema: e.target.checked })}
                  className="w-4 h-4 text-[#5865f2] rounded border-gray-300 focus:ring-[#5865f2]"
                />
                <label htmlFor="faq-schema-check" className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                  Kích hoạt FAQ Schema (Hiển thị câu hỏi xổ xuống trên Google)
                </label>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Thẻ Tags (Từ khóa phụ &amp; Liên kết nội bộ)</label>
            <input
              type="text"
              value={tags}
              onChange={e => onChange({ tags: e.target.value })}
              placeholder="VD: hạt điều bình phước, quà tặng tết, nông sản sạch..."
              className="w-full px-3 py-2 text-xs bg-gray-50/50 dark:bg-[#1a1b23] border border-gray-200 dark:border-gray-700 rounded-[4px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2]/20"
            />
            <p className="text-[11px] text-gray-400">
              Nhập các thẻ cách nhau bởi dấu phẩy để liên kết các bài viết liên quan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
