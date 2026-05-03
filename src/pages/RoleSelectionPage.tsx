import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Shield, GraduationCap } from 'lucide-react';

export default function RoleSelectionPage() {
  const roles = [
    {
      to: '/login/admin',
      icon: Shield,
      label: 'Quản trị viên',
      description: 'Quản lý toàn bộ hệ thống, người dùng và báo cáo chi tiết',
      features: ['Quản lý người dùng', 'Quản lý khóa học', 'Báo cáo & Phân tích'],
      gradient: 'from-teal-500 to-teal-700',
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
      featureBg: 'bg-teal-50',
      featureText: 'text-teal-700',
      borderAccent: 'border-t-teal-600',
      badgeColor: 'bg-teal-100 text-teal-700',
      badge: 'Hệ thống',
      dotColor: 'bg-teal-500',
      hoverShadow: 'hover:shadow-teal-200',
    },
    {
      to: '/login/teacher',
      icon: GraduationCap,
      label: 'Giáo viên',
      description: 'Tạo khóa học, quản lý bài tập và theo dõi tiến độ học sinh',
      features: ['Tạo khóa học', 'Quản lý bài tập', 'Giao tiếp học sinh'],
      gradient: 'from-emerald-500 to-emerald-700',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      featureBg: 'bg-emerald-50',
      featureText: 'text-emerald-700',
      borderAccent: 'border-t-emerald-600',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      badge: 'Giảng dạy',
      dotColor: 'bg-emerald-500',
      hoverShadow: 'hover:shadow-emerald-200',
    },
    {
      to: '/login/student',
      icon: BookOpen,
      label: 'Học sinh',
      description: 'Theo dõi khóa học, bài tập và tiến độ học tập cá nhân',
      features: ['Xem khóa học', 'Nộp bài tập', 'Theo dõi tiến độ'],
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      featureBg: 'bg-amber-50',
      featureText: 'text-amber-700',
      borderAccent: 'border-t-amber-500',
      badgeColor: 'bg-amber-100 text-amber-700',
      badge: 'Học tập',
      dotColor: 'bg-amber-500',
      hoverShadow: 'hover:shadow-amber-200',
    },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f3d38 0%, #0d4a42 40%, #134e3a 100%)' }}
    >
      {/* Background decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #5eead4, transparent)', transform: 'translate(-30%, -30%)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #fbbf24, transparent)', transform: 'translate(30%, 30%)' }} />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />

      <div className="max-w-5xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          {/* Logo pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #14b8a6, #10b981)' }}>
              <span className="text-white font-black text-xs">L</span>
            </div>
            <span className="text-teal-200 text-sm font-semibold tracking-wide">LMS Platform</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Chọn vai trò
          </h1>
          <div className="w-16 h-1 rounded-full mx-auto mb-5"
            style={{ background: 'linear-gradient(90deg, #14b8a6, #fbbf24)' }} />
          <p className="text-lg text-teal-200 max-w-md mx-auto">
            Truy cập dashboard phù hợp với vai trò của bạn trong hệ thống
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.to}
                to={role.to}
                className={`group bg-white rounded-2xl shadow-xl ${role.hoverShadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-t-4 ${role.borderAccent} flex flex-col`}
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${role.gradient}`} />

                <div className="p-7 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-5">
                    <div className={`w-14 h-14 ${role.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={role.iconColor} size={28} />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${role.badgeColor}`}>
                      {role.badge}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-gray-900 mb-2">{role.label}</h2>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">{role.description}</p>

                  <div className={`${role.featureBg} rounded-xl p-4 mb-6 flex-1`}>
                    <ul className="space-y-2">
                      {role.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${role.dotColor}`} />
                          <span className={role.featureText + ' font-medium'}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r ${role.gradient} text-white text-sm font-bold group-hover:opacity-90 transition-opacity`}>
                    <span>Truy cập ngay</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-teal-300 text-sm mb-3">
            Đây là giao diện demo. Chọn vai trò phía trên để khám phá dashboard.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-teal-200 hover:text-white text-sm font-medium transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}