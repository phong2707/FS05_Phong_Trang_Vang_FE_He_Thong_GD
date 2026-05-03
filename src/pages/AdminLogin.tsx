/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { ShieldAlert, LockKeyhole } from 'lucide-react';
import authService from '@/services/authService';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const data = await authService.login({ email, password }); //[cite: 3]
    setIsLoading(false);

    if (data && data.success) {
      if (authService.isAdmin(data.user)) { 
        localStorage.setItem('token', data.token); //[cite: 3]
        navigate('/admin');
      } else {
        // Đăng xuất ngay lập tức nếu không phải Admin
        localStorage.removeItem('token');
        alert("Truy cập bị từ chối. Bạn không có quyền quản trị viên.");
      }
    } else if (data && data.message) {
      alert(data.message); //[cite: 3]
    } else {
      alert("Có lỗi xảy ra. Vui lòng thử lại sau."); //[cite: 3]
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      setGoogleLoading(true);
      const idToken = credentialResponse.credential; //[cite: 3]
      
      if (!idToken) {
        alert("Không thể lấy token từ Google."); //[cite: 3]
        return;
      }

      const response = await authService.googleVerify(idToken); //[cite: 3]
      
      const result = response?.data; //[cite: 3]
      const validToken = result?.accessToken || result?.token; //[cite: 3]
      const userData = result?.user; //[cite: 3]

      if (response?.success && validToken) {
        if (authService.isAdmin(userData)) { 
          localStorage.setItem('token', validToken); //[cite: 3]
          navigate('/admin');
        } else {
          // Đăng xuất ngay lập tức nếu không phải Admin
          localStorage.removeItem('token');
          alert("Truy cập bị từ chối. Bạn không có quyền quản trị viên.");
        }
      } else {
        alert(response?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại dữ liệu."); //[cite: 3]
      }
    } catch (error: any) {
      console.error('Google login error:', error); //[cite: 3]
      alert("Lỗi kết nối server."); //[cite: 3]
    } finally {
      setGoogleLoading(false); //[cite: 3]
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* CỘT TRÁI: Branding - Tone màu Slate & Violet bảo mật */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center flex-col text-white p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #2e1065 50%, #020617 100%)' }}
      >
        <div className="absolute top-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full" style={{ background: 'rgba(139, 92, 246, 0.15)' }}></div>
        <div className="absolute bottom-[-80px] left-[10%] w-[240px] h-[240px] rounded-full" style={{ background: 'rgba(99, 102, 241, 0.10)' }}></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center mb-8 shadow-2xl">
            <ShieldAlert size={48} className="text-violet-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight text-white">Hệ thống Quản trị Nội bộ</h1>
          <p className="text-lg max-w-md text-violet-200">
            Khu vực giám sát và quản lý hệ thống. Mọi thao tác tại đây đều được ghi log để đảm bảo an toàn thông tin.
          </p>
          
          <div className="mt-16 w-64 h-64 flex items-center justify-center relative">
             <div className="absolute inset-0 bg-violet-600 opacity-20 rounded-full blur-2xl animate-pulse"></div>
             <LockKeyhole size={140} className="relative z-10 text-white/80 drop-shadow-2xl" />
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: Form Đăng nhập Admin */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-100">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-slate-200">
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">Xác thực Danh tính</h2>
            <p className="mt-2 text-sm text-slate-500">
              Đăng nhập với tư cách <span className="font-bold text-violet-700">Admin</span>
            </p>
            <div className="mt-3 inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200">
              Chỉ dành cho người có thẩm quyền
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-slate-700" htmlFor="email">
                  Tài khoản Email Quản trị
                </label>
                <input 
                  id="email"
                  type="email" 
                  placeholder="admin@system.local" 
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-900 bg-slate-50 focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-slate-700" htmlFor="password">
                  Mật khẩu bảo mật
                </label>
                <input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-slate-900 bg-slate-50 focus:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" 
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-600">
                Ghi nhớ phiên đăng nhập
              </label>
            </div>
            {/* ĐÃ XÓA LINK QUÊN MẬT KHẨU TẠI ĐÂY */}

            <div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-[1px] bg-slate-900 hover:bg-slate-800"
              >
                {isLoading ? 'Đang xác thực...' : 'Đăng nhập Hệ thống'}
              </button>
            </div>
          </form>

          {/* Dòng phân cách và Nút đăng nhập Google */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-400 font-medium">
                  Hoặc đăng nhập bằng
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  alert("Lỗi đăng nhập bằng Google. Vui lòng thử lại.");
                }}
                text="signin_with"
                theme="outline"
                size="large"
              />
            </div>
          </div>

          {/* Nút quay lại trang chủ - KHÔNG CÓ LINK ĐĂNG KÝ */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm">
            <Link to="/" className="font-semibold text-slate-400 hover:text-slate-600 transition-colors">
              &larr; Rời khỏi khu vực quản trị
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;