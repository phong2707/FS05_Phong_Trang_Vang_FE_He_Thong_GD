/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Mail, Phone, MapPin, User,
  AlertCircle, Loader, Edit3, KeyRound,
  CheckCircle, Clock, Shield, X, Save, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  fullName: string;
  avatarUrl?: string;
  phoneNumber?: string;
  address?: string;
  gender?: string;
  status: string;
  createdAt: string;
  roles: Array<{
    id: string;
    code: string;
    name: string;
  }>;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return { bg: 'bg-teal-100', text: 'text-teal-700', dot: 'bg-teal-500' };
    case 'PENDING':
      return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
    case 'INACTIVE':
      return { bg: 'bg-stone-100', text: 'text-stone-500', dot: 'bg-stone-400' };
    default:
      return { bg: 'bg-stone-100', text: 'text-stone-500', dot: 'bg-stone-400' };
  }
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: 'Hoạt động',
  PENDING: 'Đang chờ duyệt',
  INACTIVE: 'Không hoạt động',
};

export default function TeacherProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassModal, setShowPassModal] = useState(false);
  const [passData, setPassData] = useState({ oldPassword: '', password: '', passwordConfirmation: '' });
  
  // States cho chức năng chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      if (response?.success && response.user) {
        setProfile(response.user);
        setError(null);
      } else {
        setError(response?.error || 'Không thể tải thông tin profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (!profile) return;
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      middleName: profile.middleName || '',
      phoneNumber: profile.phoneNumber || '',
      address: profile.address || '',
      gender: profile.gender || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await authService.updateProfile(formData); 
      if (response?.success) {
        setProfile((prev) => prev ? { 
          ...prev, 
          ...formData, 
          fullName: `${formData.firstName} ${formData.lastName}` 
        } as UserProfile : null);
        setIsEditing(false);
        setError(null);
      } else {
        setError(response?.error || 'Cập nhật thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối khi cập nhật');
    } finally {
      setIsSaving(false);
    }
  };

// 1. Sửa lại hàm handleChangePassword hiện có
const handleChangePassword = async () => {
  // Kiểm tra tính hợp lệ của dữ liệu
  if (!passData.oldPassword || !passData.password || !passData.passwordConfirmation) {
    alert("Vui lòng nhập đầy đủ các trường thông tin");
    return;
  }

  if (passData.password !== passData.passwordConfirmation) {
    alert("Mật khẩu mới và xác nhận mật khẩu không khớp");
    return;
  }

  try {
    setIsSaving(true); // Dùng chung state loading với update profile hoặc tạo mới
    const response = await authService.changePassword(passData);
    
    if (response.success) {
      alert("Đổi mật khẩu thành công!");
      setShowPassModal(false); // Đóng modal
      setPassData({ oldPassword: '', password: '', passwordConfirmation: '' }); // Reset form
    } else {
      alert(response.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.");
    }
  } catch (err) {
    alert("Có lỗi xảy ra trong quá trình đổi mật khẩu");
  } finally {
    setIsSaving(false);
  }
};

// 2. Hàm để cập nhật input trong modal
const handlePassInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setPassData(prev => ({ ...prev, [name]: value }));
};
  const handleLogout = async () => {
    await authService.logout('/teacher/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-10 h-10 text-teal-600 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Đang tải thông tin profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-3 max-w-lg">
        <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800">Thông báo</p>
          <p className="text-xs text-amber-700 mt-1">{error || 'Lỗi không xác định'}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-xs font-semibold text-amber-800 underline hover:opacity-75 transition">
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  const statusStyle = getStatusStyle(profile.status);
  const statusLabel = STATUS_LABEL[profile.status] || profile.status;
  const roleNames = profile.roles.map(r => r.name).join(', ') || 'Chưa có vai trò';
  const joinDate = new Date(profile.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-teal-500 to-emerald-500" />
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative flex-shrink-0">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.fullName} className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center shadow-inner">
                <User className="w-12 h-12 text-teal-600" />
              </div>
            )}
            <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${statusStyle.dot}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <input 
                      className="text-2xl font-bold text-gray-900 border-b-2 border-teal-500 outline-none w-32"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Họ"
                    />
                    <input 
                      className="text-2xl font-bold text-gray-900 border-b-2 border-teal-500 outline-none w-32"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="Tên"
                    />
                  </div>
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
                )}
                
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {statusLabel}
                  </span>
                  {profile.roles.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-semibold">
                      <Shield size={11} />
                      {roleNames}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Clock size={11} /> Tham gia {joinDate}
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition shadow-sm disabled:opacity-50"
                    >
                      {isSaving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                      Lưu
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-stone-100 transition"
                    >
                      <X size={14} /> Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleEditClick}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition shadow-sm"
                    >
                      <Edit3 size={14} /> Chỉnh sửa
                    </button>
<button
  onClick={() => setShowPassModal(true)} // Sửa từ handleChangePassword thành setShowPassModal(true)
  className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-stone-100 transition"
>
  <KeyRound size={14} /> Đổi mật khẩu
</button>
                    {/* Nút logout bổ sung trong profile (tùy chọn) */}
                    <button
                      onClick={handleLogout}
                      className="sm:hidden inline-flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition"
                    >
                      <LogOut size={14} /> Thoát
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Thông tin cá nhân</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-stone-200 rounded-lg bg-white">
              <div className="w-11 h-11 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0"><Mail className="text-teal-600" size={20} /></div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-medium">Email (Không thể thay đổi)</p>
                <p className="text-sm font-semibold text-gray-900 break-all">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-stone-200 rounded-lg bg-white">
              <div className="w-11 h-11 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0"><Phone className="text-emerald-600" size={20} /></div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-medium">Số điện thoại</p>
                {isEditing ? (
                  <input 
                    className="w-full text-sm font-semibold text-gray-900 border-b border-teal-500 outline-none"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{profile.phoneNumber || 'Chưa cập nhật'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-stone-200 rounded-lg bg-white">
              <div className="w-11 h-11 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0"><MapPin className="text-amber-600" size={20} /></div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-medium">Địa chỉ</p>
                {isEditing ? (
                  <input 
                    className="w-full text-sm font-semibold text-gray-900 border-b border-teal-500 outline-none"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{profile.address || 'Chưa cập nhật'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div className="bg-stone-50 border border-stone-100 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">Giới tính</p>
              {isEditing ? (
                <select 
                  className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              ) : (
                <p className="text-sm font-semibold text-gray-900">
                  {profile.gender === 'MALE' ? 'Nam' : profile.gender === 'FEMALE' ? 'Nữ' : profile.gender || '—'}
                </p>
              )}
            </div>
            <div className="bg-stone-50 border border-stone-100 rounded-lg p-4 min-w-0">
              <p className="text-xs text-gray-400 mb-1">Mã thành viên</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{profile.id.substring(0, 8)}...</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Vai trò hệ thống</h2>
            <div className="space-y-3">
              {profile.roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 border border-stone-200 rounded-lg bg-white">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center"><Shield size={14} className="text-teal-600" /></div>
                    <span className="text-sm font-semibold text-gray-900">{role.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg flex items-start space-x-3">
            <CheckCircle className="text-teal-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-sm font-medium text-teal-800">Thông tin hồ sơ</p>
              <p className="text-xs text-teal-700 mt-1">Cập nhật thông tin chính xác giúp học sinh và đồng nghiệp dễ dàng nhận diện bạn trên hệ thống.</p>
            </div>
          </div>
        </div>
      </div>
      {/* MODAL ĐỔI MẬT KHẨU */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-teal-50">
              <div className="flex items-center gap-2 text-teal-700">
                <KeyRound size={20} />
                <h3 className="font-bold">Đổi mật khẩu</h3>
              </div>
              <button 
                onClick={() => setShowPassModal(false)}
                className="text-stone-400 hover:text-stone-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passData.oldPassword}
                  onChange={handlePassInputChange}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              <div className="h-px bg-stone-100 my-2" />

              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  name="password"
                  value={passData.password}
                  onChange={handlePassInputChange}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                  placeholder="Tối thiểu 6 ký tự"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  name="passwordConfirmation"
                  value={passData.passwordConfirmation}
                  onChange={handlePassInputChange}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 bg-stone-50 flex gap-3 justify-end">
              <button
                onClick={() => setShowPassModal(false)}
                className="px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-200 rounded-lg transition"
              >
                Hủy
              </button>
              <button
                onClick={handleChangePassword}
                disabled={isSaving}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving && <Loader size={14} className="animate-spin" />}
                Cập nhật mật khẩu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}