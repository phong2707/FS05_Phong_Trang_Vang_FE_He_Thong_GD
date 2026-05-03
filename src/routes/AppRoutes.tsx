// frontend/src/routes/appRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import RoleSelectionPage from '@/pages/RoleSelectionPage';
import AdminDashboard from '@/pages/AdminDashboard';
import TeacherDashboard from '@/pages/TeacherDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import TeacherLogin from '@/pages/TeacherLogin';
import ProfilePage from '@/pages/ProfilePage';
import ForgotPasswordForm from '@/components/ForgotPasswordForm'; 
import StudentLogin from '@/pages/StudentLogin';
import AdminLogin from '@/pages/AdminLogin';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Các trang công khai */}
      <Route path="/" element={<HomePage />} />
      <Route path="/roles" element={<RoleSelectionPage />} />
      
      {/* 2. Luồng Đăng nhập & Quên mật khẩu (Phải đặt TRƯỚC các cụm /*) */}
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/login/teacher" element={<TeacherLogin />} />
      <Route path="/login/student" element={<StudentLogin />} />
      
      {/* Thêm Route này ở đây để nó không bị rơi vào cụm /teacher/* phía dưới */}
      <Route
        path="/teacher/forgot-password"
        element={
          <ForgotPasswordForm
            role="TEACHER"
            themeColor="teal"
            loginPath="/login/teacher"
          />
        }
      />
      {/* 3. Trang Profile cá nhân */}
      <Route path="/profile" element={<ProfilePage />} />
  
      {/* 4. Các cụm Dashboard dành cho từng vai trò */}
      {/* Dấu /* cho phép các trang con bên trong Dashboard hoạt động */}
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/teacher/*" element={<TeacherDashboard />} />
      <Route path="/student/*" element={<StudentDashboard />} />

      {/* 5. Xử lý khi không tìm thấy trang */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}