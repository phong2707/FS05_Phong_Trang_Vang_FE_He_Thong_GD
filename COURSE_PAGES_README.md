# LMS Course Pages Documentation

## Overview
Tôi đã tạo 3 trang hiển thị khóa học cho hệ thống LMS (Learning Management System) sử dụng React, TypeScript, Tailwind CSS, và Lucide React icons.

## 📁 File Structure

```
frontend/src/
├── data/
│   └── mockCourses.ts           # Mock dữ liệu 5 khóa học mẫu
├── components/
│   ├── CourseCard.tsx           # Component hiển thị card khóa học (reusable)
│   └── CourseFilter.tsx         # Component sidebar lọc khóa học (reusable)
├── pages/
│   ├── CoursesPage.tsx          # Trang danh sách tất cả khóa học
│   ├── CourseDetailPage.tsx     # Trang chi tiết khóa học
│   └── UpcomingCoursesPage.tsx  # Trang khóa học sắp khai giảng
└── routes/
    └── AppRoutes.tsx             # (Updated) Thêm routes cho 3 trang mới
```

## 🎯 3 Trang Chính

### 1️⃣ CoursesPage.tsx (`/courses`)
**Chức năng:** Hiển thị danh sách TẤT CẢ khóa học
- **Layout:** Sidebar lọc (trái) + Grid khóa học (phải)
- **Sidebar Lọc:**
  - 🔍 Tìm kiếm theo tên/mô tả
  - 🏷️ Lọc theo chuyên ngành (Frontend, Backend, Mobile, Tester)
  - 📚 Lọc theo trình độ (Beginner, Intermediate, Advanced)
  - 💰 Lọc theo giá (Tất cả, Miễn phí, Có phí)
- **Card Khóa học:**
  - Thumbnail với hiệu ứng hover (scale up)
  - Level badge (color-coded)
  - Discount badge nếu có
  - Meta info: Thời lượng, Max students, Số môn học
  - Giá gốc (gạch ngang) & Giá khuyến mãi
  - Nút "Chi tiết" → navigate to CourseDetailPage

---

### 2️⃣ CourseDetailPage.tsx (`/courses/:id`)
**Chức năng:** Hiển thị thông tin chi tiết 1 khóa học
- **Hero Section:**
  - Ảnh cover với gradient overlay
  - Tên khóa học, Level badge, Status badge (nếu sắp khai giảng)
  - Sticky Price Box bên phải (giá, nút "Đăng ký ngay")
- **Main Content (7-3 layout):**
  - **Cột Trái (7/10):**
    - Giới thiệu khóa học
    - "Những gì bạn sẽ học" (dạng Checklist)
    - Lộ trình học tập (Accordion xổ xuống Subjects → Chapters)
    - Yêu cầu đầu vào (Requirements box)
  - **Cột Phải (3/10) - Sticky:**
    - Ngày khai giảng (Calendar icon)
    - Thời lượng (Clock icon)
    - Lịch học (Days of week)
    - Sĩ số tối đa (Users icon)
    - Ngôn ngữ (Globe icon)
    - Nút "Đăng ký" & "Chia sẻ"

---

### 3️⃣ UpcomingCoursesPage.tsx (`/upcoming-courses`)
**Chức năng:** Hiển thị chỉ khóa học có `startDate` > hôm nay
- **Logic:**
  - Filter only courses with `startDate` > now
  - Sort by nearest start date first
- **Card Urgency Badges:**
  - Badge "Còn X ngày" hiển thị ở top-right
  - Color code: Red (≤3 ngày), Orange (4-7 ngày), Yellow (>7 ngày)
  - Special labels: "Hôm nay", "Ngày mai"
- **Same Sidebar Filters** as CoursesPage
- **Same Layout & Card Design** as CoursesPage

---

## 🛠️ Component Reusables

### CourseCard.tsx
Không được sử dụng trực tiếp trong pages (vì cards được render inline), nhưng code được chuẩn bị để tái sử dụng.

