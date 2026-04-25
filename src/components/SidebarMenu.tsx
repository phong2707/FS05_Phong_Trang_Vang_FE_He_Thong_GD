import type { LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: number;
}

interface SidebarMenuProps {
  items: MenuItem[];
  isCollapsed?: boolean;
}

export default function SidebarMenu({ items, isCollapsed = false }: SidebarMenuProps) {
  const location = useLocation();

  return (
    <nav className="space-y-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Icon size={20} />
            {!isCollapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
