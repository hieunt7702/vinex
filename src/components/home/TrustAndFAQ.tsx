export const TrustAndFAQ = () => {
  return (
    <section id="niem-tin" className="py-24 bg-vinex-white/50 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-vinex-black mb-16">Bạn đang cần giải pháp nào từ VINEX?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-lg border border-gray-100">
            <div className="w-12 h-12 bg-vinex-yellow rounded-full flex items-center justify-center font-bold mx-auto mb-4">01</div>
            <h3 className="font-bold text-vinex-black mb-2">Nhân điều trắng</h3>
            <p className="text-sm text-gray-500">Trao đổi nguồn cung</p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-gray-100">
            <div className="w-12 h-12 bg-vinex-yellow rounded-full flex items-center justify-center font-bold mx-auto mb-4">02</div>
            <h3 className="font-bold text-vinex-black mb-2">Danh mục sản phẩm</h3>
            <p className="text-sm text-gray-500">Gửi nhu cầu sản phẩm</p>
          </div>
          <div className="bg-vinex-blue p-8 rounded-lg text-white">
            <div className="w-12 h-12 bg-vinex-yellow rounded-full flex items-center justify-center font-bold text-vinex-black mx-auto mb-4">03</div>
            <h3 className="font-bold mb-2">Quà tặng doanh nghiệp</h3>
            <p className="text-sm text-white/70">Nhận tư vấn bộ quà</p>
          </div>
        </div>
        
        <div className="bg-vinex-blue rounded-xl p-8 flex flex-col md:flex-row items-center justify-between text-left gap-8">
          <p className="text-white text-lg max-w-2xl">
            Chia sẻ nhu cầu, số lượng và thời gian dự kiến để VINEX phối hợp đề xuất phương án phù hợp.
          </p>
          <button className="px-8 py-3 bg-vinex-yellow text-vinex-black rounded font-bold uppercase tracking-wider text-sm hover:bg-vinex-yellow/90 transition-colors whitespace-nowrap">
            Gửi yêu cầu
          </button>
        </div>
      </div>
    </section>
  );
};
