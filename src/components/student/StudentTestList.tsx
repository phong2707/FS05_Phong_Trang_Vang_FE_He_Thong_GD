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
};

export default function StudentTestList() {
  const [tests, setTests] = useState<StudentTest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      const res = await studentLearningApi.getMyTests();

      console.log("API response:", res.data);

      if (res.data.success) {
        setTests(res.data.data);
      }
    };
    fetchTests();
  }, []);

  const handleStart = async (t: StudentTest) => {
    try {
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
            questions: data.questions,
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

      {tests.map((t: StudentTest) => (
        <div key={t.id} className="border p-4 rounded mb-3">
          <h3 className="font-semibold">{t.title}</h3>

          <p>{t.subjectName}</p>
          <p>{t.chapterName}</p>
          <p>Loại: {t.testType}</p>

          <button
            onClick={() => handleStart(t)}
            className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded"
          >
            Làm bài
          </button>
        </div>
      ))}
    </div>
  );
}
