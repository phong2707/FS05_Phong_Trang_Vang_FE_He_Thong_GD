// frontend/src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import RoleSelectionPage from '@/pages/RoleSelectionPage';
import AdminDashboard from '@/pages/AdminDashboard';
import TeacherDashboard from '@/pages/TeacherDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import TeacherLogin from '@/pages/TeacherLogin';

import TeacherHome from '@/pages/teacher/TeacherHome';
import ClassGroupsPage from '@/pages/teacher/ClassGroupsPage';


import TeacherCoursesPage from '@/pages/teacher/TeacherCoursesPage';
import CourseDetailPage from '@/pages/teacher/CourseDetailPage';


export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Các trang công khai */}
      <Route path="/" element={<HomePage />} />
      <Route path="/roles" element={<RoleSelectionPage />} />

      {/* 2. Trang đăng nhập */}
      <Route path="/login/teacher" element={<TeacherLogin />} />

      {/* 3. Dashboard Admin */}
      <Route path="/admin/*" element={<AdminDashboard />} />

      {/* 4. Dashboard Teacher (nested routes) */}
      <Route path="/teacher/*" element={<TeacherDashboard />}>
        <Route index element={<TeacherHome />} />
        <Route
          path="subjects/:subjectId/groups"
          element={<ClassGroupsPage />}
        />
      </Route>

      {/* 5. Dashboard Student */}
      <Route path="/student/*" element={<StudentDashboard />} />

      {/* 6. Not found */}
      <Route path="*" element={<Navigate to="/" replace />} />

      <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
<Route path="/teacher/courses/:id" element={<CourseDetailPage />} />
    </Routes>
  );
}