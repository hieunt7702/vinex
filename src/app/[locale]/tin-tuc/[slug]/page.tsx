import { Metadata } from 'next';
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Link from 'next/link';
import Image from 'next/image';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries';
import { GlassCard } from '@/components/ui/glass';
import { Clock, Eye, User, Tag, ChevronRight, ArrowRight } from 'lucide-react';
import { articles as dataArticles } from '@/data/articles';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
   title: "Chi tiết bài viết | VINEX",
};

export default async function ArticleDetailPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
   const { locale, slug } = await params;
   const t = getDictionary(locale as Locale);

   // Find article by slug
   const article = dataArticles.find(a => a.slug === slug);
   if (!article) {
      notFound();
   }

   // Get related articles (exclude current one, limit to 3)
   const relatedArticles = dataArticles.filter(a => a.slug !== slug).slice(0, 3);

   return (
      <SmoothScroll>
         <main className="w-full flex flex-col min-h-screen pt-[140px] lg:pt-[160px] pb-24 relative overflow-hidden bg-[#FAF8F2]">
            
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
               <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#074751]/20 rounded-full blur-[160px]" />
               <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] bg-vinex-gold/20 rounded-full blur-[160px]" />
               <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-[#5C7B6C]/20 rounded-full blur-[160px]" />
            </div>

            <article className="relative z-10 px-4 max-w-[1300px] mx-auto w-full">
               
               {/* Breadcrumbs */}
               <nav className="flex items-center gap-2 text-[11px] sm:text-[12px] font-bold text-[#074751]/60 uppercase tracking-widest mb-8 flex-wrap">
                  <Link href={`/${locale}`} className="hover:text-vinex-gold transition-colors">Trang chủ</Link>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <Link href={`/${locale}/tin-tuc`} className="hover:text-vinex-gold transition-colors">Tin tức</Link>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-vinex-gold line-clamp-1 max-w-[300px] sm:max-w-none">{article.title}</span>
               </nav>

               {/* Category Badge */}
               <div className="inline-block px-3 py-1.5 bg-vinex-gold text-white rounded-[4px] text-[11px] font-bold uppercase tracking-widest mb-5 shadow-sm">
                  {article.category}
               </div>

               {/* Title */}
               <h1 className="text-3xl md:text-4xl lg:text-[42px] font-marcellus text-[#074751] mb-6 leading-[1.25]">
                  {article.title}
               </h1>

               {/* Meta Info */}
               <div className="flex flex-wrap items-center gap-5 sm:gap-8 text-[#074751]/70 text-[13px] font-medium mb-10 pb-6 border-b border-[#074751]/10">
                  <div className="flex items-center gap-2">
                     <User className="w-4 h-4" />
                     <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Clock className="w-4 h-4" />
                     <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Eye className="w-4 h-4" />
                     <span>{article.views} lượt xem</span>
                  </div>
               </div>

               {/* Featured Image */}
               <div className="w-full aspect-[16/10] md:aspect-[21/9] bg-gradient-to-br from-[#074751] to-[#10626f] rounded-[16px] overflow-hidden mb-12 shadow-[0_16px_40px_rgba(7,71,81,0.1)] relative group cursor-pointer">
                   <div className="absolute inset-0 opacity-80">
                       <Image src={article.coverImg} alt={article.title} fill className="object-cover" />
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-[#074751]/50 to-transparent" />
               </div>

               {/* Abstract Highlight */}
               <div className="flex gap-5 mb-12 items-center bg-white/40 p-6 rounded-[16px] border border-white/60 shadow-[0_4px_16px_rgba(7,71,81,0.03)] backdrop-blur-sm">
                  <div className="w-[4px] h-[60px] bg-vinex-gold rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(242,183,25,0.4)]"></div>
                  <p className="text-[17px] md:text-[19px] text-[#074751] font-medium leading-relaxed italic">
                     {article.abstract}
                  </p>
               </div>

               {/* Content Body */}
               <div 
                  className="prose prose-lg md:prose-xl max-w-none prose-headings:font-marcellus prose-headings:text-[#074751] prose-h3:text-2xl prose-p:text-[#074751]/80 prose-p:leading-[1.85] prose-p:font-light prose-a:text-vinex-gold hover:prose-a:text-[#074751] prose-strong:text-[#074751] prose-strong:font-semibold mb-16"
                  dangerouslySetInnerHTML={{ __html: article.content }}
               />

               {/* Bottom Tags */}
               <div className="flex flex-wrap items-center gap-3 pt-8 border-t border-[#074751]/10">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#074751]/5 text-[#074751]/60 mr-2">
                     <Tag className="w-4 h-4" />
                  </div>
                  {article.tags.map((tag, idx) => (
                     <Link key={idx} href="#" className="px-5 py-2 bg-white/60 border border-white shadow-[0_2px_8px_rgba(7,71,81,0.04)] rounded-full text-[13px] font-semibold text-[#074751]/80 hover:bg-[#074751] hover:text-white hover:border-[#074751] transition-all duration-300">
                        {tag}
                     </Link>
                  ))}
               </div>

            </article>

            {/* Related Articles Section */}
            <section className="relative z-10 px-4 max-w-[1300px] mx-auto w-full mt-16 pt-16 border-t border-[#074751]/10">
               <h2 className="text-3xl md:text-[32px] font-marcellus text-center text-[#074751] mb-12">
                  BÀI VIẾT <span className="text-vinex-gold">LIÊN QUAN</span>
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {relatedArticles.map((item, idx) => (
                     <Link href={`/${locale}/tin-tuc/${item.slug}`} key={idx} className="block group h-full">
                        <GlassCard
                           radius={20}
                           className="h-full transition-transform hover:-translate-y-2 shadow-[0_8px_24px_rgba(7,71,81,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.7)] border border-white/60 overflow-hidden"
                           contentClassName="bg-white/50 hover:bg-white/70 transition-colors duration-500 flex flex-col h-full rounded-[20px]"
                        >
                           {/* Image Top */}
                           <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#074751]/80 to-[#10626f]/80 relative overflow-hidden shrink-0">
                              <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110 opacity-70">
                                 <Image src={item.coverImg} alt={item.title} fill className="object-cover mix-blend-overlay" />
                              </div>
                              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                              <div className="absolute top-4 left-4 bg-vinex-gold text-white text-[10px] font-bold px-2.5 py-1.5 rounded-[4px] uppercase tracking-wider shadow-sm z-10">
                                 {item.badge}
                              </div>
                           </div>
                           
                           {/* Content Bottom */}
                           <div className="p-6 flex flex-col flex-1">
                              <h3 className="text-[19px] font-marcellus mb-3 text-[#074751] group-hover:text-vinex-gold transition-colors duration-300 leading-snug">
                                 {item.title}
                              </h3>
                              <p className="text-[#074751]/75 mb-6 line-clamp-2 text-[14.5px] font-light leading-relaxed">
                                 {item.desc}
                              </p>
                              
                              {/* Read More Button Area */}
                              <div className="mt-auto flex items-center gap-2 text-[13px] font-bold text-vinex-gold uppercase tracking-wider group-hover:text-[#0D6370] transition-colors">
                                 Đọc tiếp <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                           </div>
                        </GlassCard>
                     </Link>
                  ))}
               </div>
            </section>

         </main>
      </SmoothScroll>
   );
}
