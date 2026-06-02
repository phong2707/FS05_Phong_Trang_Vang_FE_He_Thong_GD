/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import TeacherDashboardLayout from "@/components/teacher/TeacherDashboardLayout";
import {
  ArrowLeft,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Calendar,
  BookOpen,
  Pencil,
  Trash2,
  HelpCircle,
  X,
} from "lucide-react";

// Interfaces (the same as yêu cầu)
interface QuestionAnswer {
  id?: string;
  answerText: string;
  isCorrect: boolean;
  orderIndex: number;
}

interface QuestionType {
  id: string;
  name: string;
  description: string | null;
}

type QuestionFormat = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "ESSAY";

interface Question {
  id: string;
  subjectId: string;
  teacherId: string;
  typeId: string;
  questionFormat: QuestionFormat;
  content: string;
  explanation: string | null;
  createdAt: string;
  questionType: QuestionType;
  answers: QuestionAnswer[];
}

interface QuestionFormData {
  typeId: string;
  questionFormat: QuestionFormat;
  content: string;
  explanation: string;
  answers: QuestionAnswer[];
}

// Helper: API with mock fallback
const withMockFallback = async <T,>(
  apiCall: () => Promise<T>,
  fallback: () => T
): Promise<T> => {
  try {
    return await apiCall();
  } catch {
    return fallback();
  }
};

// Mock data theo yêu cầu
const mockQuestionTypes: QuestionType[] = [
  { id: "type-1", name: "Lý thuyết", description: null },
  { id: "type-2", name: "Thực hành", description: null },
  { id: "type-3", name: "Tổng hợp", description: null },
];

const mockQuestions = (subjectId: string): Question[] => [
  {
    id: "q-1",
    subjectId,
    teacherId: "teacher-1",
    typeId: "type-1",
    questionFormat: "SINGLE_CHOICE",
    content: "HTTP là viết tắt của?",
    explanation: "HyperText Transfer Protocol",
    createdAt: new Date().toISOString(),
    questionType: { id: "type-1", name: "Lý thuyết", description: null },
    answers: [
      {
        id: "a-1",
        answerText: "HyperText Transfer Protocol",
        isCorrect: true,
        orderIndex: 1,
      },
      { id: "a-2", answerText: "High Transfer Text Protocol", isCorrect: false, orderIndex: 2 },
      { id: "a-3", answerText: "HyperText Transmission Protocol", isCorrect: false, orderIndex: 3 },
      { id: "a-4", answerText: "Home Tool Transfer Protocol", isCorrect: false, orderIndex: 4 },
    ],
  },
  {
    id: "q-2",
    subjectId,
    teacherId: "teacher-1",
    typeId: "type-2",
    questionFormat: "MULTIPLE_CHOICE",
    content: "Những phương thức nào thuộc HTTP?",
    explanation: null,
    createdAt: new Date().toISOString(),
    questionType: { id: "type-2", name: "Thực hành", description: null },
    answers: [
      { id: "a-5", answerText: "GET", isCorrect: true, orderIndex: 1 },
      { id: "a-6", answerText: "POST", isCorrect: true, orderIndex: 2 },
      { id: "a-7", answerText: "SEND", isCorrect: false, orderIndex: 3 },
      { id: "a-8", answerText: "DELETE", isCorrect: true, orderIndex: 4 },
    ],
  },
  {
    id: "q-3",
    subjectId,
    teacherId: "teacher-1",
    typeId: "type-1",
    questionFormat: "ESSAY",
    content: "Hãy trình bày sự khác nhau giữa GET và POST trong HTTP.",
    explanation: "GET dùng để lấy dữ liệu, không có body...",
    createdAt: new Date().toISOString(),
    questionType: { id: "type-1", name: "Lý thuyết", description: null },
    answers: [],
  },
];

