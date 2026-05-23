/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Calendar } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { courseApi } from '@/api/course.api';

export default function UpcomingCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const data = await courseApi.getUpcomingCourses();
        setCourses(data);
      } catch (err) {
        setError('Không thể tải khóa học sắp khai giảng.');
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Khóa học sắp khai giảng</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">Đừng bỏ lỡ cơ hội tham gia các khóa học mới nhất với giảng viên hàng đầu. Đăng ký ngay hôm nay!</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0f766e]" size={40} /></div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 justify-center max-w-2xl mx-auto"><AlertCircle /> {error}</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 text-lg">Hiện chưa có khóa học nào sắp khai giảng.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col relative" onClick={() => navigate(`/courses/${course.id}`)}>
                
                {/* Badge ngày khai giảng nổi bật */}
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
                  <Calendar size={14} /> 
                  Khai giảng: {new Date(course.startDate).toLocaleDateString('vi-VN')}
                </div>

                <img src={course.thumbnailUrl || 'https://placehold.co/600x400/e2e8f0/475569?text=Course'} alt={course.title} className="w-full h-52 object-cover" />
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-800 text-xl mb-4 line-clamp-2 flex-1">{course.title}</h3>
                  <div className="border-t border-slate-100 pt-4 flex items-end justify-between">
                    <div>
                      {course.price === 0 ? (
                        <span className="text-lg font-bold text-green-600">Miễn phí</span>
                      ) : course.discountPrice ? (
                        <p className="text-xl font-bold text-[#0f766e]">${course.discountPrice.toLocaleString()}</p>
                      ) : (
                        <p className="text-xl font-bold text-[#0f766e]">${course.price.toLocaleString()}</p>
                      )}
                    </div>
                    <button className="px-5 py-2.5 bg-[#0f766e] text-white rounded-lg font-bold text-sm hover:bg-[#0d6560] transition-colors">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}