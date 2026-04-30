/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Mail, Phone, MapPin, User, Badge,
  AlertCircle, Loader, Edit3, KeyRound,
  CheckCircle, Clock, Shield,
} from 'lucide-react';
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

interface ProfileResponse {
  success: boolean;
  user: UserProfile;
}

// Đồng bộ màu status với palette teal/emerald/amber của dự án
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Loading — dùng bg-stone-50 giống các trang dashboard
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

  // Error — dùng alert box giống AdminDashboard / TeacherDashboard
  if (error || !profile) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-3 max-w-lg">
        <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800">Không thể tải profile</p>
          <p className="text-xs text-amber-700 mt-1">{error || 'Lỗi không xác định'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-xs font-semibold text-amber-800 underline hover:opacity-75 transition"
          >
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

      {/* Profile Header Card — đồng bộ rounded-lg shadow-md như các trang khác */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Top accent strip — dùng teal giống TeacherDashboard */}
        <div className="h-2 w-full bg-gradient-to-r from-teal-500 to-emerald-500" />

        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center shadow-inner">
                <User className="w-12 h-12 text-teal-600" />
              </div>
            )}
            {/* Status dot */}
            <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${statusStyle.dot}`} />
          </div>

          {/* Name & badges */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {/* Status badge */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {statusLabel}
                  </span>
                  {/* Role badge */}
                  {profile.roles.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-semibold">
                      <Shield size={11} />
                      {roleNames}
                    </span>
                  )}
                </div>
                {/* Join date */}
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Clock size={11} /> Tham gia {joinDate}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition shadow-sm">
                  <Edit3 size={14} /> Chỉnh sửa
                </button>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-stone-100 transition">
                  <KeyRound size={14} /> Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid — 2 col giống pattern dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Contact Details — chiếm 2/3 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Thông tin liên hệ</h2>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-4 p-4 border border-stone-200 rounded-lg hover:shadow-sm transition bg-white">
              <div className="w-11 h-11 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="text-teal-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Email</p>
                <p className="text-sm font-semibold text-gray-900 break-all">{profile.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4 p-4 border border-stone-200 rounded-lg hover:shadow-sm transition bg-white">
              <div className="w-11 h-11 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="text-emerald-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Số điện thoại</p>
                <p className="text-sm font-semibold text-gray-900">
                  {profile.phoneNumber || <span className="text-gray-400 font-normal italic">Chưa cập nhật</span>}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-4 p-4 border border-stone-200 rounded-lg hover:shadow-sm transition bg-white">
              <div className="w-11 h-11 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="text-amber-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Địa chỉ</p>
                <p className="text-sm font-semibold text-gray-900">
                  {profile.address || <span className="text-gray-400 font-normal italic">Chưa cập nhật</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Additional info grid */}
          <div className="grid grid-cols-3 gap-4 mt-5">
            <div className="bg-stone-50 border border-stone-100 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">Giới tính</p>
              <p className="text-sm font-semibold text-gray-900">
                {profile.gender === 'MALE' ? 'Nam' : profile.gender === 'FEMALE' ? 'Nữ' : profile.gender || '—'}
              </p>
            </div>
            <div className={`${statusStyle.bg} border rounded-lg p-4`} style={{ borderColor: 'transparent' }}>
              <p className="text-xs text-gray-400 mb-1">Trạng thái</p>
              <p className={`text-sm font-semibold ${statusStyle.text}`}>{statusLabel}</p>
            </div>
            <div className="bg-stone-50 border border-stone-100 rounded-lg p-4 min-w-0">
              <p className="text-xs text-gray-400 mb-1">Mã thành viên</p>
              <p className="text-sm font-semibold text-gray-900 truncate" title={profile.id}>
                {profile.id.substring(0, 8)}...
              </p>
            </div>
          </div>
        </div>

        {/* Roles & Alert — chiếm 1/3 */}
        <div className="space-y-6">

          {/* Roles card */}
          {profile.roles.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Vai trò</h2>
              <div className="space-y-3">
                {profile.roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-3 border border-stone-200 rounded-lg bg-white hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Shield size={14} className="text-teal-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{role.name}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full font-mono">
                      {role.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alert box — giống TeacherDashboard reminder */}
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg flex items-start space-x-3">
            <CheckCircle className="text-teal-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-sm font-medium text-teal-800">Hồ sơ của bạn</p>
              <p className="text-xs text-teal-700 mt-1">
                Hãy cập nhật đầy đủ thông tin để giúp học sinh dễ dàng liên hệ với bạn.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}