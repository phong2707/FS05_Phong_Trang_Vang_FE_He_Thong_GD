import { Bell, Settings, LogOut, User } from 'lucide-react';

interface DashboardHeaderProps {
  userName?: string;
  role?: string;
}

export default function DashboardHeader({ userName = 'User', role = 'Admin' }: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{role} Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {userName}</p>
        </div>

        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <button className="relative text-gray-500 hover:text-gray-700">
            <Bell size={24} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="text-gray-500 hover:text-gray-700">
            <Settings size={24} />
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{role}</p>
            </div>
            <button className="text-gray-500 hover:text-gray-700 ml-2">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
