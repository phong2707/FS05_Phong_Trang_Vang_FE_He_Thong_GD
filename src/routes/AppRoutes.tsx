// frontend/src/routes/AppRoutes.tsx
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
import UserManagementPage from '@/pages/admin/UserManagement';
import RoleManagementPage from '@/pages/admin/RoleManagement';
import CourseManagementPage from '@/pages/admin/CourseManagement';
import CourseCreateWizardPage from '@/pages/admin/CourseCreateWizard';

import TeacherSubject from '@/pages/teacher/TeacherSubject';
import SubjectDetailPage from '@/pages/teacher/SubjectDetailPage';
import SubjectFeaturePlaceholderPage from '@/pages/teacher/SubjectFeaturePlaceholderPage';
import AttendancePage from '@/pages/teacher/AttendancePage';
import ClassGroupStudentsPage from '@/pages/teacher/ClassGroupStudentsPage';

// ✅ Bổ sung import trang Quản lý tài liệu môn học
import SubjectResourcesPage from '@/pages/teacher/SubjectResourcesPage';

// Public Course Pages
import CoursesPage from '@/pages/CoursesPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import UpcomingCoursesPage from '@/pages/UpcomingCoursesPage';
import SubjectStudentsPage from '@/pages/teacher/SubjectStudentsPage';
import SubjectTestsPage from '@/pages/teacher/SubjectTestsPage';
import SubjectQuestionBankPage from '@/pages/teacher/SubjectQuestionBankPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Các trang công khai */}
      <Route path="/" element={<HomePage />} />
      <Route path="/roles" element={<RoleSelectionPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/:id" element={<CourseDetailPage />} />
      <Route path="/upcoming-courses" element={<UpcomingCoursesPage />} />
      
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
      {/* Dashboard Admin */}
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagementPage />} />
      <Route path="/admin/roles" element={<RoleManagementPage />} />
      <Route path="/admin/courses" element={<CourseManagementPage />} />
      <Route path="/admin/courses/create" element={<CourseCreateWizardPage />} />
      <Route path="/admin/courses/:id/edit" element={<CourseCreateWizardPage />} />

      {/* Dashboard Teacher */}
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/subjects" element={<TeacherSubject />} />
      <Route path="/teacher/subjects/:subjectId" element={<SubjectDetailPage />} />
      
      {/* ✅ Thay thế Placeholder bằng Component Quản lý tài liệu thật (đã đổi path thành resources cho chuẩn) */}
      <Route
        path="/teacher/subjects/:subjectId/resources"
        element={<SubjectResourcesPage />}
      />
      
      <Route
        path="/teacher/subjects/:subjectId/attendance"
        element={<AttendancePage />}
      />
      <Route
        path="/teacher/subjects/:subjectId/students"
        element={<SubjectStudentsPage />}
      />
      <Route
        path="/teacher/subjects/:subjectId/exams"
        element={<SubjectTestsPage />}
      />
      <Route
        path="/teacher/subjects/:subjectId/question-bank"
        element={<SubjectQuestionBankPage />}
      />
      <Route
        path="/teacher/subjects/:subjectId/grades"
        element={<SubjectFeaturePlaceholderPage title="Quản lý điểm theo môn" />}
      />
      <Route
        path="/teacher/subjects/:subjectId/groups"
        element={<SubjectFeaturePlaceholderPage title="Nhóm lớp học phần" />}
      />
      <Route
        path="/teacher/class-groups/:classGroupId/students"
        element={<ClassGroupStudentsPage />}
      />

      {/* 5. Dashboard Student */}
      <Route path="/student/*" element={<StudentDashboard />} />

      {/* 6. Not found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}