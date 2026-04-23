export const AboutUsSection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Hình ảnh */}
          <div className="order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=600&fit=crop"
              alt="About us"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>

          {/* Văn bản */}
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Về chúng tôi
            </h2>

            <p className="text-gray-600 text-lg mb-6">
              LMS (Learning Management System) được thành lập vào năm 2024 với
              sứ mệnh cách mạng hóa giáo dục trực tuyến tại Việt Nam. Chúng tôi
              tin rằng mỗi người đều có khả năng học hỏi và phát triển.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Khóa học chất lượng cao
                  </h3>
                  <p className="text-gray-600">
                    Tất cả khóa học được thiết kế và giảng dạy bởi các chuyên gia
                    trong ngành với nhiều năm kinh nghiệm thực tế.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nền tảng hiện đại
                  </h3>
                  <p className="text-gray-600">
                    Hệ thống được xây dựng với công nghệ mới nhất, đảm bảo trải
                    nghiệm học tập mượt mà trên mọi thiết bị.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Hỗ trợ tận tình
                  </h3>
                  <p className="text-gray-600">
                    Đội ngũ hỗ trợ khách hàng 24/7 sẵn sàng giúp đỡ và giải đáp
                    mọi thắc mắc của bạn.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Giá cả phải chăng
                  </h3>
                  <p className="text-gray-600">
                    Chúng tôi cam k承 cung cấp các khóa học với giá tốt nhất mà
                    không đánh đổi chất lượng.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  10,000+
                </div>
                <p className="text-gray-600 text-sm">Học viên hài lòng</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  4.9/5
                </div>
                <p className="text-gray-600 text-sm">Đánh giá trung bình</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
