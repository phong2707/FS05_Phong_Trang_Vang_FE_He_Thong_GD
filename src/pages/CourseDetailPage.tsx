/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, BookOpen, ChevronDown, Globe, Loader2, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { courseApi } from '@/api/course.api';
import enrollmentService, { type PaymentMethod } from '@/services/enrollment.service';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('VNPAY');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhoneNumber, setGuestPhoneNumber] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const data = await courseApi.getCourseDetail(id);
        setCourse(data);
        
        // Mở sẵn Môn học đầu tiên
        if (data?.subjects?.length > 0) {
          setExpandedSubjects([data.subjects[0].id]);
        }
      } catch (err) {
        setError('Không tìm thấy khóa học hoặc có lỗi xảy ra.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((s) => s !== subjectId) : [...prev, subjectId]
    );
  };

  const openEnrollModal = () => {
    setEnrollError('');
    setPaymentMethod('VNPAY');
    setIsEnrollModalOpen(true);
  };

  const closeEnrollModal = () => {
    if (enrolling) return;
    setIsEnrollModalOpen(false);
  };

  const handleEnrollCourse = async () => {
    if (!id) return;
    setEnrolling(true);
    setEnrollError('');

    try {
      const token = localStorage.getItem('token');

      const payload: any = {
        courseId: id,
        paymentMethod,
      };

      if (!token) {
        payload.guestFirstName = guestFirstName.trim();
        payload.guestLastName = guestLastName.trim();
        payload.guestEmail = guestEmail.trim();
        payload.guestPhoneNumber = guestPhoneNumber.trim();

        if (!payload.guestFirstName || !payload.guestLastName || !payload.guestEmail) {
          setEnrollError('Vui lòng nhập đầy đủ họ, tên và email để đăng ký.');
          setEnrolling(false);
          return;
        }
      }

      const res = await enrollmentService.enrollCourse(payload);

      if (res.vnpayUrl) {
        window.location.href = res.vnpayUrl;
        return;
      }

      alert('Đăng ký khóa học thành công! Đơn của bạn đang chờ duyệt.');
      setIsEnrollModalOpen(false);
    } catch (err: any) {
      setEnrollError(err?.response?.data?.error || 'Không thể đăng ký khóa học. Vui lòng thử lại.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="flex-1 flex justify-center items-center"><Loader2 className="animate-spin text-[#0f766e]" size={48} /></div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
            <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-600 text-lg">{error}</p>
            <button onClick={() => navigate('/courses')} className="mt-4 text-[#0f766e] font-bold underline">Quay lại danh sách</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {/* HERO SECTION */}
        <div className="bg-[#0f172a] rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row gap-8 items-center mb-12 shadow-lg">
          <div className="flex-1">
            <span className="bg-[#1e293b] border border-[#334155] text-teal-300 px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">
              {course.level}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{course.title}</h1>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl leading-relaxed">{course.description}</p>
          </div>
          <div className="w-full md:w-1/3 shrink-0">
            <img src={course.thumbnailUrl || 'https://placehold.co/600x400/e2e8f0/475569?text=Course'} alt={course.title} className="rounded-2xl shadow-2xl w-full object-cover aspect-video border-4 border-[#1e293b]" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* CỘT TRÁI: Lộ trình */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BookOpen className="text-[#0f766e]" /> Nội dung khóa học
              </h2>
              
              <div className="space-y-4">
                {course.subjects?.map((subject: any, idx: number) => (
                  <div key={subject.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button 
                      className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition"
                      onClick={() => toggleSubject(subject.id)}
                    >
                      <div className="flex items-center gap-3 font-bold text-slate-800 text-left">
                        <span className="text-[#0f766e]">Phần {idx + 1}:</span> {subject.name}
                      </div>
                      <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${expandedSubjects.includes(subject.id) ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedSubjects.includes(subject.id) && (
                      <div className="p-5 bg-white space-y-3">
                        {subject.chapters?.length === 0 && <p className="text-sm text-slate-400">Chưa có bài học nào.</p>}
                        {subject.chapters?.map((chapter: any, chapIdx: number) => (
                          <div key={chapter.id} className="flex gap-3 items-center text-slate-600 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition">
                            <span className="w-7 h-7 rounded-full bg-teal-50 text-[#0f766e] flex items-center justify-center text-xs font-bold shrink-0">
                              {chapIdx + 1}
                            </span>
                            <span className="font-medium">{chapter.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Sticky Box Thông tin */}
          <div className="lg:col-span-1 relative">
            <div className="sticky top-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <div className="text-center pb-6 border-b border-slate-100 mb-6">
                {course.price === 0 ? (
                  <span className="text-3xl font-bold text-green-600">Miễn phí</span>
                ) : (
                  <>
                    {course.discountPrice && <p className="text-lg text-slate-400 line-through mb-1">${course.price.toLocaleString()}</p>}
                    <p className="text-4xl font-bold text-[#0f766e]">
                      ${(course.discountPrice || course.price).toLocaleString()}
                    </p>
                  </>
                )}
              </div>
              
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <Calendar className="text-[#0f766e]" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Khai giảng</p>
                    <p className="font-bold text-slate-800">{course.startDate ? new Date(course.startDate).toLocaleDateString('vi-VN') : 'Đang cập nhật'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <Clock className="text-[#0f766e]" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Thời lượng</p>
                    <p className="font-bold text-slate-800">{course.durationValue || 0} {course.durationUnit === 'MONTH' ? 'Tháng' : course.durationUnit === 'WEEK' ? 'Tuần' : 'Ngày'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <Users className="text-[#0f766e]" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Sĩ số tối đa</p>
                    <p className="font-bold text-slate-800">{course.maxStudents || 'Không giới hạn'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <Globe className="text-[#0f766e]" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Ngôn ngữ</p>
                    <p className="font-bold text-slate-800">{course.language === 'VI' ? 'Tiếng Việt' : course.language || 'Tiếng Việt'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  onClick={openEnrollModal}
                  className="w-full bg-[#0f766e] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#0d6560] transition-colors shadow-md shadow-teal-600/20"
                >
                  Đăng ký khóa học
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">Xác nhận đăng ký khóa học</h3>
              <button
                onClick={closeEnrollModal}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <p className="text-sm text-slate-600">
                Bạn đang đăng ký: <span className="font-semibold text-slate-800">{course?.title}</span>
              </p>

              {!localStorage.getItem('token') && (
                <div className="grid grid-cols-1 gap-3">
                  <input
                    type="text"
                    placeholder="Họ"
                    value={guestFirstName}
                    onChange={(e) => setGuestFirstName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Tên"
                    value={guestLastName}
                    onChange={(e) => setGuestLastName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Số điện thoại (không bắt buộc)"
                    value={guestPhoneNumber}
                    onChange={(e) => setGuestPhoneNumber(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Chọn phương thức thanh toán</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === 'VNPAY'}
                      onChange={() => setPaymentMethod('VNPAY')}
                    />
                    <span className="text-slate-700">VNPay</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === 'MANUAL'}
                      onChange={() => setPaymentMethod('MANUAL')}
                    />
                    <span className="text-slate-700">Chuyển khoản thủ công (MANUAL)</span>
                  </label>
                </div>
              </div>

              {enrollError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {enrollError}
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={closeEnrollModal}
                disabled={enrolling}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleEnrollCourse}
                disabled={enrolling}
                className="px-4 py-2 rounded-lg bg-[#0f766e] text-white hover:bg-[#0d6560] disabled:opacity-50"
              >
                {enrolling ? 'Đang xử lý...' : 'Xác nhận đăng ký'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
