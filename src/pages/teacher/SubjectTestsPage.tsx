import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  Clock,
  FileText,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
  Users,
  X,
} from "lucide-react";
import TeacherDashboardLayout from "@/components/teacher/TeacherDashboardLayout";
import { 
  type SubmissionItem,
  type TestItem,
  subjectTestsService,
} from "@/services/teacher/subjectTestsService";

import TestCreateModal from "@/components/teacher/TestCreateModal";

type FilterTab = "ALL" | "QUIZ" | "ESSAY";

const buttonPrimary =
  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700";
const buttonDanger =
  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700";
const buttonSecondary =
  "rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50";
const cardClass = "bg-white border border-gray-200 rounded-xl shadow-sm p-5";
const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500";
const tableHeaderClass =
  "bg-gray-50 text-gray-600 text-xs font-semibold uppercase";
const emptyClass =
  "rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500";

function formatDateTime(iso?: string | null) {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleString("vi-VN");
}

function getTimeStatus(startTime: string | null, endTime: string | null) {
  const now = new Date();
  if (startTime && now < new Date(startTime)) {
    return {
      label: "Chưa mở",
      className:
        "text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-300 text-gray-600 bg-gray-50",
    };
  }
  if (endTime && now > new Date(endTime)) {
    return {
      label: "Đã đóng",
      className:
        "text-xs font-semibold px-2.5 py-1 rounded-full border border-red-200 text-red-700 bg-red-50",
    };
  }
  return {
    label: "Đang mở",
    className:
      "text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200 text-green-700 bg-green-50",
  };
}

function testTypeBadge(testType: TestItem["testType"]) {
  if (testType === "QUIZ") {
    return "text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-200 text-teal-700 bg-teal-50";
  }
  return "text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-200 text-orange-700 bg-orange-50";
}

function scopeBadge(scope: TestItem["scope"]) {
  if (scope === "CHAPTER") {
    return "text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-300 text-gray-700 bg-gray-50";
  }
  return "text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-200 text-purple-700 bg-purple-50";
}

