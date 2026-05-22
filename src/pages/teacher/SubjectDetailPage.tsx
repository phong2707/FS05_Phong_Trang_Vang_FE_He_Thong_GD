import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarCheck,
  ChevronRight,
  FileText,
  HelpCircle,
  Loader2,
  NotebookPen,
  Users,
} from 'lucide-react';
import apiClient from '@/api/apiClient';
import TeacherDashboardLayout from '@/components/teacher/TeacherDashboardLayout';

interface SubjectDetail {
  subjectId: string;
  subjectName: string;
  subjectCode?: string;
  classGroupId: string;
  classGroupName: string;
  studentCount: number;
  schedule: string;
  status: 'ACTIVE' | 'INACTIVE';
  teacherType: 'MAIN' | 'TA';
}

interface SubjectDetailApiResponse {
  id: string;
  name: string;
  classGroups?: Array<{
    id: string;
    name: string;
    status?: 'ACTIVE' | 'INACTIVE';
    groupUsers?: Array<{ userId: string }>;
    schedules?: Array<{
      startAt: string;
      endAt: string;
      dayOfWeek?: number | null;
    }>;
  }>;
  teachers?: Array<{
    type: 'MAIN' | 'TA';
  }>;
}

export default function SubjectDetailPage() {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [subjectDetail, setSubjectDetail] = useState<SubjectDetail | null>(null);

  useEffect(() => {
    const fetchSubjectDetail = async () => {
      if (!subjectId) {
        setSubjectDetail(null);
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(`/v1/teacher/subjects/${subjectId}`);
        const data: SubjectDetailApiResponse | null = response?.data?.data ?? null;

        if (!data) {
          setSubjectDetail(null);
          return;
        }

        const firstClass = data.classGroups?.[0];
        const firstSchedule = firstClass?.schedules?.[0];
        const schedule = firstSchedule?.startAt
          ? new Date(firstSchedule.startAt).toLocaleString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
          : 'Chưa cập nhật';

        const mapped: SubjectDetail = {
          subjectId: data.id ?? subjectId,
          subjectName: data.name ?? 'Chưa cập nhật',
          subjectCode: undefined,
          classGroupId: firstClass?.id ?? '',
          classGroupName: firstClass?.name ?? 'Chưa có lớp',
          studentCount: firstClass?.groupUsers?.length ?? 0,
          schedule,
          status: firstClass?.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
          teacherType: data.teachers?.[0]?.type === 'TA' ? 'TA' : 'MAIN',
        };

        setSubjectDetail(mapped);
      } catch (error) {
        console.error('Không thể tải chi tiết môn học:', error);
        setSubjectDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectDetail();
  }, [subjectId]);

  const managementMenus = useMemo(() => {
    if (!subjectId) return [];

    return [
      {
        title: 'Tài liệu',
        description: 'Quản lý giáo trình, slide, tài liệu học tập của môn học',
        path: `/teacher/subjects/${subjectId}/resources`,
        icon: FileText,
      },
      {
        title: 'Điểm danh',
        description: 'Tạo buổi điểm danh và theo dõi chuyên cần của sinh viên',
        path: `/teacher/subjects/${subjectId}/attendance`,
        icon: CalendarCheck,
      },
      {
        title: 'Danh sách sinh viên',
        description: 'Xem danh sách sinh viên thuộc lớp học phần',
        path: `/teacher/subjects/${subjectId}/students`,
        icon: Users,
      },
      {
        title: 'Bài tập và bài thi',
        description: 'Quản lý bài tập, đề thi, lịch thi và bài nộp của sinh viên',
        path: `/teacher/subjects/${subjectId}/exams`,
        icon: NotebookPen,
      },
      {
        title: 'Ngân hàng câu hỏi',
        description: 'Tạo và quản lý câu hỏi dùng cho bài kiểm tra, bài thi',
        path: `/teacher/subjects/${subjectId}/question-bank`,
        icon: HelpCircle,
      },
      {
        title: 'Quản lý điểm',
        description: 'Nhập, cập nhật và tổng hợp điểm của sinh viên theo môn học',
        path: `/teacher/subjects/${subjectId}/grades`,
        icon: FileText,
      },
    ];
  }, [subjectId]);

  return (
    <TeacherDashboardLayout mainClassName="flex-1 overflow-auto bg-stone-50 p-6 space-y-6">
        <button
          onClick={() => navigate('/teacher/subjects')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách môn
        </button>

        <header>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý môn học</h1>
          <p className="text-sm text-gray-500 mt-1">Chọn chức năng bạn muốn quản lý cho môn học này</p>
        </header>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 size={18} className="animate-spin" />
              Đang tải thông tin môn học...
            </div>
          ) : !subjectDetail ? (
            <p className="text-sm text-gray-500">Không tìm thấy thông tin môn học.</p>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{subjectDetail.subjectName}</h2>
                {subjectDetail.subjectCode ? (
                  <span className="text-sm text-gray-500">({subjectDetail.subjectCode})</span>
                ) : null}
              </div>

              <p className="text-sm text-gray-600">
                Lớp: {subjectDetail.classGroupName} · {subjectDetail.studentCount} sinh viên
              </p>
              <p className="text-sm text-gray-500">Lịch học: {subjectDetail.schedule}</p>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    subjectDetail.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {subjectDetail.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                </span>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    subjectDetail.teacherType === 'MAIN'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {subjectDetail.teacherType === 'MAIN' ? 'Giảng viên chính' : 'TA'}
                </span>
              </div>
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {managementMenus.map((menu) => {
            const Icon = menu.icon;
            return (
              <button
                key={menu.title}
                onClick={() => subjectId && navigate(menu.path)}
                className="text-left bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:bg-blue-50/40 hover:border-blue-300 transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-teal-600" />
                  </div>
                  <ChevronRight size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                </div>

                <h3 className="mt-4 text-base font-semibold text-gray-900">{menu.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{menu.description}</p>
              </button>
            );
          })}
        </section>
    </TeacherDashboardLayout>
  );
}
