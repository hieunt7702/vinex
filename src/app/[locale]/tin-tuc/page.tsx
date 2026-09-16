import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import Image from 'next/image';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';
import { GlassButton, GlassCard } from '@/components/ui/glass';
import { Clock, Eye, User, ArrowRight, Phone } from 'lucide-react';
import { articles as dataArticles } from '@/data/articles';

export const metadata: Metadata = {
   title: "Tin tức & Kiến thức | VINEX",
   description: "Cập nhật các kiến thức chuyên sâu về hạt điều, quy trình bóc tách, ứng dụng sản phẩm và giải pháp quà tặng doanh nghiệp.",
};

export default async function KnowledgePage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;
   const t = getDictionary(locale as Locale);
   const pg = t.pages.knowledge;

   const topPost = dataArticles[0];
   const articlesList = dataArticles.slice(1);

   const categories = [
      { name: 'Toàn bộ bài viết', count: 12 },
      { name: 'Kiến thức nông sản', count: 5 },
      { name: 'Kinh nghiệm quà tặng', count: 4 },
      { name: 'Tin tức VINEX', count: 3 }
   ];

   return (
      <SmoothScroll>
         <main className="w-full flex flex-col min-h-screen pt-[100px] relative overflow-hidden bg-[#FAF8F2]">
            
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#074751]/20 rounded-full blur-[160px]" />
               <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] bg-vinex-gold/20 rounded-full blur-[160px]" />
               <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-[#5C7B6C]/20 rounded-full blur-[160px]" />
            </div>

            <section className="relative z-10 px-4 py-8 lg:py-12 max-w-[1300px] mx-auto w-full">
               
               {/* --- Top Layout: Single Featured Post --- */}
               <div className="mb-16 h-auto lg:h-[500px]">
                  <Link href={`/${locale}/tin-tuc/${topPost.slug}`} className="w-full relative rounded-[16px] lg:rounded-[24px] overflow-hidden group shadow-[0_8px_30px_rgba(7,71,81,0.12)] h-[400px] lg:h-full block">
                     <div className={`absolute inset-0 bg-gradient-to-br ${topPost.bg || 'from-[#074751] to-[#04282D]'} transition-transform duration-1000 group-hover:scale-105`} />
                     <div className="absolute inset-0 opacity-40 transition-transform duration-700 ease-out group-hover:scale-105">
                        <Image src={topPost.coverImg} alt={topPost.title} fill className="object-cover mix-blend-overlay" />
                     </div>
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#04282D] via-[#074751]/80 to-transparent" />
                     
                     <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 flex flex-col items-start lg:w-[75%]">
                        <span className="bg-vinex-gold text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 mb-4 rounded-[4px] uppercase tracking-wider shadow-sm">
                           {topPost.badge}
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-marcellus text-white mb-4 lg:mb-5 group-hover:text-vinex-gold transition-colors duration-300 leading-[1.25] drop-shadow-md">
                           {topPost.title}
                        </h2>
                        <p className="text-white/85 line-clamp-2 text-[14.5px] lg:text-[16px] mb-6 font-light leading-relaxed drop-shadow-sm">
                           {topPost.desc}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-white/70 text-[12px] lg:text-[13px] font-medium">
                           <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              <span>{topPost.author}</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{topPost.date}</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5" />
                              <span>{topPost.views} lượt xem</span>
                           </div>
                        </div>
                     </div>
                  </Link>
               </div>

               {/* --- Bottom Layout: Split Left / Right --- */}
               <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
                  
                  {/* Left: List of all posts */}
                  <div className="flex-1 w-full">
                     {/* Section Header */}
                     <div className="flex items-center gap-3 mb-8 pb-4">
                        <div className="w-[4px] h-[26px] bg-vinex-gold rounded-full shadow-[0_0_8px_rgba(242,183,25,0.4)]"></div>
                        <h3 className="text-[22px] lg:text-[24px] font-bold text-[#074751] uppercase tracking-wide">Bài viết mới nhất</h3>
                     </div>

                     <div className="space-y-6">
                        {articlesList.map((article, idx) => (
                           <Link href={`/${locale}/tin-tuc/${article.slug}`} key={idx} className="block group">
                              <GlassCard 
                                 radius={24}
                                 className="transition-transform hover:-translate-y-1 shadow-[0_8px_24px_rgba(7,71,81,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.8)] border border-white/60 overflow-hidden"
                                 contentClassName="p-4 sm:p-5 bg-white/50 hover:bg-white/70 transition-colors duration-500 flex flex-col h-full rounded-[24px]"
                              >
                                 <article className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                                    {/* Image Placeholder */}
                                    <div className="w-full sm:w-[240px] aspect-[16/10] bg-gradient-to-br from-[#074751]/80 to-[#10626f]/80 rounded-[16px] shrink-0 overflow-hidden relative shadow-sm">
                                       <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110 opacity-70">
                                          <Image src={article.coverImg} alt={article.title} fill className="object-cover mix-blend-overlay" />
                                       </div>
                                       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center py-1 w-full text-left">
                                       <span className="text-vinex-gold text-[10px] font-bold mb-2 uppercase tracking-widest">
                                          {article.category}
                                       </span>
                                       <h4 className="text-[18px] lg:text-[20px] font-marcellus mb-3 text-[#074751] group-hover:text-[#0D6370] transition-colors duration-300 leading-snug">
                                          {article.title}
                                       </h4>
                                       <p className="text-[#074751]/75 mb-4 line-clamp-2 text-[14px] font-light leading-relaxed">
                                          {article.desc}
                                       </p>
                                       <div className="flex flex-wrap items-center gap-4 text-[#074751]/60 text-[12px] font-medium mt-auto">
                                          <div className="flex items-center gap-1.5">
                                             <User className="w-3.5 h-3.5" />
                                             <span>{article.author}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                             <Clock className="w-3.5 h-3.5" />
                                             <span>{article.date}</span>
                                          </div>
                                       </div>
                                    </div>
                                 </article>
                              </GlassCard>
                           </Link>
                        ))}
                     </div>
                  </div>

                  {/* Right Sidebar: Categories & CTA */}
                  <aside className="w-full lg:w-[340px] shrink-0 space-y-8 sticky top-28 mt-8 lg:mt-20">
                     
                     {/* Categories Widget */}
                     <GlassCard 
                        radius={24} 
                        className="border border-white/60 shadow-[0_8px_24px_rgba(7,71,81,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.8)] overflow-hidden"
                        contentClassName="bg-white/50 p-6 sm:p-8 flex flex-col"
                     >
                        <div className="flex items-center gap-2.5 mb-6">
                           <div className="w-[3px] h-[20px] bg-vinex-gold rounded-full shadow-[0_0_6px_rgba(242,183,25,0.4)]"></div>
                           <h3 className="text-[18px] font-bold text-[#074751] uppercase tracking-wide">Chuyên mục</h3>
                        </div>
                        <ul className="flex flex-col">
                           {categories.map((cat, idx) => (
                              <li key={idx} className="border-b border-[#074751]/10 last:border-0">
                                 <Link href="#" className="flex items-center justify-between text-[#074751]/80 hover:text-[#074751] hover:font-semibold transition-all group py-3.5">
                                    <div className="flex items-center gap-2">
                                       <ArrowRight className="w-3.5 h-3.5 text-vinex-gold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                                       <span className="text-[14.5px] group-hover:pl-1 transition-all duration-300">{cat.name}</span>
                                    </div>
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-[#074751] text-[11px] font-bold shadow-sm border border-white/80 group-hover:bg-[#074751] group-hover:text-white transition-colors">
                                       {cat.count}
                                    </span>
                                 </Link>
                              </li>
                           ))}
                        </ul>
                     </GlassCard>

                     {/* Premium Light Glass CTA Widget */}
                     <GlassCard 
                        radius={24} 
                        className="shadow-[0_24px_48px_rgba(7,71,81,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.9)] overflow-hidden group border border-vinex-gold/20"
                        contentClassName="p-0 flex flex-col relative h-full bg-white/60 hover:bg-white/70 transition-colors duration-500 backdrop-blur-2xl"
                     >
                        {/* Elegant Ambient Glows */}
                        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-vinex-gold/15 rounded-full blur-[50px] pointer-events-none group-hover:bg-vinex-gold/25 transition-all duration-700 z-0" />
                        <div className="absolute bottom-0 left-0 w-[120px] h-[120px] bg-[#074751]/5 rounded-full blur-[40px] pointer-events-none z-0" />
                        
                        {/* Decorative subtle pattern */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay z-0 pointer-events-none" />

                        <div className="relative z-10 p-8 lg:p-10 flex flex-col h-full items-start">
                           {/* Sophisticated Icon Container */}
                           <div className="w-16 h-16 rounded-full bg-white shadow-[0_8px_24px_rgba(7,71,81,0.08),inset_0_1.5px_2px_rgba(255,255,255,1)] flex items-center justify-center mb-6 border border-white/60 relative group-hover:scale-105 transition-transform duration-500 ease-out shrink-0">
                              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-vinex-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <div className="absolute inset-0 flex items-center justify-center z-10">
                                 <Phone className="w-7 h-7 text-vinex-gold drop-shadow-sm" strokeWidth={2} />
                              </div>
                           </div>
                           
                           <h3 className="text-[13px] font-bold mb-1.5 text-[#074751]/60 tracking-widest uppercase">Bạn cần hỗ trợ?</h3>
                           <h4 className="text-[28px] font-marcellus mb-4 text-[#074751] leading-[1.2] drop-shadow-sm font-bold">
                              Tư Vấn <span className="text-vinex-gold">Quà Tặng</span>
                           </h4>
                           
                           <p className="text-[#074751]/80 text-[14.5px] mb-10 font-light leading-relaxed">
                              VINEX mang đến giải pháp cung ứng, bao bì và quà tặng doanh nghiệp tinh tế, tối ưu chi phí.
                           </p>
                           
                           <Link href={`/${locale}/lien-he`} className="block w-full mt-auto">
                              <div className="w-full bg-white/50 hover:bg-white/80 backdrop-blur-md text-[#074751] transition-all duration-300 py-3.5 px-6 rounded-full flex items-center justify-between gap-2 shadow-[0_4px_16px_rgba(7,71,81,0.05),inset_0_1.5px_2px_rgba(255,255,255,0.9)] hover:shadow-[0_8px_24px_rgba(7,71,81,0.1),inset_0_1.5px_2px_rgba(255,255,255,1)] border border-white/70 group/btn">
                                 <span className="font-bold tracking-wide text-[14.5px]">LIÊN HỆ NGAY</span>
                                 <div className="w-8 h-8 rounded-full bg-[#074751] flex items-center justify-center group-hover/btn:bg-vinex-gold transition-colors duration-300 shadow-[0_2px_8px_rgba(7,71,81,0.2)]">
                                    <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                                 </div>
                              </div>
                           </Link>
                        </div>
                     </GlassCard>
                  </aside>

               </div>
            </section>

         </main>
      </SmoothScroll>
   );
}
