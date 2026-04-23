import { CourseCard } from '@/components/CourseCard.tsx';

export const FeaturedCourses: React.FC = () => {
  const courses = [
    {
      id: '1',
      image:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
      title: 'Lập trình Web với React',
      instructor: 'Thầy Nguyễn Văn A',
      price: 499000,
      status: 'active' as const,
    },
    {
      id: '2',
      image:
        'https://images.unsplash.com/photo-1516534775068-bb6d1b5e4e0a?w=500&h=300&fit=crop',
      title: 'JavaScript Nâng cao',
      instructor: 'Cô Trần Thị B',
      price: 399000,
      status: 'active' as const,
    },
    {
      id: '3',
      image:
        'https://images.unsplash.com/photo-1516321314725-8f865d26df80?w=500&h=300&fit=crop',
      title: 'TypeScript Từ Cơ bản đến Nâng cao',
      instructor: 'Thầy Lê Văn C',
      price: 599000,
      status: 'pending' as const,
    },
    {
      id: '4',
      image:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
      title: 'Tailwind CSS - Thiết kế Web hiện đại',
      instructor: 'Cô Phạm Thị D',
      price: 299000,
      status: 'active' as const,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Khóa học Nổi bật
          </h2>
          <p className="text-lg text-gray-600">
            Khám phá những khóa học được yêu thích nhất từ các giáo viên hàng đầu
          </p>
        </div>

        {/* Grid khóa học */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

        {/* Nút xem thêm */}
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
