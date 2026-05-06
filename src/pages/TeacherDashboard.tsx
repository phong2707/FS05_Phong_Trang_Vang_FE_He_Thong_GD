import { Outlet } from 'react-router-dom';
import {
  BookOpen,
  Users,
  BarChart3,
  FileText,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';
import SidebarLayout from '@/layouts/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';
import SidebarMenu from '@/components/SidebarMenu';

const teacherMenuItems = [
  { label: 'Dashboard', icon: BarChart3, href: '/teacher' },
  { label: 'My Courses', icon: BookOpen, href: '/teacher/courses' },
  { label: 'Students', icon: Users, href: '/teacher/students' },
  { label: 'Assignments', icon: FileText, href: '/teacher/assignments' },
  { label: 'Grades', icon: CheckCircle, href: '/teacher/grades' },
  { label: 'Messages', icon: MessageSquare, href: '/teacher/messages' },
];

export default function TeacherDashboard() {
  return (
    <SidebarLayout sidebar={<SidebarMenu items={teacherMenuItems} />}>
      <DashboardHeader userName="Prof. John Smith" role="Teacher" />

      {/* 👇 RẤT QUAN TRỌNG */}
      <main className="flex-1 overflow-auto bg-stone-50 p-6">
        <Outlet />
      </main>
    </SidebarLayout>
  );
}