// frontend/src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from '@/pages/HomePage';
import RoleSelectionPage from '@/pages/RoleSelectionPage';

import AdminDashboard from '@/pages/AdminDashboard';
import TeacherDashboard from '@/pages/TeacherDashboard';
import StudentDashboard from '@/pages/StudentDashboard';

import TeacherLogin from '@/pages/TeacherLogin';
import StudentLogin from '@/pages/StudentLogin';
import AdminLogin from '@/pages/AdminLogin';
import UserManagementPage from '@/pages/admin/UserManagement';
import RoleManagementPage from '@/pages/admin/RoleManagement'; // Import mới


import ProfilePage from '@/pages/ProfilePage';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';

import TeacherHome from '@/pages/teacher/TeacherHome';
import ClassGroupsPage from '@/pages/teacher/ClassGroupsPage';
import ClassGroupStudentsPage from '@/pages/teacher/ClassGroupStudentsPage';
import TeacherCoursesPage from '@/pages/teacher/TeacherCoursesPage';
import CourseDetailPage from '@/pages/teacher/CourseDetailPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/roles" element={<RoleSelectionPage />} />
      
      {/* 2. Luồng Đăng nhập & Quên mật khẩu (Phải đặt TRƯỚC các cụm /*) */}
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/login/teacher" element={<TeacherLogin />} />
      <Route path="/login/student" element={<StudentLogin />} />

      {/* Forgot password for teacher */}
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

      {/* 3. Profile */}
      <Route path="/profile" element={<ProfilePage />} />
  
      {/* 4. Các cụm Dashboard dành cho từng vai trò */}
      {/* Dấu /* cho phép các trang con bên trong Dashboard hoạt động */}
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagementPage />} />
      <Route path="/admin/roles" element={<RoleManagementPage />} /> {/* Route mới cho RBAC */}

      {/* 5. Teacher Dashboard (nested routes) */}
      <Route path="/teacher/*" element={<TeacherDashboard />}>
        <Route index element={<TeacherHome />} />

        <Route
          path="subjects/:subjectId/groups"
          element={<ClassGroupsPage />}
        />

        <Route
          path="class-groups/:classGroupId/students"
          element={<ClassGroupStudentsPage />}
        />

        <Route path="courses" element={<TeacherCoursesPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
      </Route>

      {/* 6. Student Dashboard */}
      <Route path="/student/*" element={<StudentDashboard />} />

      {/* 6. Not found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
