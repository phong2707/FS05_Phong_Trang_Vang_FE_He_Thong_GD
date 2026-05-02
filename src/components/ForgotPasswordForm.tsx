/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Mail, ShieldCheck, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import authService from '@/services/authService';
import { Link, useNavigate } from 'react-router-dom';

interface Props {
  role: 'TEACHER' | 'STUDENT';
  themeColor: string; // 'teal' | 'emerald' | 'blue'
  loginPath: string;
}

export default function ForgotPasswordForm({ role, themeColor, loginPath }: Props) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await authService.forgotPassword(email);
    setLoading(false);
    if (res.success) {
      setStep(2);
      setMessage({ type: 'success', text: res.message });
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await authService.verifyOtp(email, otp);
    setLoading(false);
    if (res.success) {
      setResetToken(res.resetToken);
      setStep(3);
      setMessage({ type: 'success', text: 'Xác thực thành công. Vui lòng nhập mật khẩu mới.' });
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;
    setLoading(true);
    const res = await authService.resetPassword({ password, passwordConfirmation: confirm }, resetToken);
    setLoading(false);
    if (res.success) {
      alert("Đổi mật khẩu thành công!");
      navigate(loginPath);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-8 sm:px-16 lg:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm">
          <Link to={loginPath} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8">
            <ArrowLeft size={16} className="mr-2" /> Quay lại đăng nhập
          </Link>
          
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Quên mật khẩu?</h2>
          <p className="text-gray-500 mb-8">
            {step === 1 && "Nhập email của bạn để nhận mã xác thực OTP."}
            {step === 2 && `Chúng tôi đã gửi mã 6 số đến ${email}`}
            {step === 3 && "Thiết lập mật khẩu mới cho tài khoản của bạn."}
          </p>

          {message.text && (
            <div className={`p-3 rounded-lg mb-6 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendEmail} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email công việc</label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border p-2.5" />
                </div>
              </div>
              <button disabled={loading} type="submit" className={`w-full py-3 px-4 rounded-md shadow-sm text-white font-medium bg-${themeColor}-600 hover:bg-${themeColor}-700 flex justify-center`}>
                {loading ? <Loader2 className="animate-spin" /> : "Gửi mã OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mã xác thực OTP</label>
                <div className="mt-1 relative">
                  <ShieldCheck className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="text" maxLength={6} required value={otp} onChange={e => setOtp(e.target.value)}
                    className="pl-10 block w-full tracking-[1em] font-bold text-center border-gray-300 rounded-md shadow-sm border p-2.5" />
                </div>
              </div>
              <button disabled={loading} type="submit" className={`w-full py-3 px-4 rounded-md shadow-sm text-white font-medium bg-${themeColor}-600 hover:bg-${themeColor}-700 flex justify-center`}>
                {loading ? <Loader2 className="animate-spin" /> : "Xác nhận mã"}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input name="password" type="password" required className="pl-10 block w-full border-gray-300 rounded-md shadow-sm border p-2.5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input name="confirm" type="password" required className="pl-10 block w-full border-gray-300 rounded-md shadow-sm border p-2.5" />
                </div>
              </div>
              <button disabled={loading} type="submit" className={`w-full py-3 px-4 rounded-md shadow-sm text-white font-medium bg-${themeColor}-600 hover:bg-${themeColor}-700 flex justify-center`}>
                {loading ? <Loader2 className="animate-spin" /> : "Cập nhật mật khẩu"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Right side: Image/Banner */}
      <div className={`hidden lg:block relative flex-1 bg-${themeColor}-600`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <img src="/auth-illustration.svg" alt="Security" className="w-2/3 mb-8 opacity-80" />
          <h3 className="text-2xl font-bold">Bảo mật tài khoản {role === 'TEACHER' ? 'Giáo viên' : 'Sinh viên'}</h3>
          <p className="text-center mt-4 opacity-90 text-sm max-w-md">
            Hệ thống LMS sử dụng xác thực đa lớp để bảo vệ dữ liệu học tập và thông tin cá nhân của bạn.
          </p>
        </div>
      </div>
    </div>
  );
}