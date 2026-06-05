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

  const locationState = (location.state as LocationState) || {};

  const classGroupId = locationState.classGroupId;
  const sessionToken = locationState.sessionToken;
  const questions = locationState.questions;

  console.log("LOCATION STATE:", locationState);
  console.log("INITIAL QUESTIONS:", questions);

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [timeLeft, setTimeLeft] = useState<number>(0);

  const [localQuestions, setLocalQuestions] = useState<Question[]>(
    Array.isArray(questions) && questions.length ? questions : [],
  );

  const [localSessionToken, setLocalSessionToken] = useState<string | null>(
    sessionToken || null,
  );
  const qs = localQuestions;
  const token = localSessionToken;

  console.log("QS AFTER LOAD:", qs);
  console.log("TOKEN:", token);
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

    const isAutoSubmit = timeLeft === 0;

    if (!isAutoSubmit && answersPayload.some((a) => !a.answerId)) {
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

  useEffect(() => {
    if (!testId) return;

    const fetch = async () => {
      try {
        const res = await studentLearningApi.startTest({ testId });

        console.log("API QUESTIONS:", res.data.data.questions);
        console.log("DURATION:", res.data.data.durationMinutes);

        setLocalQuestions(res.data.data.questions || []);
        setLocalSessionToken(res.data.data.sessionToken || null);
        const durationMinutes = res.data.data.durationMinutes || 0;
        setTimeLeft(durationMinutes * 60);
      } catch {
        toast.error("Không load lại được bài thi");
      }
    };

    fetch();
  }, [testId]);
  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          // ✅ tránh gọi nhiều lần
          setTimeout(() => {
            handleSubmit();
          }, 0);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);
  useEffect(() => {
    if (timeLeft === 10) {
      toast.warning("Sắp hết giờ!");
    }
  }, [timeLeft]);
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isAllAnswered =
  qs.length > 0 &&
  qs.every((q) => userAnswers[q.id] !== undefined);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Làm bài trắc nghiệm</h1>
      <div className="mb-4 text-red-600 font-bold text-lg">
        Thời gian còn lại: {formatTime(timeLeft)}
      </div>
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
                  value={ans.id}
                  disabled={timeLeft === 0}
                  checked={userAnswers[q.id] === ans.id}
                  onChange={() => handleAnswerChange(q.id, ans.id)}
                />
                <label className="ml-2">{ans.answerText}</label>
              </div>
            ))}
          </div>
        </div>
      ))}

      {isAllAnswered && (
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {submitting ? "Đang nộp bài..." : "Nộp bài"}
        </button>
      )}
    </div>
  );
};
