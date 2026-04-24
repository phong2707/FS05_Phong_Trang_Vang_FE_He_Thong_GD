import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

type Subject = {
  id: string;
  name: string;
  description?: string;
};

type CourseDetail = {
  id: string;
  title: string;
  description: string;
  price: number;
  createdAt: string;
  subjects: Subject[];
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/v1/courses/${id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch course detail");
        }
        return res.json();
      })
      .then((data) => setCourse(data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (!course) return <p>Không tìm thấy khóa học</p>;

  return (
    <div>
      <h2>Chi tiết khóa học</h2>

      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <p>
        <strong>Giá:</strong> {course.price}
      </p>

      <h4>Danh sách môn học</h4>
      {course.subjects.length === 0 ? (
        <p>Chưa có môn học nào</p>
      ) : (
        <ul>
          {course.subjects.map((subject) => (
            <li key={subject.id}>
              <strong>{subject.name}</strong>
              {subject.description && <p>{subject.description}</p>}
            </li>
          ))}
        </ul>
      )}

      <br />
      <Link to="/teacher/courses">← Quay lại danh sách khóa học</Link>
    </div>
  );
}