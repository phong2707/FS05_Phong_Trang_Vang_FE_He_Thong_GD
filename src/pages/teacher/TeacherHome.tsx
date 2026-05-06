import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const courses = [
  {
    id: 'sub_demo_01',
    name: 'Advanced Python',
    students: 45,
    status: 'Active',
  },
  {
    id: 'sub_demo_02',
    name: 'Web Development',
    students: 50,
    status: 'Active',
  },
  {
    id: 'sub_demo_03',
    name: 'Data Science',
    students: 60,
    status: 'Active',
  },
];
export default function TeacherHome() {
  const navigate = useNavigate();

  return (
    <>
      {/* My Courses */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">My Courses</h2>

        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow transition"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-teal-600" size={24} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{course.name}</p>
                  <p className="text-sm text-gray-500">
                    {course.students} students – {course.status}
                  </p>
                </div>
              </div>

              {/* ✅ NÚT QUẢN LÝ NHÓM LỚP */}
              <button
                onClick={() =>
                  navigate(`/teacher/subjects/${course.id}/groups`)
                }
                className="px-4 py-2 text-sm font-semibold rounded-lg
                           bg-teal-600 text-white hover:bg-teal-700 transition"
              >
                Quản lý nhóm lớp
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}