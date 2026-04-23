export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Thông tin công ty */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">LMS</h3>
            <p className="text-sm">
              Nền tảng học tập trực tuyến hiện đại cho giáo dục số.
            </p>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-blue-400 transition-colors">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/courses" className="hover:text-blue-400 transition-colors">
                  Khóa học
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-blue-400 transition-colors">
                  Giới thiệu
                </a>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Hỏi đáp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Điều khoản dịch vụ
                </a>
              </li>
            </ul>
          </div>

          {/* Mạng xã hội */}
          <div>
            <h4 className="text-white font-semibold mb-4">Theo dõi chúng tôi</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                Facebook
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-sm">
            © {currentYear} LMS. Bản quyền được bảo vệ. | Thiết kế bởi iViettech
          </p>
        </div>
      </div>
    </footer>
  );
};
