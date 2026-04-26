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
      title: 'Lap trinh Web voi React',
      instructor: 'Thay Nguyen Van A',
      level: 'Nang cao',
      students: 1250,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
    },
    {
      id: 2,
      title: 'JavaScript Tu Co ban den Nang cao',
      instructor: 'Co Tran Thi B',
      level: 'Co ban',
      students: 2150,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1516534775068-bb6d1b5e4e0a?w=400&h=250&fit=crop',
    },
    {
      id: 3,
      title: 'TypeScript Nang cao',
      instructor: 'Thay Le Van C',
      level: 'Nang cao',
      students: 890,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1516321314725-8f865d26df80?w=400&h=250&fit=crop',
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Tran Duc Minh',
      role: 'Hoc sinh',
      content: 'Nen tang nay giup toi hoc tap hieu qua hon. Giao dien de su dung va cac khoa hoc rat chat luong!',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'Nguyen Thi Huong',
      role: 'Giao vien',
      content: 'Cong cu quan ly lop hoc tuyet voi. Giup toi tiet kiem rat nhieu thoi gian trong viec cham diem va giao tiep voi hoc sinh.',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: 3,
      name: 'Pham Van Toan',
      role: 'Quan tri vien',
      content: 'He thong rat manh me va de quan ly. Dashboard cung cap cac thong tin can thiet mot cach ro rang va truc quan.',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=3',
    },
  ];

  const faqs = [
    {
      id: 1,
      question: 'Lam the nao de bat dau?',
      answer: 'Ban co the nhan vao nut "Vao Dashboard" o tren, chon vai tro cua minh (Admin, Giao vien hoac Hoc sinh) va bat dau su dung.',
    },
    {
      id: 2,
      question: 'Chi phi su dung nen tang la bao nhieu?',
      answer: 'Nen tang cung cap cac goi mien phi va tra phi. Ban co the su dung cac tinh nang co ban mien phi.',
    },
    {
      id: 3,
      question: 'Toi co the tao bao nhieu khoa hoc?',
      answer: 'Khong co gioi han so luong khoa hoc ma ban co the tao. Tuy nhien, co the co gioi han dung luong tuy thuoc vao goi dich vu.',
    },
    {
      id: 4,
      question: 'Lam the nao de lien he voi ho tro?',
      answer: 'Ban co the lien he voi chung toi qua email support@lms.com hoac su dung bieu mau lien he tren trang web.',
    },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }} className="flex flex-col min-h-screen bg-stone-50">
      <style>{`
        :root {
          --primary: #0f766e;
          --primary-dark: #0d6560;
          --primary-light: #ccfbf1;
          --primary-mid: #14b8a6;
          --secondary: #059669;
          --secondary-light: #d1fae5;
          --accent: #f59e0b;
          --accent-dark: #d97706;
          --accent-light: #fef3c7;
          --surface: #ffffff;
          --surface-alt: #f8fafc;
          --text-primary: #0f172a;
          --text-secondary: #475569;
          --text-muted: #94a3b8;
          --border: #e2e8f0;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(15,118,110,0.35);
        }

        .btn-accent {
          background: var(--accent);
          color: #1c1917;
          transition: all 0.2s ease;
        }
        .btn-accent:hover {
          background: var(--accent-dark);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245,158,11,0.4);
        }

        .btn-ghost {
          background: rgba(255,255,255,0.12);
          color: white;
          border: 1.5px solid rgba(255,255,255,0.35);
          transition: all 0.2s ease;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.22);
        }

        .card-hover {
          transition: all 0.25s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(15,118,110,0.12);
        }

        .hero-bg {
          background: linear-gradient(135deg, #0f766e 0%, #0e7490 50%, #065f46 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-bg::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: rgba(20,184,166,0.18);
        }
        .hero-bg::after {
          content: '';
          position: absolute;
          bottom: -80px; left: 10%;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: rgba(245,158,11,0.10);
        }

        .stat-card {  
          border-top: 3px solid var(--primary-mid);
          transition: all 0.2s ease;
        }
        .stat-card:hover {
          border-top-color: var(--accent);
          transform: translateY(-2px);
        }

        .badge-teal {
          background: var(--primary-light);
          color: var(--primary);
        }
        .badge-emerald {
          background: var(--secondary-light);
          color: var(--secondary);
        }
        .badge-amber {
          background: var(--accent-light);
          color: var(--accent-dark);
        }

        .faq-item {
          border: 1px solid var(--border);
          border-left: 3px solid var(--primary-mid);
          border-radius: 10px;
          overflow: hidden;
          transition: border-left-color 0.2s;
        }
        .faq-item:hover {
          border-left-color: var(--accent);
        }

        .newsletter-bg {
          background: linear-gradient(135deg, #0f766e 0%, #0e7490 60%, #1e3a5f 100%);
        }

        .testimonial-card {
          border-top: 3px solid transparent;
          transition: border-top-color 0.2s, box-shadow 0.2s;
        }
        .testimonial-card:hover {
          border-top-color: var(--accent);
          box-shadow: 0 8px 24px rgba(15,118,110,0.10);
        }

        .feature-card-admin { border-top: 4px solid #0f766e; }
        .feature-card-teacher { border-top: 4px solid #059669; }
        .feature-card-student { border-top: 4px solid #f59e0b; }

        .check-item::before {
          content: '';
          display: inline-block;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: var(--primary-light);
          margin-right: 8px;
          vertical-align: middle;
          position: relative;
        }
      `}</style>

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-bg px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span style={{ background: 'rgba(245,158,11,0.18)', color: '#fef3c7', border: '1px solid rgba(245,158,11,0.4)' }}
                  className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
                  nền tảng giáo dục số #1 Việt Nam
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
                  Nền tảng học tập
                  <span style={{ color: '#fbbf24' }}> toàn diện</span>
                </h1>
                <p style={{ color: '#99f6e4' }} className="text-xl mb-8 leading-relaxed">
                  Kết nối giáo viên, học sinh và quản trị viên trong một hệ thống hiện đại, để sử dụng
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/roles"
                    className="btn-accent inline-block px-7 py-3 font-bold rounded-xl text-center shadow-lg"
                  >
                    vào Dashboard
                  </Link>
                  <a
                    href="#features"
                    className="btn-ghost inline-block px-7 py-3 font-semibold rounded-xl text-center"
                  >
                    Tìm hiểu thêm
                  </a>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="bg-white rounded-2xl shadow-2xl p-7" style={{ borderLeft: '4px solid #f59e0b' }}>
                  <p style={{ color: '#0f766e' }} className="text-xs font-bold uppercase tracking-widest mb-4">
                    Thống kê hệ thống 
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 p-4 rounded-xl" style={{ background: '#ccfbf1' }}>
                      <div style={{ background: '#0f766e', borderRadius: '10px', padding: '8px' }}>
                        <Users style={{ color: 'white' }} size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg">10,000+</p>
                        <p className="text-sm" style={{ color: '#475569' }}>Người dùng hoạt động</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 rounded-xl" style={{ background: '#d1fae5' }}>
                      <div style={{ background: '#059669', borderRadius: '10px', padding: '8px' }}>
                        <BookOpen style={{ color: 'white' }} size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg">500+</p>
                        <p className="text-sm" style={{ color: '#475569' }}>Khoa học chất lượng</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 rounded-xl" style={{ background: '#fef3c7' }}>
                      <div style={{ background: '#f59e0b', borderRadius: '10px', padding: '8px' }}>
                        <Award style={{ color: 'white' }} size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg">95%</p>
                        <p className="text-sm" style={{ color: '#475569' }}>Tỷ lệ hoàn thành</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-6" style={{ background: '#f8fafc' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span style={{ color: '#0f766e', background: '#ccfbf1' }} className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3">
                Chuc nang
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0f172a' }}>
                Cac chuc nang chinh
              </h2>
              <p className="text-lg" style={{ color: '#475569' }}>
                Toan bo cong cu ban can de quan ly giao duc hieu qua
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Admin Card */}
              <div className="bg-white rounded-2xl shadow-md card-hover p-8 feature-card-admin">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: '#ccfbf1' }}>
                  <Users style={{ color: '#0f766e' }} size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#0f172a' }}>Admin</h3>
                <p className="mb-5" style={{ color: '#475569' }}>
                  Quan ly toan he thong, nguoi dung, khoa hoc va bao cao chi tiet
                </p>
                <ul className="text-sm space-y-2 mb-6" style={{ color: '#334155' }}>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#0f766e', fontWeight: 700 }}>+</span> Quan ly nguoi dung
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#0f766e', fontWeight: 700 }}>+</span> Quan ly khoa hoc
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#0f766e', fontWeight: 700 }}>+</span> Bao cao va phan tich
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#0f766e', fontWeight: 700 }}>+</span> Cai dat he thong
                  </li>
                </ul>
                <Link to="/admin" className="btn-primary inline-block px-5 py-2.5 rounded-xl text-sm font-semibold">
                  Truy cap Admin
                </Link>
              </div>

              {/* Teacher Card */}
              <div className="bg-white rounded-2xl shadow-md card-hover p-8 feature-card-teacher">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: '#d1fae5' }}>
                  <BookOpen style={{ color: '#059669' }} size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#0f172a' }}>Giao vien</h3>
                <p className="mb-5" style={{ color: '#475569' }}>
                  Tao khoa hoc, quan ly bai tap va theo doi tien do hoc sinh
                </p>
                <ul className="text-sm space-y-2 mb-6" style={{ color: '#334155' }}>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#059669', fontWeight: 700 }}>+</span> Tao khoa hoc
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#059669', fontWeight: 700 }}>+</span> Quan ly bai tap
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#059669', fontWeight: 700 }}>+</span> Cham diem
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#059669', fontWeight: 700 }}>+</span> Giao tiep voi hoc sinh
                  </li>
                </ul>
                <Link to="/teacher"
                  style={{ background: '#059669' }}
                  className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">
                  Truy cap Teacher
                </Link>
              </div>

              {/* Student Card */}
              <div className="bg-white rounded-2xl shadow-md card-hover p-8 feature-card-student">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: '#fef3c7' }}>
                  <Award style={{ color: '#f59e0b' }} size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#0f172a' }}>Hoc sinh</h3>
                <p className="mb-5" style={{ color: '#475569' }}>
                  Hoc cac khoa hoc, nop bai tap va xem tien do hoc tap
                </p>
                <ul className="text-sm space-y-2 mb-6" style={{ color: '#334155' }}>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#d97706', fontWeight: 700 }}>+</span> Xem khoa hoc
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#d97706', fontWeight: 700 }}>+</span> Nop bai tap
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#d97706', fontWeight: 700 }}>+</span> Xem diem so
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: '#d97706', fontWeight: 700 }}>+</span> Theo doi tien do
                  </li>
                </ul>
                <Link to="/student"
                  style={{ background: '#f59e0b', color: '#1c1917' }}
                  className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition">
                  Truy cap Student
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section style={{ background: '#0f766e' }} className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-md p-8 text-center stat-card">
                <TrendingUp style={{ color: '#0f766e' }} className="mx-auto mb-4" size={32} />
                <p className="text-3xl font-bold" style={{ color: '#0f172a' }}>10,000+</p>
                <p className="mt-2" style={{ color: '#475569' }}>Nguoi dung dang ky</p>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-8 text-center stat-card">
                <BookOpen style={{ color: '#059669' }} className="mx-auto mb-4" size={32} />
                <p className="text-3xl font-bold" style={{ color: '#0f172a' }}>500+</p>
                <p className="mt-2" style={{ color: '#475569' }}>Khoa hoc</p>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-8 text-center stat-card">
                <Users style={{ color: '#0e7490' }} className="mx-auto mb-4" size={32} />
                <p className="text-3xl font-bold" style={{ color: '#0f172a' }}>1,000+</p>
                <p className="mt-2" style={{ color: '#475569' }}>Giao vien</p>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-8 text-center stat-card">
                <Award style={{ color: '#f59e0b' }} className="mx-auto mb-4" size={32} />
                <p className="text-3xl font-bold" style={{ color: '#0f172a' }}>95%</p>
                <p className="mt-2" style={{ color: '#475569' }}>Ty le thanh cong</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section id="courses" className="py-16 px-6" style={{ background: '#f8fafc' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span style={{ color: '#0f766e', background: '#ccfbf1' }} className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3">
                Khoa hoc
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0f172a' }}>
                Khoa hoc noi bat
              </h2>
              <p className="text-lg" style={{ color: '#475569' }}>
                Cac khoa hoc duoc giao vien hang dau tao ra, duoc hang ngan hoc sinh tin tuong
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {featuredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl shadow-md card-hover overflow-hidden">
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{ background: '#0f766e', color: 'white' }}>
                        {course.level}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          className={i < Math.floor(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                      <span className="text-sm ml-1" style={{ color: '#64748b' }}>({course.rating})</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#0f172a' }}>{course.title}</h3>
                    <p className="text-sm mb-4" style={{ color: '#64748b' }}>Giao vien: {course.instructor}</p>
                    <div className="flex items-center justify-between text-sm pb-4 border-b"
                      style={{ borderColor: '#e2e8f0', color: '#94a3b8' }}>
                      <span style={{ background: '#ccfbf1', color: '#0f766e' }}
                        className="text-xs font-semibold px-2 py-1 rounded-lg">
                        {course.students.toLocaleString()} hoc sinh
                      </span>
                    </div>
                    <button className="btn-primary w-full mt-4 px-4 py-2.5 rounded-xl font-semibold">
                      Xem chi tiet
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/student" className="btn-primary inline-block px-8 py-3 rounded-xl font-semibold shadow-lg">
                Xem tat ca khoa hoc
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section style={{ background: '#ccfbf1' }} className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span style={{ color: '#0f766e', background: 'white' }} className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3">
                Phan hoi
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0f172a' }}>
                Nguoi dung noi gi ve chung toi
              </h2>
              <p className="text-lg" style={{ color: '#134e4a' }}>
                Hang ngan nguoi dung hai long da duoc huong loi tu nen tang cua chung toi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-2xl shadow-md p-8 testimonial-card">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                      style={{ border: '2px solid #0f766e' }}
                    />
                    <div>
                      <p className="font-bold" style={{ color: '#0f172a' }}>{testimonial.name}</p>
                      <p className="text-xs font-semibold uppercase tracking-wide"
                        style={{ color: '#0f766e' }}>{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={15} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="italic leading-relaxed" style={{ color: '#475569' }}>"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup Section */}
        <section className="newsletter-bg py-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <span style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.4)' }}
              className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full inline-block mb-5">
              Đăng ký ngay
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Đăng ký khoá học ngay hôm nay
            </h2>
            <p className="text-xl mb-8" style={{ color: '#99f6e4' }}>
              Nhận thông báo về các khoá học mới và cập nhật hệ thống
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Dang ky thanh cong voi email: ${signupEmail}`);
                setSignupEmail('');
              }}
              className="flex flex-col sm:flex-row gap-3 mb-6"
            >
              <input
                type="email"
                placeholder="Nhap email cua ban"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                className="flex-1 px-5 py-3 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.4)' }}
              />
              <button type="submit" className="btn-accent px-7 py-3 rounded-xl font-bold whitespace-nowrap shadow-lg">
                Dang ky
              </button>
            </form>

            <p className="text-sm" style={{ color: '#99f6e4' }}>
              Chung toi se khong bao gio chia se email cua ban. Huy dang ky bat ky luc nao.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span style={{ color: '#0f766e', background: '#ccfbf1' }} className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0f172a' }}>
                Cau hoi thuong gap
              </h2>
              <p className="text-lg" style={{ color: '#475569' }}>
                Tim cau tra loi cho cac cau hoi pho bien ve nen tang cua chung toi
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="faq-item">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left transition"
                    style={{ background: expandedFAQ === faq.id ? '#f0fdf9' : '#f8fafc' }}
                  >
                    <h3 className="font-semibold" style={{ color: '#0f172a' }}>{faq.question}</h3>
                    <ChevronDown
                      size={20}
                      style={{ color: '#0f766e', transform: expandedFAQ === faq.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                    />
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 py-4 bg-white border-t" style={{ borderColor: '#e2e8f0' }}>
                      <p style={{ color: '#475569' }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center rounded-2xl p-8" style={{ background: '#f0fdf9', border: '1px solid #ccfbf1' }}>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#0f172a' }}>
                Khong tim duoc cau tra loi?
              </h3>
              <p className="mb-5" style={{ color: '#475569' }}>
                Lien he voi chung toi qua email hoac bieu mau lien he
              </p>
              <button className="btn-primary inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold shadow-md">
                <MessageCircle size={18} />
                Lien he voi chung toi
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}