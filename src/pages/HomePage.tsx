import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, TrendingUp, Star, MessageCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Header } from '@/components/Header.tsx';
import { Footer } from '@/components/Footer.tsx';

export default function HomePage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [signupEmail, setSignupEmail] = useState('');

  const featuredCourses = [
    {
      id: 1,
      title: 'Lập trình Web với React',
      instructor: 'Thầy Nguyễn Văn A',
      level: 'Nâng cao',
      students: 1250,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
    },
    {
      id: 2,
      title: 'JavaScript Từ Cơ bản đến Nâng cao',
      instructor: 'Cô Trần Thị B',
      level: 'Cơ bản',
      students: 2150,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1516534775068-bb6d1b5e4e0a?w=400&h=250&fit=crop',
    },
    {
      id: 3,
      title: 'TypeScript Nâng cao',
      instructor: 'Thầy Lê Văn C',
      level: 'Nâng cao',
      students: 890,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1516321314725-8f865d26df80?w=400&h=250&fit=crop',
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Trần Đức Minh',
      role: 'Học sinh',
      content: 'Nền tảng này giúp tôi học tập hiệu quả hơn. Giao diện dễ sử dụng và các khóa học rất chất lượng!',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'Nguyễn Thị Hương',
      role: 'Giáo viên',
      content: 'Công cụ quản lý lớp học tuyệt vời. Giúp tôi tiết kiệm rất nhiều thời gian trong việc chấm điểm và giao tiếp với học sinh.',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: 3,
      name: 'Phạm Văn Toàn',
      role: 'Quản trị viên',
      content: 'Hệ thống rất mạnh mẽ và dễ quản lý. Dashboard cung cấp các thông tin cần thiết một cách rõ ràng và trực quan.',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=3',
    },
  ];

  const faqs = [
    {
      id: 1,
      question: 'Làm thế nào để bắt đầu?',
      answer: 'Bạn có thể nhấn vào nút "Vào Dashboard" ở trên, chọn vai trò của mình (Admin, Giáo viên hoặc Học sinh) và bắt đầu sử dụng. Hệ thống sẽ hướng dẫn bạn qua các bước cơ bản.',
    },
    {
      id: 2,
      question: 'Chi phí sử dụng nền tảng là bao nhiêu?',
      answer: 'Nền tảng cung cấp các gói miễn phí và trả phí. Bạn có thể sử dụng các tính năng cơ bản miễn phí. Các tính năng nâng cao yêu cầu gói trả phí.',
    },
    {
      id: 3,
      question: 'Tôi có thể tạo bao nhiêu khóa học?',
      answer: 'Không có giới hạn số lượng khóa học mà bạn có thể tạo. Tuy nhiên, có thể có giới hạn dung lượng tùy thuộc vào gói dịch vụ của bạn.',
    },
    {
      id: 4,
      question: 'Làm thế nào để liên hệ với hỗ trợ?',
      answer: 'Bạn có thể liên hệ với chúng tôi thông qua email support@lms.com hoặc sử dụng biểu mẫu liên hệ trên trang web.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Nền tảng học tập toàn diện
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                  Kết nối giáo viên, học sinh và quản trị viên trong một hệ thống hiện đại, dễ sử dụng
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/roles"
                    className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition text-center"
                  >
                    Vào Dashboard
                  </Link>
                  <a
                    href="#features"
                    className="inline-block px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition text-center border border-blue-600"
                  >
                    Tìm hiểu thêm
                  </a>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-400">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <Users className="text-blue-600" size={32} />
                      <div>
                        <p className="font-semibold text-gray-900">10,000+</p>
                        <p className="text-sm text-gray-600">Người dùng hoạt động</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <BookOpen className="text-green-600" size={32} />
                      <div>
                        <p className="font-semibold text-gray-900">500+</p>
                        <p className="text-sm text-gray-600">Khóa học chất lượng</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                      <Award className="text-purple-600" size={32} />
                      <div>
                        <p className="font-semibold text-gray-900">95%</p>
                        <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Các chức năng chính
              </h2>
              <p className="text-lg text-gray-600">
                Toàn bộ công cụ bạn cần để quản lý giáo dục hiệu quả
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Admin Card */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8 border-t-4 border-blue-600">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Admin</h3>
                <p className="text-gray-600 mb-6">
                  Quản lý toàn hệ thống, người dùng, khóa học và báo cáo chi tiết
                </p>
                <ul className="text-sm text-gray-700 space-y-2 mb-6">
                  <li>✓ Quản lý người dùng</li>
                  <li>✓ Quản lý khóa học</li>
                  <li>✓ Báo cáo & phân tích</li>
                  <li>✓ Cài đặt hệ thống</li>
                </ul>
                <Link
                  to="/admin"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  Truy cập Admin
                </Link>
              </div>

              {/* Teacher Card */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8 border-t-4 border-green-600">
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="text-green-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Giáo viên</h3>
                <p className="text-gray-600 mb-6">
                  Tạo khóa học, quản lý bài tập và theo dõi tiến độ học sinh
                </p>
                <ul className="text-sm text-gray-700 space-y-2 mb-6">
                  <li>✓ Tạo khóa học</li>
                  <li>✓ Quản lý bài tập</li>
                  <li>✓ Chấm điểm</li>
                  <li>✓ Giao tiếp với học sinh</li>
                </ul>
                <Link
                  to="/teacher"
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                >
                  Truy cập Teacher
                </Link>
              </div>

              {/* Student Card */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8 border-t-4 border-purple-600">
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="text-purple-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Học sinh</h3>
                <p className="text-gray-600 mb-6">
                  Học các khóa học, nộp bài tập và xem tiến độ học tập
                </p>
                <ul className="text-sm text-gray-700 space-y-2 mb-6">
                  <li>✓ Xem khóa học</li>
                  <li>✓ Nộp bài tập</li>
                  <li>✓ Xem điểm số</li>
                  <li>✓ Theo dõi tiến độ</li>
                </ul>
                <Link
                  to="/student"
                  className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                >
                  Truy cập Student
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gray-100 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <TrendingUp className="text-blue-600 mx-auto mb-4" size={32} />
                <p className="text-3xl font-bold text-gray-900">10,000+</p>
                <p className="text-gray-600 mt-2">Người dùng đăng ký</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <BookOpen className="text-green-600 mx-auto mb-4" size={32} />
                <p className="text-3xl font-bold text-gray-900">500+</p>
                <p className="text-gray-600 mt-2">Khóa học</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Users className="text-purple-600 mx-auto mb-4" size={32} />
                <p className="text-3xl font-bold text-gray-900">1,000+</p>
                <p className="text-gray-600 mt-2">Giáo viên</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Award className="text-yellow-600 mx-auto mb-4" size={32} />
                <p className="text-3xl font-bold text-gray-900">95%</p>
                <p className="text-gray-600 mt-2">Tỷ lệ thành công</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section id="courses" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Khóa học nổi bật
              </h2>
              <p className="text-lg text-gray-600">
                Các khóa học được giáo viên hàng đầu tạo ra, được hàng ngàn học sinh tin tưởng
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {featuredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                        {course.level}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.floor(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">({course.rating})</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">Giáo viên: {course.instructor}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 pb-4 border-b border-gray-200">
                      <span>👥 {course.students.toLocaleString()} học sinh</span>
                    </div>
                    <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/student"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Xem tất cả khóa học
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-blue-50 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Người dùng nói gì về chúng tôi
              </h2>
              <p className="text-lg text-gray-600">
                Hàng ngàn người dùng hài lòng đã được hưởng lợi từ nền tảng của chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Đăng ký khóa học ngay hôm nay
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Nhận thông báo về các khóa học mới và cập nhật hệ thống
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Đăng ký thành công với email: ${signupEmail}`);
                setSignupEmail('');
              }}
              className="flex flex-col sm:flex-row gap-3 mb-6"
            >
              <input
                type="email"
                placeholder="Nhập email của bạn"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
              >
                Đăng ký
              </button>
            </form>

            <p className="text-sm text-blue-100">
              Chúng tôi sẽ không bao giờ chia sẻ email của bạn. Hủy đăng ký bất kỳ lúc nào.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Câu hỏi thường gặp
              </h2>
              <p className="text-lg text-gray-600">
                Tìm câu trả lời cho các câu hỏi phổ biến về nền tảng của chúng tôi
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition text-left"
                  >
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    <ChevronDown
                      size={20}
                      className={`text-gray-600 transition-transform ${
                        expandedFAQ === faq.id ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 py-4 bg-white border-t border-gray-200">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm được câu trả lời?
              </h3>
              <p className="text-gray-600 mb-4">
                Liên hệ với chúng tôi qua email hoặc biểu mẫu liên hệ
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                <MessageCircle size={20} />
                Liên hệ với chúng tôi
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
