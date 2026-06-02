/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import TeacherDashboardLayout from "@/components/teacher/TeacherDashboardLayout";
import DOMPurify from "dompurify";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";

export default function QuestionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await apiClient.get(`/v1/questions/${id}`);
        setQuestion(res.data.data);
      } catch {
        alert("Lỗi tải câu hỏi");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <TeacherDashboardLayout>
        <div>Đang tải...</div>
      </TeacherDashboardLayout>
    );
  }

  if (!question) {
    return (
      <TeacherDashboardLayout>
        <div>Không tìm thấy câu hỏi</div>
      </TeacherDashboardLayout>
    );
  }

  return (
    <TeacherDashboardLayout>
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="flex gap-2">
          <ArrowLeft size={16} />
          Quay lại
        </button>

        <h1 className="text-xl font-semibold">Chi tiết câu hỏi</h1>
      </div>

      {/* BADGE */}
      <div className="flex gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-100 rounded">
          {question.questionFormat?.replaceAll("_", " ")}
        </span>

        <span className="px-2 py-1 bg-gray-100 rounded">
          {question.questionType?.name}
        </span>
      </div>

      {/* CONTENT */}
      <div
        className="p-4 border rounded bg-white"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(question.content),
        }}
      />

      {/* ANSWERS */}
      {question.questionFormat !== "ESSAY" && (
        <div className="mt-4 space-y-2">
          {question.answers.map((a: any, i: number) => (
            <div key={i} className="flex gap-2 items-center">
              {a.isCorrect ? (
                <CheckCircle2 className="text-green-600" size={16} />
              ) : (
                <Circle className="text-gray-300" size={16} />
              )}
              <span
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(a.answerText),
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* ESSAY RUBRIC */}
      {question.questionFormat === "ESSAY" && (
        <div className="mt-4 border p-4 rounded bg-yellow-50">
          <h3 className="font-semibold mb-2">Rubric chấm điểm</h3>

          {Array.isArray(question.explanation) ? (
            question.explanation.map((r: any, i: number) => (
              <div key={i} className="flex justify-between">
                <span>{r.name}</span>
                <span>{r.max} điểm</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500">Không có rubric</div>
          )}
        </div>
      )}

      {/* EXPLANATION */}
      {question.questionFormat !== "ESSAY" && question.explanation && (
        <div className="mt-4 border p-4 rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Giải thích</h3>

          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(question.explanation),
            }}
          />
        </div>
      )}
    </TeacherDashboardLayout>
  );
}