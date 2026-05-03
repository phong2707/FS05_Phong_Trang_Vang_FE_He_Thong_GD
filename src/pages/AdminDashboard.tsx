import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  UserCheck,
  TrendingUp,
  Activity,
  AlertCircle,
} from 'lucide-react';
import SidebarLayout from '@/layouts/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';
import StatCard from '@/components/StatCard';
import SidebarMenu from '@/components/SidebarMenu';

const adminMenuItems = [
  { label: 'Dashboard', icon: Activity, href: '/admin' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Courses', icon: BookOpen, href: '/admin/courses' },
  { label: 'Teachers', icon: UserCheck, href: '/admin/teachers' },
  { label: 'Reports', icon: BarChart3, href: '/admin/reports' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminDashboard() {
  return (
    <SidebarLayout
      sidebar={<SidebarMenu items={adminMenuItems} />}
    >
      <DashboardHeader />

      <main className="flex-1 overflow-auto bg-stone-50 p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value="1,234"
            icon={Users}
            color="blue"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Active Courses"
            value="48"
            icon={BookOpen}
            color="green"
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Total Teachers"
            value="156"
            icon={UserCheck}
            color="purple"
            trend={{ value: 3, isPositive: false }}
          />
          <StatCard
            title="Revenue"
            value="$45,231"
            icon={TrendingUp}
            color="yellow"
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">User Action {item}</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs rounded-full font-medium">New</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition font-medium">
                Add User
              </button>
              <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition font-medium">
                Create Course
              </button>
              <button className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition font-medium">
                Generate Report
              </button>
              <button className="w-full border border-stone-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-stone-100 transition font-medium">
                View Settings
              </button>
            </div>

            {/* Alert Box */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-sm font-medium text-amber-800">System Alert</p>
                <p className="text-xs text-amber-700 mt-1">
                  Scheduled maintenance on Sunday at 2:00 AM
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}