export default function SubjectQuestionBankPage() {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [types, setTypes] = useState<QuestionType[]>([]);

  // Filters
  const [formatFilter, setFormatFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [searchText, setSearchText] = useState<string>("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);

  // Banner error
  const [bannerError, setBannerError] = useState<string | null>(null);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load types
  useEffect(() => {
    (async () => {
      const data = await withMockFallback(
        async () => {
          const res = await apiClient.get("/v1/question-types");
          return res?.data?.data as QuestionType[];
        },
        () => mockQuestionTypes
      );

      setTypes(data);
    })();
  }, []);

  // Load questions (call when subjectId or format/type filter changes)
  useEffect(() => {
    if (!subjectId) return;

    (async () => {
      setLoading(true);
      try {
        // Call API with format and type filter (search is client-side)
        const params: any = {};
        if (formatFilter !== "ALL") params.format = formatFilter;
        if (typeFilter !== "ALL") params.typeId = typeFilter;

        const data = await withMockFallback(
          async () => {
            const res = await apiClient.get(`/v1/subjects/${subjectId}/questions`, { params });
            return res?.data?.data as Question[];
          },
          () => mockQuestions(subjectId)
        );

        setQuestions(data);
      } catch (err) {
        // ignore for now
      } finally {
        setLoading(false);
      }
    })();
  }, [subjectId, formatFilter, typeFilter]);

  // Filtered list (search on client)
  const filtered = useMemo(() => {
    if (!searchText.trim()) return questions;
    const s = searchText.trim().toLowerCase();
    return questions.filter((q) => q.content.toLowerCase().includes(s));
  }, [questions, searchText]);

  // Handlers
  const openCreate = () => {
    setEditing(null);
    setShowModal(true);
    setBannerError(null);
  };

  const openEdit = async (q: Question) => {
    setBannerError(null);
    // Fetch detail (to ensure up-to-date answers)
    const data = await withMockFallback(
      async () => {
        const res = await apiClient.get(`/v1/questions/${q.id}`);
        return res?.data?.data as Question;
      },
      () => q
    );

    setEditing(data);
    setShowModal(true);
  };

  const handleDelete = async (q: Question) => {
    setBannerError(null);
    const ok = window.confirm("Bạn có chắc muốn xóa câu hỏi này?");
    if (!ok) return;

    setDeletingId(q.id);

    try {
      await apiClient.delete(`/v1/questions/${q.id}`);
      setQuestions((prev) => prev.filter((p) => p.id !== q.id));
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Lỗi";
      setBannerError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  // Submit create/update
  const handleSubmit = async (form: QuestionFormData, existingId?: string) => {
    setSaving(true);
    setBannerError(null);

    try {
      if (existingId) {
        const res = await apiClient.put(`/v1/questions/${existingId}`, form);
        const updated = res?.data?.data as Question;
        setQuestions((prev) => prev.map((p) => (p.id === existingId ? updated : p)));
      } else {
        const res = await apiClient.post(`/v1/questions`, form);
        const created = res?.data?.data as Question;
        // thêm vào đầu
        setQuestions((prev) => [created, ...prev]);
      }

      setShowModal(false);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Lỗi";
      setBannerError(msg);
    } finally {
      setSaving(false);
    }
  };

  const totalCount = questions.length;
  const shownCount = filtered.length;

  return (
    <TeacherDashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} /> Quay lại
          </button>

          <h1 className="text-xl font-semibold">Ngân hàng câu hỏi</h1>

          <span className="text-sm font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
            {totalCount}
          </span>
        </div>

        <div>
          <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700" onClick={openCreate}>
            <Plus size={16} /> Thêm câu hỏi
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <select
          className="w-60 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={formatFilter}
          onChange={(e) => setFormatFilter(e.target.value)}
        >
          <option value="ALL">Tất cả</option>
          <option value="SINGLE_CHOICE">Trắc nghiệm 1 đáp án</option>
          <option value="MULTIPLE_CHOICE">Trắc nghiệm nhiều đáp án</option>
          <option value="ESSAY">Tự luận</option>
        </select>

        <select
          className="w-60 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">Tất cả loại</option>
          {types.map((t) => (
            <option value={t.id} key={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <div className="relative flex-1 max-w-md">
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 pl-10"
            placeholder="Tìm kiếm câu hỏi"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>

        <div className="text-sm text-gray-600">Đang hiển thị {shownCount}/{totalCount} câu</div>
      </div>

      {bannerError && (
        <div className="rounded-xl border border-red-400 bg-red-50 p-4 mb-4 text-red-700">
          {bannerError}
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm text-center">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
            {searchText ? (
              <>
                <Search className="mx-auto mb-3 text-gray-400" />
                <div className="font-semibold">Không tìm thấy câu hỏi phù hợp</div>
              </>
            ) : (
              <>
                <HelpCircle className="mx-auto mb-3 text-gray-400" />
                <div className="font-semibold mb-2">Chưa có câu hỏi nào</div>
                <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700" onClick={openCreate}>
                  <Plus size={14} /> Thêm câu hỏi đầu tiên
                </button>
              </>
            )}
          </div>
        ) : (
          filtered.map((q) => (
            <div key={q.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {/* format badge */}
                    {q.questionFormat === "SINGLE_CHOICE" && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-teal-100 text-teal-700">Trắc nghiệm 1 đáp án</span>
                    )}
                    {q.questionFormat === "MULTIPLE_CHOICE" && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-blue-100 text-blue-700">Trắc nghiệm nhiều đáp án</span>
                    )}
                    {q.questionFormat === "ESSAY" && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-amber-100 text-amber-700">Tự luận</span>
                    )}

                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-gray-100 text-gray-600">{q.questionType?.name}</span>
                  </div>

                  <div className="text-sm text-gray-800 mb-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: q.content }} />

                  {/* answers or explanation */}
                  {q.questionFormat !== "ESSAY" ? (
                    <div className="space-y-1">
                      {q.answers.map((a) => (
                        <div key={a.id} className="flex items-center gap-2">
                          {a.isCorrect ? (
                            <CheckCircle2 className="text-green-600" size={16} />
                          ) : (
                            <Circle className="text-gray-300" size={16} />
                          )}
                          <div className={a.isCorrect ? "text-green-700 font-semibold text-sm" : "text-gray-500 text-sm"}>{a.answerText}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      <div className="font-semibold">Đáp án mẫu:</div>
                      <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: q.explanation || "" }} />
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  <div className="text-xs text-gray-500">
                    <div className="flex items-center gap-1"><Calendar size={14} /> {new Date(q.createdAt).toLocaleDateString()}</div>
                    <div className="flex items-center gap-1 mt-1"><BookOpen size={14} /> 0</div>
                  </div>

                  <div className="flex gap-2">
                    <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50" onClick={() => openEdit(q)}>
                      <Pencil size={14} />
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600" onClick={() => handleDelete(q)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <QuestionFormModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          saving={saving}
          initialData={editing || undefined}
          types={types}
          subjectId={subjectId!}
        />
      )}
    </TeacherDashboardLayout>
  );
}

// Modal component nằm trong cùng file
function QuestionFormModal({
  onClose,
  onSubmit,
  saving,
  initialData,
  types,
  subjectId,
}: {
  onClose: () => void;
  onSubmit: (data: QuestionFormData, existingId?: string) => Promise<void>;
  saving: boolean;
  initialData?: Question;
  types: QuestionType[];
  subjectId: string;
}) {
  // Form state
  const [typeId, setTypeId] = useState<string>(initialData?.typeId || (types[0]?.id || ""));
  const [questionFormat, setQuestionFormat] = useState<QuestionFormat>(initialData?.questionFormat || "SINGLE_CHOICE");
  const [content, setContent] = useState<string>(initialData?.content || "");
  const [explanation, setExplanation] = useState<string>(initialData?.explanation || "");
  const [answers, setAnswers] = useState<QuestionAnswer[]>(
    initialData?.answers?.length ? initialData!.answers.map((a, i) => ({ ...a, orderIndex: i + 1 })) : [
      { answerText: "", isCorrect: false, orderIndex: 1 },
      { answerText: "", isCorrect: false, orderIndex: 2 },
    ]
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setErrors({});
  }, [questionFormat, content, answers]);

  const addAnswer = () => {
    if (answers.length >= 6) return;
    setAnswers((s) => [...s, { answerText: "", isCorrect: false, orderIndex: s.length + 1 }]);
  };

  const removeAnswer = (idx: number) => {
    setAnswers((s) => s.filter((_, i) => i !== idx).map((a, i) => ({ ...a, orderIndex: i + 1 })));
  };

  const updateAnswerText = (idx: number, text: string) => {
    setAnswers((s) => s.map((a, i) => (i === idx ? { ...a, answerText: text } : a)));
  };

  const toggleCorrect = (idx: number) => {
    if (questionFormat === "SINGLE_CHOICE") {
      setAnswers((s) => s.map((a, i) => ({ ...a, isCorrect: i === idx })));
    } else {
      setAnswers((s) => s.map((a, i) => (i === idx ? { ...a, isCorrect: !a.isCorrect } : a)));
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!typeId) e.typeId = "Chọn loại câu hỏi";
    if (!content || content.trim().length < 10) e.content = "Nội dung phải có ít nhất 10 ký tự";

    if (questionFormat !== "ESSAY") {
      if (answers.length < 2) e.answers = "Phải có ít nhất 2 đáp án";
      const correctCount = answers.filter((a) => a.isCorrect).length;
      if (questionFormat === "SINGLE_CHOICE" && correctCount !== 1) e.answers = "Câu SINGLE phải có đúng 1 đáp án đúng";
      if (questionFormat === "MULTIPLE_CHOICE" && correctCount < 1) e.answers = "Câu MULTIPLE phải có ít nhất 1 đáp án đúng";
      if (answers.some((a) => !a.answerText || !a.answerText.trim())) e.answers = "Các đáp án không được để trống";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload: QuestionFormData = {
      typeId,
      questionFormat,
      content,
      explanation,
      answers: questionFormat === "ESSAY" ? [] : answers.map((a, i) => ({ ...a, orderIndex: i + 1 })),
    };

    await onSubmit(payload, initialData?.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{initialData ? "Sửa câu hỏi" : "Thêm câu hỏi"}</h3>
          <button className="rounded-full p-2 hover:bg-gray-100" onClick={onClose}><X /></button>
        </div>

        {/* Phần 1 - thông tin chung */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Loại câu hỏi</label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={typeId} onChange={(e) => setTypeId(e.target.value)}>
              {types.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {errors.typeId && <div className="text-sm text-red-600 mt-1">{errors.typeId}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Loại câu hỏi</label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={questionFormat} onChange={(e) => setQuestionFormat(e.target.value as QuestionFormat)}>
              <option value="SINGLE_CHOICE">Trắc nghiệm 1 đáp án</option>
              <option value="MULTIPLE_CHOICE">Trắc nghiệm nhiều đáp án</option>
              <option value="ESSAY">Tự luận</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nội dung câu hỏi</label>
            <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
            {errors.content && <div className="text-sm text-red-600 mt-1">{errors.content}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Giải thích / Đáp án mẫu (không bắt buộc)</label>
            <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" rows={3} value={explanation} onChange={(e) => setExplanation(e.target.value)} />
          </div>
        </div>

        {/* Phần 2 - đáp án */}
        {questionFormat !== "ESSAY" ? (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Đáp án</h4>
              <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50" onClick={addAnswer}>+ Thêm đáp án</button>
            </div>

            {answers.map((a, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input type="checkbox" checked={a.isCorrect} onChange={() => toggleCorrect(idx)} />
                <input value={a.answerText} onChange={(e) => updateAnswerText(idx, e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                <button className="rounded-lg p-2 text-sm text-gray-600 hover:bg-gray-100" onClick={() => removeAnswer(idx)}>
                  <X size={16} />
                </button>
              </div>
            ))}

            {errors.answers && <div className="text-sm text-red-600 mt-1">{errors.answers}</div>}
          </div>
        ) : (
          <div className="mb-4 text-sm text-gray-600">Sinh viên sẽ nhập bài làm dạng văn bản. Giáo viên chấm tay sau khi nộp.</div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50" onClick={onClose}>Hủy</button>
          <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700" onClick={handleSubmit} disabled={saving}>
            {saving ? "Đang lưu..." : (initialData ? "Lưu thay đổi" : "Tạo câu hỏi")}
          </button>
        </div>
      </div>
    </div>
  );
}
