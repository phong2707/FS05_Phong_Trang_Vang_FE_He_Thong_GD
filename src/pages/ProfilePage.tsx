import TeacherProfile from '@/components/TeacherProfile';
import TeacherDashboardLayout from '@/components/teacher/TeacherDashboardLayout';

/**
 * ProfilePage - Trang hiển thị thông tin profile của giáo viên
 * Có layout giống TeacherDashboard với Sidebar + Header
 */
export default function ProfilePage() {
  return (
    <TeacherDashboardLayout>
      <TeacherProfile />
    </TeacherDashboardLayout>
  );
}
