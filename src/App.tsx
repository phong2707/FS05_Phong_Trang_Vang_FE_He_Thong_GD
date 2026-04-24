import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import TeacherCoursesPage from "@/pages/TeacherCoursesPage";
import CourseDetailPage from "@/pages/CourseDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* ✅ Trang danh sách khóa học giáo viên */}
      <Route path="/teacher/courses" element={<TeacherCoursesPage />} />

      {/* ✅ Trang chi tiết khóa học */}
      <Route path="/courses/:id" element={<CourseDetailPage />} />
    </Routes>
  );
}

export default App;