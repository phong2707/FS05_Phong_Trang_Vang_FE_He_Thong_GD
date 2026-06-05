/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Loader2, BookOpen, TrendingUp, AlertCircle, Filter, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminCourseService, type Course } from '@/services/admin/adminCourseService';
import { adminMenuItems } from '@/constants/adminMenuConfig';
import SidebarLayout from '@/layouts/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';
import SidebarMenu from '@/components/SidebarMenu';

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600'
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}><Icon size={24} /></div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function CourseManagement() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await adminCourseService.getCourses();
      const courseList = Array.isArray(res) ? res : res.data || [];
      setCourses(courseList);

      // Calculate stats
      setStats({
        total: courseList.length,
        published: courseList.filter((c: Course) => c.status === 'PUBLISHED').length,
        draft: courseList.filter((c: Course) => c.status === 'DRAFT').length,
        totalRevenue: courseList.reduce((sum: number, c: Course) => sum + c.price, 0)
      });
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (course: Course) => {
    const newStatus = course.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      // optimistic UI: update locally first
      setCourses(prev => prev.map(c => c.id === course.id ? { ...c, status: newStatus } : c));
      await adminCourseService.updateCourse(course.id, { status: newStatus });
      await loadCourses();
    } catch (err) {
      console.error('Failed to update status:', err);
      // revert on error
      await loadCourses();
      alert('Cập nhật trạng thái thất bại');
    }
  };

  useEffect(() => {
    (async () => {
      await loadCourses();
    })();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <SidebarLayout sidebar={<SidebarMenu items={adminMenuItems} />}>
      <DashboardHeader />
      <main className="flex-1 overflow-auto bg-slate-50 p-6 md:p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Tổng Khóa học" value={stats?.total || 0} icon={BookOpen} color="blue" />
          <StatCard title="Đang phát hành" value={stats?.published || 0} icon={TrendingUp} color="emerald" />
          <StatCard title="Nháp" value={stats?.draft || 0} icon={AlertCircle} color="amber" />
          {/* <StatCard title="Doanh thu" value={`$${(stats?.totalRevenue || 0).toFixed(2)}`} icon={DollarSign} color="purple" /> */}
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Khóa học</h1>
          <button 
            onClick={() => navigate('/admin/courses/create')}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all"
          >
            <Plus size={18} /> Tạo Khóa học mới
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên khóa học..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter size={16} className="text-slate-400" />
            <select
              className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả Trạng thái</option>
              <option value="DRAFT">Nháp</option>
              <option value="PUBLISHED">Đang phát hành</option>
              <option value="ARCHIVED">Lưu trữ</option>
            </select>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left min-w-max">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 w-80">Tên Khóa học</th>
                <th className="px-6 py-4 w-20">Giá</th>
                <th className="px-6 py-4 w-24">Môn học</th>
                <th className="px-6 py-4 w-24">Bắt đầu</th>
                <th className="px-10 py-4 w-16 ">Level</th>
                <th className="px-6 py-4 w-28">Trạng thái</th>
                <th className="px-6 py-4 w-40 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" /></td></tr>
              ) : filteredCourses.length === 0 ? (
                <tr><td colSpan={7} className="py-20 text-center text-slate-500">Không có khóa học nào</td></tr>
              ) : filteredCourses.map(course => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {course.thumbnailUrl && (
                        <img src={course.thumbnailUrl} alt={course.title} className="w-10 h-10 rounded object-cover" />
                      )}
                      <div>
                        {/* Course Title and Description width ngắn lại */}
                        <div className="font-bold text-slate-800">{course.title}</div>
                        <div className="text-xs text-slate-400 line-clamp-1">{course.description || 'Không có mô tả'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-800">${course.price.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                      {course.subjectCount || 0} môn
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">
                      {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold">
                      {course.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                      course.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      course.status === 'DRAFT' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      {course.status === 'DRAFT' && 'Nháp'}
                      {course.status === 'PUBLISHED' && 'Phát hành'}
                      {course.status === 'ARCHIVED' && 'Lưu trữ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                        className="p-2 text-slate-400 hover:text-indigo-600 transition-all"
                      >
                        <Edit2 size={16} />
                      </button>

                      {course.status === 'DRAFT' ? (
                        <button
                          onClick={() => togglePublish(course)}
                          className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-all"
                        >
                          Phát hành
                        </button>
                      ) : (
                        <button
                          onClick={() => togglePublish(course)}
                          className="px-3 py-1 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-all"
                        >
                          Hủy phát hành
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </SidebarLayout>
  );
}
