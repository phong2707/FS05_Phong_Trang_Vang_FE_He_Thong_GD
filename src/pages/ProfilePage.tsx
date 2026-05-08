import { BarChart3, BookOpen, Users, FileText, CheckCircle, MessageSquare } from 'lucide-react';
import SidebarLayout from '@/layouts/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';
import SidebarMenu from '@/components/SidebarMenu';
import TeacherProfile from '@/components/TeacherProfile';

const teacherMenuItems = [
  { label: 'Dashboard', icon: BarChart3, href: '/teacher' },
  { label: 'My Courses', icon: BookOpen, href: '/teacher/courses' },
  { label: 'Students', icon: Users, href: '/teacher/students' },
  { label: 'Assignments', icon: FileText, href: '/teacher/assignments' },
  { label: 'Grades', icon: CheckCircle, href: '/teacher/grades' },
  { label: 'Messages', icon: MessageSquare, href: '/teacher/messages' },
];

/**
 * ProfilePage - Trang hiển thị thông tin profile của giáo viên
 * Có layout giống TeacherDashboard với Sidebar + Header
 */
export default function ProfilePage() {
  return (
    <SidebarLayout
      sidebar={<SidebarMenu items={teacherMenuItems} />}
    >
      <DashboardHeader/>
      
      <main className="flex-1 overflow-auto bg-stone-50 p-6">
        <TeacherProfile />
      </main>
    </SidebarLayout>
  );
}