export default function SubjectTestsPage() {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();

  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [filterTab, setFilterTab] = useState<FilterTab>("ALL");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [gradeOpen, setGradeOpen] = useState(false);

  const [activeTest, setActiveTest] = useState<TestItem | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [activeSubmission, setActiveSubmission] =
    useState<SubmissionItem | null>(null); 
  
  const [saving, setSaving] = useState(false);

  const [gradeScore, setGradeScore] = useState(0);
  const [teacherFeedback, setTeacherFeedback] = useState("");

  const filteredTests = useMemo(() => {
    if (filterTab === "ALL") return tests;
    return tests.filter((item) => item.testType === filterTab);
  }, [tests, filterTab]);

  

  const loadTests = async () => {
    if (!subjectId) return;
    setLoading(true);
    try {
      const data = await subjectTestsService.getTeacherSubjectTests(subjectId);
      setTests(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!subjectId) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const data =
          await subjectTestsService.getTeacherSubjectTests(subjectId);
        if (!cancelled) setTests(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [subjectId]);

  

  

  const handleDelete = async (testId: string, testTitle: string) => {
    const ok = window.confirm(`Bạn có chắc muốn xóa bài "${testTitle}"?`);
    if (!ok) return;
    try {
      await subjectTestsService.deleteTest(testId);
      setTests((prev) => prev.filter((t) => t.id !== testId));
    } catch {
      setTests((prev) => prev.filter((t) => t.id !== testId));
    }
  };

 

  const handleOpenSubmissions = async (test: TestItem) => {
    setActiveTest(test);
    setSubmissionOpen(true);
    const data = await subjectTestsService.getTestSubmissions(test.id);
    setSubmissions(data);
  };

  const handleUpdate = async () => {
    if (!activeTest) return;
    setSaving(true);
    try {
      await subjectTestsService.updateTest(activeTest.id, {
        title: activeTest.title,
        durationMinutes: activeTest.durationMinutes,
        startTime: activeTest.startTime,
        endTime: activeTest.endTime,
        maxAttempts: activeTest.maxAttempts,
      });
      setEditOpen(false);
      setActiveTest(null);
      await loadTests();
    } finally {
      setSaving(false);
    }
  };

  

  const handleGrade = async () => {
    if (!activeSubmission) return;
    if (gradeScore < 0 || gradeScore > 10) {
      window.alert("Điểm phải trong khoảng 0-10");
      return;
    }

    setSaving(true);
    try {
      await subjectTestsService.gradeAssignmentSubmission(activeSubmission.id, {
        score: gradeScore,
        teacherFeedback: teacherFeedback || undefined,
      });

      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === activeSubmission.id
            ? {
                ...item,
                status: "GRADED",
                score: gradeScore,
                finalScoreStatus: "MANUAL_GRADED",
              }
            : item,
        ),
      );

      setGradeOpen(false);
      setActiveSubmission(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <TeacherDashboardLayout>
      <div className="space-y-5">
        <div
          className={`${cardClass} flex flex-wrap items-center justify-between gap-3`}
        >
          <div className="flex items-center gap-3">
            <button className={buttonSecondary} onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              Quay lại
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              Quản lý bài kiểm tra
            </h1>
          </div>
          <button
            className={`${buttonPrimary} ${!subjectId ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!subjectId}
            onClick={() => setCreateOpen(true)}
          >
            <Plus size={16} />
            Tạo bài kiểm tra
          </button>
        </div>

        <div className={`${cardClass} flex flex-wrap gap-2`}>
          {[
            { key: "ALL", label: "Tất cả" },
            { key: "QUIZ", label: "Trắc nghiệm (QUIZ)" },
            { key: "ESSAY", label: "Tự luận (ESSAY)" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={
                filterTab === tab.key
                  ? "rounded-lg border border-teal-500 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700"
                  : buttonSecondary
              }
              onClick={() => setFilterTab(tab.key as FilterTab)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={cardClass}>Đang tải dữ liệu...</div>
        ) : filteredTests.length === 0 ? (
          <div className={emptyClass}>Chưa có bài kiểm tra nào</div>
        ) : (
          <div className="space-y-4">
            {filteredTests.map((test) => {
              const status = getTimeStatus(test.startTime, test.endTime);
              return (
                <div key={test.id} className={cardClass}>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className={testTypeBadge(test.testType)}>
                      {test.testType}
                    </span>
                    <span className={scopeBadge(test.scope)}>{test.scope}</span>
                    {test.isAutoGenerated && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200 text-amber-700 bg-amber-50">
                        Random
                      </span>
                    )}
                    <span className={status.className}>{status.label}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800">
                    {test.title}
                  </h3>

                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
                    <div className="inline-flex items-center gap-2">
                      <Clock size={16} />
                      {test.durationMinutes} phút
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <FileText size={16} />
                      {test.questionCount} câu
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <RefreshCcw size={16} />
                      {test.maxAttempts} lần làm
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <Users size={16} />
                      {test.submissionCount} bài nộp
                    </div>
                  </div>

                  {(test.startTime || test.endTime) && (
                    <div className="mt-2 inline-flex items-center gap-2 text-sm text-gray-600">
                      <CalendarClock size={16} />
                      {formatDateTime(test.startTime)} →{" "}
                      {formatDateTime(test.endTime)}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className={buttonSecondary}
                      onClick={() => handleOpenSubmissions(test)}
                    >
                      Xem bài nộp
                    </button>
                    <button
                      className={buttonSecondary}
                      onClick={() => {
                        setActiveTest({ ...test });
                        setEditOpen(true);
                      }}
                    >
                      <Pencil size={16} />
                      Sửa
                    </button>
                    <button
                      className={buttonDanger}
                      onClick={() => handleDelete(test.id, test.title)}
                    >
                      <Trash2 size={16} />
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {editOpen && activeTest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xl rounded-xl bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Sửa bài kiểm tra
                </h2>
                <button
                  className={buttonSecondary}
                  onClick={() => setEditOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Tiêu đề
                  </label>
                  <input
                    className={inputClass}
                    value={activeTest.title}
                    onChange={(e) =>
                      setActiveTest({ ...activeTest, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Thời lượng
                    </label>
                    <input
                      type="number"
                      className={inputClass}
                      value={activeTest.durationMinutes}
                      onChange={(e) =>
                        setActiveTest({
                          ...activeTest,
                          durationMinutes: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Số lần làm
                    </label>
                    <input
                      type="number"
                      className={inputClass}
                      value={activeTest.maxAttempts}
                      onChange={(e) =>
                        setActiveTest({
                          ...activeTest,
                          maxAttempts: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  className={buttonSecondary}
                  onClick={() => setEditOpen(false)}
                >
                  Hủy
                </button>
                <button
                  className={buttonPrimary}
                  onClick={handleUpdate}
                  disabled={saving}
                >
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        )}

        {submissionOpen && activeTest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Bài nộp - {activeTest.title}
                </h2>
                <button
                  className={buttonSecondary}
                  onClick={() => setSubmissionOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full">
                  <thead className={tableHeaderClass}>
                    <tr>
                      <th className="px-4 py-3 text-left">STT</th>
                      <th className="px-4 py-3 text-left">Sinh viên</th>
                      {activeTest.testType === "QUIZ" && (
                        <th className="px-4 py-3 text-left">Điểm</th>
                      )}
                      <th className="px-4 py-3 text-left">Trạng thái</th>
                      <th className="px-4 py-3 text-left">Thời gian nộp</th>
                      {activeTest.testType === "ESSAY" && (
                        <th className="px-4 py-3 text-left">Hành động</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub, index) => (
                      <tr
                        key={sub.id}
                        className="border-t border-gray-100 text-sm text-gray-700"
                      >
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium">
                            {sub.student.lastName}{" "}
                            {sub.student.middleName || ""}{" "}
                            {sub.student.firstName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {sub.student.email}
                          </div>
                        </td>
                        {activeTest.testType === "QUIZ" && (
                          <td className="px-4 py-3">
                            {sub.score !== null ? `${sub.score}/10` : "--"}
                          </td>
                        )}
                        <td className="px-4 py-3">
                          <span
                            className={
                              sub.status === "PENDING"
                                ? "text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200 text-amber-700 bg-amber-50"
                                : "text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-200 text-teal-700 bg-teal-50"
                            }
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {formatDateTime(sub.submittedAt)}
                        </td>
                        {activeTest.testType === "ESSAY" && (
                          <td className="px-4 py-3">
                            {sub.status === "PENDING" ? (
                              <button
                                className={buttonPrimary}
                                onClick={() => {
                                  setActiveSubmission(sub);
                                  setGradeScore(0);
                                  setTeacherFeedback("");
                                  setGradeOpen(true);
                                }}
                              >
                                Chấm bài
                              </button>
                            ) : (
                              <span className="text-xs text-gray-500">
                                Đã chấm
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {submissions.length === 0 && (
                <div className={`${emptyClass} mt-3`}>Chưa có bài nộp</div>
              )}
            </div>
          </div>
        )}

        {gradeOpen && activeSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Chấm bài ESSAY
                </h2>
                <button
                  className={buttonSecondary}
                  onClick={() => setGradeOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div className={cardClass}>
                  <p className="text-sm font-semibold text-gray-700">
                    {activeSubmission.student.lastName}{" "}
                    {activeSubmission.student.middleName || ""}{" "}
                    {activeSubmission.student.firstName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activeSubmission.student.email}
                  </p>
                </div>

                <div className={cardClass}>
                  <p className="mb-2 text-sm font-semibold text-gray-700">
                    Nội dung bài làm
                  </p>
                  <p className="whitespace-pre-wrap text-sm text-gray-700">
                    {activeSubmission.userAnswers?.[0]?.essayAnswer ||
                      "Không có nội dung"}
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Điểm (0-10)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    className={inputClass}
                    value={gradeScore}
                    onChange={(e) => setGradeScore(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Nhận xét giáo viên
                  </label>
                  <textarea
                    rows={4}
                    className={inputClass}
                    value={teacherFeedback}
                    onChange={(e) => setTeacherFeedback(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  className={buttonSecondary}
                  onClick={() => setGradeOpen(false)}
                >
                  Hủy
                </button>
                <button
                  className={buttonPrimary}
                  onClick={handleGrade}
                  disabled={saving}
                >
                  {saving ? "Đang chấm..." : "Xác nhận chấm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <TestCreateModal
        subjectId={subjectId!}
        open={createOpen}
        onClose={() => {setCreateOpen(false)}}
        onSuccess={loadTests}
      />
    </TeacherDashboardLayout>
  );
}


