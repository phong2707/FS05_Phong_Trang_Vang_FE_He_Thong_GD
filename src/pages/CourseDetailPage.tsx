/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, BookOpen, ChevronDown, Globe, Loader2, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { courseApi } from '@/api/course.api';
import PaymentInstructionModal from '@/components/PaymentInstructionModal';
import enrollmentService, { type PaymentMethod } from '@/services/enrollment.service';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);

  // 3-Step Modal State
  const [enrollmentStep, setEnrollmentStep] = useState<1 | 2 | 3>(1); // 1: Info, 2: Payment Method, 3: Payment Instruction
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('VNPAY');

  // Store enrollment data for step 3
  const [enrollmentData, setEnrollmentData] = useState<any>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const data = await courseApi.getCourseDetail(id);
        setCourse(data);
        
        // Open first subject by default
        if (data?.subjects?.length > 0) {
          setExpandedSubjects([data.subjects[0].id]);
        }

        // Pre-fill form with current user if logged in
        const token = localStorage.getItem('token');
        if (token) {
          // Try to get current user info (you may need to add this to your auth service)
          // For now, we'll leave it empty and user can fill it
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
    setEnrollmentStep(1);
    setEnrollError('');
    setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '' });
    setPaymentMethod('VNPAY');
    setIsEnrollModalOpen(true);
  };

  const closeEnrollModal = () => {
    if (enrolling) return;
    setIsEnrollModalOpen(false);
  };

  // Step 1: Validate and move to Step 2
  const handleStep1Next = () => {
    setEnrollError('');

    if (!formData.firstName.trim()) {
      setEnrollError('Vui lòng nhập họ');
      return;
    }
    if (!formData.lastName.trim()) {
      setEnrollError('Vui lòng nhập tên');
      return;
    }
    if (!formData.email.trim()) {
      setEnrollError('Vui lòng nhập email');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEnrollError('Email không hợp lệ');
      return;
    }

    setEnrollmentStep(2);
  };

  // Step 2: Move to Step 3 and submit enrollment