### CourseFilter.tsx
Sidebar filter component được sử dụng lại trong cả CoursesPage và UpcomingCoursesPage.
- Props: search, category, level, price filters + callbacks
- State hoàn toàn quản lý từ parent component

---

## 📊 Mock Data Structure

File `mockCourses.ts` chứa 5 khóa học mẫu với các trường:
```typescript
{
  id: '1',
  title: 'Fullstack Development with React & Node.js',
  description: '...',
  thumbnailUrl: 'https://images.unsplash.com/...',
  price: 299,
  discountPrice: 199,
  startDate: Date.now() + 7 days,
  endDate: Date.now() + 90 days,
  durationValue: 3,
  durationUnit: 'MONTH',
  daysOfWeek: 'Monday, Wednesday, Friday',
  level: 'INTERMEDIATE',
  maxStudents: 30,
  language: 'VI',
  category: 'Backend',
  subjects: [
    {
      id: 's1',
      name: 'Frontend Fundamentals',
      chapters: [
        { id: 'c1', title: 'HTML & CSS Basics' },
        ...
      ]
    },
    ...
  ],
  status: 'PUBLISHED'
}
```

---

## 🎨 Design System

**Color Palette:**
- Text: `slate-800` (primary text), `slate-600` (secondary)
- Primary: `indigo-600` (buttons, accents)
- Backgrounds: `white`, `slate-50`, `slate-100`
- Level Colors:
  - BEGINNER: `green-100 / green-700`
  - INTERMEDIATE: `blue-100 / blue-700`
  - ADVANCED: `red-100 / red-700`
- Urgency (Upcoming):
  - ≤3 days: `red-100 / red-700`
  - 4-7 days: `orange-100 / orange-700`
  - >7 days: `yellow-100 / yellow-700`

**Typography:**
- Page title: `text-4xl font-bold`
- Section title: `text-2xl font-bold`
- Card title: `font-bold line-clamp-2`
- Labels: `text-sm font-bold`

**Spacing:**
- Main container: `max-w-7xl mx-auto px-6`
- Grid gaps: `gap-6` (cards), `gap-8` (sections)
- Component padding: `p-5` (cards), `p-6` (boxes)

---

## 🚀 Routes Added

```typescript
// Public course pages
<Route path="/courses" element={<CoursesPage />} />
<Route path="/courses/:id" element={<CourseDetailPage />} />
<Route path="/upcoming-courses" element={<UpcomingCoursesPage />} />
```

---

## 📱 Responsive Design

- **Desktop (lg):** 3-column grid for cards
- **Tablet (md):** 2-column grid for cards
- **Mobile (sm):** 1-column grid for cards
- Sidebar filter: Fixed width (`w-72`) on desktop, should stack on mobile (can be enhanced with drawer/modal)

---

## ✨ Features

✅ Full TypeScript support with proper types  
✅ React Hooks (useState, useMemo) for state management  
✅ Tailwind CSS for consistent, modern styling  
✅ Lucide React icons for UI elements  
✅ Mock data ready for immediate testing  
✅ Reusable filter component  
✅ Responsive grid layout  
✅ Hover effects and smooth transitions  
✅ Dynamic price calculation and discount display  
✅ Accordion for course curriculum  
✅ Urgency indicators for upcoming courses  

---

## 🔄 Integration Notes

- Mock data uses `mockCourses.ts` - in production, replace with API calls to `/admin/courses`
- Current styling uses Tailwind classes directly - consider extracting to CSS modules if project scales
- All pages are self-contained and can work independently
- Filter logic uses `useMemo` for performance optimization with multiple filters

---

## 📝 Next Steps (Optional Enhancements)

1. Connect to actual API endpoint (`/courses` GET)
2. Add pagination for large course lists
3. Add sorting options (by price, date, rating)
4. Add course reviews/ratings display
5. Add "Add to Cart" / "Wishlist" functionality
6. Implement loading skeletons
7. Add error boundaries
8. Mobile-optimized sidebar filter (drawer/modal)

---

Created with ❤️ as Senior Frontend Developer with React + TypeScript + Tailwind expertise.
