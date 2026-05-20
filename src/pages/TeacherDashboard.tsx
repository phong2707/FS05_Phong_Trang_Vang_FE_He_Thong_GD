import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  User,
  Users,
} from 'lucide-react';
import SidebarLayout from '@/layouts/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';
import SidebarMenu from '@/components/SidebarMenu';

interface TeacherStats {
  totalSubjects: number;
  totalStudents: number;
  upcomingTests: number;
  avgAttendanceRate: number;
}

interface UpcomingScheduleItem {
  id: string;
  dayOfWeek: string;
  startAt: string;
  endAt: string;
  subject: {
    name: string;
  };
  classGroup: {
    name: string;
  };
}

interface PendingSubmissionItem {
  id: string;
  examName: string;
  studentName: string;
  submittedAt: string;
  status: 'PENDING';
  subjectId?: string;
}

const mockStats: TeacherStats = {
  totalSubjects: 4,
  totalStudents: 128,
  upcomingTests: 3,
  avgAttendanceRate: 92,
};

const mockUpcomingSchedules: UpcomingScheduleItem[] = [
  {
    id: 'sch_01',
    dayOfWeek: 'Thứ 2',
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    subject: { name: 'Lập trình Web nâng cao' },
    classGroup: { name: 'SE-2201' },
  },
  {
    id: 'sch_02',
    dayOfWeek: 'Thứ 3',
    startAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 25.5 * 60 * 60 * 1000).toISOString(),
    subject: { name: 'Cơ sở dữ liệu' },
    classGroup: { name: 'SE-2202' },
  },
  {
    id: 'sch_03',
    dayOfWeek: 'Thứ 4',
    startAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
    subject: { name: 'Cấu trúc dữ liệu & giải thuật' },
    classGroup: { name: 'SE-2203' },
  },
  {
    id: 'sch_04',
    dayOfWeek: 'Thứ 5',
    startAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
    subject: { name: 'Phân tích thiết kế hệ thống' },
    classGroup: { name: 'SE-2204' },
  },
  {
    id: 'sch_05',
    dayOfWeek: 'Thứ 6',
    startAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
    subject: { name: 'Kiểm thử phần mềm' },
    classGroup: { name: 'SE-2205' },
  },
];

const mockPendingSubmissions: PendingSubmissionItem[] = [
  {
    id: 'sub_01',
    examName: 'Giữa kỳ - Cơ sở dữ liệu',
    studentName: 'Nguyễn Văn A',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
    subjectId: 'subject_01',
  },
  {
    id: 'sub_02',
    examName: 'Quiz 03 - Lập trình Web',
    studentName: 'Trần Thị B',
    submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
    subjectId: 'subject_02',
  },
  {
    id: 'sub_03',
    examName: 'Bài tập lớn - OOP',
    studentName: 'Phạm Văn C',
    submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
    subjectId: 'subject_03',
  },
  {
    id: 'sub_04',
    examName: 'Kiểm tra nhanh tuần 5',
    studentName: 'Lê Thị D',
    submittedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
  },
  {
    id: 'sub_05',
    examName: 'Bài thi thực hành API',
    studentName: 'Hoàng Văn E',
    submittedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
    subjectId: 'subject_05',
  },
];

const teacherMenuItems = [
  { label: '📊 Thống kê tổng quan', icon: BarChart3, href: '/teacher' },
  { label: '📚 Môn được phân công', icon: BookOpen, href: '/teacher/subjects' },
  { label: '📈 Quản lý điểm số', icon: ClipboardCheck, href: '/teacher/grades' },
  { label: '👤 Hồ sơ', icon: User, href: '/profile' },
];

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  });

const isToday = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const upcomingSchedules = useMemo(() => {
    const now = new Date();
    return mockUpcomingSchedules
      .filter((item) => new Date(item.startAt) > now)
      .slice(0, 5);
  }, []);

  const pendingSubmissions = useMemo(
    () => mockPendingSubmissions.filter((item) => item.status === 'PENDING').slice(0, 5),
    [],
  );

  const statCards = [
    {
      label: 'Môn đang dạy',
      value: mockStats.totalSubjects,
      icon: BookOpen,
    },
    {
      label: 'Sinh viên',
      value: mockStats.totalStudents,
      icon: Users,
    },
    {
      label: 'Bài thi sắp tới',
      value: mockStats.upcomingTests,
      icon: GraduationCap,
    },
    {
      label: 'Điểm danh TB',
      value: `${mockStats.avgAttendanceRate}%`,
      icon: ClipboardCheck,
    },
  ];

  return (
    <SidebarLayout sidebar={<SidebarMenu items={teacherMenuItems} />}>
      <DashboardHeader />
      <main className="flex-1 overflow-auto bg-stone-50 p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Thống kê tổng quan</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi nhanh tình hình giảng dạy và chấm điểm</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <Icon size={18} className="text-teal-600" />
                </div>
                <p className="mt-3 text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Buổi học sắp tới</h2>
              <button
                onClick={() => navigate('/teacher/schedule')}
                className="text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                Xem tất cả lịch
              </button>
            </div>

            <div className="space-y-3">
              {upcomingSchedules.map((item) => {
                const today = isToday(item.startAt);
                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 border-l-4 border-l-blue-500 rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.subject.name} · {item.classGroup.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDateTime(item.startAt)} → {formatDateTime(item.endAt)}
                        </p>
                        <p className="text-sm text-gray-500">{item.dayOfWeek}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          today
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {today ? 'Hôm nay' : 'Sắp tới'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Bài nộp chờ chấm</h2>

            <div className="space-y-3">
              {pendingSubmissions.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{item.examName}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.studentName}</p>
                      <p className="text-sm text-gray-500 mt-1">Nộp lúc: {formatDateTime(item.submittedAt)}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                      Chờ chấm
                    </span>
                  </div>

                  {item.subjectId ? (
                    <button
                      onClick={() => navigate(`/teacher/subjects/${item.subjectId}/exams`)}
                      className="mt-3 inline-flex items-center text-sm font-semibold text-teal-700 hover:text-teal-800"
                    >
                      Chấm điểm
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SidebarLayout>
  );
}

