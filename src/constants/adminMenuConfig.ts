import {
  LayoutGrid,
  Users,
  Shield,
  BookOpen,
  DollarSign,
  UsersRound,
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
    label: 'Class Groups', 
    icon: UsersRound, 
    href: '/admin/class-groups' 
  },
  { 
    label: 'Revenue & Transactions', 
    icon: DollarSign, 
    href: '/admin/revenue' 
  },
];
