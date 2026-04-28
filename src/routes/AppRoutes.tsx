// frontend/src/routes/appRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import RoleSelectionPage from '@/pages/RoleSelectionPage';
import AdminDashboard from '@/pages/AdminDashboard';
import TeacherDashboard from '@/pages/TeacherDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import TeacherLogin from '@/pages/TeacherLogin';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Các trang công khai */}
      <Route path="/" element={<HomePage />} />
      <Route path="/roles" element={<RoleSelectionPage />} />
      
      {/* 2. Trang đăng nhập cụ thể (Phải đặt trước các cụm /*) */}
      <Route path="/login/teacher" element={<TeacherLogin />} />
      
      {/* 3. Các cụm Dashboard dành cho từng vai trò */}
      {/* Dấu /* cho phép các trang con bên trong Dashboard hoạt động */}
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/teacher/*" element={<TeacherDashboard />} />
      <Route path="/student/*" element={<StudentDashboard />} />

      {/* 4. Xử lý khi không tìm thấy trang */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}