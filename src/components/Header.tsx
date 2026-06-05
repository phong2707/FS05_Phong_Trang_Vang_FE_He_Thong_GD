import { useState } from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from '@/components/NotificationBell';

// ─── CSS Variables (match homepage) ────────────────────────────────────────
// --teal-700: #0f766e   primary
// --teal-600: #0d9488   primary hover
// --emerald-600: #059669
// --amber-500: #f59e0b  accent
// ───────────────────────────────────────────────────────────────────────────

interface DropdownMenuProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const AuthDropdown: React.FC<DropdownMenuProps> = ({
  isOpen,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        className="px-4 py-2 text-sm font-semibold text-teal-700 border border-teal-200 rounded-lg
                   hover:bg-teal-50 hover:border-teal-400 transition-all duration-200"
      >
        Đăng nhập
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-teal-100 py-2 z-50 overflow-hidden">
          {/* decorative top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-teal-500 to-emerald-500 mb-1" />
          <Link
            to="/login/student"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                       hover:bg-teal-50 hover:text-teal-700 transition-colors group"
          >
            <span
              className="w-7 h-7 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center
                         text-xs font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors"
            >
              SV
            </span>
            Dành cho Sinh viên
          </Link>
          <Link
            to="/login/teacher"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                       hover:bg-emerald-50 hover:text-emerald-700 transition-colors group"
          >
            <span
              className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center
                         text-xs font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors"
            >
              GV
            </span>
            Dành cho Giáo viên
          </Link>
        </div>
      )}
    </div>
  );
};

const SignupDropdown: React.FC<DropdownMenuProps> = ({
  isOpen,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-200
                   shadow-md shadow-teal-200 hover:shadow-teal-300 hover:scale-[1.03]"
        style={{ background: 'linear-gradient(135deg, #0f766e 0%, #059669 100%)' }}
      >
       Đăng ký 
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-teal-100 py-2 z-50 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-amber-500 mb-1" />
          <Link
            to="/register/student"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                       hover:bg-amber-50 hover:text-amber-700 transition-colors group"
          >
            <span
              className="w-7 h-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center
                         text-xs font-bold group-hover:bg-amber-500 group-hover:text-white transition-colors"
            >
              SV
            </span>
            Dành cho Sinh viên
          </Link>
          <Link
            to="/register/teacher"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                       hover:bg-amber-50 hover:text-amber-700 transition-colors group"
          >
            <span
              className="w-7 h-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center
                         text-xs font-bold group-hover:bg-amber-500 group-hover:text-white transition-colors"
            >
              GV
            </span>
            Dành cho Giáo viên
          </Link>
        </div>
      )}
    </div>
  );
};

interface HeaderCurrentUser {
  id: string;
}

interface HeaderProps {
  currentUser?: HeaderCurrentUser | null;
}

export const Header: React.FC<HeaderProps> = ({ currentUser }) => {
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isSignupDropdownOpen, setIsSignupDropdownOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-teal-100"
      style={{ boxShadow: '0 2px 16px 0 rgba(15,118,110,0.08)' }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ── Logo + Nav Links ── */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              {/* Logo mark: teal gradient square */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md
                           shadow-teal-200 group-hover:shadow-teal-300 transition-shadow"
                style={{ background: 'linear-gradient(135deg, #0f766e 0%, #059669 100%)' }}
              >
                <span className="text-white font-black text-lg tracking-tight">L</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black text-gray-900 tracking-tight">LMS</span>
                <span className="text-[9px] font-semibold text-teal-600 tracking-widest uppercase">
                  iViettech
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { to: '/', label: 'Trang chủ' },
                { to: '/courses', label: 'Khoa học' },
                { to: '/about', label: 'Giới thiệu' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg
                             hover:text-teal-700 hover:bg-teal-50 transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            {/* Dashboard pill */}
            <Link
              to="/roles"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                         text-amber-700 bg-amber-50 border border-amber-200
                         hover:bg-amber-100 hover:border-amber-400 transition-all duration-200"
            >
              {/* dot indicator */}
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              vào Dashboard
            </Link>

            {currentUser?.id ? (
              <NotificationBell currentUser={currentUser} />
            ) : (
              <>
                <AuthDropdown
                  isOpen={isLoginDropdownOpen}
                  onMouseEnter={() => setIsLoginDropdownOpen(true)}
                  onMouseLeave={() => setIsLoginDropdownOpen(false)}
                />
                <SignupDropdown
                  isOpen={isSignupDropdownOpen}
                  onMouseEnter={() => setIsSignupDropdownOpen(true)}
                  onMouseLeave={() => setIsSignupDropdownOpen(false)}
                />
              </>
            )}
          </div>
        </div>
      </nav>

      {/* bottom accent line */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #0f766e, #059669, #f59e0b)' }} />
    </header>
  );
};