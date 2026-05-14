import { Outlet } from 'react-router-dom';
import {
  
  Users,
  BarChart3,
  MessageSquare,
  Library,
  Database,
  ClipboardList,
  CheckSquare,
} from 'lucide-react';
import SidebarLayout from '@/layouts/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';
import SidebarMenu from '@/components/SidebarMenu';

const teacherMenuItems = [
  { 
    label: 'Tổng quan', 
    icon: BarChart3, 
    href: '/teacher' 
  },
  { 
    label: 'Môn học giảng dạy', 
    icon: Library, 
    href: '/teacher/subjects',
    // Đây là nơi GV xem các môn được phân công và quản lý tài liệu bên trong môn đó
  },
  { 
    label: 'Ngân hàng câu hỏi', 
    icon: Database, 
    href: '/teacher/question-bank',
    // Nơi quản lý, tạo mới các câu hỏi để dùng cho các bài kiểm tra sau này
  },
  { 
    label: 'Quản lý Lớp học', 
    icon: Users, 
    href: '/teacher/classes' 
    // Quản lý sinh viên theo từng lớp học cụ thể (Class Groups)
  },
  { 
    label: 'Bài tập & Kỳ thi', 
    icon: ClipboardList, 
    href: '/teacher/assessments' 
    // Tạo các đợt nộp bài hoặc bài thi lấy từ ngân hàng câu hỏi
  },
  { 
    label: 'Chấm điểm', 
    icon: CheckSquare, 
    href: '/teacher/grading' 
  },
  { 
    label: 'Hỏi đáp & Thảo luận', 
    icon: MessageSquare, 
    href: '/teacher/discussions' 
  },
];

export default function TeacherDashboard() {
  return (
    <SidebarLayout sidebar={<SidebarMenu items={teacherMenuItems} />}>
      <DashboardHeader/>

      {/* 👇 RẤT QUAN TRỌNG */}
      <main className="flex-1 overflow-auto bg-stone-50 p-6">
        <Outlet />
      </main>
    </SidebarLayout>
  );
}

