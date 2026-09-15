"use client";

import { GlassCard } from "@/components/ui/glass";

export const CorporateClients = () => {
  return (
    <section className="py-24 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.2em] text-vinex-teal uppercase mb-4 font-semibold block">TRUSTED BY</span>
          <h2 className="text-3xl font-semibold text-vinex-black mb-6">Khách hàng Doanh nghiệp</h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light">
            VINEX tự hào là đối tác tin cậy, cung cấp giải pháp quà tặng cao cấp cho các tập đoàn và tổ chức hàng đầu.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center justify-items-center">
          {[...Array(5)].map((_, i) => (
            <GlassCard
              key={i}
              variant="default"
              className="w-full h-20 flex items-center justify-center p-4 hover:border-vinex-gold/40 transition-colors"
            >
              <span className="text-xs font-semibold tracking-widest text-vinex-charcoal/50">PARTNER {i + 1}</span>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};
