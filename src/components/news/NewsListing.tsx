"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  X, 
  User, 
  Calendar, 
  Eye, 
  ArrowRight, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { PublicArticle } from '@/lib/dataService';
import { getApiUrl } from '@/lib/apiConfig';
import { normalizeImageUrl, sortArticlesNewestFirst, formatArticleDate } from '@/lib/imageUtils';

interface NewsListingProps {
  initialArticles: PublicArticle[];
  locale: string;
}

const DEFAULT_CATEGORIES = [
  'Tất cả',
  'Tin tức VINEX',
  'Kinh nghiệm quà tặng',
  'Kiến thức nông sản',
  'Quy trình sản xuất',
];

export function NewsListing({ initialArticles, locale }: NewsListingProps) {
  const [articles, setArticles] = useState<PublicArticle[]>(() => sortArticlesNewestFirst(initialArticles || []));
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');

  React.useEffect(() => {
    if (initialArticles && initialArticles.length > 0) {
      setArticles(sortArticlesNewestFirst(initialArticles));
    }
  }, [initialArticles]);

  // Real-time synchronization with Admin APIs
  React.useEffect(() => {
    let isSubscribed = true;

    async function fetchLiveNews() {
      try {
        const [resArts, resCats] = await Promise.all([
          fetch(getApiUrl('/articles'), { cache: 'no-store' }),
          fetch(getApiUrl('/categories'), { cache: 'no-store' })
        ]);

        if (resArts.ok && isSubscribed) {
          const data = await resArts.json();
          const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
          if (list.length > 0) {
            const mapped: PublicArticle[] = list
              .filter((a: any) => a.status === 'PUBLISHED')
              .map((a: any) => ({
                id: a.id,
                title: a.title,
                slug: a.slug,
                desc: a.summary || a.desc || '',
                category: a.category || 'Tin tức VINEX',
                author: a.author || 'Truyền thông VINEX',
                date: formatArticleDate(a.publishedAt || a.createdAt || a.date),
                views: Number(a.views ?? 0) || 0,
                badge: a.isFeatured ? 'NỔI BẬT' : (a.category || 'TIN TỨC VINEX'),
                coverImg: normalizeImageUrl(a.thumbnail || a.coverImg, '/images/banner/b_miss_world_2026.png'),
                content: a.content || '',
                tags: Array.isArray(a.tags) ? a.tags : (typeof a.tags === 'string' && a.tags ? a.tags.split(',').map((t: string) => t.trim()) : []),
                isFeatured: Boolean(a.isFeatured),
                publishedAt: a.publishedAt || a.createdAt || ''
              }));
            setArticles(sortArticlesNewestFirst(mapped));
          }
        }

        if (resCats.ok && isSubscribed) {
          const data = await resCats.json();
          const allCats = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
          const articleCats = allCats
            .filter((c: any) => c.type === 'Bài viết')
            .map((c: any) => c.name);
          if (articleCats.length > 0) {
            const uniqueCats = Array.from(new Set(['Tất cả', ...articleCats, 'Tin tức VINEX']));
            setCategories(uniqueCats);
          }
        }
      } catch (err) {
        console.warn('Could not sync live news:', err);
      }
    }

    fetchLiveNews();

    const handleSync = () => {
      fetchLiveNews();
    };

    window.addEventListener('vinex_articles_updated', handleSync);
    window.addEventListener('vinex_categories_updated', handleSync);

    return () => {
      isSubscribed = false;
      window.removeEventListener('vinex_articles_updated', handleSync);
      window.removeEventListener('vinex_categories_updated', handleSync);
    };
  }, []);

  // Top featured post: pick newest isFeatured article, fallback to newest overall article
  const featuredPost = useMemo(() => {
    const featuredArticles = articles.filter(a => Boolean(a.isFeatured));
    if (featuredArticles.length > 0) {
      // articles is already sorted newest first by date/time
      return featuredArticles[0];
    }
    return articles[0] || null;
  }, [articles]);

  // Filtered articles list for the grid: All published articles sorted newest first.
  // ONLY the single top hero featuredPost is excluded from the grid when viewing "Tất cả" without search.
  // Any older featured articles REMAIN in the grid at their newest position!
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // Exclude only the single featured post that is showcased in the top hero banner
      if (selectedCategory === 'Tất cả' && !searchQuery.trim()) {
        if (featuredPost && (article.id === featuredPost.id || article.slug === featuredPost.slug)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'Tất cả') {
        const catMatch = article.category?.toLowerCase() === selectedCategory.toLowerCase();
        if (!catMatch) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = article.title.toLowerCase().includes(q);
        const descMatch = (article.desc || '').toLowerCase().includes(q);
        const tagMatch = article.tags?.some(t => t.toLowerCase().includes(q));
        if (!titleMatch && !descMatch && !tagMatch) return false;
      }

      return true;
    });
  }, [articles, selectedCategory, searchQuery, featuredPost]);

  return (
    <div className="w-full">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] text-[#074751]/60 font-medium mb-4">
        <Link href={`/${locale}`} className="hover:text-[#074751] transition-colors">
          Trang chủ
        </Link>
        <span className="text-[#074751]/40">/</span>
        <span className="text-[#074751] font-semibold">Tin tức</span>
      </nav>

      {/* 2. Page Title Header */}
      <div className="mb-8 lg:mb-10 text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-marcellus text-[#074751] font-bold tracking-tight mb-2.5 leading-tight">
          Tin tức &amp; câu chuyện
        </h1>
        <p className="text-[#074751]/75 text-[14.5px] sm:text-[16px] font-normal leading-relaxed max-w-2xl">
          Cập nhật hoạt động VINEX, kiến thức nông sản và kinh nghiệm chọn quà.
        </p>
      </div>

      {/* 3. Hero Featured Banner (Wide Horizontal Card) */}
      {featuredPost && (
        <section className="mb-12 lg:mb-14">
          <div className="group relative rounded-[20px] lg:rounded-[24px] overflow-hidden backdrop-blur(24px) saturate(140%) bg-white/80 hover:bg-white/95 border border-white/85 shadow-[0_16px_40px_rgba(7,71,81,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.85)] hover:shadow-[0_24px_50px_rgba(7,71,81,0.1),inset_0_1.5px_2px_rgba(255,255,255,0.95)] transition-all duration-300">
            {/* Specular sheen reflection overlay */}
            <span
              className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/5 to-transparent pointer-events-none rounded-[inherit] z-20"
              aria-hidden="true"
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Cover Image - Flush with top, left, bottom of the card, zero outer white padding */}
              <div className="lg:col-span-7 relative w-full aspect-[2.32/1] lg:aspect-auto lg:h-full min-h-[220px] sm:min-h-[280px] lg:min-h-[320px] max-h-[360px] overflow-hidden bg-[#eef3ef]">
                <Image
                  src={normalizeImageUrl(featuredPost.coverImg, '/images/banner/b_miss_world_2026.png')}
                  alt={featuredPost.title}
                  fill
                  priority
                  unoptimized
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Text & Meta Information (Title & desc at top, views & button at footer) */}
              <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 lg:p-7 xl:p-8 text-left">
                {/* Top: Category Badge, Title, Excerpt */}
                <div>
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#074751] text-white text-[11px] font-bold tracking-wider uppercase shadow-xs">
                      {featuredPost.category || 'TIN TỨC VINEX'}
                    </span>
                  </div>

                  {/* Article Title */}
                  <Link href={`/${locale}/tin-tuc/${featuredPost.slug}`}>
                    <h2 className="text-[21px] sm:text-[23px] lg:text-[24px] xl:text-[26px] font-marcellus text-[#074751] font-bold leading-[1.28] mb-2.5 group-hover:text-[#0D5962] transition-colors line-clamp-2">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-[#074751]/80 text-[13.5px] sm:text-[14px] leading-relaxed font-normal line-clamp-2 sm:line-clamp-3">
                    {featuredPost.desc}
                  </p>
                </div>

                {/* Bottom (Sát footer): Meta Row & Action Button */}
                <div className="mt-6 pt-4 border-t border-[#074751]/10 flex flex-col gap-3.5">
                  {/* Meta Row: Author • Date • Views */}
                  <div className="flex items-center flex-wrap gap-x-3 sm:gap-x-4 gap-y-1.5 text-[12px] sm:text-[12.5px] text-[#074751]/70 font-medium">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#5C7B6C] shrink-0" />
                      <span>{featuredPost.author || 'Truyền thông VINEX'}</span>
                    </div>
                    <span className="text-[#074751]/30">•</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#5C7B6C] shrink-0" />
                      <span>{featuredPost.date || 'Gần đây'}</span>
                    </div>
                    <span className="text-[#074751]/30">•</span>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#5C7B6C] shrink-0" />
                      <span>{Number(featuredPost.views ?? 0).toLocaleString('vi-VN')} lượt xem</span>
                    </div>
                  </div>

                  {/* Primary CTA Button */}
                  <div>
                    <Link
                      href={`/${locale}/tin-tuc/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#074751] hover:bg-[#0D5962] text-white text-[13px] font-semibold transition-all duration-300 shadow-[0_4px_16px_rgba(7,71,81,0.2)] hover:shadow-[0_6px_22px_rgba(7,71,81,0.3)] hover:scale-[1.02] active:scale-[0.98] group/btn"
                    >
                      <span>Đọc bài viết</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Section Heading: "Bài viết mới nhất" */}
      <section className="mb-8">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="w-1.5 h-6 rounded-full bg-vinex-gold shadow-[0_0_8px_rgba(242,183,25,0.4)] inline-block" />
          <h2 className="text-[22px] sm:text-[24px] font-bold text-[#074751] tracking-tight">
            Bài viết mới nhất
          </h2>
        </div>

        {/* 5. Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 md:pb-0 no-scrollbar flex-nowrap sm:flex-wrap">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap outline-none ${
                    isActive
                      ? 'bg-[#074751] text-white font-semibold shadow-[0_4px_14px_rgba(7,71,81,0.2)]'
                      : 'backdrop-blur-md bg-white/75 hover:bg-white text-[#074751] border border-white/80 shadow-[0_2px_8px_rgba(7,71,81,0.03)] hover:shadow-[0_4px_14px_rgba(7,71,81,0.08)]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64 lg:w-72 shrink-0">
            <div className="backdrop-blur-md bg-white/75 border border-white/80 rounded-full px-3.5 py-2 flex items-center gap-2.5 shadow-[0_2px_12px_rgba(7,71,81,0.03)] focus-within:bg-white focus-within:border-vinex-teal/50 focus-within:shadow-[0_4px_16px_rgba(7,71,81,0.08)] transition-all">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Tìm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[13.5px] text-[#074751] placeholder:text-gray-400 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 6. Article Grid (3 columns on desktop) */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-[24px] backdrop-blur-md bg-white/60 border border-white/80 shadow-xs">
            <p className="text-base text-[#074751]/80 font-medium mb-3">
              Không tìm thấy bài viết nào phù hợp với bộ lọc hoặc từ khóa &quot;{searchQuery}&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Tất cả');
                setSearchQuery('');
              }}
              className="text-[13.5px] font-semibold text-[#074751] underline hover:text-[#0D5962] cursor-pointer"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {filteredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/${locale}/tin-tuc/${article.slug}`}
                className="group flex flex-col h-full"
              >
                <div className="relative h-full rounded-[20px] overflow-hidden backdrop-blur(24px) saturate(140%) bg-white/80 hover:bg-white/95 border border-white/85 shadow-[0_12px_32px_rgba(7,71,81,0.05),inset_0_1.5px_2px_rgba(255,255,255,0.85)] hover:shadow-[0_20px_48px_rgba(7,71,81,0.1),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
                  {/* Specular sheen reflection overlay */}
                  <span
                    className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/5 to-transparent pointer-events-none rounded-[inherit]"
                    aria-hidden="true"
                  />

                  {/* Card Thumbnail Image */}
                  <div className="w-full aspect-[16/10] relative overflow-hidden bg-gray-100">
                    <Image
                      src={normalizeImageUrl(article.coverImg, '/images/placeholder.jpg')}
                      alt={article.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-600 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 relative z-10 text-left">
                    {/* Category Label */}
                    <span className="text-[11px] font-bold text-vinex-gold uppercase tracking-widest mb-2 inline-block">
                      {article.isFeatured ? '⭐ NỔI BẬT' : (article.category || 'KIẾN THỨC NÔNG SẢN')}
                    </span>

                    {/* Article Title */}
                    <h3 className="text-[18px] sm:text-[19px] font-marcellus text-[#074751] font-bold leading-snug line-clamp-2 mb-4 group-hover:text-[#0D5962] transition-colors">
                      {article.title}
                    </h3>

                    {/* Footer Meta Row */}
                    <div className="mt-auto pt-4 border-t border-gray-100/80 flex items-center justify-between text-[12px] text-[#074751]/65 font-medium">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{article.date || 'Gần đây'}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{Number(article.views ?? 0).toLocaleString('vi-VN')} lượt xem</span>
                        </div>
                      </div>

                      {/* Read More Link */}
                      <span className="inline-flex items-center gap-1 text-[#074751] font-semibold group-hover:text-vinex-teal group-hover:translate-x-0.5 transition-all">
                        Đọc tiếp <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
