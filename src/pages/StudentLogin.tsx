/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import authService from '@/services/authService';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const data = await authService.login({ email, password });
    setIsLoading(false);

    if (data && data.success) {
      // 🆕 Kiểm tra quyền SINH VIÊN
      if (authService.isStudent(data.user)) { 
        localStorage.setItem('token', data.token);
        navigate('/student');
      } else {
        alert("Bạn không có quyền truy cập vào khu vực Sinh viên. Vui lòng đăng nhập bằng tài khoản sinh viên.");
      }
    } else {
      alert(data?.message || "Email hoặc mật khẩu không chính xác.");
    }
  };

 const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      if (!idToken) {
        alert("Không thể lấy token từ Google.");
        return;
      }

      const response = await authService.googleVerify(idToken);
      
      // ✅ FIX: Lấy trực tiếp token và user từ response y hệt như bên Teacher
      const validToken = response?.token;
      const userData = response?.user;

      if (response?.success && validToken) {
        // Kiểm tra quyền Sinh viên
        if (authService.isStudent(userData)) { 
          localStorage.setItem('token', validToken);
          navigate('/student'); // Chuyển thẳng vào trang Dashboard Sinh viên
        } else {
          alert("Tài khoản Google này chưa được đăng ký vai trò Sinh viên.");
        }
      } else {
        // Backend trả về lỗi (ví dụ: chưa đăng ký, bị khóa,...)
        alert(response?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại dữ liệu.");
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      alert("Đăng nhập Google thất bại. Lỗi kết nối server.");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* CỘT TRÁI: Branding - Tone màu Indigo */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center flex-col text-white p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' }}
      >
        <div className="absolute top-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full bg-white/10"></div>
        <div className="absolute bottom-[-80px] left-[10%] w-[240px] h-[240px] rounded-full bg-blue-400/10"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-20 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
            <span className="font-extrabold text-4xl text-indigo-600">LMS</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Khu vực Sinh viên</h1>
          <p className="text-lg max-w-md text-indigo-100">
            Khám phá kho tàng tri thức, theo dõi lộ trình học tập và kết nối cùng cộng đồng sinh viên năng động.
          </p>
          
          <div className="mt-12 w-72 h-72 rounded-full flex items-center justify-center relative">
             <div className="absolute inset-0 bg-white opacity-5 rounded-full blur-sm"></div>
             <img 
               src="https://cdn-icons-png.flaticon.com/512/3449/3449614.png" 
               alt="Sinh viên minh họa" 
               className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
             />
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">Chào bạn sinh viên!</h2>
            <p className="mt-2 text-sm text-slate-500">Đăng nhập để tiếp tục việc học của bạn</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mã sinh viên / Email</label>
                <input 
                  type="email" 
                  placeholder="student@university.edu.vn" 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={email} onChange={(e) => setEmail(e.target.value)} required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={password} onChange={(e) => setPassword(e.target.value)} required 
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
                <span className="ml-2">Duy trì đăng nhập</span>
              </label>
              <Link to="/student/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">Quên mật khẩu?</Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? 'Đang xác thực...' : 'Vào lớp ngay'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-medium">Hoặc đăng nhập bằng</span></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleLogin} theme="outline" size="large" shape="pill" />
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Tân sinh viên? <Link to="/register/student" className="font-bold text-indigo-600 hover:underline">Đăng ký nhập học</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;