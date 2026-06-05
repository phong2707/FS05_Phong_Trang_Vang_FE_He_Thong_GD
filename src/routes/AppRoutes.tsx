// frontend/src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import RoleSelectionPage from "@/pages/RoleSelectionPage";
import AdminDashboard from "@/pages/AdminDashboard";
import TeacherDashboard from "@/pages/TeacherDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import TeacherLogin from "@/pages/TeacherLogin";
import StudentLogin from "@/pages/StudentLogin";
import AdminLogin from "@/pages/AdminLogin";
import UserManagementPage from "@/pages/admin/UserManagement";
import RoleManagementPage from "@/pages/admin/RoleManagement";
import CourseManagementPage from "@/pages/admin/CourseManagement";
import CourseCreateWizardPage from "@/pages/admin/CourseCreateWizard";
import RevenueDashboard from "@/pages/admin/RevenueDashboard";

import TeacherSubject from "@/pages/teacher/TeacherSubject";
import SubjectDetailPage from "@/pages/teacher/SubjectDetailPage";
import SubjectFeaturePlaceholderPage from "@/pages/teacher/SubjectFeaturePlaceholderPage";
import AttendancePage from "@/pages/teacher/AttendancePage";
import EssaySubmissionPage from "@/pages/student/EssaySubmissionPage";
import AssignmentList from "@/pages/student/AssignmentList";

import DemoStudentPage from "@/pages/demo/DemoStudentPage";
import DemoEssayPage from "@/pages/demo/DemoEssayPage";

import StudentTestList from "@/components/student/StudentTestList";
import SubjectGradesPage from "@/pages/teacher/SubjectGradesPage";

import {
  StudentSchedule,
  StudentMaterials,
  StudentGrades,
  StudentAttendances,
  StudentQuiz,
  // StudentAssignment,
} from "@/components";

// import TeacherHome from "@/pages/teacher/TeacherHome";
// import ClassGroupsPage from "@/pages/teacher/ClassGroupsPage";
// import TeacherCoursesPage from "@/pages/teacher/TeacherCoursesPage";
// ✅ Bổ sung import trang Quản lý tài liệu môn học
import SubjectResourcesPage from "@/pages/teacher/SubjectResourcesPage";

// Public Course Pages
import CoursesPage from "@/pages/CoursesPage";
import CourseDetailPage from "@/pages/CourseDetailPage";
import ClassGroupStudentsPage from "@/pages/teacher/ClassGroupStudentsPage";
import UpcomingCoursesPage from "@/pages/UpcomingCoursesPage";
import SubjectStudentsPage from "@/pages/teacher/SubjectStudentsPage";
import SubjectTestsPage from "@/pages/teacher/SubjectTestsPage";
import SubjectQuestionBankPage from "@/pages/teacher/SubjectQuestionBankPage";
import QuestionCreatePage from "@/pages/teacher/QuestionCreatePage";
import QuestionDetailPage from "@/pages/teacher/QuestionDetailPage";

import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import ProfilePage from "@/pages/ProfilePage";
import PaymentResultPage from "@/pages/PaymentResultPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public pages */}
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
      <Route
        path="/admin/courses/create"
        element={<CourseCreateWizardPage />}
      />
      <Route
        path="/admin/courses/:id/edit"
        element={<CourseCreateWizardPage />}
      />
      <Route path="/admin/revenue" element={<RevenueDashboard />} />

      {/* Dashboard Teacher */}
      {/* 4. Dashboard Teacher (nested routes) */}
      {/* <Route path="/teacher/*" element={<TeacherDashboard />}>
        <Route index element={<TeacherHome />} />
        <Route
          path="subjects/:subjectId/groups"
          element={<ClassGroupsPage />}
        /> */}
      {/* ✅ Sinh viên trong nhóm lớp */}
      {/* <Route
          path="class-groups/:classGroupId/students"
          element={<ClassGroupStudentsPage />}
        /> */}
      {/* </Route> */}

      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/subjects" element={<TeacherSubject />} />
      <Route
        path="/teacher/subjects/:subjectId"
        element={<SubjectDetailPage />}
      />

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
        path="/teacher/subjects/:subjectId/questions/create"
        element={<QuestionCreatePage />}
      />
      <Route
        path="/teacher/subjects/:subjectId/questions/:questionId/edit"
        element={<QuestionCreatePage />}
      />
      <Route
        path="/teacher/subjects/:subjectId/grades"
        element={<SubjectGradesPage />}
      />
      <Route
        path="/teacher/subjects/:subjectId/groups"
        element={<SubjectFeaturePlaceholderPage title="Nhóm lớp học phần" />}
      />
      <Route
        path="/teacher/class-groups/:classGroupId/students"
        element={<ClassGroupStudentsPage />}
      />
      <Route path="/teacher/questions/:id" element={<QuestionDetailPage />} />
      <Route
        path="class-groups/:classGroupId/students"
        element={<ClassGroupStudentsPage />}
      />

      <Route path="/demo/student" element={<DemoStudentPage />} />
      <Route path="/demo/assignment" element={<DemoEssayPage />} />
      {/* <Route path="/student/assignment/:testId" element={<EssaySubmissionPage />} /> */}
      {/* 5. Dashboard Student */}
      <Route path="/student/*" element={<StudentDashboard />}>
        <Route path="assignments" element={<AssignmentList />} />
        <Route path="assignment/:testId" element={<EssaySubmissionPage />} />
        <Route path="schedule" element={<StudentSchedule />} />
        <Route path="materials" element={<StudentMaterials />} />
        <Route path="grades" element={<StudentGrades />} />
        <Route path="attendances" element={<StudentAttendances />} />
        <Route path="quiz/:testId" element={<StudentQuiz />} />
        <Route path="tests" element={<StudentTestList />} />
        {/* <Route path="assignment/:testId" element={<StudentAssignment />} /> */}
      </Route>

      <Route path="/payment-result" element={<PaymentResultPage />} />

      {/* 6. Not found */}
      <Route path="*" element={<Navigate to="/" replace />} />

      {/* <Route path="/teacher/courses" element={<TeacherCoursesPage />} /> */}
      <Route path="/teacher/courses/:id" element={<CourseDetailPage />} />
    </Routes>
  );
}