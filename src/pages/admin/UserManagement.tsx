/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Search, Plus, Edit2, Loader2, Users, Shield,
  UserCheck, AlertCircle, Filter, X, Check, Save, Info
} from 'lucide-react';
// FIX: Đảm bảo cú pháp import chuẩn, không dấu cách thừa
import { adminUserService, type Role, type UserQueryParams } from '@/services/adminUserService';
import { adminMenuItems } from '@/constants/adminMenuConfig';
import SidebarLayout from '@/layouts/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';
import SidebarMenu from '@/components/SidebarMenu';

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600'
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

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserQueryParams>({
    page: 1, perPage: 10, search: '', role: '', status: ''
  });
  const loadData = async () => {
      setLoading(true);
      try {
      const res = await adminUserService.getUsers(filters);
      setUsers(res.users);
      // Giả sử API trả về stats hoặc ta tính toán tạm thời
      setStats({
        total: res.total,
        active: res.users.filter((u: any) => u.status === 'ACTIVE').length,
        pending: res.users.filter((u: any) => u.status === 'PENDING').length,
        inactive: res.users.filter((u: any) => u.status === 'INACTIVE').length
      });
      } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [filters.page, filters.role, filters.status, filters.search]);
  return (
    <SidebarLayout sidebar={<SidebarMenu items={adminMenuItems} />}>
      <DashboardHeader />
      <main className="flex-1 overflow-auto bg-slate-50 p-6 md:p-8">
        {/* [1] KHU VỰC THỐNG KÊ (Giữ nguyên) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <StatCard title="Tổng User" value={stats?.total || users.length} icon={Users} color="blue" />
           <StatCard title="Đang hoạt động" value={stats?.active || 0} icon={UserCheck} color="emerald" />
           <StatCard title="Chờ duyệt" value={stats?.pending || 0} icon={AlertCircle} color="amber" />
           <StatCard title="Bị khóa" value={stats?.inactive || 0} icon={Shield} color="red" />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Quản lý người dùng</h1>
          <button onClick={() => setEditId('new')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all">
            <Plus size={18} /> Thêm người dùng
          </button>
        </div>

        {/* [2] KHU VỰC BỘ LỌC - ĐÃ KHÔI PHỤC STATUS */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text" placeholder="Tìm theo tên, email..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              onKeyDown={(e: any) => e.key === 'Enter' && setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
                  </div>

          <div className="flex items-center gap-3">
            <Filter size={16} className="text-slate-400" />

            {/* Lọc Role */}
            <select
              className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none"
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
            >
              <option value="">Tất cả Vai trò</option>
              <option value="ADMIN">Quản trị viên</option>
              <option value="TEACHER">Giáo viên</option>
              <option value="STUDENT">Sinh viên</option>
            </select>

            {/* 🟢 KHÔI PHỤC LỌC STATUS */}
            <select
              className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            >
              <option value="">Tất cả Trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="INACTIVE">Đã khóa</option>
            </select>
                    </div>
              </div>

        {/* BẢNG DỮ LIỆU */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" /></td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{u.firstName} {u.lastName}</div>
                    <div className="text-xs text-slate-400">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {u.roles?.map((r: any) => (
                        <span key={r.roleId} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-black border border-indigo-100">
                          {r.role.code}
                        </span>
                      ))}
      </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setEditId(u.id)} className="p-2 text-slate-400 hover:text-indigo-600 transition-all"><Edit2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      </main>

      {editId && <EditUserModal userId={editId === 'new' ? null : editId} onClose={() => { setEditId(null); loadData(); }} />}
    </SidebarLayout>
  );
}

// --- MODAL SIMPLIFIED (ĐÃ FIX LỖI CRASH VÀ CHECKBOX) ---
function EditUserModal({ userId, onClose }: { userId: string | null; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'personal' | 'roles'>('personal');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        if (userId) {
          const res = await adminUserService.getUserDetails(userId);
          setData(res);
        } else {
          // Khi Thêm mới: Gọi API lấy Roles
          const rolesRes = await adminUserService.getRoles();
          setData({ 
            targetUser: { firstName: '', lastName: '', email: '', status: 'ACTIVE', roleIds: [] }, 
            roles: rolesRes 
          });
        }
      } catch (err: any) {
        console.error("Lỗi fetch modal:", err);
        setFetchError(err.response?.data?.message || "Không thể tải dữ liệu từ máy chủ.");
      } finally { 
        setLoading(false); 
      }
    };
    fetchDetails();
  }, [userId]);

  const handleSave = async (section: string, payload: any) => {
    setSaving(true);
    try {
      userId 
        ? await adminUserService.updateUser(userId, { section, ...payload }) 
        : await adminUserService.createUser(payload);
      alert('Thành công!');
      if (!userId || section === 'personal') onClose();
    } catch (err: any) { 
      alert(err.response?.data?.message || 'Lỗi khi lưu dữ liệu'); 
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <Loader2 className="animate-spin text-white" size={48} />
    </div>
  );

  // BẢO VỆ GIAO DIỆN: Nếu có lỗi API hoặc không có data, hiển thị thông báo thay vì crash app
  if (fetchError || !data) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full animate-in zoom-in-95">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Đã có lỗi xảy ra</h2>
        <p className="text-slate-500 mb-6">{fetchError || "Dữ liệu bị rỗng."}</p>
        <button onClick={onClose} className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-lg transition-colors">
          Đóng cửa sổ
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95">
        <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">{userId ? `Chỉnh sửa: ${data.targetUser?.email}` : 'Thêm tài khoản'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} /></button>
        </div>

        {userId && (
          <div className="flex border-b bg-white px-6">
            <button onClick={() => setActiveTab('personal')} className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'personal' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Thông tin</button>
            <button onClick={() => setActiveTab('roles')} className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'roles' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Vai trò (Roles)</button>
          </div>
        )}

        <div className="flex-1 overflow-auto p-8">
          {activeTab === 'personal' && (
            <div className="max-w-xl mx-auto space-y-4">
              <input 
                placeholder="Họ" 
                className="w-full p-3 border rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                value={data.targetUser?.lastName || ''} 
                onChange={e => setData({...data, targetUser: {...data.targetUser, lastName: e.target.value}})} 
              />
              <input 
                placeholder="Tên" 
                className="w-full p-3 border rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                value={data.targetUser?.firstName || ''} 
                onChange={e => setData({...data, targetUser: {...data.targetUser, firstName: e.target.value}})} 
              />
              <input 
                placeholder="Email" 
                disabled={!!userId} 
                className="w-full p-3 border rounded-xl bg-slate-50 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:text-slate-500" 
                value={data.targetUser?.email || ''} 
                onChange={e => setData({...data, targetUser: {...data.targetUser, email: e.target.value}})} 
              />
              
              {!userId && (
                <div className="py-2">
                  <p className="text-sm font-bold text-slate-700 mb-2">Chọn vai trò:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {data.roles?.map((r: any) => (
                      <label key={r.id} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                          checked={data.targetUser?.roleIds?.includes(r.id) || false}
                          onChange={(e) => {
                            const ids = e.target.checked 
                              ? [...(data.targetUser?.roleIds || []), r.id] 
                              : (data.targetUser?.roleIds || []).filter((id:any) => id !== r.id);
                            setData({...data, targetUser: {...data.targetUser, roleIds: ids}});
                          }} 
                        /> 
                        <span className="font-medium text-slate-700">{r.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => handleSave('personal', data.targetUser)} 
                disabled={saving} 
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {saving ? <><Loader2 size={18} className="animate-spin" /> Đang xử lý...</> : 'Lưu thông tin'}
              </button>
            </div>
          )}

          {activeTab === 'roles' && userId && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {data.roles?.map((role: Role) => {
                  const isSelected = data.targetUser?.roles?.some((ur: any) => ur.roleId === role.id);
                  return (
                    <div key={role.id} onClick={() => {
                      const newRoles = isSelected 
                        ? data.targetUser.roles.filter((r:any) => r.roleId !== role.id) 
                        : [...(data.targetUser.roles || []), { roleId: role.id }];
                      setData({...data, targetUser: {...data.targetUser, roles: newRoles}});
                    }} className={`p-4 border-2 rounded-2xl cursor-pointer flex items-center justify-between transition-all ${isSelected ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-300'}`}>
                      <div>
                        <p className="font-bold text-slate-800">{role.name}</p>
                        <p className="text-xs font-semibold text-slate-400 mt-1">{role.code}</p>
                      </div>
                      {isSelected && <div className="bg-indigo-600 p-1 rounded-full"><Check size={14} className="text-white" /></div>}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end pt-4 border-t">
                <button 
                  onClick={() => handleSave('roles', { roleIds: data.targetUser?.roles?.map((r:any) => r.roleId) || [] })} 
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {saving ? <><Loader2 size={18} className="animate-spin" /> Đang xử lý...</> : 'Cập nhật Vai trò'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}