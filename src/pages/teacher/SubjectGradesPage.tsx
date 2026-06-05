import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import apiClient from "@/api/apiClient";
import { subjectTestsService } from "@/services/teacher/subjectTestsService";
import type { TestItem } from "@/services/teacher/subjectTestsService";

type Submission = {
  id: number;
  name: string;
  email: string;
  studentCode?: string;
  className?: string;
  score: number;
  status: string;
  submittedAt: string;
};

type LeaderboardItem = {
  id: number;
  score: number;
  status: string;
  submittedAt: string;
  student: {
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    studentCode?: string;
    className?: string;
    class?: {
      name: string;
    };
  };
};

type Subject = {
  id: string;
  name: string;
};


type StudentFromAPI = {
  email: string;
  fullName: string;
  studentCode?: string;
  className?: string;
};

export default function SubjectGradesPage() {
  const { subjectId } = useParams<{ subjectId: string }>();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [testTitle, setTestTitle] = useState("");

  const [subjectInfo, setSubjectInfo] = useState<Subject | null>(null);

  const [selectedTestId, setSelectedTestId] = useState<string>("");
  const [tests, setTests] = useState<TestItem[]>([]);

  const handleExportExcel = () => {
    const data = submissions.map((s, index) => ({
  STT: index + 1,
  "Mã SV": s.studentCode || "-",
  "Họ tên": s.name, 
  "Email": s.email,
  "Điểm": s.score,
  "Trạng thái": s.status,
  "Thời gian": s.submittedAt,
}));

    const header = [
  {
    "Môn học": subjectInfo?.name || "...",
    "Bài kiểm tra": testTitle,
  },
  {},
];

    const ws = XLSX.utils.json_to_sheet([...header, ...data]);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Bang diem");
    XLSX.writeFile(wb, "bang-diem.xlsx");
  };

  const avg =
    submissions.length > 0
      ? (
          submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length
        ).toFixed(2)
      : 0;
  useEffect(() => {
    const loadInit = async () => {
      try {
        const subjectRes = await apiClient.get(
          `/v1/teacher/subjects/${subjectId}`,
        );
        setSubjectInfo(subjectRes.data.data);

        const data = await subjectTestsService.getTeacherSubjectTests(
          subjectId!,
        );

        setTests(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadInit();
  }, [subjectId]);

  useEffect(() => {
    if (!selectedTestId) return; // ✅ chỉ return

   const loadLeaderboard = async () => {
  try {
    const res = await apiClient.get(
      `/v1/tests/${selectedTestId}/leaderboard`
    );

    // ✅ đổi tên data → leaderboard
    const leaderboard: LeaderboardItem[] = res.data.data || [];

    // ✅ lấy danh sách student
    const studentsRes = await apiClient.get(
      `/v1/teacher/subjects/${subjectId}/students`
    );

    // ✅ type rõ ràng (KHÔNG dùng any)
    // ✅ chuẩn sạch, không any, không lỗi
const students: StudentFromAPI[] =
  studentsRes.data.data?.classGroups?.flatMap(
    (g: { students: StudentFromAPI[] }) => g.students
  ) || [];

    // ✅ map + merge data
    const mapped: Submission[] = leaderboard.map((item: LeaderboardItem) => {
      const student = students.find(
        (s) => s.email === item.student.email
      );

      return {
        id: item.id,
        name: student?.fullName || item.student.email,
        email: item.student.email,
        studentCode: student?.studentCode || "-",
        className: student?.className || "-",
        score: item.score,
        status: item.status,
        submittedAt: new Date(item.submittedAt).toLocaleString("vi-VN"),
      };
    });

    setSubmissions(mapped);

    const selectedTest = tests.find((t) => t.id === selectedTestId);
    setTestTitle(selectedTest?.title || "");
  } catch (err) {
    console.error(err);
  }
};

    loadLeaderboard();
  }, [selectedTestId, tests]);

  
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-1">
        Bảng điểm môn: {subjectInfo?.name || "..."}
      </h2>
      <select
        value={selectedTestId}
        onChange={(e) => setSelectedTestId(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="">Chọn bài kiểm tra</option>

        {tests.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>

      <button
        onClick={handleExportExcel}
        disabled={!selectedTestId}
        className="mb-4 px-3 py-1 bg-green-600 text-white rounded disabled:bg-gray-400"
      >
        Xuất Excel
      </button>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">STT</th>
            <th className="p-2 border">Mã SV</th>
            <th className="p-2 border">Họ tên</th>
           
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Điểm</th>
            <th className="p-2 border">Thời gian</th>
          </tr>
        </thead>

        <tbody>
          {submissions.map((s, i) => (
            <tr key={s.id} className="hover:bg-gray-50 transition">
              <td className="border p-2">{i + 1}</td>

              {/* MÃ SINH VIÊN */}
              <td className="border p-2 text-sm text-gray-600">
                {s.studentCode || "-"}
              </td>
              {/* HỌ TÊN */}
              <td className="border p-2 font-semibold text-gray-800">
                {s.name}
              </td>

             

              {/* EMAIL */}
              <td className="border p-2 text-sm text-gray-500">{s.email}</td>

              {/* ĐIỂM */}
              <td
                className={`border p-2 font-semibold ${
                  s.score >= 8
                    ? "text-green-600"
                    : s.score >= 5
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {s.score}
              </td>

              {/* THỜI GIAN */}
              <td className="border p-2">{s.submittedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <p>Tổng sinh viên: {submissions.length}</p>
        <p>Điểm trung bình: {avg}</p>
      </div>
    </div>
  );
}
