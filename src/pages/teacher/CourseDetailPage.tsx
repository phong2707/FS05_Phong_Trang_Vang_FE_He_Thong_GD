import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCourseDetail } from '@/api/course.api';
import type { Course } from '@/api/course.api';

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (id) getCourseDetail(id).then(setCourse);
  }, [id]);

  if (!course) {
    return (
      <p className="text-sm text-gray-500">
        Đang tải thông tin khóa học...
      </p>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-6 max-w-3xl">

      <Link
        to="/teacher/courses"
        className="text-xs text-gray-500 hover:text-teal-700"
      >
        ← Quay lại danh sách
      </Link>

      <h1 className="text-xl font-bold text-gray-900 mt-2">
        {course.name}
      </h1>

      <p className="text-sm text-gray-600 mt-2">
        {course.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
        <div className="bg-teal-50 rounded-lg p-3 text-teal-800">
          Học kỳ: <strong>{course.semester}</strong>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3 text-emerald-800">
          {course.studentCount} sinh viên
        </div>
      </div>

      <Link
        to={`/teacher/subjects/${course.id}/groups`}
        className="inline-flex mt-6 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
      >
        Quản lý nhóm lớp
      </Link>
    </div>
  );
}