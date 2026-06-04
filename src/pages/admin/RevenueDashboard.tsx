/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  Loader2,
  Check,
  X,
  Filter,
  Calendar,
} from 'lucide-react';
import axios from 'axios';
import { adminMenuItems } from '@/constants/adminMenuConfig';
import SidebarLayout from '@/layouts/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';
import SidebarMenu from '@/components/SidebarMenu';

// Types
interface OverviewStats {
  totalRevenue: number;
  successTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  totalTransactions: number;
}

interface Transaction {
  id: string;
  enrollmentId: string;
  courseId: string;
  courseName: string;
  coursePrice: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  paymentMethod: string;
  referenceCode?: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  bankAccount?: string;
  bankName?: string;
  accountName?: string;
  createdAt: string;
  updatedAt: string;
}

interface TopCourse {
  courseId: string;
  courseName: string;
  price: number;
  description: string;
  totalRevenue: number;
  transactionCount: number;
  createdAt: string;
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, suffix = '' }: any) {
  const colors: any = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800">
            {value.toLocaleString()}
            {suffix}
          </p>
        </div>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const statusConfig: any = {
    SUCCESS: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Thành công' },
    PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Chờ xử lý' },
    FAILED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Thất bại' },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

// Format Vietnamese Dong (VNĐ)
function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

// Format datetime
function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function RevenueDashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [topCourses, setTopCourses] = useState<TopCourse[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // API base URL
  const API_BASE_URL = 'http://localhost:8000';

  /**
   * Load dashboard data
   */
  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/revenue/dashboard`, {
        withCredentials: true,
      });

      if (response.data.success) {
        const { overview, recentTransactions, topCourses } = response.data.data;
        setOverview(overview);
        setRecentTransactions(recentTransactions);
        setTopCourses(topCourses);
      }
    } catch (error) {
      console.error('Lỗi khi tải dashboard doanh thu:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load transactions with filters
   */
  const loadTransactions = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      params.append('limit', '10');

      const response = await axios.get(
        `${API_BASE_URL}/admin/revenue/transactions?${params}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setRecentTransactions(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải giao dịch:', error);
    }
  };

  /**
   * Load revenue by date range
   */
  const loadRevenueByDateRange = async () => {
    if (!dateRange.start || !dateRange.end) {
      alert('Vui lòng chọn cả ngày bắt đầu và kết thúc');
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/revenue/by-date-range?startDate=${dateRange.start}&endDate=${dateRange.end}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const { totalRevenue, transactionCount } = response.data.data;
        alert(
          `Doanh thu từ ${dateRange.start} đến ${dateRange.end}:\n` +
          `Tổng tiền: ${formatVND(totalRevenue)}\n` +
          `Số giao dịch: ${transactionCount}`
        );
      }
    } catch (error) {
      console.error('Lỗi khi tải doanh thu theo ngày:', error);
      alert('Lỗi khi tải doanh thu');
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [statusFilter]);

  if (loading) {
    return (
      <SidebarLayout sidebar={<SidebarMenu items={adminMenuItems} />}>
        <DashboardHeader />
        <main className="flex-1 bg-slate-50 p-6 md:p-8 flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
        </main>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout sidebar={<SidebarMenu items={adminMenuItems} />}>
      <DashboardHeader />
      <main className="flex-1 overflow-auto bg-slate-50 p-6 md:p-8">
        {/* 🎯 PHẦN 1: TIÊU ĐỀ & ACTION */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Quản lý Doanh thu</h1>
            <p className="text-slate-500 mt-2">Thống kê doanh thu & lịch sử giao dịch</p>
          </div>
        </div>

        {/* 🎯 PHẦN 2: KHU VỰC THẺ THỐNG KÊ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng Doanh thu"
            value={overview?.totalRevenue || 0}
            icon={DollarSign}
            color="green"
            suffix=" ₫"
          />
          <StatCard
            title="Giao dịch Thành công"
            value={overview?.successTransactions || 0}
            icon={Check}
            color="blue"
          />
          <StatCard
            title="Giao dịch Chờ xử lý"
            value={overview?.pendingTransactions || 0}
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Giao dịch Thất bại"
            value={overview?.failedTransactions || 0}
            icon={X}
            color="red"
          />
        </div>

        {/* 🎯 PHẦN 3: KHU VỰC LỌC & TÌM KIẾM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Filter size={20} /> Bộ lọc & Tìm kiếm
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trạng thái giao dịch
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="SUCCESS">Thành công</option>
                <option value="PENDING">Chờ xử lý</option>
                <option value="FAILED">Thất bại</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Từ ngày
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Đến ngày
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <button
            onClick={loadRevenueByDateRange}
            className="mt-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md"
          >
            <Calendar size={18} /> Xem doanh thu theo khoảng
          </button>
        </div>

        {/* 🎯 PHẦN 4: BẢNG GIAO DỊCH GẦN ĐÂY */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={20} /> Giao dịch Gần đây
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Mã GD
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Khóa học
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Học viên
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Phương thức
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Số tiền
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Thời gian
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-slate-600">
                        {tx.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium text-slate-800">{tx.courseName}</div>
                        <div className="text-xs text-slate-500">{formatVND(tx.coursePrice)}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="font-medium text-slate-800">{tx.studentName}</div>
                        <div className="text-xs text-slate-500">{tx.studentEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {tx.paymentMethod}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                        {formatVND(tx.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDateTime(tx.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                      <AlertCircle className="mx-auto mb-2 text-slate-400" size={32} />
                      <p>Không có giao dịch nào</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🎯 PHẦN 5: TOP KHÓA HỌC CÓ DOANH THU CAO NHẤT */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={20} /> Top 5 Khóa học - Doanh thu cao nhất
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Xếp hạng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Tên khóa học
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Mô tả
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Giá gốc
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Doanh thu
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Số giao dịch
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {topCourses.length > 0 ? (
                  topCourses.map((course, idx) => (
                    <tr key={course.courseId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-indigo-600">#{idx + 1}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        {course.courseName}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                        {course.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatVND(course.price)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                        {formatVND(course.totalRevenue)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        {course.transactionCount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      <AlertCircle className="mx-auto mb-2 text-slate-400" size={32} />
                      <p>Không có dữ liệu khóa học</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}
