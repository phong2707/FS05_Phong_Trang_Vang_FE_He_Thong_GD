/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Loader2, Plus, X, ArrowLeft, Check, Grid3X3, BookOpen, Users } from 'lucide-react';
import { adminCourseService, type Teacher } from '@/services/admin/adminCourseService';
import SidebarLayout from '@/layouts/SidebarLayout';
import DashboardHeader from '@/components/DashboardHeader';
import SidebarMenu from '@/components/SidebarMenu';

const adminMenuItems = [
  { label: 'Dashboard', icon: Grid3X3, href: '/admin' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Courses', icon: BookOpen, href: '/admin/courses' },
];

export default function CourseCreateWizard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [step, setStep] = useState(1);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    thumbnailUrl: '',
    status: 'DRAFT',
    subjects: [{ name: '', description: '', sortOrder: 0, mainTeacher: '', assistantTeacher: '' }],
    startDate: '',
    endDate: '',
    durationValue: 0,
    durationUnit: 'MONTH',
    daysOfWeek: '',
    level: 'BEGINNER',
    maxStudents: 30,
    language: 'VI',
    isFeatured: false,
    discountPrice: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersList = await adminCourseService.getTeachers();
        setTeachers(Array.isArray(teachersList) ? teachersList : teachersList.data || []);

        if (isEdit && id) {
          const courseData = await adminCourseService.getCourseDetail(id);
          
          setFormData(prev => ({
            ...prev, // Cực kỳ quan trọng: Giữ lại các trường mặc định nếu API không trả về
            title: courseData.title || '',
            description: courseData.description || '',
            price: courseData.price || 0,
            thumbnailUrl: courseData.thumbnailUrl || '',
            status: courseData.status || 'DRAFT',
            
            // --- Map thêm các trường thực tế (Format lại Date để hiển thị đúng thẻ input type="date") ---
            startDate: courseData.startDate ? new Date(courseData.startDate).toISOString().split('T')[0] : '',
            endDate: courseData.endDate ? new Date(courseData.endDate).toISOString().split('T')[0] : '',
            durationValue: courseData.durationValue || 0,
            durationUnit: courseData.durationUnit || 'MONTH',
            daysOfWeek: courseData.daysOfWeek || '',
            level: courseData.level || 'BEGINNER',
            maxStudents: courseData.maxStudents || 30,
            language: courseData.language || 'VI',
            isFeatured: courseData.isFeatured || false,
            discountPrice: courseData.discountPrice || 0,
            // ----------------------------------------------------------------------------------------

            subjects: courseData.subjects?.map((s: any) => ({
              name: s.name,
              description: s.description || '',
              sortOrder: s.sortOrder,
              mainTeacher: s.teachers?.find((t: any) => t.type === 'MAIN')?.teacher?.id || '',
              assistantTeacher: s.teachers?.find((t: any) => t.type === 'TA')?.teacher?.id || ''
            })) || []
          }));
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isEdit, id]);

  const handleAddSubject = () => {
    setFormData({
      ...formData,
      subjects: [
        ...formData.subjects,
        { name: '', description: '', sortOrder: formData.subjects.length, mainTeacher: '', assistantTeacher: '' }
      ]
    });
  };

  const handleRemoveSubject = (index: number) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((_, i) => i !== index)
    });
  };

  const handleSubjectChange = (index: number, field: string, value: any) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.price || formData.subjects.length === 0) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate subjects
    for (const subject of formData.subjects) {
      if (!subject.name || !subject.mainTeacher) {
        alert('Mỗi môn học phải có tên và giáo viên chính');
        return;
      }
    }

    setSaving(true);
    try {
      if (isEdit && id) {
        await adminCourseService.updateCourse(id, formData);
        alert('Cập nhật khóa học thành công');
      } else {
        await adminCourseService.createCourse(formData);
        alert('Tạo khóa học thành công');
      }
      navigate('/admin/courses');
    } catch (err: any) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout sidebar={<SidebarMenu items={adminMenuItems} />}>
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center bg-slate-50">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
        </main>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout sidebar={<SidebarMenu items={adminMenuItems} />}>
      <DashboardHeader />
      <main className="flex-1 overflow-auto bg-slate-50 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/courses')}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {isEdit ? 'Chỉnh sửa Khóa học' : 'Tạo Khóa học mới'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Hoàn thành từng bước để tạo khóa học</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-8 mb-12">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-all ${
              step >= 1 ? 'bg-indigo-600' : 'bg-slate-300'
            }`}>
              {step > 1 ? <Check size={20} /> : '1'}
            </div>
            <span className={`text-sm font-bold ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
              Thông tin cơ bản
            </span>
          </div>

          <div className={`h-1 w-16 transition-all ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-300'}`} />

          <div className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-all ${
              step >= 2 ? 'bg-indigo-600' : 'bg-slate-300'
            }`}>
              2
            </div>
            <span className={`text-sm font-bold ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
              Đề cương môn học
            </span>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Thông tin Khóa học cơ bản</h2>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tên Khóa học *</label>
                <input
                  type="text"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="VD: Python cơ bản"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả</label>
                <textarea
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={4}
                  placeholder="Mô tả chi tiết về khóa học..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Giá tiền ($) *</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">URL Ảnh bìa</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://..."
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Ngày bắt đầu</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={(formData as any).startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Thời lượng</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="w-1/2 p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                      value={(formData as any).durationValue}
                      onChange={(e) => setFormData({ ...formData, durationValue: parseInt(e.target.value || '0') })}
                    />
                    <select
                      className="w-1/2 p-3 border border-slate-200 rounded-xl outline-none"
                      value={(formData as any).durationUnit}
                      onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
                    >
                      <option value="DAY">Ngày</option>
                      <option value="WEEK">Tuần</option>
                      <option value="MONTH">Tháng</option>
                      <option value="HOUR">Giờ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Ngôn ngữ</label>
                  <select
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                    value={(formData as any).language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  >
                    <option value="VI">Tiếng Việt</option>
                    <option value="EN">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Max học viên</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={(formData as any).maxStudents}
                    onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value || '0') })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Level</label>
                  <select
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                    value={(formData as any).level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Giá giảm ($)</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={(formData as any).discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: parseFloat(e.target.value || '0') })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nổi bật</label>
                  <div className="mt-2">
                    <input
                      type="checkbox"
                      checked={(formData as any).isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">Ngày kết thúc</label>
                <input
                  type="date"
                  className="w-56 p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={(formData as any).endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">Trạng thái</label>
                <select
                  className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none w-56"
                  value={(formData as any).status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="DRAFT">Nháp</option>
                  <option value="PUBLISHED">Đang phát hành</option>
                  <option value="ARCHIVED">Lưu trữ</option>
                </select>
              </div>

              {formData.thumbnailUrl && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Xem trước ảnh</label>
                  <img src={formData.thumbnailUrl} alt="Thumbnail" className="h-40 w-full object-cover rounded-xl" />
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">Đề cương môn học</h2>
                <button
                  onClick={handleAddSubject}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                >
                  <Plus size={16} /> Thêm môn học
                </button>
              </div>

              <div className="space-y-4">
                {formData.subjects.map((subject, index) => (
                  <div key={index} className="border border-slate-200 rounded-xl p-6 relative">
                    {formData.subjects.length > 1 && (
                      <button
                        onClick={() => handleRemoveSubject(index)}
                        className="absolute top-4 right-4 p-1 hover:bg-red-50 rounded-lg text-red-600"
                      >
                        <X size={18} />
                      </button>
                    )}

                    <div className="text-sm font-bold text-indigo-600 mb-4">Môn học #{index + 1}</div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tên môn học *</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="VD: Cơ bản về Python"
                          value={subject.name}
                          onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả môn học</label>
                        <textarea
                          className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                          rows={2}
                          placeholder="Mô tả chi tiết..."
                          value={subject.description}
                          onChange={(e) => handleSubjectChange(index, 'description', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Thứ tự</label>
                          <input
                            type="number"
                            className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            value={subject.sortOrder}
                            onChange={(e) => handleSubjectChange(index, 'sortOrder', parseInt(e.target.value))}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Giảng viên chính *</label>
                          <select
                            className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            value={subject.mainTeacher}
                            onChange={(e) => handleSubjectChange(index, 'mainTeacher', e.target.value)}
                          >
                            <option value="">-- Chọn giảng viên --</option>
                            {teachers.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.firstName} {t.lastName}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Trợ giảng (Tùy chọn)</label>
                          <select
                            className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                            value={subject.assistantTeacher}
                            onChange={(e) => handleSubjectChange(index, 'assistantTeacher', e.target.value)}
                          >
                            <option value="">-- Không chọn --</option>
                            {teachers.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.firstName} {t.lastName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
          <button
            onClick={() => step === 1 ? navigate('/admin/courses') : setStep(1)}
            className="px-6 py-3 text-slate-700 font-bold border border-slate-300 rounded-xl hover:bg-slate-100 transition-all"
          >
            {step === 1 ? 'Hủy' : 'Quay lại'}
          </button>

          <div className="flex items-center gap-4">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 text-indigo-600 font-bold border border-indigo-300 rounded-xl hover:bg-indigo-50 transition-all flex items-center gap-2"
              >
                <ChevronRight size={18} className="rotate-180" /> Bước trước
              </button>
            )}

            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                Bước tiếp <ChevronRight size={18} />
              </button>
            )}

            {step === 2 && (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                {saving ? 'Đang xử lý...' : (isEdit ? 'Lưu thay đổi' : 'Tạo Khóa học')}
              </button>
            )}
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}
