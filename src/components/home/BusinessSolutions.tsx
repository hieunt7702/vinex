export const BusinessSolutions = () => {
  return (
    <section id="giai-phap" className="py-24 bg-vinex-white/50 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-vinex-black mb-6">Phát triển sản phẩm theo nhu cầu doanh nghiệp</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            VINEX phối hợp lựa chọn nhóm sản phẩm, xây dựng cơ cấu danh mục, định hướng quy cách và bao bì, hoàn thiện phương án triển khai.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {['Xác định nhu cầu', 'Chọn nhóm sản phẩm', 'Xây dựng danh mục', 'Định hướng quy cách', 'Định hướng bao bì', 'Hoàn thiện phương án'].map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${index === 5 ? 'bg-vinex-blue text-white' : 'bg-vinex-yellow text-vinex-black'}`}>
                <span className="font-bold text-xl">0{index + 1}</span>
              </div>
              <span className="text-sm font-medium text-center max-w-[100px]">{step}</span>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button className="px-8 py-3 bg-vinex-blue text-white rounded font-bold uppercase tracking-wider text-sm hover:bg-vinex-blue/90 transition-colors">
            Gửi nhu cầu sản phẩm
          </button>
        </div>
      </div>
    </section>
  );
};
