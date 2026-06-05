import {
  LayoutGrid,
  Users,
  Shield,
  BookOpen,
  DollarSign,
} from 'lucide-react';

export const adminMenuItems = [
  { 
    label: 'Dashboard', 
    icon: LayoutGrid, 
    href: '/admin' 
  },
  { 
    label: 'Users', 
    icon: Users, 
    href: '/admin/users' 
  },
  { 
    label: 'Roles & Permissions', 
    icon: Shield, 
    href: '/admin/roles' 
  },
  { 
    label: 'Courses', 
    icon: BookOpen, 
    href: '/admin/courses' 
  },
  { 
    label: 'Revenue & Transactions', 
    icon: DollarSign, 
    href: '/admin/revenue' 
  },
];
