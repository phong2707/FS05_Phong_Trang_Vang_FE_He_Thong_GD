import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '@/services/authService';

const TeacherLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const data = await authService.login({ email, password });
    setIsLoading(false);

    // Kiểm tra response từ backend
    if (data && data.success) {
      // Kiểm tra xem user có role TEACHER không
      if (authService.isTeacher(data.user)) {
        localStorage.setItem('token', data.token);
        navigate('/teacher');
      } else {
        alert("Bạn không có quyền truy cập vào khu vực Giáo viên. Vui lòng liên hệ Admin.");
      }
    } else if (data && data.message) {
      // Backend trả về lỗi với message
      alert(data.message);
    } else {
      // Lỗi không xác định
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  // Hàm xử lý đăng nhập bằng Google (Cần tích hợp Firebase hoặc Google OAuth2)
  const handleGoogleLogin = () => {
    console.log("Kích hoạt luồng đăng nhập Google...");
    // alert("Tính năng Đăng nhập bằng Google đang được phát triển!");
  };

  return (
    <div className="min-h-screen flex bg-stone-50" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* CỘT TRÁI: Branding - Đồng bộ với Hero Section của HomePage */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center flex-col text-white p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0e7490 50%, #065f46 100%)' }}
      >
        <div className="absolute top-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full" style={{ background: 'rgba(20,184,166,0.18)' }}></div>
        <div className="absolute bottom-[-80px] left-[10%] w-[240px] h-[240px] rounded-full" style={{ background: 'rgba(245,158,11,0.10)' }}></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-20 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
            <span className="font-extrabold text-4xl" style={{ color: '#0f766e' }}>LMS</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Hệ thống Giáo dục</h1>
          <p className="text-lg max-w-md" style={{ color: '#99f6e4' }}>
            Nền tảng hỗ trợ giảng dạy trực tuyến thông minh. Quản lý lớp học, giao bài tập và đồng hành cùng sinh viên dễ dàng hơn bao giờ hết.
          </p>
          
          <div className="mt-12 w-72 h-72 rounded-full flex items-center justify-center relative">
             <div className="absolute inset-0 bg-white opacity-10 rounded-full blur-sm"></div>
             <img 
               src="https://png.pngtree.com/png-vector/20230430/ourmid/pngtree-teachers-day-characters-png-image_6740168.png" 
               alt="Giáo viên minh họa" 
               className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
             />
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: Form Đăng nhập */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-stone-50">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-lg border" style={{ borderColor: '#e2e8f0' }}>
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold" style={{ color: '#0f172a' }}>Chào mừng trở lại</h2>
            <p className="mt-2 text-sm" style={{ color: '#475569' }}>
              Đăng nhập với tài khoản <span className="font-bold" style={{ color: '#059669' }}>Giáo viên</span>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0f172a' }} htmlFor="email">
                  Địa chỉ Email
                </label>
                <input 
                  id="email"
                  type="email" 
                  placeholder="teacher@school.edu.vn" 
                  className="appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm sm:text-sm transition-colors focus:outline-none"
                  style={{ borderColor: '#e2e8f0', color: '#0f172a' }}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0f172a' }} htmlFor="password">
                  Mật khẩu
                </label>
                <input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm sm:text-sm transition-colors focus:outline-none"
                  style={{ borderColor: '#e2e8f0', color: '#0f172a' }}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  name="remember-me" 
                  type="checkbox" 
                  className="h-4 w-4 rounded" 
                  style={{ accentColor: '#059669', borderColor: '#e2e8f0' }} 
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm" style={{ color: '#475569' }}>
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium hover:opacity-80 transition-opacity" style={{ color: '#059669' }}>
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-[1px]"
                style={{ background: '#059669' }}
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập ngay'}
              </button>
            </div>
          </form>

          {/* Dòng phân cách và Nút đăng nhập Google */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#e2e8f0' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white" style={{ color: '#94a3b8' }}>
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center py-3 px-4 border rounded-xl shadow-sm text-sm font-semibold bg-white hover:bg-gray-50 transition-colors duration-200"
                style={{ borderColor: '#e2e8f0', color: '#0f172a' }}
              >
                {/* SVG Icon Google */}
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Đăng nhập bằng Gmail
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm" style={{ color: '#475569' }}>
            <p>
              Chưa có tài khoản?{' '}
              <Link to="/register/teacher" className="font-bold hover:opacity-80 transition-opacity" style={{ color: '#059669' }}>
                Đăng ký mở lớp
              </Link>
            </p>
            <p className="mt-3">
              <Link to="/" className="font-medium hover:text-slate-900 transition-colors" style={{ color: '#94a3b8' }}>
                &larr; Quay lại trang chủ
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;