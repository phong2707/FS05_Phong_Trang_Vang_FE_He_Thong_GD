export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full opacity-20 -ml-48 -mb-48"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center min-h-screen py-12">
          {/* Phần văn bản */}
          <div className="flex flex-col justify-center z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Học tập không giới hạn,
              <span className="text-blue-600"> Tương lai vô tận</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Trung tâm học tập trực tuyến hàng đầu với hàng ngàn khóa học chất
              lượng cao từ các giáo viên giàu kinh nghiệm. Bắt đầu hành trình học
              tập của bạn ngay hôm nay!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/courses"
                className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Xem khóa học ngay
              </a>
              <a
                href="#about"
                className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors text-center"
              >
                Tìm hiểu thêm
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div>
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <p className="text-gray-600 text-sm">Học viên tích cực</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <p className="text-gray-600 text-sm">Khóa học chất lượng</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">100+</div>
                <p className="text-gray-600 text-sm">Giáo viên tài năng</p>
              </div>
            </div>
          </div>

          {/* Phần hình ảnh */}
          <div className="relative hidden md:block z-10">
            <div className="relative w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop"
                alt="Hero illustration"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              {/* Floating cards effect */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                <p className="text-sm font-semibold text-gray-900">
                  ⭐ 4.9/5 - Đánh giá từ học viên
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
