import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentLearningApi } from "@/api/studentLearning.api";
type StudentTest = {
  id: string;
  title: string;
  testType: "QUIZ" | "ESSAY";
  durationMinutes: number;
  subjectName: string;
  chapterName: string;
  classGroupId: string;

  startTime?: string; // ✅ thêm dòng này
  endTime?: string;
};

export default function StudentTestList() {
  const [tests, setTests] = useState<StudentTest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await studentLearningApi.getMyTests();

        console.log("API response:", res.data);

        if (res.data.success) {
          setTests(res.data.data);
        }
      } catch (err: any) {
        console.error("Lỗi tải danh sách bài kiểm tra:", err);
        setError(
          err.response?.data?.message || "Không thể tải danh sách bài kiểm tra",
        );
      }
    };
    fetchTests();
  }, []);

  const handleStart = async (t: StudentTest) => {
    const now = new Date();

    // ✅ CHẶN CHƯA ĐẾN GIỜ
    if (t.startTime && new Date(t.startTime) > now) {
      alert("Chưa đến giờ làm bài");
      return;
    }

    // ✅ optional: đã hết giờ
    if (t.endTime && new Date(t.endTime) < now) {
      alert("Bài kiểm tra đã hết hạn");
      return;
    }

    try {
      console.log("START REQUEST:", {
        testId: t.id,
      });

      const res = await studentLearningApi.startTest({
        testId: t.id,
      });

      const data = res.data.data;

      if (t.testType === "ESSAY") {
        navigate(`/student/assignment/${t.id}`, {
          state: {
            classGroupId: t.classGroupId,
          },
        });
      } else {
        navigate(`/student/quiz/${t.id}`, {
          state: {
            classGroupId: t.classGroupId,
            sessionToken: data.sessionToken,

            questions:
              Array.isArray(data.questions) && data.questions.length
                ? data.questions
                : undefined, // ✅ QUAN TRỌNG
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Danh sách bài kiểm tra</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {tests.length === 0 && !error && (
        <p className="text-gray-500">Không có bài kiểm tra nào.</p>
      )}
      {tests.map((t: StudentTest) => {
        const now = new Date();
        const isNotStart = !!t.startTime && new Date(t.startTime) > now;

        return (
          <div key={t.id} className="border p-4 rounded mb-3">
            <h3 className="font-semibold">{t.title}</h3>

            <p>{t.subjectName}</p>
            <p>{t.chapterName}</p>
            <p>Loại: {t.testType}</p>

            <button
              disabled={isNotStart}
              onClick={() => handleStart(t)}
              className={`mt-2 px-3 py-1 rounded ${
                isNotStart
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {isNotStart ? "Chưa mở" : "Làm bài"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
