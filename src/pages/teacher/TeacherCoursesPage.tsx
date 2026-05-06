import { useEffect, useState } from 'react';
import { getAssignedCourses } from '@/api/course.api';
import type { Course } from '@/api/course.api';
import CourseCard from '@/components/course/CourseCard';

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    getAssignedCourses().then(setCourses);
  }, []);

  return (
    <div>

      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold text-gray-900">My Courses</h1>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700">
          {courses.length} courses
        </span>
      </div>

      {/* Content */}
      {courses.length === 0 ? (
        <div className="text-sm text-gray-500">
          Bạn chưa được phân công khóa học nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
