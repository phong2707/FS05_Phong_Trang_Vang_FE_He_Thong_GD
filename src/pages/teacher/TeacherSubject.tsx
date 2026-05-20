import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Inbox } from 'lucide-react';
import apiClient from '@/api/apiClient';
import TeacherDashboardLayout from '@/components/teacher/TeacherDashboardLayout';

interface SubjectItem {
  subjectId: string;
  subjectName: string;
  classGroupId: string;
  classGroupName: string;
  studentCount: number;
  schedule: string;
  status: 'ACTIVE' | 'INACTIVE';
  teacherType: 'MAIN' | 'TA';
  subjectCode?: string;
}

interface SubjectApiResponseItem {
  id: string;
  name: string;
  description?: string | null;
  sortOrder?: number;
  createdAt?: string;
  teachers?: Array<{
    type: 'MAIN' | 'TA';
  }>;
  classGroups?: Array<{
    id: string;
    name: string;
    status?: 'ACTIVE' | 'INACTIVE';
    startDate?: string | null;
    endDate?: string | null;
    groupUsers?: Array<{
      userId: string;
    }>;
    schedules?: Array<{
      startAt: string;
      endAt: string;
      dayOfWeek?: number | null;
    }>;
  }>;
  course?: {
    id: string;
    title: string;
    status?: string;
  } | null;
}

export default function TeacherSubject() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await apiClient.get('/v1/teacher/subjects');
        const apiSubjects: SubjectApiResponseItem[] = response?.data?.data ?? [];

        const mappedSubjects: SubjectItem[] = apiSubjects.map((item) => {
          const firstClass = item.classGroups?.[0];
          const firstSchedule = firstClass?.schedules?.[0];
          const studentCount = firstClass?.groupUsers?.length ?? 0;

          const schedule = firstSchedule?.startAt
            ? new Date(firstSchedule.startAt).toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : 'Chưa cập nhật';

          return {
            subjectId: item.id,
            subjectName: item.name,
            subjectCode: undefined,
            classGroupId: firstClass?.id ?? '',
            classGroupName: firstClass?.name ?? 'Chưa có lớp',
            studentCount,
            schedule,
            status: (firstClass?.status as 'ACTIVE' | 'INACTIVE') ?? 'ACTIVE',
            teacherType: item.teachers?.[0]?.type ?? 'MAIN',
          };
        });

        setSubjects(mappedSubjects);
      } catch (error) {
        console.error('Không thể tải danh sách môn học được phân công:', error);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const displayedSubjects = useMemo(() => subjects, [subjects]);

  return (
    <TeacherDashboardLayout mainClassName="flex-1 overflow-auto bg-stone-50 p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Môn được phân công</h1>
        <p className="text-sm text-gray-500 mt-1">
          Chọn môn để quản lý tài liệu, điểm danh, sinh viên và bài thi
        </p>
      </header>

      <section className="bg-white border border-gray-200 rounded-xl shadow-sm">
        {loading ? (
          <div className="py-10 px-6 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : displayedSubjects.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
              <Inbox size={24} className="text-gray-500" />
            </div>
            <p className="mt-4 text-gray-600">Bạn chưa được phân công môn học nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayedSubjects.map((subject) => (
              <button
                key={subject.subjectId}
                onClick={() => navigate(`/teacher/subjects/${subject.subjectId}`)}
                className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={20} className="text-teal-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center flex-wrap gap-2">
                        <p className="font-semibold text-gray-900 truncate">{subject.subjectName}</p>
                        {subject.subjectCode ? (
                          <span className="text-xs text-gray-500">({subject.subjectCode})</span>
                        ) : null}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Lớp: {subject.classGroupName} · {subject.studentCount} sinh viên
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Lịch học: {subject.schedule}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        subject.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {subject.status}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        subject.teacherType === 'MAIN'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {subject.teacherType === 'MAIN' ? 'Giảng viên chính' : 'TA'}
                    </span>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </TeacherDashboardLayout>
  );
}
