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
} from "lucide-react";
import DOMPurify from "dompurify";

// ===== TYPES =====
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
  difficulty: string;
  questionFormat: QuestionFormat;
  content: string;
  explanation: string | null;
  createdAt: string;
  questionType: QuestionType;
  answers: QuestionAnswer[];
}

// ===== MOCK =====
const withMockFallback = async <T,>(
  apiCall: () => Promise<T>,
  fallback: () => T,
): Promise<T> => {
  try {
    return await apiCall();
  } catch {
    return fallback();
  }
};

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
    questionType: mockQuestionTypes[0],

    difficulty: "EASY",

    answers: [
      {
        answerText: "HyperText Transfer Protocol",
        isCorrect: true,
        orderIndex: 1,
      },
      {
        answerText: "High Transfer Text Protocol",
        isCorrect: false,
        orderIndex: 2,
      },
    ],
  },
];

// ===== MAIN =====
export default function SubjectQuestionBankPage() {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [types, setTypes] = useState<QuestionType[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [chapterId, setChapterId] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // ===== LOAD =====
  useEffect(() => {
    (async () => {
      const data = await withMockFallback(
        async () => {
          const res = await apiClient.get("/v1/question-types");
          return res?.data?.data as QuestionType[];
        },
        () => mockQuestionTypes,
      );
      setTypes(data);
    })();
  }, []);

  useEffect(() => {
    if (!subjectId) return;

    (async () => {
      setLoading(true);

      try {
        const res = await apiClient.get("/v1/questions", {
          params: {
            subjectId,
            chapterId: chapterId || undefined,
            typeId: typeFilter !== "ALL" ? typeFilter : undefined,
            difficulty:
              difficultyFilter !== "ALL" ? difficultyFilter : undefined,
            search: searchText || undefined,
            page,
            pageSize: 10,
          },
        });

        const data = res.data.data;

        setQuestions(data.items);
        setTotal(data.total);
      } catch {
        // fallback nếu API lỗi
        const mock = mockQuestions(subjectId);
        setQuestions(mock);
        setTotal(mock.length);
      }

      setLoading(false);
    })();
  }, [subjectId, chapterId, difficultyFilter, typeFilter, searchText, page]);

  useEffect(() => {
    if (!subjectId) return;

    (async () => {
      try {
        const res = await apiClient.get(`/v1/subjects/${subjectId}`);
        setChapters(res.data.data?.chapters || []);
      } catch {
        console.error("Lỗi load chapters");
      }
    })();
  }, [subjectId]);

  useEffect(() => {
    setPage(1);
  }, [subjectId]);

  // ===== DELETE =====
  const handleDelete = async (q: Question) => {
    const ok = window.confirm("Bạn có chắc muốn xóa?");
    if (!ok) return;

    try {
      await apiClient.delete(`/v1/questions/${q.id}`);
      setTotal((prev) => prev - 1);
      setQuestions((prev) => {
        const newList = prev.filter((p) => p.id !== q.id);

        if (newList.length === 0 && page > 1) {
          setPage((prev) => prev - 1);
        }

        return newList;
      });
    } catch {
      alert("Lỗi xóa");
    }
  };
  const totalPages = Math.max(1, Math.ceil(total / 10));
  return (
    <TeacherDashboardLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Quay lại
          </button>

          <h1 className="text-xl font-semibold">Ngân hàng câu hỏi</h1>
        </div>

        {/* ✅ REFRACTOR: NAVIGATE PAGE */}
        <button
          onClick={() =>
            navigate(`/teacher/subjects/${subjectId}/questions/create`)
          }
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus size={16} /> Thêm câu hỏi
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Tìm kiếm..."
          className="border p-2 flex-1 rounded"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
        />

        {/* CHƯƠNG */}
        <select
          disabled={!chapters.length}
          value={chapterId}
          onChange={(e) => {
            setChapterId(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="">Tất cả câu hỏi của môn</option>

          {/* <option value="COURSE">Tất cả câu hỏi của khóa</option> */}

          {chapters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title || c.name}
            </option>
          ))}
        </select>

        {/* TYPE FILTER */}
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="ALL">Tất cả loại</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* MỨC ĐỘ */}
        <select
          value={difficultyFilter}
          onChange={(e) => {
            setDifficultyFilter(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="ALL">Tất cả mức độ</option>
          <option value="EASY">Dễ</option>
          <option value="MEDIUM">Trung bình</option>
          <option value="HARD">Khó</option>
        </select>
      </div>
      {/* LIST */}
      <div className="space-y-4">
        {loading ? (
          <div>Đang tải...</div>
        ) : questions.length === 0 ? (
          <div className="text-gray-500">Không có câu hỏi</div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="p-4 border rounded-xl bg-white">
              <div className="flex gap-2 text-sm mb-2">
                {/* FORMAT */}
                <span className="px-2 py-1 bg-blue-100 rounded">
                  {q.questionFormat === "ESSAY"
                    ? "Tự luận"
                    : q.questionFormat === "SINGLE_CHOICE"
                      ? "Trắc nghiệm 1 đáp án"
                      : "Trắc nghiệm nhiều đáp án"}
                </span>

                {/* DIFFICULTY */}
                <span className="px-2 py-1 bg-green-100 rounded">
                  {q.difficulty === "EASY"
                    ? "Dễ"
                    : q.difficulty === "MEDIUM"
                      ? "Trung bình"
                      : "Khó"}
                </span>
              </div>

              <div
                className="cursor-pointer hover:underline line-clamp-2"
                onClick={() => navigate(`/teacher/questions/${q.id}`)}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(q.content),
                }}
              />

              <div className="mt-2 space-y-1">
                {q.answers.map((a, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    {a.isCorrect ? (
                      <CheckCircle2 size={16} className="text-green-600" />
                    ) : (
                      <Circle size={16} className="text-gray-300" />
                    )}
                    <span>{a.answerText}</span>
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-400 mt-2">
                {new Date(q.createdAt).toLocaleDateString()}
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() =>
                    navigate(
                      `/teacher/subjects/${subjectId}/questions/${q.id}/edit`,
                    )
                  }
                  className="border px-3 py-1 rounded"
                >
                  <Pencil size={14} />
                </button>

                <button
                  onClick={() => handleDelete(q)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-teal-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </TeacherDashboardLayout>
  );
}
