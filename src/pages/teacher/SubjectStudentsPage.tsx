/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState, type JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, RefreshCcw, Loader2, Search, Users } from 'lucide-react';
import TeacherDashboardLayout from '@/components/teacher/TeacherDashboardLayout';
import studentService from '@/services/teacher/studentService';

// Trang quản lý danh sách sinh viên cho giáo viên

interface Student {
  userId: string;
  studentCode: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  phoneNumber: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  joinedAt: string;
}

interface ClassGroupWithStudents {
  classGroupId: string;
  classGroupName: string;
  status: string;
  studentCount: number;
  students: Student[];
}

interface SubjectStudentsData {
  subjectId: string;
  subjectName: string;
  totalStudents: number;
  classGroups: ClassGroupWithStudents[];
}

export default function SubjectStudentsPage(): JSX.Element {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [data, setData] = useState<SubjectStudentsData | null>(null);

  const [selectedClassGroupId, setSelectedClassGroupId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');

  const [refreshIndex, setRefreshIndex] = useState(0);

  const loadData = async (classGroupId?: string) => {
    if (!subjectId) return;
    setLoading(true);
    setErrorMessage('');
    try {
      let resp: any = null;
      if (classGroupId) {
        resp = await studentService.getStudentsByClassGroup(subjectId, classGroupId);
      } else {
        resp = await studentService.getStudents(subjectId);
      }

      setData(resp ? {
  ...resp,
  classGroups: resp.classGroups ?? [],  // đảm bảo không bao giờ undefined
} : null);
    } catch (err: any) {
      setErrorMessage('Không thể tải dữ liệu sinh viên. Vui lòng thử lại.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData(selectedClassGroupId || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId, selectedClassGroupId, refreshIndex]);

  const filteredByClient = useMemo(() => {
  if (!data) return null;
  const q = searchTerm.trim().toLowerCase();

  const filterStudents = (students: Student[] | undefined) =>
    (students || []).filter((s) => { // ✅ Thêm || [] vào đây
      if (statusFilter && statusFilter !== 'Tất cả' && s.status !== statusFilter) return false;
      if (!q) return true;
      const inName = s.fullName?.toLowerCase().includes(q) ?? false; // ✅ Thêm ?? false
      const inEmail = s.email?.toLowerCase().includes(q) ?? false;
      const inCode = s.studentCode?.toLowerCase().includes(q) ?? false;
      return Boolean(inName || inEmail || inCode);
    });

  if (selectedClassGroupId) {
    const group = data.classGroups?.find((g) => g.classGroupId === selectedClassGroupId);
    const students = filterStudents(group?.students); // ✅ Sửa group thành group?
    return {
      type: 'single' as const,
      subjectId: data.subjectId,
      subjectName: data.subjectName,
      totalStudents: students.length,
      classGroup: group ? { ...group, students, studentCount: students.length } : null,
    };
  }

  const groups = (data.classGroups || []).map((g) => { // ✅ Thêm || []
    const students = filterStudents(g.students);
    return { ...g, students, studentCount: students.length };
  });
  const total = groups.reduce((acc, g) => acc + g.studentCount, 0);
  return { type: 'multi' as const, subjectId: data.subjectId, subjectName: data.subjectName, totalStudents: total, classGroups: groups };
}, [data, searchTerm, statusFilter, selectedClassGroupId]);

  const renderAvatar = (s: Student) => {
    if (s.avatarUrl) return <img src={s.avatarUrl} alt={s.fullName} className="w-8 h-8 rounded-full object-cover" />;
    const initial = (s.fullName || s.studentCode || 'U').charAt(0).toUpperCase();
    return <div className="w-8 h-8 rounded-full flex items-center justify-center bg-teal-100 text-teal-700 font-semibold">{initial}</div>;
  };

  const translateStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { label: 'Hoạt động', classes: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      case 'INACTIVE':
        return { label: 'Ngưng hoạt động', classes: 'bg-gray-100 text-gray-600 border-gray-200' };
      case 'PENDING':
        return { label: 'Chờ kích hoạt', classes: 'bg-amber-100 text-amber-700 border-amber-200' };
      default:
        return { label: status, classes: 'bg-gray-100 text-gray-600 border-gray-200' };
    }
  };

  const formatDateDDMMYYYY = (iso?: string) => {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch {
      return '-';
    }
  };

  const isEmptyNoStudents = Boolean(data && (data.classGroups?.length ?? 0) === 0);
  const isSearchNoResult = Boolean(data && filteredByClient && filteredByClient.type === 'multi' && filteredByClient.totalStudents === 0 && (searchTerm || statusFilter !== 'Tất cả'));

  return (
    <TeacherDashboardLayout mainClassName="flex-1 overflow-auto bg-stone-50 p-6 space-y-6">
      <div className="p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              <ArrowLeft size={16} /> Quay lại
            </button>

            <div>
              <h1 className="text-xl font-semibold">{data?.subjectName ?? 'Tên môn'}</h1>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full border">{data?.totalStudents ?? 0} sinh viên</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setRefreshIndex((i) => i + 1)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700">
              <RefreshCcw size={16} /> Làm mới
            </button>
          </div>
        </div>

        {errorMessage ? (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center justify-between">
            <div>{errorMessage}</div>
            <div>
              <button onClick={() => { setErrorMessage(''); void loadData(selectedClassGroupId || undefined); }} className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-50">Thử lại</button>
            </div>
          </div>
        ) : null}

        <div className="mb-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex gap-3 items-center w-full md:w-auto">
            <select value={selectedClassGroupId} onChange={(e) => setSelectedClassGroupId(e.target.value)} className="w-full md:w-auto rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">Tất cả lớp</option>
              {data?.classGroups.map((g) => (
                <option key={g.classGroupId} value={g.classGroupId}>{g.classGroupName}</option>
              ))}
            </select>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="Tất cả">Tất cả</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-96">
            <div className="relative w-full">
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm theo họ tên, email, mã SV..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm pl-10" />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={16} /></div>
            </div>

            <button onClick={() => { void loadData(selectedClassGroupId || undefined); }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Áp dụng</button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" size={28} /></div>
          ) : null}

          {!loading && isEmptyNoStudents ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500"><div className="flex items-center justify-center gap-2 mb-3"><Users size={28} /></div>Chưa có sinh viên nào trong môn học này</div>
          ) : null}

          {!loading && isSearchNoResult ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">Không tìm thấy sinh viên phù hợp</div>
          ) : null}

          {!loading && filteredByClient ? (
            <>
              {filteredByClient.type === 'multi' && filteredByClient.classGroups.map((g) => (
                <section key={g.classGroupId} className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{g.classGroupName}</h3>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full border">{g.studentCount} sinh viên</span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full border">{g.status === 'ACTIVE' ? <span className="bg-emerald-100 text-emerald-700 border-emerald-200 px-2.5 py-1 rounded-full">ACTIVE</span> : <span className="bg-gray-100 text-gray-600 border-gray-200 px-2.5 py-1 rounded-full">INACTIVE</span>}</span>
                    </div>
                  </div>

                  {g.studentCount === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">Không có sinh viên phù hợp</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 text-gray-600">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm">STT</th>
                            <th className="px-4 py-2 text-left text-sm">Mã SV</th>
                            <th className="px-4 py-2 text-left text-sm">Họ tên</th>
                            <th className="px-4 py-2 text-left text-sm">Email</th>
                            <th className="px-4 py-2 text-left text-sm">SĐT</th>
                            <th className="px-4 py-2 text-left text-sm">Trạng thái</th>
                            <th className="px-4 py-2 text-left text-sm">Ngày tham gia</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {g.students.map((s, idx) => (
                            <tr key={s.userId}>
                              <td className="px-4 py-3 text-sm">{idx + 1}</td>
                              <td className="px-4 py-3 text-sm">{s.studentCode}</td>
                              <td className="px-4 py-3 text-sm"><div className="flex items-center gap-3">{renderAvatar(s)}<div>{s.fullName}</div></div></td>
                              <td className="px-4 py-3 text-sm">{s.email}</td>
                              <td className="px-4 py-3 text-sm">{s.phoneNumber ?? '-'}</td>
                              <td className="px-4 py-3 text-sm"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${translateStatusBadge(s.status).classes}`}>{translateStatusBadge(s.status).label}</span></td>
                              <td className="px-4 py-3 text-sm">{formatDateDDMMYYYY(s.joinedAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))}

              {filteredByClient.type === 'single' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{filteredByClient.classGroup?.classGroupName ?? 'Danh sách sinh viên'}</h3>
                    <div className="text-sm text-gray-500">{filteredByClient.classGroup?.studentCount ?? 0} sinh viên</div>
                  </div>

                  {filteredByClient.classGroup?.studentCount === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">Không có sinh viên phù hợp</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 text-gray-600">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm">STT</th>
                            <th className="px-4 py-2 text-left text-sm">Mã SV</th>
                            <th className="px-4 py-2 text-left text-sm">Họ tên</th>
                            <th className="px-4 py-2 text-left text-sm">Email</th>
                            <th className="px-4 py-2 text-left text-sm">SĐT</th>
                            <th className="px-4 py-2 text-left text-sm">Trạng thái</th>
                            <th className="px-4 py-2 text-left text-sm">Ngày tham gia</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {filteredByClient.classGroup?.students.map((s, idx) => (
                            <tr key={s.userId}>
                              <td className="px-4 py-3 text-sm">{idx + 1}</td>
                              <td className="px-4 py-3 text-sm">{s.studentCode}</td>
                              <td className="px-4 py-3 text-sm"><div className="flex items-center gap-3">{renderAvatar(s)}<div>{s.fullName}</div></div></td>
                              <td className="px-4 py-3 text-sm">{s.email}</td>
                              <td className="px-4 py-3 text-sm">{s.phoneNumber ?? '-'}</td>
                              <td className="px-4 py-3 text-sm"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${translateStatusBadge(s.status).classes}`}>{translateStatusBadge(s.status).label}</span></td>
                              <td className="px-4 py-3 text-sm">{formatDateDDMMYYYY(s.joinedAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </TeacherDashboardLayout>
  );
}
