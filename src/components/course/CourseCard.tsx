import type { Course } from '@/api/course.api';
import { Link } from 'react-router-dom';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5 hover:shadow-md transition">

      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">
            {course.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {course.description}
          </p>
        </div>

        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
          Active
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
        <span>Học kỳ: {course.semester}</span>
        <span>{course.studentCount} SV</span>
      </div>

      <Link
        to={`/teacher/courses/${course.id}`}
        className="mt-4 inline-block text-sm font-semibold text-teal-700 hover:text-teal-800"
      >
        Xem chi tiết →
      </Link>
    </div>
  );
}