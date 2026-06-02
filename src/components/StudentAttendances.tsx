import React, { useEffect, useState } from "react";
import { studentLearningApi } from "../api/studentLearning.api";

export const StudentAttendances: React.FC = () => {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await studentLearningApi.getMyAttendances();
        if (response.data.success) {
          setAttendances(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải lịch sử điểm danh:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendances();
  }, []);

  if (loading)
    return (
      <div className="p-4 text-gray-600">Đang tải lịch sử điểm danh...</div>
    );

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        Lịch Sử Điểm Danh
      </h2>

      {attendances.length === 0 ? (
        <p className="text-gray-500 italic">
          Bạn chưa có dữ liệu điểm danh nào.
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
                  Lớp
                </th>
                <th className="py-3 px-4 border-b font-semibold text-left">
                  Buổi Học
                </th>
                <th className="py-3 px-4 border-b font-semibold text-left">
                  Thời Gian
                </th>
                <th className="py-3 px-4 border-b font-semibold text-center">
                  Trạng Thái
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {attendances.map((att, idx) => (
                <tr
                  key={att.id || idx}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="py-3 px-4 border-b font-medium text-gray-800">
                    {att.schedule?.classGroup?.subject?.name}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {att.schedule?.classGroup?.name}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {new Date(att.schedule?.startAt).toLocaleDateString(
                      "vi-VN",
                    )}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {new Date(att.schedule?.startAt).toLocaleTimeString(
                      "vi-VN",
                    )}{" "}
                    -{" "}
                    {new Date(att.schedule?.endAt).toLocaleTimeString("vi-VN")}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        att.status === "PRESENT"
                          ? "bg-green-100 text-green-800"
                          : att.status === "ABSENT"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {att.status === "PRESENT"
                        ? "Có mặt"
                        : att.status === "ABSENT"
                          ? "Vắng mặt"
                          : "Chưa xác định"}
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
