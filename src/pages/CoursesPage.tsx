/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { courseApi } from '@/api/course.api';

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('all');

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLevel('');
    setSelectedPrice('all');
  };

  // Lấy danh mục ngành học
  useEffect(() => {
    courseApi.getCategories().then(setCategories);
  }, []); 

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await courseApi.getAllCourses({
          title: searchTerm,
          category: selectedCategory || undefined,
          level: selectedLevel,
          price: selectedPrice === 'all' ? '' : selectedPrice,
        });
        setCourses(data);
        setError('');
      } catch (err: any) {
        setError('Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce 500ms cho tìm kiếm
    const delayDebounceFn = setTimeout(() => {
      fetchCourses();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory, selectedLevel, selectedPrice]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* CỘT TRÁI: Bộ Lọc */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-800">Lọc khóa học</h3>
                <button
                  onClick={handleReset}
                  className="text-xs text-[#0f766e] hover:underline font-medium"
                >
                  Đặt lại
                </button>
              </div>
 
              {/* Tìm kiếm */}
              <div className="mb-5">
                <label className="text-sm font-medium text-slate-600 block mb-2">Tìm kiếm</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0f766e] focus:border-transparent transition"
                    placeholder="Tên khóa học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
 
              {/* Lọc Danh mục (ĐÃ ĐƯỢC THÊM LẠI VÀO ĐÂY) */}
              <div className="mb-5">
                <label className="text-sm font-medium text-slate-600 block mb-2">Danh mục</label>
                <select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f766e]" 
  /* 👆 Bạn cứ GIỮ NGUYÊN className cũ của bạn ở trên nhé */
>
  {/* ✅ 3. CHỈ THAY ĐỔI PHẦN OPTION NÀY */}
  <option value="">Tất cả chuyên ngành</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.iconUrl ? `${cat.iconUrl} ` : ''}{cat.name} 
    </option>
  ))}
</select>
              </div>
 
              {/* Lọc Trình độ */}
              <div className="mb-5">
                <label className="text-sm font-medium text-slate-600 block mb-2">Trình độ</label>
                <div className="space-y-2">
                  {[
                    { value: '', label: 'Tất cả trình độ' },
                    { value: 'BEGINNER', label: 'Cơ bản' },
                    { value: 'INTERMEDIATE', label: 'Trung cấp' },
                    { value: 'ADVANCED', label: 'Nâng cao' },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="level"
                        value={opt.value}
                        checked={selectedLevel === opt.value}
                        onChange={() => setSelectedLevel(opt.value)}
                        className="accent-[#0f766e]"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-[#0f766e] transition-colors">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
 
              {/* Lọc Học phí */}
              <div>
                <label className="text-sm font-medium text-slate-600 block mb-2">Học phí</label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Tất cả' },
                    { value: 'free', label: 'Miễn phí' },
                    { value: 'paid', label: 'Có phí' },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="price"
                        value={opt.value}
                        checked={selectedPrice === opt.value}
                        onChange={() => setSelectedPrice(opt.value)}
                        className="accent-[#0f766e]"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-[#0f766e] transition-colors">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* CỘT PHẢI: Danh sách Khóa học */}
          <section className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Tất cả khóa học</h1>
            
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0f766e]" size={40} /></div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2"><AlertCircle /> {error}</div>
            ) : courses.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-500">
                Không tìm thấy khóa học nào phù hợp với bộ lọc của bạn.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course: any) => (
                  <div 
                    key={course.id} 
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition cursor-pointer flex flex-col" 
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <img 
                      src={course.thumbnailUrl || 'https://placehold.co/600x400/e2e8f0/475569?text=Course'} 
                      alt={course.title} 
                      className="w-full h-48 object-cover" 
                    />
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-xs font-bold text-[#0f766e] bg-teal-50 px-2 py-1 rounded-md w-fit mb-2">
                        {course.level}
                      </span>
                      <h3 className="font-bold text-slate-800 text-lg mb-4 line-clamp-2 flex-1">{course.title}</h3>
                      
                      <div className="border-t border-slate-100 pt-4 flex items-end justify-between">
                        <div>
                          {course.price === 0 ? (
                            <span className="text-lg font-bold text-green-600">Miễn phí</span>
                          ) : course.discountPrice ? (
                            <>
                              <p className="text-xs text-slate-400 line-through">
                                ${course.price.toLocaleString()}
                              </p>
                              <p className="text-xl font-bold text-[#0f766e]">
                                ${course.discountPrice.toLocaleString()}
                              </p>
                            </>
                          ) : (
                            <p className="text-xl font-bold text-[#0f766e]">
                              ${course.price.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <button className="px-4 py-2 bg-[#0f766e] text-white rounded-xl font-bold text-sm hover:bg-[#0d6560] transition-colors">
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}