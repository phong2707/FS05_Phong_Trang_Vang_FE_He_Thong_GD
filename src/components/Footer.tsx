
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-gray-300" style={{ background: 'linear-gradient(180deg, #0d1f1e 0%, #071413 100%)' }}>

      {/* top accent bar */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #0f766e, #059669, #f59e0b)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-teal-900/40"
                style={{ background: 'linear-gradient(135deg, #0f766e 0%, #059669 100%)' }}
              >
                <span className="text-white font-black text-lg">L</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-black text-lg">LMS</span>
                <span className="text-[9px] font-semibold text-teal-400 tracking-widest uppercase">
                  iViettech
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nền tảng quản lý học tập hàng đầu dành cho sinh viên và giáo viên, cung cấp trải nghiệm học tập trực tuyến toàn diện và hiệu quả.
            </p>
            {/* stat pills */}
            <div className="flex gap-2 mt-4 flex-wrap">
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-teal-900/60 text-teal-300 border border-teal-800">
                10,000+ nguoi dung
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-800">
                500+ Khoá học 
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Liệt kê nhanh 
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/', label: 'Trang chu' },
                { href: '/courses', label: 'Khoa hoc' },
                { href: '/about', label: 'Gioi thieu' },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors group"
                  >
                    <span className="w-1 h-1 rounded-full bg-teal-700 group-hover:bg-teal-400 transition-colors" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Hỗ trợ
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '#', label: 'Lien he' },
                { href: '#', label: 'Hoi dap (FAQ)' },
                { href: '#', label: 'Dieu khoan dich vu' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors group"
                  >
                    <span className="w-1 h-1 rounded-full bg-emerald-700 group-hover:bg-emerald-400 transition-colors" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Theo dỏi chúng tôi 
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { href: '#', label: 'Facebook', color: 'hover:text-blue-400' },
                { href: '#', label: 'Twitter / X', color: 'hover:text-sky-400' },
                { href: '#', label: 'LinkedIn', color: 'hover:text-indigo-400' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={`flex items-center gap-2 text-sm text-gray-400 ${s.color} transition-colors group`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg bg-gray-800 border border-gray-700
                               flex items-center justify-center text-xs font-bold
                               group-hover:border-teal-600 transition-colors`}
                  >
                    {s.label[0]}
                  </span>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © {currentYear} LMS iViettech. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Thiết kế bởi{' '}
            <span
              className="font-semibold"
              style={{ background: 'linear-gradient(90deg, #0d9488, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              iViettech
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;