/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Bell, Settings, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // Gọi API lấy thông tin User ngay khi Header được render
  useEffect(() => {
    const fetchUser = async () => {
      const response = await authService.getProfile();
      if (response?.success && response.user) {
        setUser(response.user);
      }
    };
    fetchUser();
  }, []);

  // Nếu chưa load xong thông tin, hiển thị khung trống giữ chỗ (tránh giật UI)
  if (!user) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 h-[89px]"></header>
    );
  }

  // 1. Xác định cấu hình UI & Đường dẫn dựa trên Role
  let roleConfig = {
    roleName: "Người dùng",
    loginPath: "/",
    profilePath: "/",
    color: "bg-gray-600",
  };

  if (authService.isAdmin(user)) {
    roleConfig = {
      roleName: "Admin",
      loginPath: "/login/admin",
      profilePath: "", // Bám sát yêu cầu: Admin không có trang profile
      color: "bg-slate-900", // Tone trầm
    };
  } else if (authService.isTeacher(user)) {
    roleConfig = {
      roleName: "Giáo viên",
      loginPath: "/login/teacher",
      profilePath: "/profile",
      color: "bg-teal-600", // Xanh ngọc
    };
  } else if (authService.isStudent(user)) {
    roleConfig = {
      roleName: "Sinh viên",
      loginPath: "/login/student",
      profilePath: "/profile",
      color: "bg-indigo-600", // Xanh dương
    };
  }

  // 2. Format tên hiển thị (Ưu tiên: Họ Tên -> Email)
  const displayName =
    user.lastName && user.firstName
      ? `${user.lastName} ${user.firstName}`
      : user.email;

  // 3. Xử lý các sự kiện click
  const handleAvatarClick = () => {
    // Chỉ điều hướng nếu role đó có trang profile
    if (roleConfig.profilePath) {
      navigate(roleConfig.profilePath);
    }
  };

  const handleLogout = async () => {
    // Đăng xuất và đá về trang đăng nhập của đúng Role đó
    await authService.logout(roleConfig.loginPath);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Tiêu đề Trái */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {roleConfig.roleName} Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Chào mừng trở lại, {displayName}
          </p>
        </div>

        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <button className="relative text-gray-500 hover:text-gray-700 transition">
            <Bell size={24} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="text-gray-500 hover:text-gray-700 transition">
            <Settings size={24} />
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
            <button
              onClick={handleAvatarClick}
              className={`w-10 h-10 ${roleConfig.color} rounded-full flex items-center justify-center text-white hover:opacity-80 transition ${!roleConfig.profilePath ? "cursor-default" : "cursor-pointer"}`}
              title={roleConfig.profilePath ? "Xem hồ sơ" : ""}
            >
              {/* Hiển thị Avatar ảnh nếu có, không có thì dùng Icon */}
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User size={20} />
              )}
            </button>

            <div>
              <p className="text-sm font-medium text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500">{roleConfig.roleName}</p>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 ml-2 transition-colors"
              title="Đăng xuất"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
