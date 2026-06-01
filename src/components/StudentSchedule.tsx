import React, { useEffect, useState } from "react";
import { studentLearningApi } from "../api/studentLearning.api";

export const StudentSchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await studentLearningApi.getSchedules();
        if (response.data.success) {
          setSchedules(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải lịch học:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  if (loading)
    return <div className="p-4 text-gray-600">Đang tải lịch học...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        Lịch Học Của Tôi
      </h2>

      {schedules.length === 0 ? (
        <p className="text-gray-500 italic">
          Bạn chưa có lịch học nào hoặc chưa được xếp lớp.
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
                  Giảng Viên
                </th>
                <th className="py-3 px-4 border-b font-semibold text-left">
                  Thời Gian
                </th>
                <th className="py-3 px-4 border-b font-semibold text-center">
                  Phòng Học (Link)
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {schedules.map((s, idx) => (
                <tr
                  key={s.id || idx}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="py-3 px-4 border-b font-medium text-gray-800">
                    {s.classGroup?.subject?.name}
                  </td>
                  <td className="py-3 px-4 border-b">{s.classGroup?.name}</td>
                  <td className="py-3 px-4 border-b">
                    {s.teacher?.firstName} {s.teacher?.lastName}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {new Date(s.startAt).toLocaleString("vi-VN")} -{" "}
                    {new Date(s.endAt).toLocaleTimeString("vi-VN")}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    {s.roomLink ? (
                      <a
                        href={s.roomLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 font-semibold hover:text-blue-800 hover:underline"
                      >
                        Tham gia
                      </a>
                    ) : (
                      <span className="text-gray-400">Chưa cập nhật</span>
                    )}
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
