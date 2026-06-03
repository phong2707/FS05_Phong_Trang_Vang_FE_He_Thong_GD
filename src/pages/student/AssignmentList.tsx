import React, { useEffect, useState } from "react";
import { studentLearningApi } from "@/api/studentLearning.api";
import { useNavigate } from "react-router-dom";

type Test = {
  id: string;
  title: string;
  testType: string;
  classGroupId?: string;
};

type Chapter = {
  id: string;
  title: string;
  tests: Test[];
};

// type Subject = {
//   id: string;
//   name: string;
// };
export default function AssignmentList() {
  //   const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);

    try {
      // ✅ DÙNG SUBJECT ID thật của bạn
      const subjectId = "c990f176-38ea-419c-8341-8a2a64357191";

      const mtRes = await studentLearningApi.getMaterials(subjectId);

      if (mtRes.data.success) {
        const materials = mtRes.data.data;

        console.log("MATERIALS:", materials);

        const allTests: Test[] = [];

        materials.forEach((chapter: Chapter) => {
          if (chapter.tests?.length > 0) {
            allTests.push(...chapter.tests);
          }
        });

        console.log("ALL TESTS:", allTests);

        setTests(allTests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  if (loading) return <p className="p-6">Đang tải...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">📚 Assignment List</h1>

      {tests.length === 0 && (
        <p className="text-gray-500">Chưa có bài kiểm tra</p>
      )}

      {tests.map((t) => (
        <div
          key={t.id}
          className="p-4 border rounded hover:bg-gray-50 cursor-pointer flex justify-between items-center"
          onClick={() => {
            if (t.testType?.toUpperCase() === "ESSAY") {
              navigate(`/student/assignment/${t.id}`, {
                state: { classGroupId: t.classGroupId }, // hoặc set đúng sau
              });
            } else {
              navigate(`/student/quiz/${t.id}`);
            }
          }}
        >
          <div>
            <p className="font-semibold">{t.title}</p>
            <p className="text-sm text-gray-500">Loại: {t.testType}</p>
          </div>

          <span className="text-xs px-2 py-1 bg-teal-600 text-white rounded">
            Làm bài
          </span>
        </div>
      ))}
    </div>
  );
}
