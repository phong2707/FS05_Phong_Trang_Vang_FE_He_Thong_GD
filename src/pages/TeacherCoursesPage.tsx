import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTeacherCourses } from "../services/courseService";
import type { Course } from "../types/course";

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Tạm hardcode teacherId cho GĐ1
  const teacherId = "35bc6afb-b53e-41ec-8602-f63f642712b9";

  useEffect(() => {
    getTeacherCourses(teacherId)
      .then((data) => setCourses(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Khóa học được phân công</h2>

      {courses.length === 0 ? (
        <p>Chưa có khóa học nào</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.id} style={{ marginBottom: "12px" }}>
              <strong>{course.title}</strong>
              <p>{course.description}</p>

              {/* ✅ Link sang trang chi tiết khóa học */}
              <Link to={`/courses/${course.id}`}>
                Xem chi tiết
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}