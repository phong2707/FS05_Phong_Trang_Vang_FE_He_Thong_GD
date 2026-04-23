import { useState } from 'react';
import { Link } from 'react-router-dom';

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
      <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
        Đăng nhập
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <a
            href="/login/student"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            🎓 Dành cho Sinh viên
          </a>
          <a
            href="/login/teacher"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            👨‍🏫 Dành cho Giáo viên
          </a>
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
      <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
        Đăng ký
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <a
            href="/register/student"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            🎓 Dành cho Sinh viên
          </a>
          <a
            href="/register/teacher"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            👨‍🏫 Dành cho Giáo viên
          </a>
        </div>
      )}
    </div>
  );
};

export const Header: React.FC = () => {
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isSignupDropdownOpen, setIsSignupDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo và links trái */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900">LMS</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Trang chủ
              </Link>
              <Link
                to="/courses"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Khóa học
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Giới thiệu
              </Link>
            </div>
          </div>

          {/* Nút Đăng nhập và Đăng ký phải */}
          <div className="flex items-center gap-3">
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
          </div>
        </div>
      </nav>
    </header>
  );
};
