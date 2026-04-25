import { Routes, Route } from 'react-router-dom';
import RoleSelectionPage from '@/pages/RoleSelectionPage.tsx';
import HomePage from '@/pages/HomePage.tsx';
import AdminDashboard from '@/pages/AdminDashboard.tsx';
import TeacherDashboard from '@/pages/TeacherDashboard.tsx';
import StudentDashboard from '@/pages/StudentDashboard.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/roles" element={<RoleSelectionPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/*" element={<TeacherDashboard />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/*" element={<StudentDashboard />} />
    </Routes>
  );
}

export default App