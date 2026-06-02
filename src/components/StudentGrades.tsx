import React, { useEffect, useState } from "react";
import { studentLearningApi } from "../api/studentLearning.api";

export const StudentGrades: React.FC = () => {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await studentLearningApi.getMyGrades();
        if (response.data.success) {
          setGrades(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải điểm số:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  if (loading)
    return <div className="p-4 text-gray-600">Đang tải điểm số...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        Bảng Điểm Của Tôi
      </h2>

      {grades.length === 0 ? (
        <p className="text-gray-500 italic">
          Bạn chưa có điểm số nào được ghi nhận.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-4 border-b font-semibold text-left">
                  Môn Học
                </th>
                <th className="py-3 px-4 border-b font-semibold text-left">
                  Điểm Giữa Kỳ
                </th>
                <th className="py-3 px-4 border-b font-semibold text-left">
                  Điểm Cuối Kỳ
                </th>
                <th className="py-3 px-4 border-b font-semibold text-left">
                  Điểm Tổng Kết
                </th>
                <th className="py-3 px-4 border-b font-semibold text-left">
                  Trạng Thái
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {grades.map((grade, idx) => (
                <tr
                  key={grade.id || idx}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="py-3 px-4 border-b font-medium text-gray-800">
                    {grade.subject?.name}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {grade.midtermGrade ?? "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {grade.finalGrade ?? "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b font-bold">
                    {grade.totalGrade ?? "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        grade.totalGrade !== null && grade.totalGrade >= 50
                          ? "bg-green-100 text-green-800"
                          : grade.totalGrade !== null && grade.totalGrade < 50
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {grade.totalGrade !== null
                        ? grade.totalGrade >= 50
                          ? "Đạt"
                          : "Trượt"
                        : "Chưa có"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
