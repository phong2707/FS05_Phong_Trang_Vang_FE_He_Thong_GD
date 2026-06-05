import { useMemo, useState } from "react";
import { Loader2, Plus, Search, Users, UserMinus, ShieldCheck } from "lucide-react";
import SidebarLayout from "@/layouts/SidebarLayout";
import SidebarMenu from "@/components/SidebarMenu";
import DashboardHeader from "@/components/DashboardHeader";
import { adminMenuItems } from "@/constants/adminMenuConfig";
import {
  classGroupService,
  type ClassGroup,
  type ClassGroupStatus,
  type CreateClassGroupPayload,
  type ClassGroupStudent,
  type AvailableTeacher,
  type SubjectOption,
} from "@/services/admin/classGroupService";

const defaultForm: CreateClassGroupPayload = {
  subjectId: "",
  name: "",
  maxStudents: 30,
  status: "ACTIVE",
};

function formatDate(iso?: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("vi-VN");
}

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object"
  ) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export default function ClassGroupManagement() {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<ClassGroup[]>([]);
  const [query, setQuery] = useState({
    search: "",
    status: "" as "" | ClassGroupStatus,
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20 });

  const [formOpen, setFormOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<CreateClassGroupPayload>(defaultForm);
  const [subjectOptions, setSubjectOptions] = useState<SubjectOption[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<ClassGroup | null>(null);
  const [students, setStudents] = useState<ClassGroupStudent[]>([]);
  const [teachers, setTeachers] = useState<AvailableTeacher[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const [addStudentValue, setAddStudentValue] = useState("");
  const [addingStudents, setAddingStudents] = useState(false);
  const [studentPage, setStudentPage] = useState(1);
  const studentPageSize = 8;

  const currentCount = selectedGroup?._count?.groupUsers ?? students.length;
  const maxStudents = selectedGroup?.maxStudents ?? 0;
  const isFull = maxStudents > 0 && currentCount >= maxStudents;

  const loadGroups = async () => {
    setLoading(true);
    try {
      const data = await classGroupService.getClassGroups({
        search: query.search || undefined,
        status: query.status || undefined,
        page: query.page,
        limit: query.limit,
      });
      setGroups(data?.items ?? []);
      setPagination({
        total: data?.total ?? 0,
        page: data?.page ?? query.page,
        limit: data?.limit ?? query.limit,
      });
    } catch (error: unknown) {
      alert(getErrorMessage(error, "Không thể tải danh sách lớp"));
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const [groupDetail, studentRows, teacherRows] = await Promise.all([
        classGroupService.getClassGroupById(id),
        classGroupService.getClassGroupStudents(id),
        classGroupService.getAvailableTeachers(id),
      ]);
      setSelectedGroup(groupDetail);
      setStudents(studentRows);
      setTeachers(teacherRows);
    } catch (error: unknown) {
      alert(getErrorMessage(error, "Không thể tải chi tiết lớp"));
    } finally {
      setDetailLoading(false);
    }
  };

  const submitFilter = async () => {
    setQuery((q) => ({ ...q, page: 1 }));
    await loadGroups();
  };

  const loadSubjectsForCreate = async () => {
    try {
      const subjects = await classGroupService.getSubjectsWithoutClassGroup();
      setSubjectOptions(subjects);
    } catch {
      setSubjectOptions([]);
    }
  };

  const submitCreate = async () => {
    if (!formData.subjectId || !formData.name) {
      alert("Vui lòng chọn môn học và nhập tên lớp");
      return;
    }
    setCreating(true);
    try {
      const created = await classGroupService.createClassGroup(formData);
      setFormOpen(false);
      setFormData(defaultForm);
      await loadGroups();
      await loadDetail(created.id);
    } catch (error: unknown) {
      alert(getErrorMessage(error, "Tạo lớp thất bại"));
    } finally {
      setCreating(false);
    }
  };

  const deactivateGroup = async (id: string) => {
    if (!confirm("Xác nhận huỷ kích hoạt lớp này?")) return;
    try {
      await classGroupService.deactivateClassGroup(id);
      await loadGroups();
      if (selectedGroup?.id === id) {
        await loadDetail(id);
      }
    } catch (error: unknown) {
      alert(getErrorMessage(error, "Huỷ kích hoạt thất bại"));
    }
  };

  const submitAddStudents = async () => {
    const emails = addStudentValue
      .split(/[\n,;]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (!selectedGroup || emails.length === 0) {
      alert("Nhập danh sách email, ngăn cách bởi dấu phẩy hoặc xuống dòng");
      return;
    }

    setAddingStudents(true);
    try {
      const users = await classGroupService.findUsersByEmails(emails);
      const emailToUserId = new Map(
        users.map((u) => [(u.email ?? "").toLowerCase(), u.id] as const)
      );

      const userIds = emails.map((e) => emailToUserId.get(e)).filter(Boolean) as string[];
      const missingEmails = emails.filter((e) => !emailToUserId.has(e));

      if (userIds.length === 0) {
        alert("Không tìm thấy người dùng hợp lệ từ các email đã nhập");
        return;
      }

      const result = await classGroupService.addStudents(selectedGroup.id, userIds);
      const failedLines = result.failed.map(
        (f: { userId: string; reason: string }) => `- ${f.userId}: ${f.reason}`
      );
      const missingLines = missingEmails.map((email) => `- ${email}: Không tìm thấy user theo email`);
      const info = [`Đã thêm: ${result.added.length}`]
        .concat(
          failedLines.length || missingLines.length
            ? ["Không thêm được:", ...missingLines, ...failedLines]
            : []
        )
        .join("\n");
      alert(info);
      setAddStudentValue("");
      await loadDetail(selectedGroup.id);
      await loadGroups();
    } catch (error: unknown) {
      alert(getErrorMessage(error, "Thêm sinh viên thất bại"));
    } finally {
      setAddingStudents(false);
    }
  };

  const removeStudent = async (userId: string) => {
    if (!selectedGroup) return;
    if (!confirm("Xác nhận xoá sinh viên khỏi lớp?")) return;

    try {
      await classGroupService.removeStudent(selectedGroup.id, userId);
      await loadDetail(selectedGroup.id);
      await loadGroups();
    } catch (error: unknown) {
      alert(getErrorMessage(error, "Xoá sinh viên thất bại"));
    }
  };

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((pagination.total || 0) / (pagination.limit || 20))),
    [pagination.total, pagination.limit]
  );

  const studentTotalPages = useMemo(
    () => Math.max(1, Math.ceil(students.length / studentPageSize)),
    [students.length]
  );

  const pagedStudents = useMemo(() => {
    const start = (studentPage - 1) * studentPageSize;
    return students.slice(start, start + studentPageSize);
  }, [students, studentPage]);

  return (
    <SidebarLayout sidebar={<SidebarMenu items={adminMenuItems} />}>
      <DashboardHeader />
      <main className="flex-1 overflow-auto bg-slate-50 p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-800">Quản lý ClassGroup</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={loadGroups}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50"
            >
              Tải lại
            </button>
            <button
              onClick={async () => {
                setFormOpen(true);
                await loadSubjectsForCreate();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              <Plus size={16} />
              Tạo lớp mới
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              value={query.search}
              onChange={(e) => setQuery((q) => ({ ...q, search: e.target.value }))}
              placeholder="Tìm theo tên lớp..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>
          <select
            value={query.status}
            onChange={(e) =>
              setQuery((q) => ({ ...q, status: e.target.value as "" | ClassGroupStatus, page: 1 }))
            }
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
          <button onClick={submitFilter} className="px-4 py-2 rounded-xl bg-slate-900 text-white">
            Lọc
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Tên lớp</th>
                <th className="px-4 py-3">Môn học</th>
                <th className="px-4 py-3">Khoá học</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Sĩ số</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Loader2 className="animate-spin mx-auto text-indigo-600" />
                  </td>
                </tr>
              ) : groups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                groups.map((g) => (
                  <tr key={g.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-800">{g.name}</td>
                    <td className="px-4 py-3">{g.subject?.name ?? "-"}</td>
                    <td className="px-4 py-3">{g.subject?.course?.title ?? "-"}</td>
                    <td className="px-4 py-3">
                      {formatDate(g.startDate)} → {formatDate(g.endDate)}
                    </td>
                    <td className="px-4 py-3">
                      {g._count?.groupUsers ?? 0}/{g.maxStudents ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          g.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {g.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => loadDetail(g.id)}
                        className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-50"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => deactivateGroup(g.id)}
                        className="px-3 py-1 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        Huỷ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Tổng: <b>{pagination.total}</b> bản ghi
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setQuery((q) => ({ ...q, page: Math.max(1, q.page - 1) }))}
                className="px-3 py-1 rounded-lg border border-slate-300 disabled:opacity-50"
              >
                Trước
              </button>
              <span className="text-sm">
                Trang {pagination.page}/{totalPages}
              </span>
              <button
                disabled={pagination.page >= totalPages}
                onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
                className="px-3 py-1 rounded-lg border border-slate-300 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>

        {selectedGroup && (
          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{selectedGroup.name}</h2>
                <p className="text-sm text-slate-500">
                  {selectedGroup.subject?.name} · {selectedGroup.subject?.course?.title}
                </p>
              </div>
              <div className="text-sm">
                <span
                  className={`px-2 py-1 rounded-full font-semibold ${
                    isFull ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {currentCount}/{maxStudents} sinh viên
                </span>
              </div>
            </div>

            {detailLoading ? (
              <div className="py-10 text-center">
                <Loader2 className="animate-spin mx-auto text-indigo-600" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users size={18} />
                    <h3 className="font-semibold">Sinh viên</h3>
                  </div>

                  <div className="space-y-2 mb-4">
                    {students.length === 0 ? (
                      <p className="text-sm text-slate-500">Chưa có sinh viên trong lớp</p>
                    ) : (
                      pagedStudents.map((s) => (
                        <div
                          key={s.userId}
                          className="flex items-center justify-between text-sm border border-slate-100 rounded-lg px-3 py-2"
                        >
                          <div>
                            <p className="font-medium">
                              {s.user?.firstName} {s.user?.lastName}
                            </p>
                            <p className="text-slate-500">{s.user?.email}</p>
                          </div>
                          <button
                            onClick={() => removeStudent(s.userId)}
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <UserMinus size={14} />
                            Xoá
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Thêm sinh viên (nhập email, cách nhau dấu phẩy hoặc xuống dòng)
                    </label>
                    <textarea
                      value={addStudentValue}
                      onChange={(e) => setAddStudentValue(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      placeholder="a@gmail.com, b@gmail.com"
                    />
                    <button
                      onClick={submitAddStudents}
                      disabled={addingStudents || isFull}
                      className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold disabled:opacity-50"
                    >
                      {addingStudents ? "Đang thêm..." : "Thêm sinh viên"}
                    </button>
                    {students.length > studentPageSize && (
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          disabled={studentPage <= 1}
                          onClick={() => setStudentPage((p) => Math.max(1, p - 1))}
                          className="px-2 py-1 rounded border border-slate-300 text-sm disabled:opacity-50"
                        >
                          Trước
                        </button>
                        <span className="text-xs text-slate-500">
                          Trang {studentPage}/{studentTotalPages}
                        </span>
                        <button
                          disabled={studentPage >= studentTotalPages}
                          onClick={() => setStudentPage((p) => Math.min(studentTotalPages, p + 1))}
                          className="px-2 py-1 rounded border border-slate-300 text-sm disabled:opacity-50"
                        >
                          Sau
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={18} />
                    <h3 className="font-semibold">Giáo viên khả dụng</h3>
                  </div>
                  {teachers.length === 0 ? (
                    <p className="text-sm text-slate-500">Không có giáo viên khả dụng</p>
                  ) : (
                    <div className="space-y-2">
                      {teachers.map((t) => (
                        <div
                          key={t.teacherId}
                          className="text-sm border border-slate-100 rounded-lg px-3 py-2"
                        >
                          <p className="font-medium">
                            {t.teacher?.firstName} {t.teacher?.lastName}
                          </p>
                          <p className="text-slate-500">{t.teacher?.email}</p>
                          <span className="inline-block mt-1 text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 font-semibold">
                            {t.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {formOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[100]">
            <div className="bg-white w-full max-w-xl rounded-2xl p-5 space-y-4">
              <h2 className="text-xl font-bold">Tạo ClassGroup</h2>

              <div className="grid gap-3">
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData((f) => ({ ...f, subjectId: e.target.value }))}
                  className="px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="">Chọn môn học chưa có lớp</option>
                  {subjectOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}{s.course?.title ? ` - ${s.course.title}` : ""}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Tên lớp"
                  value={formData.name}
                  onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                  className="px-3 py-2 rounded-lg border border-slate-200"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) => setFormData((f) => ({ ...f, startDate: e.target.value || undefined }))}
                    className="px-3 py-2 rounded-lg border border-slate-200"
                  />
                  <input
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) => setFormData((f) => ({ ...f, endDate: e.target.value || undefined }))}
                    className="px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <input
                  type="number"
                  min={1}
                  max={500}
                  placeholder="Sĩ số tối đa"
                  value={formData.maxStudents ?? 30}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, maxStudents: Number(e.target.value || 30) }))
                  }
                  className="px-3 py-2 rounded-lg border border-slate-200"
                />
                <input
                  placeholder="Room link (optional)"
                  value={formData.roomLink || ""}
                  onChange={(e) => setFormData((f) => ({ ...f, roomLink: e.target.value || undefined }))}
                  className="px-3 py-2 rounded-lg border border-slate-200"
                />
                <select
                  value={formData.status || "ACTIVE"}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, status: e.target.value as ClassGroupStatus }))
                  }
                  className="px-3 py-2 rounded-lg border border-slate-200"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300"
                >
                  Huỷ
                </button>
                <button
                  onClick={submitCreate}
                  disabled={creating}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold disabled:opacity-50"
                >
                  {creating ? "Đang tạo..." : "Tạo lớp"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </SidebarLayout>
  );
}
