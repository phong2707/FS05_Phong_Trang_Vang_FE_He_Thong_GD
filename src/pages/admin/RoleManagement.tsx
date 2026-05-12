/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { Shield, Plus, Lock, CheckCircle, ChevronRight, Loader2, X } from 'lucide-react';
import { adminUserService ,type Feature, type Role } from '@/services/adminUserService';
import SidebarLayout from '@/layouts/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';
import SidebarMenu from '@/components/SidebarMenu';

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [rolesRes, featuresRes] = await Promise.all([
      adminUserService.getRoles(),
      adminUserService.getFeatures()
    ]);
    // featuresRes.featuresTree (theo adminFeature.controller.ts)
    setRoles(rolesRes);
    setFeatures(featuresRes.features || featuresRes); 
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  return (
    <SidebarLayout sidebar={<SidebarMenu items={[{ label: 'Users', icon: Shield, href: '/admin/users' }]} />}>
      <DashboardHeader/>
      <main className="p-6 bg-slate-50 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dynamic RBAC</h1>
            <p className="text-sm text-slate-500 mt-1">Định nghĩa vai trò và ma trận quyền hạn hệ thống</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2">
            <Plus size={18} /> Tạo Vai trò mới
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? <Loader2 className="animate-spin text-indigo-500" /> : roles.map(role => (
            <div key={role.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-indigo-300 transition-all">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Shield size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-800">{role.name}</h3>
              <code className="text-xs text-indigo-500 font-bold bg-indigo-50 px-2 py-1 rounded mt-2 inline-block">
                {role.code}
              </code>
              <p className="text-sm text-slate-500 mt-3 line-clamp-2">{role.description || 'Không có mô tả'}</p>
              <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Đang được sử dụng</span>
                <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
                  Chi tiết <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showCreateModal && (
        <CreateRoleModal 
          features={features} 
          onClose={() => { setShowCreateModal(false); loadData(); }} 
        />
      )}
    </SidebarLayout>
  );
}

// --- MODAL TẠO ROLE & GÁN QUYỀN ---
function CreateRoleModal({ features, onClose }: { features: any[], onClose: () => void }) {
  const [formData, setFormData] = useState({ code: '', name: '', description: '' });
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const togglePerm = (id: string) => {
    setSelectedPerms(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleCreate = async () => {
    if (!formData.code || !formData.name) return alert('Vui lòng nhập đủ thông tin');
    setSaving(true);
    await adminUserService.createRole({ ...formData, permissionIds: selectedPerms });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center"><Lock size={20} /></div>
            <h2 className="text-xl font-bold text-slate-800">Cấu hình Vai trò & Quyền hạn</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Thông tin cơ bản */}
          <div className="space-y-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle size={16} className="text-indigo-600" /> Thông tin cơ bản
            </h3>
            <input 
              placeholder="Mã vai trò (VD: SUPER_ADMIN)" 
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 uppercase font-bold text-sm"
              onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
            />
            <input 
              placeholder="Tên vai trò hiển thị" 
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <textarea 
              placeholder="Mô tả vai trò..." 
              rows={4}
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Ma trận quyền hạn */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Shield size={16} className="text-indigo-600" /> Ma trận Quyền hạn (Permissions)
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {features.map((feat: any) => (
                <div key={feat.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                  <div className="px-4 py-3 bg-white border-b border-slate-100 font-bold text-slate-700 text-sm flex justify-between items-center">
                    {feat.name}
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded uppercase">{feat.code}</span>
                  </div>
                  <div className="p-4 flex flex-wrap gap-4">
                    {feat.permissions?.map((p: any) => (
                      <label key={p.id} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedPerms.includes(p.id)}
                          onChange={() => togglePerm(p.id)}
                          className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500" 
                        />
                        <span className="text-sm text-slate-600 group-hover:text-indigo-600 transition-colors">{p.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-slate-50 text-right">
          <button onClick={onClose} className="px-6 py-2.5 font-bold text-slate-400 hover:text-slate-600 mr-4">Hủy</button>
          <button 
            onClick={handleCreate}
            disabled={saving}
            className="bg-indigo-600 text-white px-10 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            {saving ? 'Đang khởi tạo...' : 'Xác nhận tạo Vai trò'}
          </button>
        </div>
      </div>
    </div>
  );
}