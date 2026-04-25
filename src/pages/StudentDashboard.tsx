
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  MessageSquare,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import SidebarLayout from '@/layouts/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';
import StatCard from '@/components/StatCard';
import SidebarMenu from '@/components/SidebarMenu';

const studentMenuItems = [
  { label: 'Dashboard', icon: TrendingUp, href: '/student' },
  { label: 'My Courses', icon: BookOpen, href: '/student/courses' },
  { label: 'Assignments', icon: Clock, href: '/student/assignments' },
  { label: 'Grades', icon: CheckCircle, href: '/student/grades' },
  { label: 'Messages', icon: MessageSquare, href: '/student/messages' },
  { label: 'Schedule', icon: Calendar, href: '/student/schedule' },
];

export default function StudentDashboard() {
  return (
    <SidebarLayout
      sidebar={<SidebarMenu items={studentMenuItems} />}
    >
      <DashboardHeader userName="Sarah Johnson" role="Student" />

      <main className="flex-1 overflow-auto bg-gray-100 p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Enrolled Courses"
            value="6"
            icon={BookOpen}
            color="blue"
          />
          <StatCard
            title="Completed Lessons"
            value="32"
            icon={CheckCircle}
            color="green"
            trend={{ value: 10, isPositive: true }}
          />
          <StatCard
            title="Pending Assignments"
            value="3"
            icon={Clock}
            color="red"
            badge={3}
          />
          <StatCard
            title="Overall GPA"
            value="3.75"
            icon={Award}
            color="purple"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Courses */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">My Courses</h2>
            <div className="space-y-4">
              {[
                { name: 'Web Development 101', progress: 75, instructor: 'Prof. Smith' },
                { name: 'Python Basics', progress: 90, instructor: 'Dr. Johnson' },
                { name: 'Data Structures', progress: 60, instructor: 'Prof. Williams' },
                { name: 'Database Design', progress: 85, instructor: 'Prof. Brown' },
                { name: 'Cloud Computing', progress: 45, instructor: 'Prof. Davis' },
              ].map((course, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{course.name}</p>
                      <p className="text-sm text-gray-500">{course.instructor}</p>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deadlines & Announcements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Deadlines</h2>
            <div className="space-y-4 mb-6">
              {[
                { task: 'Python Project', date: 'Due Tomorrow', color: 'red' },
                { task: 'Web Dev Quiz', date: 'Due in 2 days', color: 'yellow' },
                { task: 'Data Structure Assignment', date: 'Due in 5 days', color: 'blue' },
                { task: 'Database Exam', date: 'Due in 7 days', color: 'green' },
              ].map((item, index) => (
                <div key={index} className={`p-3 bg-${item.color}-50 border border-${item.color}-200 rounded-lg`}>
                  <p className={`text-sm font-medium text-${item.color}-900`}>{item.task}</p>
                  <p className={`text-xs text-${item.color}-700 mt-1`}>{item.date}</p>
                </div>
              ))}
            </div>

            {/* Announcement */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-sm font-medium text-green-800">Great Job!</p>
                <p className="text-xs text-green-700 mt-1">
                  You completed all assignments in Web Development
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Study Progress Chart */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Weekly Study Progress</h2>
          <div className="flex items-end justify-between h-64">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="flex flex-col items-center flex-1 mx-2">
                <div className={`w-full bg-blue-500 rounded-t-lg transition-all mb-2`} style={{ height: `${(index + 1) * 15}%` }}></div>
                <span className="text-xs text-gray-600 font-medium">{day}</span>
                <span className="text-xs text-gray-400 mt-1">{(index + 1) * 2}h</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}
