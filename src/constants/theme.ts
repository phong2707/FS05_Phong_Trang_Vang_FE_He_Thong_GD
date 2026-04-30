/**
 * Theme Configuration - Cấu hình toàn bộ giao diện
 * Sử dụng file này để đồng bộ màu sắc, font, kích thước giữa các trang
 */

// ==========================================
// 1. COLORS (Màu sắc chính)
// ==========================================
export const colors = {
  primary: '#0f766e',        // Teal - Màu chính
  primaryDark: '#0d6560',    // Teal đậm
  primaryLight: '#ccfbf1',   // Teal nhạt
  primaryMid: '#14b8a6',     // Teal trung bình

  secondary: '#059669',      // Emerald - Màu phụ
  secondaryLight: '#d1fae5', // Emerald nhạt

  accent: '#f59e0b',         // Amber - Màu nhấn
  accentDark: '#d97706',     // Amber đậm
  accentLight: '#fef3c7',    // Amber nhạt

  surface: '#ffffff',        // Nền trắng
  surfaceAlt: '#f8fafc',     // Nền xám nhạt
  surfaceBg: '#f0fdf9',      // Nền xanh rất nhạt

  textPrimary: '#0f172a',    // Text chính - đen nhạt
  textSecondary: '#475569',  // Text phụ - xám
  textMuted: '#94a3b8',      // Text muted - xám nhạt

  border: '#e2e8f0',         // Border - xám rất nhạt
  borderLight: 'rgba(255,255,255,0.4)', // Border light cho dark bg

  // Status colors
  success: '#10b981',        // Xanh lá
  warning: '#f59e0b',        // Vàng
  error: '#ef4444',          // Đỏ
  info: '#3b82f6',           // Xanh dương

  // Avatar gradients
  avatarGradient: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
};

// ==========================================
// 2. TYPOGRAPHY (Font chữ)
// ==========================================
export const typography = {
  family: {
    base: "'Segoe UI', system-ui, sans-serif",
  },
  size: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// ==========================================
// 3. SPACING & SIZES
// ==========================================
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
};

export const radius = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
};

// ==========================================
// 4. SHADOWS
// ==========================================
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Custom shadows
  primary: '0 4px 12px rgba(15,118,110,0.35)',
  accent: '0 4px 12px rgba(245,158,11,0.4)',
  success: '0 4px 12px rgba(16,185,129,0.3)',
  error: '0 4px 12px rgba(239,68,68,0.3)',
};

// ==========================================
// 5. TRANSITIONS
// ==========================================
export const transitions = {
  fast: 'all 0.15s ease',
  normal: 'all 0.2s ease',
  slow: 'all 0.3s ease',
  slower: 'all 0.5s ease',
};

// ==========================================
// 6. BREAKPOINTS (Responsive)
// ==========================================
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ==========================================
// 7. BUTTON STYLES (Các kiểu nút)
// ==========================================
export const buttonStyles = {
  primary: {
    background: colors.primary,
    color: 'white',
    hover: {
      background: colors.primaryDark,
      boxShadow: shadows.primary,
    },
  },
  accent: {
    background: colors.accent,
    color: '#1c1917',
    hover: {
      background: colors.accentDark,
      boxShadow: shadows.accent,
    },
  },
  secondary: {
    background: colors.secondary,
    color: 'white',
    hover: {
      background: '#047857',
      boxShadow: shadows.success,
    },
  },
  ghost: {
    background: 'rgba(255,255,255,0.12)',
    color: 'white',
    border: '1.5px solid rgba(255,255,255,0.35)',
    hover: {
      background: 'rgba(255,255,255,0.22)',
    },
  },
};

// ==========================================
// 8. BADGE STYLES (Các kiểu badge)
// ==========================================
export const badgeStyles = {
  teal: {
    background: colors.primaryLight,
    color: colors.primary,
  },
  emerald: {
    background: colors.secondaryLight,
    color: colors.secondary,
  },
  amber: {
    background: colors.accentLight,
    color: colors.accentDark,
  },
  blue: {
    background: '#dbeafe',
    color: '#1e40af',
  },
  red: {
    background: '#fee2e2',
    color: '#dc2626',
  },
  green: {
    background: '#dcfce7',
    color: '#16a34a',
  },
  purple: {
    background: '#f3e8ff',
    color: '#9333ea',
  },
};

// ==========================================
// 9. CARD STYLES (Các kiểu thẻ)
// ==========================================
export const cardStyles = {
  default: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    boxShadow: shadows.md,
  },
  hover: {
    transform: 'translateY(-4px)',
    boxShadow: shadows.xl,
    transition: transitions.normal,
  },
  bordered: {
    borderLeft: `4px solid ${colors.primary}`,
  },
};

// ==========================================
// 10. GRADIENT BACKGROUNDS
// ==========================================
export const gradients = {
  heroGradient: 'linear-gradient(135deg, #0f766e 0%, #0e7490 50%, #065f46 100%)',
  newsletterGradient: 'linear-gradient(135deg, #0f766e 0%, #0e7490 60%, #1e3a5f 100%)',
  primaryGradient: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
  accentGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
};

// ==========================================
// 11. STATUS STYLES
// ==========================================
export const statusStyles = {
  ACTIVE: {
    background: '#dcfce7',
    text: '#166534',
    badge: '#16a34a',
    label: 'Hoạt động',
  },
  PENDING: {
    background: '#fef3c7',
    text: '#92400e',
    badge: '#eab308',
    label: 'Đang chờ duyệt',
  },
  INACTIVE: {
    background: '#fee2e2',
    text: '#991b1b',
    badge: '#dc2626',
    label: 'Không hoạt động',
  },
};

// ==========================================
// 12. FEATURE COLORS (Màu cho từng vai trò)
// ==========================================
export const featureColors = {
  admin: {
    color: colors.primary,
    light: colors.primaryLight,
    icon: 'text-teal-600',
  },
  teacher: {
    color: colors.secondary,
    light: colors.secondaryLight,
    icon: 'text-emerald-600',
  },
  student: {
    color: colors.accent,
    light: colors.accentLight,
    icon: 'text-amber-600',
  },
};

// ==========================================
// 13. ANIMATION & EFFECTS
// ==========================================
export const effects = {
  // Pulse animation
  pulseAnimation: `@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }`,

  // Fade in animation
  fadeInAnimation: `@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }`,

  // Slide in animation
  slideInAnimation: `@keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }`,
};

// ==========================================
// 14. DEFAULT THEME CONFIG
// ==========================================
export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitions,
  breakpoints,
  buttonStyles,
  badgeStyles,
  cardStyles,
  gradients,
  statusStyles,
  featureColors,
  effects,
};

export default theme;
