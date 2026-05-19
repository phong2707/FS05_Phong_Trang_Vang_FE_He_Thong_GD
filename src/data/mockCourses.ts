// Mock course data for LMS
export interface MockCourse {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  price: number;
  discountPrice?: number;
  startDate: string;
  endDate: string;
  durationValue: number;
  durationUnit: 'DAY' | 'WEEK' | 'MONTH';
  daysOfWeek: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  maxStudents: number;
  language: string;
  category: string;
  subjects: {
    id: string;
    name: string;
    chapters: {
      id: string;
      title: string;
    }[];
  }[];
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
}

export const mockCourses: MockCourse[] = [
  {
    id: '1',
    title: 'Fullstack Development with React & Node.js',
    description: 'Học cách xây dựng các ứng dụng web hiện đại từ Frontend đến Backend. Khóa học bao gồm React, TypeScript, Express.js, MongoDB và các công nghệ liên quan.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop',
    price: 299,
    discountPrice: 199,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
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
          { id: 'c2', title: 'JavaScript Essentials' },
          { id: 'c3', title: 'React Core Concepts' },
        ],
      },
      {
        id: 's2',
        name: 'Backend Development',
        chapters: [
          { id: 'c4', title: 'Node.js & Express' },
          { id: 'c5', title: 'MongoDB Database' },
          { id: 'c6', title: 'REST API Design' },
        ],
      },
    ],
    status: 'PUBLISHED',
  },
  {
    id: '2',
    title: 'Python for Data Science & AI',
    description: 'Khóa học toàn diện về Python cho Data Science, Machine Learning, và AI. Học Pandas, NumPy, Scikit-learn, TensorFlow từ cơ bản đến nâng cao.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    price: 399,
    discountPrice: 299,
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    durationValue: 4,
    durationUnit: 'MONTH',
    daysOfWeek: 'Tuesday, Thursday, Saturday',
    level: 'ADVANCED',
    maxStudents: 25,
    language: 'VI',
    category: 'Backend',
    subjects: [
      {
        id: 's3',
        name: 'Python Basics',
        chapters: [
          { id: 'c7', title: 'Python Syntax' },
          { id: 'c8', title: 'Data Types & Collections' },
        ],
      },
      {
        id: 's4',
        name: 'Data Science with Pandas',
        chapters: [
          { id: 'c9', title: 'Data Manipulation' },
          { id: 'c10', title: 'Data Visualization' },
        ],
      },
    ],
    status: 'PUBLISHED',
  },
  {
    id: '3',
    title: 'Mobile App Development with Flutter',
    description: 'Xây dựng ứng dụng mobile đa nền tảng với Flutter. Từ lý thuyết cơ bản đến phát triển ứng dụng thực tế với Firebase integration.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b69e?w=500&h=300&fit=crop',
    price: 259,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    durationValue: 2,
    durationUnit: 'MONTH',
    daysOfWeek: 'Monday, Wednesday',
    level: 'BEGINNER',
    maxStudents: 40,
    language: 'VI',
    category: 'Mobile',
    subjects: [
      {
        id: 's5',
        name: 'Flutter Fundamentals',
        chapters: [
          { id: 'c11', title: 'Setup & Widgets' },
          { id: 'c12', title: 'State Management' },
        ],
      },
    ],
    status: 'PUBLISHED',
  },
  {
    id: '4',
    title: 'Advanced UI/UX Design with Figma',
    description: 'Khóa học thiết kế giao diện người dùng chuyên nghiệp. Học Figma từ cơ bản, design system, prototyping, và collaboration workflows.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    price: 0,
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    durationValue: 6,
    durationUnit: 'WEEK',
    daysOfWeek: 'Friday, Sunday',
    level: 'INTERMEDIATE',
    maxStudents: 50,
    language: 'VI',
    category: 'Frontend',
    subjects: [
      {
        id: 's6',
        name: 'Figma Basics',
        chapters: [
          { id: 'c13', title: 'Interface Overview' },
          { id: 'c14', title: 'Components & Assets' },
        ],
      },
    ],
    status: 'PUBLISHED',
  },
  {
    id: '5',
    title: 'Cloud Architecture with AWS',
    description: 'Kiến trúc cloud cho ứng dụng scalable. Học EC2, S3, Lambda, RDS, VPC, và các best practices cho production deployment.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=300&fit=crop',
    price: 349,
    discountPrice: 249,
    startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 105 * 24 * 60 * 60 * 1000).toISOString(),
    durationValue: 12,
    durationUnit: 'WEEK',
    daysOfWeek: 'Saturday, Sunday',
    level: 'ADVANCED',
    maxStudents: 20,
    language: 'VI',
    category: 'Backend',
    subjects: [
      {
        id: 's7',
        name: 'AWS Fundamentals',
        chapters: [
          { id: 'c15', title: 'AWS Basics' },
          { id: 'c16', title: 'Compute Services' },
        ],
      },
    ],
    status: 'PUBLISHED',
  },
];
