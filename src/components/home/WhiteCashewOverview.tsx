export const WhiteCashewOverview = () => {
  return (
    <section id="nhan-dieu-trang" className="py-24 bg-vinex-white/50 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse gap-12 items-center">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-vinex-black mb-6">Nhân điều trắng - nền tảng của chuỗi giá trị</h2>
          <p className="text-gray-600 mb-8">
            Sản phẩm đầu ra chính từ hoạt động bóc tách điều thô; phục vụ cung ứng và phát triển các dòng sản phẩm tiếp theo.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded border border-gray-100 flex gap-4 items-center">
              <span className="text-vinex-yellow font-bold">01</span>
              <span className="font-medium text-sm">Cung ứng thương mại</span>
            </div>
            <div className="bg-white p-4 rounded border border-gray-100 flex gap-4 items-center">
              <span className="text-vinex-yellow font-bold">02</span>
              <span className="font-medium text-sm">Hạt điều tẩm vị</span>
            </div>
            <div className="bg-white p-4 rounded border border-gray-100 flex gap-4 items-center">
              <span className="text-vinex-yellow font-bold">03</span>
              <span className="font-medium text-sm">Sản phẩm bán lẻ</span>
            </div>
            <div className="bg-white p-4 rounded border border-gray-100 flex gap-4 items-center">
              <span className="text-vinex-yellow font-bold">04</span>
              <span className="font-medium text-sm">Bộ quà doanh nghiệp</span>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
          {/* Image placeholder */}
        </div>
      </div>
    </section>
  );
};
