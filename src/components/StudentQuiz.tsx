import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { studentLearningApi } from "@/api/studentLearning.api";
import { toast } from "sonner";
import axios from "axios";

type Answer = {
  id: string;
  answerText: string;
};

type Question = {
  id: string;
  content: string;
  answers: Answer[];
};

type LocationState = {
  classGroupId?: string;
  sessionToken?: string;
  questions?: Question[];
};

export const StudentQuiz: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const location = useLocation();

  const locationState = location.state as LocationState || {};

const classGroupId = locationState.classGroupId;
const sessionToken = locationState.sessionToken;
const questions = locationState.questions;


  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [localQuestions, setLocalQuestions] = useState<Question[]>(
    questions || [],
  );

  const [localSessionToken, setLocalSessionToken] = useState<string | null>(
    sessionToken || null,
  );
  const qs = localQuestions;
  const token = localSessionToken;
 useEffect(() => {
  if (testId) {
    const fetch = async () => {
      try {
        const res = await studentLearningApi.startTest({ testId });

        if (res.data.success) {
          setLocalQuestions(res.data.data.questions);

          // ✅ IMPORTANT
          setLocalSessionToken(res.data.data.sessionToken);

          // ✅ lưu luôn classGroupId từ backend (nếu có)
          // hoặc giữ nguyên nếu đã truyền từ FE
        }
      } catch {
        toast.error("Không load lại được bài thi");
      }
    };

    fetch();
  }
}, [testId]);
  // ✅ KHÔNG cần loading nữa vì đã có data từ trước
  if (!qs.length || !token) {
    return <div>Không tìm thấy dữ liệu bài thi</div>;
  }

  const handleAnswerChange = (questionId: string, answerId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = async () => {
  // ✅ check trước (QUAN TRỌNG)
  if (!testId || !token) {
    toast.error("Thiếu testId hoặc sessionToken");
    return;
  }

  if (!classGroupId) {
    toast.error("Thiếu classGroupId!");
    return;
  }

  const answersPayload = qs.map((q) => ({
    questionId: q.id,
    answerId: userAnswers[q.id],
  }));

  // ✅ check chưa làm hết
  if (answersPayload.some((a) => !a.answerId)) {
    toast.warning("Vui lòng trả lời tất cả các câu hỏi.");
    return;
  }

  // ✅ DEBUG (đặt ở đây mới đúng)
  console.log("SUBMIT DATA:", {
    testId,
    classGroupId,
    sessionToken: token,
    answers: answersPayload,
  });

  setSubmitting(true);
  try {
    const response = await studentLearningApi.submitTest({
      testId,
      classGroupId,
      sessionToken: token,
      answers: answersPayload,
    });

    if (response.data.success) {
      toast.success("Nộp bài thành công!");
    } else {
      toast.error(response.data.message || "Nộp bài thất bại.");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data); // ✅ xem lỗi backend
      toast.error(error.response?.data?.message || "Lỗi khi nộp bài.");
    } else {
      toast.error("Lỗi khi nộp bài.");
    }
  } finally {
    setSubmitting(false);
  }
};


  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Làm bài trắc nghiệm</h1>

      {qs.map((q: Question, index: number) => (
        <div key={q.id} className="mb-6 p-4 border rounded-lg">
          <p className="font-semibold mb-2">
            Câu {index + 1}: {q.content}
          </p>

          <div className="space-y-2">
            {q.answers.map((ans: Answer) => (
              <div key={ans.id} className="flex items-center">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  checked={userAnswers[q.id] === ans.id}
                  onChange={() => handleAnswerChange(q.id, ans.id)}
                />
                <label className="ml-2">{ans.answerText}</label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {submitting ? "Đang nộp bài..." : "Nộp bài"}
      </button>
    </div>
  );
};
