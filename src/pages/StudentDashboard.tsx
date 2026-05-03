import {
  BookOpen, CheckCircle, Clock, Award,
  MessageSquare, TrendingUp, Calendar,
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

const courses = [
  { name: 'Web Development 101', progress: 75, instructor: 'Prof. Smith' },
  { name: 'Python Basics', progress: 90, instructor: 'Dr. Johnson' },
  { name: 'Data Structures', progress: 60, instructor: 'Prof. Williams' },
  { name: 'Database Design', progress: 85, instructor: 'Prof. Brown' },
  { name: 'Cloud Computing', progress: 45, instructor: 'Prof. Davis' },
];

const deadlines = [
  { task: 'Python Project', date: 'Due Tomorrow', bg: 'bg-red-50', border: 'border-red-200', titleColor: 'text-red-800', dateColor: 'text-red-600', dot: 'bg-red-500' },
  { task: 'Web Dev Quiz', date: 'Due in 2 days', bg: 'bg-amber-50', border: 'border-amber-200', titleColor: 'text-amber-800', dateColor: 'text-amber-600', dot: 'bg-amber-500' },
  { task: 'Data Structure Assignment', date: 'Due in 5 days', bg: 'bg-teal-50', border: 'border-teal-200', titleColor: 'text-teal-800', dateColor: 'text-teal-600', dot: 'bg-teal-500' },
  { task: 'Database Exam', date: 'Due in 7 days', bg: 'bg-emerald-50', border: 'border-emerald-200', titleColor: 'text-emerald-800', dateColor: 'text-emerald-600', dot: 'bg-emerald-500' },
];

const weekDays = [
  { day: 'Mon', hours: 2, pct: 14 },
  { day: 'Tue', hours: 4, pct: 28 },
  { day: 'Wed', hours: 5, pct: 40 },
  { day: 'Thu', hours: 3, pct: 56 },
  { day: 'Fri', hours: 7, pct: 70 },
  { day: 'Sat', hours: 9, pct: 85 },
  { day: 'Sun', hours: 6, pct: 60 },
];

function getProgressGradient(pct: number) {
  if (pct >= 80) return 'linear-gradient(90deg, #10b981, #34d399)';
  if (pct >= 60) return 'linear-gradient(90deg, #14b8a6, #2dd4bf)';
  if (pct >= 40) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
  return 'linear-gradient(90deg, #f97316, #fb923c)';
}

function getProgressTextColor(pct: number) {
  if (pct >= 80) return 'text-emerald-600';
  if (pct >= 60) return 'text-teal-600';
  if (pct >= 40) return 'text-amber-600';
  return 'text-orange-600';
}

export default function StudentDashboard() {
  return (
    <SidebarLayout sidebar={<SidebarMenu items={studentMenuItems} />}>
      <DashboardHeader  />

      <main className="flex-1 overflow-auto p-6" style={{ background: '#f0faf8' }}>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
          <StatCard title="Enrolled Courses" value="6" icon={BookOpen} />
          <StatCard title="Completed Lessons" value="32" icon={CheckCircle} trend={{ value: 10, isPositive: true }} />
          <StatCard title="Pending Assignments" value="3" icon={Clock}  badge={3} />
          <StatCard title="Overall GPA" value="3.75" icon={Award}  />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* My Courses */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-teal-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">My Courses</h2>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700">
                {courses.length} courses
              </span>
            </div>
            <div className="space-y-3">
              {courses.map((course, i) => (
                <div key={i} className="p-4 border border-gray-100 rounded-xl hover:border-teal-200 hover:bg-teal-50/30 transition-all duration-200 group">
                  <div className="flex items-center justify-between mb-2.5">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm group-hover:text-teal-800 transition-colors">{course.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{course.instructor}</p>
                    </div>
                    <span className={`text-sm font-black ${getProgressTextColor(course.progress)}`}>
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${course.progress}%`, background: getProgressGradient(course.progress) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deadlines */}
          <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Upcoming Deadlines</h2>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700">
                {deadlines.length} tasks
              </span>
            </div>

            <div className="space-y-3 mb-5">
              {deadlines.map((item, i) => (
                <div key={i} className={`p-3 ${item.bg} border ${item.border} rounded-xl flex items-start gap-3`}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${item.dot}`} />
                  <div>
                    <p className={`text-sm font-semibold ${item.titleColor}`}>{item.task}</p>
                    <p className={`text-xs ${item.dateColor} mt-0.5`}>{item.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievement */}
            <div className="p-4 rounded-xl border border-emerald-200 flex items-start gap-3"
              style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' }}>
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-800">Great Job!</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  You completed all assignments in Web Development
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Study Progress Bar Chart */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-teal-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Weekly Study Progress</h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700">
              This week
            </span>
          </div>

          <div className="flex items-end justify-between gap-3 h-48">
            {weekDays.map(({ day, hours, pct }) => (
              <div key={day} className="flex flex-col items-center flex-1 gap-2 group">
                <span className="text-xs font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {hours}h
                </span>
                <div className="w-full relative flex-1 bg-gray-100 rounded-t-lg overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-700"
                    style={{
                      height: `${pct}%`,
                      background: 'linear-gradient(180deg, #14b8a6, #0d9488)',
                      opacity: day === 'Fri' || day === 'Sat' ? 1 : 0.7,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-semibold">{day}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(180deg, #14b8a6, #0d9488)' }} />
              <span className="text-xs text-gray-500">Study Hours</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-gray-100" />
              <span className="text-xs text-gray-500">No activity</span>
            </div>
          </div>
        </div>

      </main>
    </SidebarLayout>
  );
}