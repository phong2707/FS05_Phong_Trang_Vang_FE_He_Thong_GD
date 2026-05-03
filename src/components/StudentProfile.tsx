/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react';
import {
  Mail, Phone, MapPin, User, AlertCircle, Loader, Edit3, KeyRound,
  CheckCircle, Clock, Shield, X, Save, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';

export default function StudentProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassModal, setShowPassModal] = useState(false);
  const [passData, setPassData] = useState({ oldPassword: '', password: '', passwordConfirmation: '' });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response?.success) {
        setProfile(response.user);
      } else {
        setError(response?.error);
      }
    } catch (err) { setError('Lỗi tải profile'); } finally { setLoading(false); }
  };

  const handleEditClick = () => {
    setFormData({ ...profile });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const response = await authService.updateProfile(formData); 
    if (response?.success) {
      setProfile(response.user);
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleChangePassword = async () => {
    if (passData.password !== passData.passwordConfirmation) return alert("Mật khẩu không khớp");
    setIsSaving(true);
    const response = await authService.changePassword(passData);
    if (response.success) {
      alert("Đổi mật khẩu thành công!");
      setShowPassModal(false);
      setPassData({ oldPassword: '', password: '', passwordConfirmation: '' });
    } else {
      alert(response.message || "Lỗi khi đổi mật khẩu");
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    await authService.logout('/login/student'); // 🆕 Điều hướng về login sinh viên
  };

  if (loading) return <div className="flex justify-center p-20"><Loader className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6">
      {/* Header Profile - Tone Blue/Indigo */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />
        <div className="px-8 pb-8 flex flex-col sm:flex-row items-end gap-6 -mt-12">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-lg">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} className="w-full h-full rounded-xl object-cover" />
              ) : (
                <div className="w-full h-full rounded-xl bg-blue-50 flex items-center justify-center"><User size={48} className="text-blue-600" /></div>
              )}
            </div>
            <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
          </div>

          <div className="flex-1 mb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{profile.fullName}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider">
                    Sinh viên
                  </span>
                  <span className="text-slate-400 text-xs flex items-center gap-1"><Clock size={12} /> Gia nhập {new Date(profile.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-blue-100 shadow-lg"><Save size={16} /></button>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold"><X size={16} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={handleEditClick} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition"><Edit3 size={16} /> Chỉnh sửa</button>
                    <button onClick={() => setShowPassModal(true)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition"><KeyRound size={16} /></button>
                    <button onClick={handleLogout} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"><LogOut size={16} /></button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-lg">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              Thông tin sinh viên
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Họ và tên đệm</label>
                <input disabled={!isEditing} value={isEditing ? formData.lastName : profile.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className={`w-full p-3 rounded-xl border ${isEditing ? 'border-blue-200 bg-white ring-2 ring-blue-50' : 'border-transparent bg-slate-50'} transition-all`} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Tên</label>
                <input disabled={!isEditing} value={isEditing ? formData.firstName : profile.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className={`w-full p-3 rounded-xl border ${isEditing ? 'border-blue-200 bg-white ring-2 ring-blue-50' : 'border-transparent bg-slate-50'} transition-all`} />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Địa chỉ Email</label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-transparent text-slate-500"><Mail size={18} /> {profile.email}</div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Số điện thoại</label>
                <input disabled={!isEditing} value={isEditing ? formData.phoneNumber : profile.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                  className={`w-full p-3 rounded-xl border ${isEditing ? 'border-blue-200 bg-white ring-2 ring-blue-50' : 'border-transparent bg-slate-50'}`} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Giới tính</label>
                <select disabled={!isEditing} value={isEditing ? formData.gender : profile.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
                  className={`w-full p-3 rounded-xl border ${isEditing ? 'border-blue-200 bg-white ring-2 ring-blue-50' : 'border-transparent bg-slate-50'}`}>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Lớp học & Khóa học</h3>
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <p className="text-xs text-indigo-600 font-bold uppercase mb-1">Mã số sinh viên</p>
              <p className="text-lg font-mono font-bold text-indigo-900">{profile.id.split('-')[0].toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL ĐỔI MẬT KHẨU - Theme Blue */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-blue-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700 font-bold"><KeyRound size={20} /> Đổi mật khẩu</div>
              <button onClick={() => setShowPassModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <input type="password" placeholder="Mật khẩu hiện tại" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={passData.oldPassword} onChange={e => setPassData({...passData, oldPassword: e.target.value})} />
              <div className="h-px bg-slate-50" />
              <input type="password" placeholder="Mật khẩu mới" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={passData.password} onChange={e => setPassData({...passData, password: e.target.value})} />
              <input type="password" placeholder="Xác nhận mật khẩu mới" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={passData.passwordConfirmation} onChange={e => setPassData({...passData, passwordConfirmation: e.target.value})} />
            </div>
            <div className="px-6 py-4 bg-slate-50 flex gap-3 justify-end">
              <button onClick={() => setShowPassModal(false)} className="px-4 py-2 font-bold text-slate-500">Hủy</button>
              <button onClick={handleChangePassword} disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-blue-200 shadow-lg disabled:opacity-50 flex items-center gap-2">
                {isSaving && <Loader size={14} className="animate-spin" />} Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}