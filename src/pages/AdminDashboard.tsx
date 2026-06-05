/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  UserCheck,
  TrendingUp,
  Activity,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { adminMenuItems } from '@/constants/adminMenuConfig';
import SidebarLayout from '@/layouts/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';
import StatCard from '@/components/StatCard';
import SidebarMenu from '@/components/SidebarMenu';
import dashboardService from '@/services/dashboard.service';

type RecentActivity = {
  action: string;
  user: string;
  time: string | Date;
  detail?: string;
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<null | any>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await dashboardService.getDashboardSummary();
        if (!mounted) return;
        setStats(res.stats || null);
        setRecentActivities(res.recentActivities || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

  return (
    <SidebarLayout
      sidebar={<SidebarMenu items={adminMenuItems} />}
    >
      <DashboardHeader />

      <main className="flex-1 overflow-auto bg-stone-50 p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading && !stats ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-4 flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-gray-500" />
            </div>
          ) : (
            <>
              <StatCard
                title="Total Users"
                value={stats ? String(stats.totalUsers) : "-"}
                icon={Users}
                color="blue"
                trend={{ value: 0, isPositive: true }}
              />
              <StatCard
                title="Active Courses"
                value={stats ? String(stats.activeCourses) : "-"}
                icon={BookOpen}
                color="green"
                trend={{ value: 0, isPositive: true }}
              />
              <StatCard
                title="Total Teachers"
                value={stats ? String(stats.totalTeachers) : "-"}
                icon={UserCheck}
                color="purple"
                trend={{ value: 0, isPositive: false }}
              />
              <StatCard
                title="Revenue"
                value={stats ? formatVND(stats.totalRevenue) : "-"}
                icon={TrendingUp}
                color="yellow"
                trend={{ value: 0, isPositive: true }}
              />
            </>
          )}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.length === 0 && !loading && (
                <div className="text-sm text-gray-500">No recent activities</div>
              )}

              {recentActivities.map((act, idx) => {
                const Icon = act.action === 'Transaction' ? Activity : Users;
                const timeStr = new Date(act.time).toLocaleString();
                return (
                  <div key={idx} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Icon className="text-teal-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{act.action} — {act.user}</p>
                      <p className="text-xs text-gray-500">{timeStr}</p>
                    </div>
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs rounded-full font-medium">{act.detail ? act.detail : '—'}</span>
                  </div>
                );
              })}
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
