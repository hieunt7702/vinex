import { ScrollReveal } from "@/components/layout/ScrollReveal";

export const GiftAndPackaging = () => {
  return (
    <section id="qua-tang" className="py-24 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-vinex-black mb-6">Giải pháp quà tặng theo nhu cầu doanh nghiệp</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Một món quà cần phù hợp với người nhận, thể hiện đúng tinh thần thương hiệu và tạo trải nghiệm khi mở hộp.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="border border-gray-100 rounded-lg p-6 bg-vinex-white/30 flex items-start gap-4">
              <div className="w-12 h-12 bg-vinex-yellow rounded-full flex items-center justify-center font-bold flex-shrink-0">01</div>
              <div>
                <h3 className="font-bold text-vinex-black mb-2">Chất lượng sản phẩm</h3>
                <p className="text-sm text-gray-500">Lựa chọn phù hợp</p>
              </div>
            </div>
            <div className="border border-gray-100 rounded-lg p-6 bg-vinex-white/30 flex items-start gap-4">
              <div className="w-12 h-12 bg-vinex-yellow rounded-full flex items-center justify-center font-bold flex-shrink-0">02</div>
              <div>
                <h3 className="font-bold text-vinex-black mb-2">Thẩm mỹ & câu chuyện</h3>
                <p className="text-sm text-gray-500">Bao bì có chủ đích</p>
              </div>
            </div>
            <div className="border border-gray-100 rounded-lg p-6 bg-vinex-white/30 flex items-start gap-4">
              <div className="w-12 h-12 bg-vinex-yellow rounded-full flex items-center justify-center font-bold flex-shrink-0">03</div>
              <div>
                <h3 className="font-bold text-vinex-black mb-2">Ngân sách phù hợp</h3>
                <p className="text-sm text-gray-500">Cơ cấu linh hoạt</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-2 bg-vinex-blue text-white rounded-full font-medium text-sm hover:scale-105 transition-transform">Quà Tết</button>
            <button className="px-6 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-full font-medium text-sm hover:scale-105 transition-transform">Quà khách hàng</button>
            <button className="px-6 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-full font-medium text-sm hover:scale-105 transition-transform">Quà đối tác</button>
            <button className="px-6 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-full font-medium text-sm hover:scale-105 transition-transform">Quà sự kiện</button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
