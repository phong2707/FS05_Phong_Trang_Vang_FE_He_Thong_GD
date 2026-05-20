import type { ReactNode } from 'react';
import { BarChart3, BookOpen, ClipboardCheck, User } from 'lucide-react';
import SidebarLayout from '@/layouts/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';
import SidebarMenu from '@/components/SidebarMenu';

interface TeacherDashboardLayoutProps {
  children: ReactNode;
  mainClassName?: string;
}

const teacherMenuItems = [
  { label: '📊 Thống kê tổng quan', icon: BarChart3, href: '/teacher' },
  { label: '📚 Môn được phân công', icon: BookOpen, href: '/teacher/subjects' },
  { label: '📈 Quản lý điểm số', icon: ClipboardCheck, href: '/teacher/grades' },
  { label: '👤 Hồ sơ', icon: User, href: '/profile' },
];

export default function TeacherDashboardLayout({
  children,
  mainClassName = 'flex-1 overflow-auto bg-stone-50 p-6',
}: TeacherDashboardLayoutProps) {
  return (
    <SidebarLayout sidebar={<SidebarMenu items={teacherMenuItems} />}>
      <DashboardHeader />
      <main className={mainClassName}>{children}</main>
    </SidebarLayout>
  );
}