const handleStep2Submit = async () => {
  if (!id) return;
  
  setEnrolling(true);
  setEnrollError('');

  try {
    const payload: any = {
      courseId: id,
      paymentMethod,
      guestFirstName: formData.firstName.trim(),
      guestLastName: formData.lastName.trim(),
      guestEmail: formData.email.trim(),
      guestPhoneNumber: formData.phoneNumber.trim() || undefined,
    };

    const res = await enrollmentService.enrollCourse(payload);
    
    // In dữ liệu ra Console để chúng ta bắt tận tay cái vnpayUrl đang núp ở đâu
    console.log("👉 DỮ LIỆU TỪ BACKEND TRẢ VỀ:", res); 
    const responseData: any = res;
    if (paymentMethod === 'VNPAY') {
      // Quét URL ở mọi tầng dữ liệu
      const url = responseData?.vnpayUrl 
               || responseData?.data?.vnpayUrl 
               || responseData?.data?.data?.vnpayUrl 
               || responseData?.data?.data?.data?.vnpayUrl;

      if (!url) {
        // NẾU KHÔNG CÓ URL, CHẶN LẠI VÀ BÁO LỖI (SẼ KHÔNG BỊ XOAY TRÒN NỮA)
        setEnrollError('Không lấy được link VNPay! Hãy mở F12 -> tab Console để xem biến res.');
        return; 
      }

      setEnrollmentStep(3); // Bật modal xoay vòng
      setTimeout(() => {
        window.location.href = url; // Đá sang VNPay
      }, 1000);
      
    } else {
      // THANH TOÁN MANUAL
      setEnrollmentData(res); 
      setEnrollmentStep(3);  
    }

  } catch (err: any) {
    console.error("Lỗi đăng ký:", err);
    setEnrollError(
      err?.response?.data?.error || 
      err?.response?.data?.message || 
      'Không thể đăng ký khóa học. Vui lòng thử lại.'
    );
  } finally {
    setEnrolling(false); // Chắc chắn tắt vòng xoay ở nút bấm
  }
};

  const handleStep2Back = () => {
    setEnrollmentStep(1);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="animate-spin text-[#0f766e]" size={48} />
        </div>
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
            <button
              onClick={() => navigate('/courses')}
              className="mt-4 text-[#0f766e] font-bold underline"
            >
              Quay lại danh sách
            </button>
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
            <p className="text-slate-300 text-lg mb-8 max-w-2xl leading-relaxed">
              {course.description}
            </p>
          </div>
          <div className="w-full md:w-1/3 shrink-0">
            <img
              src={
                course.thumbnailUrl ||
                'https://placehold.co/600x400/e2e8f0/475569?text=Course'
              }
              alt={course.title}
              className="rounded-2xl shadow-2xl w-full object-cover aspect-video border-4 border-[#1e293b]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN: Content */}
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
                      <ChevronDown
                        size={20}
                        className={`text-slate-400 transition-transform duration-300 ${
                          expandedSubjects.includes(subject.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {expandedSubjects.includes(subject.id) && (
                      <div className="p-5 bg-white space-y-3">
                        {subject.chapters?.length === 0 && (
                          <p className="text-sm text-slate-400">Chưa có bài học nào.</p>
                        )}
                        {subject.chapters?.map((chapter: any, chapIdx: number) => (
                          <div
                            key={chapter.id}
                            className="flex gap-3 items-center text-slate-600 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition"
                          >
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

          {/* RIGHT COLUMN: Course Info (Sticky) */}
          <div className="lg:col-span-1 relative">
            <div className="sticky top-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <div className="text-center pb-6 border-b border-slate-100 mb-6">
                {course.price === 0 ? (
                  <span className="text-3xl font-bold text-green-600">Miễn phí</span>
                ) : (
                  <>
                    {course.discountPrice && (
                      <p className="text-lg text-slate-400 line-through mb-1">
                        ${course.price.toLocaleString()}
                      </p>
                    )}
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
                    <p className="font-bold text-slate-800">
                      {course.startDate
                        ? new Date(course.startDate).toLocaleDateString('vi-VN')
                        : 'Đang cập nhật'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <Clock className="text-[#0f766e]" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Thời lượng</p>
                    <p className="font-bold text-slate-800">
                      {course.durationValue || 0}{' '}
                      {course.durationUnit === 'MONTH'
                        ? 'Tháng'
                        : course.durationUnit === 'WEEK'
                          ? 'Tuần'
                          : 'Ngày'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <Users className="text-[#0f766e]" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Sĩ số tối đa</p>
                    <p className="font-bold text-slate-800">
                      {course.maxStudents || 'Không giới hạn'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <Globe className="text-[#0f766e]" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Ngôn ngữ</p>
                    <p className="font-bold text-slate-800">
                      {course.language === 'VI' ? 'Tiếng Việt' : course.language || 'Tiếng Việt'}
                    </p>
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

      {/* 3-STEP ENROLLMENT MODAL */}
      {/* CHỈ HIỆN MODAL CHÍNH KHI Ở BƯỚC 1, 2 HOẶC LÀ VNPAY Ở BƯỚC 3 */}
      {isEnrollModalOpen && !(enrollmentStep === 3 && paymentMethod === 'MANUAL') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">
                {enrollmentStep === 1
                  ? 'Thông tin cá nhân'
                  : enrollmentStep === 2
                    ? 'Chọn phương thức thanh toán'
                    : 'Đang chuyển hướng'}
              </h3>
              <button
                onClick={closeEnrollModal}
                disabled={enrolling}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-500 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${enrollmentStep >= 1 ? 'bg-[#0f766e] text-white' : 'bg-slate-300 text-slate-600'}`}>1</div>
                <div className={`flex-1 h-0.5 ${enrollmentStep >= 2 ? 'bg-[#0f766e]' : 'bg-slate-300'}`} />
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${enrollmentStep >= 2 ? 'bg-[#0f766e] text-white' : 'bg-slate-300 text-slate-600'}`}>2</div>
                <div className={`flex-1 h-0.5 ${enrollmentStep >= 3 ? 'bg-[#0f766e]' : 'bg-slate-300'}`} />
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${enrollmentStep >= 3 ? 'bg-[#0f766e] text-white' : 'bg-slate-300 text-slate-600'}`}>3</div>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 py-6 space-y-4 min-h-[300px]">
              {enrollmentStep === 1 && (
                <>
                  <p className="text-sm text-slate-600 mb-4">
                    Khóa học: <span className="font-semibold text-slate-800">{course?.title}</span>
                  </p>
                  <input
                    type="text"
                    placeholder="Họ"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm placeholder-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Tên"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm placeholder-slate-400"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm placeholder-slate-400"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại (tùy chọn)"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm placeholder-slate-400"
                  />
                </>
              )}

              {enrollmentStep === 2 && (
                <>
                  <p className="text-sm text-slate-600 mb-4">
                    {formData.firstName} {formData.lastName} ({formData.email})
                  </p>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-[#0f766e] bg-teal-50 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="VNPAY"
                        checked={paymentMethod === 'VNPAY'}
                        onChange={() => setPaymentMethod('VNPAY')}
                        className="w-5 h-5"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">VNPay</p>
                        <p className="text-xs text-slate-600">Thanh toán trực tuyến an toàn</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-300 cursor-pointer hover:border-slate-400">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="MANUAL"
                        checked={paymentMethod === 'MANUAL'}
                        onChange={() => setPaymentMethod('MANUAL')}
                        className="w-5 h-5"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">Chuyển khoản ngân hàng</p>
                        <p className="text-xs text-slate-600">Chuyển tiền vào tài khoản của chúng tôi</p>
                      </div>
                    </label>
                  </div>
                </>
              )}

              {/* CHỈ CÒN LẠI VNPAY Ở ĐÂY */}
              {enrollmentStep === 3 && paymentMethod === 'VNPAY' && (
                <div className="text-center space-y-4 py-8">
                  <Loader2 className="animate-spin mx-auto text-[#0f766e]" size={40} />
                  <p className="text-slate-600 font-semibold">Đang chuyển hướng đến VNPay...</p>
                  <p className="text-xs text-slate-500">Vui lòng không đóng trang này</p>
                </div>
              )}

              {enrollError && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 mt-4">
                  <p className="text-sm text-red-700">{enrollError}</p>
                </div>
              )}
            </div>

            {/* Footer / Actions */}
            <div className="px-5 py-4 border-t border-slate-200 flex justify-between gap-3">
              {enrollmentStep === 1 && (
                <>
                  <button onClick={closeEnrollModal} disabled={enrolling} className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50">Hủy</button>
                  <button onClick={handleStep1Next} disabled={enrolling} className="flex-1 px-4 py-2 rounded-lg bg-[#0f766e] text-white hover:bg-[#0d6560] disabled:opacity-50">Tiếp theo</button>
                </>
              )}

              {enrollmentStep === 2 && (
                <>
                  <button onClick={handleStep2Back} disabled={enrolling} className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50">Quay lại</button>
                  <button onClick={handleStep2Submit} disabled={enrolling} className="flex-1 px-4 py-2 rounded-lg bg-[#0f766e] text-white hover:bg-[#0d6560] disabled:opacity-50 flex items-center justify-center gap-2">
                    {enrolling ? <Loader2 size={16} className="animate-spin" /> : null} Xác nhận
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Instruction Modal (for MANUAL only) */}
      {/* ĐÃ CẬP NHẬT LOGIC LẤY AMOUNT AN TOÀN TỪ JSON TRẢ VỀ */}
      {enrollmentStep === 3 && paymentMethod === 'MANUAL' && enrollmentData && (
        <PaymentInstructionModal
          isOpen={true}
          paymentMethod="MANUAL"
          amount={enrollmentData?.transaction?.amount || enrollmentData?.data?.transaction?.amount || course?.price}
          enrollmentId={enrollmentData?.enrollment?.id || enrollmentData?.data?.enrollment?.id || ''}
          courseName={course?.title || ''}
          onClose={() => {
            closeEnrollModal();
            setEnrollmentStep(1); // Reset lại cho lần sau
          }}
        />
      )}

      <Footer />
    </div>
  );
}
