import { Routes, Route } from "react-router-dom";
import TeacherCoursesPage from "./TeacherCoursesPage";
import CourseDetailPage from "./CourseDetailPage";

function App() {
  return (
    <Routes>
      {/* Trang danh sách khóa học */}
      <Route path="/teacher/courses" element={<TeacherCoursesPage />} />

      {/* ✅ Trang chi tiết khóa học — ĐẶT Ở ĐÂY */}
      <Route path="/courses/:id" element={<CourseDetailPage />} />
    </Routes>
  );
}

export default App;