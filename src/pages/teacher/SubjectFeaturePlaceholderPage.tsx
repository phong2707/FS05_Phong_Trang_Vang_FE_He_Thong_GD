import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeacherDashboardLayout from '@/components/teacher/TeacherDashboardLayout';

interface SubjectFeaturePlaceholderPageProps {
  title: string;
}

export default function SubjectFeaturePlaceholderPage({
  title,
}: SubjectFeaturePlaceholderPageProps) {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();

  const backPath = useMemo(
    () => (subjectId ? `/teacher/subjects/${subjectId}` : '/teacher/subjects'),
    [subjectId],
  );

  return (
    <TeacherDashboardLayout mainClassName="flex-1 overflow-auto bg-stone-50 p-6 space-y-6">
        <button
          onClick={() => navigate(backPath)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
        >
          <ArrowLeft size={16} />
           Quay lại quản lý môn học
        </button>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-500">Chức năng này đang được phát triển</p>
        </section>
    </TeacherDashboardLayout>
  );
}
