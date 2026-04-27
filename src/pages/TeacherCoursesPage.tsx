import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTeacherCourses } from "../services/courseService";
import type { Course } from "../types/course";

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Tạm hardcode teacherId cho GĐ1
  const teacherId = "a11c9ec7-2be1-4c96-af75-7aace7014ecb";

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