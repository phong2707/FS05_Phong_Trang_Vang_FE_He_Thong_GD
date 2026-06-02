import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { studentLearningApi } from "@/api/studentLearning.api";
import { toast } from "sonner";

export const StudentQuiz: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const location = useLocation();
  const { classGroupId } = location.state || {}; // Nhận classGroupId từ state của Link

  const [questions, setQuestions] = useState<any[]>([]);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!testId) return;

    const startTestSession = async () => {
      try {
        const response = await studentLearningApi.startTest({ testId });
        if (response.data.success) {
          setQuestions(response.data.data.questions);
          setSessionToken(response.data.data.sessionToken);
        } else {
          toast.error(response.data.message || "Không thể bắt đầu bài thi.");
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Lỗi khi bắt đầu bài thi.",
        );
      } finally {
        setLoading(false);
      }
    };

    startTestSession();
  }, [testId]);

  const handleAnswerChange = (questionId: string, answerId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = async () => {
    if (!testId || !sessionToken || !classGroupId) {
      toast.error("Thiếu thông tin cần thiết để nộp bài.");
      return;
    }

    const answersPayload = Object.entries(userAnswers).map(
      ([questionId, answerId]) => ({
        questionId,
        answerId,
      }),
    );

    if (answersPayload.length !== questions.length) {
      toast.warning("Vui lòng trả lời tất cả các câu hỏi.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await studentLearningApi.submitTest({
        testId,
        classGroupId,
        sessionToken,
        answers: answersPayload,
      });

      if (response.data.success) {
        toast.success("Nộp bài thành công!");
        // Chuyển hướng hoặc hiển thị kết quả
        // Ví dụ: navigate(`/student/results/${response.data.data.id}`);
      } else {
        toast.error(response.data.message || "Nộp bài thất bại.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi nộp bài.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Đang tải đề thi...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Làm bài trắc nghiệm</h1>
      {questions.map((q, index) => (
        <div key={q.id} className="mb-6 p-4 border rounded-lg">
          <p className="font-semibold mb-2">
            Câu {index + 1}: {q.content}
          </p>
          <div className="space-y-2">
            {q.answers.map((ans: any) => (
              <div key={ans.id} className="flex items-center">
                <input
                  type="radio"
                  id={`q${q.id}-ans${ans.id}`}
                  name={`question-${q.id}`}
                  value={ans.id}
                  checked={userAnswers[q.id] === ans.id}
                  onChange={() => handleAnswerChange(q.id, ans.id)}
                  className="mr-2"
                />
                <label htmlFor={`q${q.id}-ans${ans.id}`}>
                  {ans.answerText}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Đang nộp bài..." : "Nộp bài"}
      </button>
    </div>
  );
};

export const StudentAssignment: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const location = useLocation();
  const { classGroupId } = location.state || {};
  const [essayAnswer, setEssayAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!testId || !classGroupId || !essayAnswer.trim()) {
      toast.error("Vui lòng nhập nội dung bài làm và đảm bảo có đủ thông tin.");
      return;
    }
    setSubmitting(true);
    try {
      await studentLearningApi.submitAssignment({
        testId,
        classGroupId,
        essayAnswer,
      });
      toast.success("Nộp bài tự luận thành công!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi nộp bài tự luận.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nộp bài tự luận</h1>
      <textarea
        className="w-full p-2 border rounded-lg"
        rows={15}
        value={essayAnswer}
        onChange={(e) => setEssayAnswer(e.target.value)}
        placeholder="Nhập nội dung bài làm của bạn ở đây..."
      />
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Đang nộp..." : "Nộp bài"}
      </button>
    </div>
  );
};
