# 📚 Hướng dẫn Cấu trúc Frontend - LMS (Learning Management System)

## 📋 Mục lục
1. [Giới thiệu](#giới-thiệu)
2. [Cấu trúc Thư mục](#cấu-trúc-thư-mục)
3. [Các Component Chính](#các-component-chính)
4. [Hướng dẫn Kết nối Backend](#hướng-dẫn-kết-nối-backend)
5. [Best Practices](#best-practices)

---

## 🎯 Giới thiệu

Frontend LMS được xây dựng với:
- **React 19.2.5** + **TypeScript 6.0**
- **Tailwind CSS 4.2** cho styling
- **React Router 7.14** cho navigation
- **Zustand 5.0** cho state management
- **Axios 1.15** cho API communication
- **Vite 8.0** làm build tool

---

## 📁 Cấu trúc Thư mục

```
frontend/
├── src/
│   ├── App.tsx                    # Component chính
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # CSS global
│   │
│   ├── pages/                     # 📄 Các trang chính
│   │   └── HomePage.tsx           # Trang chủ LMS
│   │
│   ├── components/                # 🧩 Components tái sử dụng
│   │   ├── Header.tsx             # Header (Logo, Navigation, Auth buttons)
│   │   ├── Footer.tsx             # Footer
│   │   ├── HeroSection.tsx        # Banner chính
│   │   ├── FeaturedCourses.tsx    # Danh sách khóa học nổi bật
│   │   ├── CourseCard.tsx         # Thẻ khóa học
│   │   ├── AboutUsSection.tsx     # Phần giới thiệu
│   │   └── index.ts               # Export tất cả components
│   │
│   ├── assets/                    # 🖼️ Hình ảnh, icon, font
│   │   ├── react.svg
│   │   ├── vite.svg
│   │   └── hero.png
│   │
│   ├── services/                  # 🔌 API services
│   │   ├── api.ts                 # Cấu hình axios (cần tạo)
│   │   ├── courseService.ts       # Gọi API khóa học (cần tạo)
│   │   ├── authService.ts         # Gọi API authentication (cần tạo)
│   │   └── userService.ts         # Gọi API user (cần tạo)
│   │
│   ├── store/                     # 📦 State Management (Zustand)
│   │   ├── authStore.ts           # Store cho authentication (cần tạo)
│   │   ├── courseStore.ts         # Store cho khóa học (cần tạo)
│   │   └── userStore.ts           # Store cho user info (cần tạo)
│   │
│   ├── hooks/                     # 🎣 Custom React Hooks
│   │   ├── useAuth.ts             # Hook auth (cần tạo)
│   │   ├── useCourses.ts          # Hook khóa học (cần tạo)
│   │   └── useFetch.ts            # Hook fetch data (cần tạo)
│   │
│   ├── types/                     # 🏷️ TypeScript types
│   │   ├── course.ts              # Types khóa học (cần tạo)
│   │   ├── user.ts                # Types user (cần tạo)
│   │   └── auth.ts                # Types authentication (cần tạo)
│   │
│   ├── utils/                     # 🛠️ Utilities
│   │   ├── helpers.ts             # Các hàm helper (cần tạo)
│   │   ├── validators.ts          # Form validation (cần tạo)
│   │   └── constants.ts           # Constants (cần tạo)
│   │
│   ├── contexts/                  # 🌐 React Context (nếu cần)
│   │   └── AuthContext.tsx        # Auth context (tùy chọn)
│   │
│   └── routes/                    # 🛣️ Router configuration
│       └── index.tsx              # Route definitions (cần tạo)
│
├── public/
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
└── README_CẤUTRÚC.md             # File này

```

---

## 🧩 Các Component Chính

### 1️⃣ **Header.tsx**
**Mục đích**: Thanh điều hướng chính

**Props**: Không có
```typescript
<Header />
```

**Chức năng**:
- Logo LMS với link về home
- 3 link navigation: Trang chủ, Khóa học, Giới thiệu
- Dropdown menu Đăng nhập (Sinh viên / Giáo viên)
- Dropdown menu Đăng ký (Sinh viên / Giáo viên)

**Cải tiến khi kết nối BE**:
```typescript
// Thêm xử lý đăng nhập
const handleStudentLogin = async () => {
  // Navigate đến trang login sinh viên
  navigate('/login/student');
};

// Lấy user info từ store và hiển thị avatar
import { useAuthStore } from '@/store/authStore';

const { user, isAuthenticated } = useAuthStore();
if (isAuthenticated) {
  // Hiển thị avatar + dropdown menu user
}
```

---

### 2️⃣ **HeroSection.tsx**
**Mục đích**: Banner chính trang chủ

**Chức năng**:
- Tiêu đề lớn: "Học tập không giới hạn, Tương lai vô tận"
- Nút CTA: "Xem khóa học ngay" và "Tìm hiểu thêm"
- Hình minh họa bên phải
- Hiển thị stats: 10K+ học viên, 500+ khóa học, etc.

**Cải tiến khi kết nối BE**:
```typescript
// Fetch stats từ backend
import { useEffect, useState } from 'react';
import { courseService } from '@/services/courseService';

const [stats, setStats] = useState({ 
  students: 0, 
  courses: 0, 
  teachers: 0 
});

useEffect(() => {
  const fetchStats = async () => {
    try {
      const data = await courseService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  fetchStats();
}, []);
```

---

### 3️⃣ **CourseCard.tsx**
**Mục đích**: Thẻ hiển thị thông tin 1 khóa học

**Props**:
```typescript
interface CourseCardProps {
  id: string;
  image: string;
  title: string;
  instructor: string;
  price: number;
  status?: 'pending' | 'active' | 'completed';
}
```

**Cải tiến khi kết nối BE**:
```typescript
const handleViewDetails = () => {
  // Navigate đến chi tiết khóa học
  navigate(`/courses/${id}`);
};

const handleEnroll = async () => {
  // Gọi API enroll
  try {
    await courseService.enrollCourse(id);
    toast.success('Đăng ký khóa học thành công!');
  } catch (error) {
    toast.error('Lỗi đăng ký khóa học');
  }
};
```

---

### 4️⃣ **FeaturedCourses.tsx**
**Mục đích**: Hiển thị danh sách khóa học nổi bật

**Cải tiến khi kết nối BE**:
```typescript
import { useEffect, useState } from 'react';
import { courseService } from '@/services/courseService';

export const FeaturedCourses: React.FC = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getFeaturedCourses();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi tải khóa học');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <section className="py-16 bg-gray-50">
      {/* ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </section>
  );
};
```

---

### 5️⃣ **AboutUsSection.tsx**
**Mục đích**: Phần giới thiệu về LMS

**Chức năng**:
- Hình ảnh trung tâm bên trái
- Văn bản giới thiệu bên phải
- Hiển thị 4 điểm nổi bật

**Cải tiến khi kết nối BE**:
```typescript
// Fetch thông tin về trung tâm từ backend
import { settingService } from '@/services/settingService';

const [aboutData, setAboutData] = useState(null);

useEffect(() => {
  const fetchAbout = async () => {
    try {
      const data = await settingService.getAboutInfo();
      setAboutData(data);
    } catch (error) {
      console.error('Error fetching about info:', error);
    }
  };
  fetchAbout();
}, []);
```

---

### 6️⃣ **HomePage.tsx**
**Mục đích**: Trang chủ chính

**Cấu trúc**:
```typescript
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCourses />
        <AboutUsSection />
      </main>
      <Footer />
    </div>
  );
}
```

---

## 🔌 Hướng dẫn Kết nối Backend

### Bước 1️⃣: Cấu hình Axios

Tạo file `src/services/api.ts`:

```typescript
import axios, { AxiosInstance } from 'axios';

// Lấy base URL từ environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Thêm token vào mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Xử lý response lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn, đăng xuất
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**File `.env.local`**:
```
VITE_API_URL=http://localhost:3000/api
```

---

### Bước 2️⃣: Tạo API Services

Tạo file `src/services/courseService.ts`:

```typescript
import api from './api';

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  price: number;
  students: number;
  status: 'pending' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const courseService = {
  // Lấy danh sách khóa học nổi bật
  getFeaturedCourses: async (limit: number = 4): Promise<Course[]> => {
    try {
      const response = await api.get<ApiResponse<Course[]>>(
        `/courses/featured?limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching featured courses:', error);
      throw error;
    }
  },

  // Lấy tất cả khóa học
  getAllCourses: async (page: number = 1, limit: number = 10): Promise<{
    courses: Course[];
    total: number;
    pages: number;
  }> => {
    try {
      const response = await api.get<ApiResponse<{
        courses: Course[];
        total: number;
        pages: number;
      }>>(`/courses?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching all courses:', error);
      throw error;
    }
  },

  // Lấy chi tiết 1 khóa học
  getCourseById: async (id: string): Promise<Course> => {
    try {
      const response = await api.get<ApiResponse<Course>>(`/courses/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  },

  // Đăng ký khóa học
  enrollCourse: async (courseId: string): Promise<{ message: string }> => {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        `/courses/${courseId}/enroll`,
        {}
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error enrolling course ${courseId}:`, error);
      throw error;
    }
  },

  // Lấy stats
  getStats: async (): Promise<{
    totalStudents: number;
    totalCourses: number;
    totalTeachers: number;
  }> => {
    try {
      const response = await api.get<ApiResponse<{
        totalStudents: number;
        totalCourses: number;
        totalTeachers: number;
      }>>(`/stats`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },
};
```

---

Tạo file `src/services/authService.ts`:

```typescript
import api from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'teacher' | 'admin';
    avatar?: string;
  };
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const authService = {
  // Đăng nhập
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>(
        '/auth/login',
        payload
      );
      const { token, user } = response.data.data;
      
      // Lưu token vào localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Đăng ký
  register: async (payload: RegisterPayload): Promise<{ message: string }> => {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>(
        '/auth/register',
        payload
      );
      return response.data.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  // Đăng xuất
  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async (): Promise<LoginResponse['user']> => {
    try {
      const response = await api.get<ApiResponse<LoginResponse['user']>>(
        '/auth/me'
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },
};
```

---

### Bước 3️⃣: Tạo Zustand Store

Tạo file `src/store/authStore.ts`:

```typescript
import { create } from 'zustand';
import { authService, LoginResponse } from '@/services/authService';

interface AuthState {
  user: LoginResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await authService.login({ email, password });
      set({ token, user, isAuthenticated: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
    set({ isLoading: false });
  },

  logout: () => {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      set({ 
        token, 
        user: JSON.parse(user), 
        isAuthenticated: true 
      });
    }
  },
}));
```

---

Tạo file `src/store/courseStore.ts`:

```typescript
import { create } from 'zustand';
import { courseService, Course } from '@/services/courseService';

interface CourseState {
  courses: Course[];
  featuredCourses: Course[];
  selectedCourse: Course | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchFeaturedCourses: () => Promise<void>;
  fetchAllCourses: (page: number, limit: number) => Promise<void>;
  fetchCourseById: (id: string) => Promise<void>;
  enrollCourse: (courseId: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  featuredCourses: [],
  selectedCourse: null,
  isLoading: false,
  error: null,

  fetchFeaturedCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await courseService.getFeaturedCourses();
      set({ featuredCourses: data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch courses';
      set({ error: errorMessage });
    }
    set({ isLoading: false });
  },

  fetchAllCourses: async (page, limit) => {
    set({ isLoading: true, error: null });
    try {
      const data = await courseService.getAllCourses(page, limit);
      set({ courses: data.courses });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch courses';
      set({ error: errorMessage });
    }
    set({ isLoading: false });
  },

  fetchCourseById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await courseService.getCourseById(id);
      set({ selectedCourse: data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch course';
      set({ error: errorMessage });
    }
    set({ isLoading: false });
  },

  enrollCourse: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      await courseService.enrollCourse(courseId);
      // Cập nhật UI hoặc refetch data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to enroll course';
      set({ error: errorMessage });
    }
    set({ isLoading: false });
  },
}));
```

---

### Bước 4️⃣: Tạo Custom Hooks

Tạo file `src/hooks/useCourses.ts`:

```typescript
import { useEffect, useState } from 'react';
import { useCourseStore } from '@/store/courseStore';

export const useCourses = () => {
  const { 
    courses, 
    featuredCourses, 
    isLoading, 
    error, 
    fetchFeaturedCourses,
    fetchAllCourses 
  } = useCourseStore();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  const loadMoreCourses = () => {
    setPage(page + 1);
    fetchAllCourses(page + 1, limit);
  };

  return {
    courses,
    featuredCourses,
    isLoading,
    error,
    page,
    setPage,
    loadMoreCourses,
  };
};
```

Tạo file `src/hooks/useAuth.ts`:

```typescript
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
};
```

---

### Bước 5️⃣: Cập nhật Components để dùng Services

**Ví dụ: FeaturedCourses.tsx cập nhật**

```typescript
import { useEffect } from 'react';
import { useCourseStore } from '@/store/courseStore';
import { CourseCard } from '@/components/CourseCard.tsx';

export const FeaturedCourses: React.FC = () => {
  const { featuredCourses, isLoading, error, fetchFeaturedCourses } = useCourseStore();

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="text-gray-600 mt-4">Đang tải khóa học...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            ❌ {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Khóa học Nổi bật
          </h2>
          <p className="text-lg text-gray-600">
            Khám phá những khóa học được yêu thích nhất từ các giáo viên hàng đầu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/courses"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xem tất cả khóa học
          </a>
        </div>
      </div>
    </section>
  );
};
```

---

## ✨ Best Practices

### 1️⃣ **Error Handling**
```typescript
try {
  const data = await courseService.getFeaturedCourses();
  setCourses(data);
} catch (error) {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) {
      // Unauthorized - chuyển đến login
      navigate('/login');
    } else if (error.response?.status === 403) {
      // Forbidden
      setError('Bạn không có quyền truy cập');
    }
  }
  setError(error instanceof Error ? error.message : 'Lỗi không xác định');
}
```

### 2️⃣ **Loading States**
```typescript
if (isLoading) return <div>Đang tải...</div>;
if (error) return <div className="text-red-500">Lỗi: {error}</div>;
return <YourComponent data={data} />;
```

### 3️⃣ **Sử dụng Environment Variables**
```typescript
// .env.local
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=LMS

// Sử dụng
const apiUrl = import.meta.env.VITE_API_URL;
```

### 4️⃣ **Type Safety**
```typescript
// Luôn khai báo types rõ ràng
interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
}

// Sử dụng trong component
const handleUserAction = (user: User) => {
  // TypeScript sẽ kiểm tra loại user
};
```

### 5️⃣ **Reusable Components**
```typescript
// ✅ Tốt - Flexible, reusable
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  loading = false,
}) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`...`}
  >
    {loading ? 'Đang xử lý...' : label}
  </button>
);
```

### 6️⃣ **Tối ưu Performance**
```typescript
// Sử dụng useCallback để memoize function
import { useCallback } from 'react';

const handleEnroll = useCallback(async (courseId: string) => {
  await courseService.enrollCourse(courseId);
}, []);

// Sử dụng React.memo cho components
export const CourseCard = React.memo(({ course }: CourseCardProps) => (
  // Component
));
```

---

## 📚 Tóm tắt Quy trình Kết nối Backend

```
1. Tạo services (api.ts, courseService.ts, authService.ts)
           ↓
2. Tạo stores Zustand (authStore.ts, courseStore.ts)
           ↓
3. Tạo custom hooks (useAuth.ts, useCourses.ts)
           ↓
4. Cập nhật components để sử dụng hooks và stores
           ↓
5. Test toàn bộ flow từ Frontend → Backend
           ↓
6. Deploy và monitoring
```

---

## 🔗 Thông tin liên hệ Backend

**API Base URL**: `http://localhost:3000/api`
**Endpoints chính**:
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `GET /courses/featured` - Lấy khóa học nổi bật
- `GET /courses` - Lấy tất cả khóa học
- `GET /courses/:id` - Chi tiết khóa học
- `POST /courses/:id/enroll` - Đăng ký khóa học
- `GET /stats` - Lấy thống kê

---

**Happy Coding! 🚀**
