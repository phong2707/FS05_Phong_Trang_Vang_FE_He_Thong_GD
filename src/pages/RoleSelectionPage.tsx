
import { Link } from 'react-router-dom';
import { Users, BookOpen, Award } from 'lucide-react';

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Education Dashboard</h1>
          <p className="text-xl text-blue-100">
            Select your role to access the dashboard
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Admin Dashboard */}
          <Link
            to="/admin"
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4 mx-auto">
              <Users className="text-blue-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Admin
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Manage users, courses, teachers and system settings
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ User Management</li>
                <li>✓ Course Management</li>
                <li>✓ Reports & Analytics</li>
              </ul>
            </div>
          </Link>

          {/* Teacher Dashboard */}
          <Link
            to="/teacher"
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-4 mx-auto">
              <BookOpen className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Teacher
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Manage courses, assignments and student grades
            </p>
            <div className="bg-green-50 rounded-lg p-4">
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ My Courses</li>
                <li>✓ Grade Management</li>
                <li>✓ Student Communication</li>
              </ul>
            </div>
          </Link>

          {/* Student Dashboard */}
          <Link
            to="/student"
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4 mx-auto">
              <Award className="text-purple-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Student
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Track your courses, assignments and academic progress
            </p>
            <div className="bg-purple-50 rounded-lg p-4">
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ My Courses</li>
                <li>✓ Assignment Tracking</li>
                <li>✓ Grade Monitoring</li>
              </ul>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-blue-100">
          <p className="text-sm">
            This is a demo interface. Select a role above to explore the dashboard.
          </p>
          <p className="text-xs mt-3">
            <Link to="/" className="text-blue-200 hover:text-white underline">
              ← Back to Homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
