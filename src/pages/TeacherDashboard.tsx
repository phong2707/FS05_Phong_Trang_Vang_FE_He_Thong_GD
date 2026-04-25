import React from 'react';
import {
  BookOpen,
  Users,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import SidebarLayout from '@/layouts/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';
import StatCard from '@/components/StatCard';
import SidebarMenu from '@/components/SidebarMenu';

const teacherMenuItems = [
  { label: 'Dashboard', icon: BarChart3, href: '/teacher' },
  { label: 'My Courses', icon: BookOpen, href: '/teacher/courses' },
  { label: 'Students', icon: Users, href: '/teacher/students' },
  { label: 'Assignments', icon: FileText, href: '/teacher/assignments' },
  { label: 'Grades', icon: CheckCircle, href: '/teacher/grades' },
  { label: 'Messages', icon: MessageSquare, href: '/teacher/messages' },
];

export default function TeacherDashboard() {
  return (
    <SidebarLayout
      sidebar={<SidebarMenu items={teacherMenuItems} />}
    >
      <DashboardHeader userName="Prof. John Smith" role="Teacher" />

      <main className="flex-1 overflow-auto bg-gray-100 p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="My Courses"
            value="5"
            icon={BookOpen}
            color="blue"
            trend={{ value: 2, isPositive: true }}
          />
          <StatCard
            title="Total Students"
            value="243"
            icon={Users}
            color="green"
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Pending Assignments"
            value="12"
            icon={FileText}
            color="red"
            badge={12}
          />
          <StatCard
            title="Avg. Class Grade"
            value="3.8/5"
            icon={CheckCircle}
            color="purple"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses Overview */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">My Courses</h2>
            <div className="space-y-4">
              {['Advanced Python', 'Web Development', 'Data Science', 'JavaScript Basics', 'Database Design'].map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-${['blue', 'green', 'purple', 'yellow', 'red'][index]}-100 rounded-lg flex items-center justify-center`}>
                      <BookOpen className={`text-${['blue', 'green', 'purple', 'yellow', 'red'][index]}-600`} size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{course}</p>
                      <p className="text-sm text-gray-500">{45 + index * 5} students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">3 lessons</p>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Tasks</h2>
            <div className="space-y-4">
              {[
                { title: 'Grade submissions', time: 'Today', icon: Clock, color: 'blue' },
                { title: 'Review assignment', time: 'Tomorrow', icon: FileText, color: 'green' },
                { title: 'Class meeting', time: 'Thu, 2:00 PM', icon: Users, color: 'purple' },
                { title: 'Update grades', time: 'Fri, 10:00 AM', icon: CheckCircle, color: 'yellow' },
              ].map((task, index) => {
                const Icon = task.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Icon className={`text-${task.color}-600 flex-shrink-0 mt-1`} size={18} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">{task.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Alert */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-sm font-medium text-blue-800">Reminder</p>
                <p className="text-xs text-blue-700 mt-1">
                  You have 5 ungraded assignments waiting
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}
