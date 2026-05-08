/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { 
  Search, Plus, Edit2, Trash2, Shield, X, Loader2,
  Users, BookOpen, BarChart3, Settings, UserCheck, Activity
} from 'lucide-react';
import { adminUserService, type UserQueryParams } from '@/services/adminUserService';

// --- IMPORT CÁC COMPONENT LAYOUT TỪ DASHBOARD ---
import SidebarLayout from '@/layouts/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';
import SidebarMenu from '@/components/SidebarMenu';

// --- ĐỊNH NGHĨA MENU ADMIN ---
const adminMenuItems = [
  { label: 'Dashboard', icon: Activity, href: '/admin' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Courses', icon: BookOpen, href: '/admin/courses' },
  { label: 'Teachers', icon: UserCheck, href: '/admin/teachers' },
  { label: 'Reports', icon: BarChart3, href: '/admin/reports' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

// --- TRANG DANH SÁCH CHÍNH ---
export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<UserQueryParams>({ page: 1, perPage: 10, search: '', filterStatus: '' });
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await adminUserService.getUsers(filters);
    setUsers(res.users); 
    setTotal(res.total); 
    setLoading(false);
  };

  useEffect(() => { load(); }, [filters]);

  return (
    <SidebarLayout sidebar={<SidebarMenu items={adminMenuItems} />}>
      <DashboardHeader />
      
      {/* Bao bọc nội dung vào thẻ main tương tự như Dashboard */}
      <main className="flex-1 overflow-auto bg-slate-50 p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản lý Người dùng</h1>
            <p className="text-sm text-slate-500 mt-1">Quản lý danh sách tài khoản và ma trận phân quyền hệ thống</p>
          </div>
          <button 
            onClick={() => setEditId('new')} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm font-bold transition-all hover:shadow-md"
          >
            <Plus size={18} /> Thêm Người dùng
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc email..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              onKeyDown={(e: any) => e.key === 'Enter' && setFilters({...filters, search: e.target.value, page: 1})} 
            />
          </div>
          <select 
            className="border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-700" 
            onChange={(e) => setFilters({...filters, filterStatus: e.target.value, page: 1})}
          >
            <option value="">Trạng thái: Tất cả</option>
            <option value="ACTIVE">Hoạt động (ACTIVE)</option>
            <option value="PENDING">Chờ duyệt (PENDING)</option>
            <option value="INACTIVE">Đã khóa (INACTIVE)</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Tài khoản</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Vai trò (Roles)</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500 mb-2" /> Đang tải dữ liệu...</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 flex-shrink-0">
                      {u.firstName[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{u.firstName} {u.lastName}</div>
                      <div className="text-sm text-slate-500">{u.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                      u.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {u.roles?.map((r: any) => (
                        <span key={r.roleId} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold border border-slate-200 uppercase">
                          {r.role.code}
                        </span>
                      ))}
                      {(!u.roles || u.roles.length === 0) && <span className="text-xs text-slate-400 italic">Chưa cấp quyền</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setEditId(u.id)} 
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Chỉnh sửa người dùng"
                    >
                      <Edit2 size={18} />
                    </button>
                    {/* Bạn có thể thêm nút Xóa (Trash2) ở đây sau này nếu cần */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Trạng thái trống */}
          {!loading && users.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              Không tìm thấy người dùng nào phù hợp với tìm kiếm của bạn.
            </div>
          )}
        </div>
      </main>

      {/* Render Modal Edit User (Giữ nguyên logic của bạn) */}
      {editId && <EditUserModal userId={editId === 'new' ? null : editId} onClose={() => {setEditId(null); load();}} />}
    </SidebarLayout>
  );
}

// --- MODAL CHỈNH SỬA (KÈM TABS) ---
// (Component này giữ nguyên logic của bạn, chỉ làm đẹp UI thêm 1 chút)
function EditUserModal({ userId, onClose }: { userId: string | null, onClose: () => void }) {
  const [tab, setTab] = useState<'personal' | 'roles' | 'permissions'>('personal');
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userId) {
      adminUserService.getUserDetails(userId).then(res => { setState(res); setLoading(false); });
    } else { 
      setState({ targetUser: { firstName: '', lastName: '', email: '', status: 'PENDING' }, roles: [] }); 
      setLoading(false); 
    }
  }, [userId]);

  const onSave = async (section: string, payload: any) => {
    setSaving(true);
    try {
      if (userId) {
        await adminUserService.updateUser(userId, { section, ...payload });
      } else {
        await adminUserService.createUser(payload);
      }
      alert("Lưu thông tin thành công!"); 
      if (section === 'personal' && !userId) onClose(); // Đóng modal nếu vừa tạo mới thành công
    } catch (error) {
      alert("Có lỗi xảy ra khi lưu dữ liệu.");
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <h3 className="font-bold text-slate-800 text-lg">
            {userId ? `Chỉnh sửa: ${state.targetUser.email}` : 'Tạo Người Dùng Mới'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {userId && (
          <div className="flex border-b border-slate-200 bg-white">
            {[
              { id: 'personal', label: 'Thông tin cá nhân' }, 
              { id: 'roles', label: 'Vai trò (Roles)' }, 
              { id: 'permissions', label: 'Quyền trực tiếp' }
            ].map((t: any) => (
              <button 
                key={t.id} 
                onClick={() => setTab(t.id)} 
                className={`px-6 py-3.5 text-sm font-bold tracking-wide border-b-2 transition-all ${
                  tab === t.id ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-8 bg-white rounded-b-2xl">
          {/* TAB: THÔNG TIN CÁ NHÂN */}
          {tab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tên</label>
                <input placeholder="VD: Văn A" className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={state.targetUser.firstName} onChange={e => setState({...state, targetUser: {...state.targetUser, firstName: e.target.value}})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Họ</label>
                <input placeholder="VD: Nguyễn" className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={state.targetUser.lastName} onChange={e => setState({...state, targetUser: {...state.targetUser, lastName: e.target.value}})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input placeholder="admin@example.com" disabled={!!userId} className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-500 disabled:opacity-70" value={state.targetUser.email} onChange={e => setState({...state, targetUser: {...state.targetUser, email: e.target.value}})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Trạng thái</label>
                <select className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={state.targetUser.status} onChange={e => setState({...state, targetUser: {...state.targetUser, status: e.target.value}})}>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="PENDING">Chờ duyệt</option>
                  <option value="INACTIVE">Đã khóa</option>
                </select>
              </div>
              <div className="col-span-1 md:col-span-2 text-right pt-4 border-t border-slate-100 mt-2">
                <button 
                  onClick={() => onSave('personal', state.targetUser)} 
                  disabled={saving} 
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : (userId ? 'Cập nhật Thông tin' : 'Tạo Người dùng mới')}
                </button>
              </div>
            </div>
          )}

          {/* TAB: VAI TRÒ */}
          {tab === 'roles' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.roles?.map((r: any) => {
                  const isChecked = state.targetUser.roles?.some((ur: any) => ur.roleId === r.id);
                  return (
                    <label key={r.id} className={`p-4 border rounded-xl cursor-pointer flex items-center gap-4 transition-all ${isChecked ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}>
                      <input type="checkbox" checked={isChecked} onChange={() => {
                        const newRoles = isChecked ? state.targetUser.roles.filter((x:any) => x.roleId !== r.id) : [...(state.targetUser.roles || []), { roleId: r.id }];
                        setState({...state, targetUser: {...state.targetUser, roles: newRoles}});
                      }} className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                      <div>
                        <div className="font-bold text-slate-800">{r.name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{r.code}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
              <div className="text-right pt-4 border-t border-slate-100">
                <button onClick={() => onSave('roles', { roleIds: state.targetUser.roles.map((r:any) => r.roleId) })} disabled={saving} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition disabled:opacity-50">
                  {saving ? 'Đang cập nhật...' : 'Cập nhật Vai trò'}
                </button>
              </div>
            </div>
          )}

          {/* TAB: QUYỀN TRỰC TIẾP */}
          {tab === 'permissions' && (
            <div className="space-y-6 animate-in fade-in">
              {state.features?.map((f: any) => (
                <div key={f.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-4 py-3 font-bold text-slate-800 border-b border-slate-200 text-sm flex items-center gap-2">
                    <Shield size={16} className="text-indigo-600" /> {f.name}
                  </div>
                  <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white">
                    {f.permissions?.map((p: any) => {
                      const isChecked = state.targetUser.permissions?.some((up: any) => up.permissionId === p.id);
                      return (
                        <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" checked={isChecked} onChange={() => {
                            const newPerms = isChecked ? state.targetUser.permissions.filter((x:any) => x.permissionId !== p.id) : [...(state.targetUser.permissions || []), { permissionId: p.id }];
                            setState({...state, targetUser: {...state.targetUser, permissions: newPerms}});
                          }} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                          <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-700 transition-colors">{p.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="text-right pt-4 border-t border-slate-100">
                <button onClick={() => onSave('permissions', { permissionIds: state.targetUser.permissions.map((p:any) => p.permissionId) })} disabled={saving} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition disabled:opacity-50">
                  {saving ? 'Đang cập nhật...' : 'Cập nhật Quyền trực tiếp'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}