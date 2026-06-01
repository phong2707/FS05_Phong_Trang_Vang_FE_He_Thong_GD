// frontend/src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import RoleSelectionPage from "@/pages/RoleSelectionPage";
import AdminDashboard from "@/pages/AdminDashboard";
import TeacherDashboard from "@/pages/TeacherDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import TeacherLogin from "@/pages/TeacherLogin";
import ProfilePage from "@/pages/ProfilePage";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import StudentLogin from "@/pages/StudentLogin";
import AdminLogin from "@/pages/AdminLogin";
import UserManagementPage from "@/pages/admin/UserManagement";
import RoleManagementPage from "@/pages/admin/RoleManagement"; // Import mới
import CourseManagementPage from "@/pages/admin/CourseManagement";
import CourseCreateWizardPage from "@/pages/admin/CourseCreateWizard";

import { StudentSchedule, StudentMaterials } from "@/components";

import TeacherHome from "@/pages/teacher/TeacherHome";
import ClassGroupsPage from "@/pages/teacher/ClassGroupsPage";

import TeacherCoursesPage from "@/pages/teacher/TeacherCoursesPage";
import CourseDetailPage from "@/pages/teacher/CourseDetailPage";

import ClassGroupStudentsPage from "@/pages/teacher/ClassGroupStudentsPage";

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
      <Route path="/admin/users" element={<UserManagementPage />} />
      <Route path="/admin/roles" element={<RoleManagementPage />} />
      <Route path="/admin/courses" element={<CourseManagementPage />} />
      <Route
        path="/admin/courses/create"
        element={<CourseCreateWizardPage />}
      />
      <Route
        path="/admin/courses/:id/edit"
        element={<CourseCreateWizardPage />}
      />

      {/* 4. Dashboard Teacher (nested routes) */}
      <Route path="/teacher/*" element={<TeacherDashboard />}>
        <Route index element={<TeacherHome />} />
        <Route
          path="subjects/:subjectId/groups"
          element={<ClassGroupsPage />}
        />

        {/* ✅ Sinh viên trong nhóm lớp */}
        <Route
          path="class-groups/:classGroupId/students"
          element={<ClassGroupStudentsPage />}
        />
      </Route>

      {/* 5. Dashboard Student */}
      <Route path="/student/*" element={<StudentDashboard />}>
        <Route path="schedule" element={<StudentSchedule />} />
        <Route path="materials" element={<StudentMaterials />} />
      </Route>

      {/* 6. Not found */}
      <Route path="*" element={<Navigate to="/" replace />} />

      <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
      <Route path="/teacher/courses/:id" element={<CourseDetailPage />} />
    </Routes>
  );
}
