/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { studentLearningApi } from "../api/studentLearning.api";
import { useNavigate } from "react-router-dom";

export const StudentMaterials: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedClassGroupId, setSelectedClassGroupId] = useState<
    string | null
  >(null);

  // Tải danh sách môn học sinh viên đang tham gia
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await studentLearningApi.getMySubjects();
        if (res.data.success) {
          setSubjects(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách môn học:", error);
      }
    };
    fetchSubjects();
  }, []);

  // Click vào 1 môn học để tải tài liệu tương ứng
  const handleSelectSubject = async (subjectId: string) => {
    setSelectedSubject(subjectId);

    setSelectedClassGroupId("c990f176-38ea-419c-8341-8a2a64357191");

    setLoading(true);
    try {
      const res = await studentLearningApi.getMaterials(subjectId);
      if (res.data.success) {
        setMaterials(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải tài liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col md:flex-row gap-8 bg-white min-h-screen rounded-lg shadow-sm border border-gray-100">
      {/* Cột Trái: Danh sách Môn Học */}
      <div className="w-full md:w-1/3 md:border-r border-gray-200 md:pr-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
          Khóa Học & Môn Học
        </h2>
        <ul className="space-y-3">
          {subjects.length === 0 && (
            <p className="text-sm text-gray-500">
              Bạn chưa ghi danh môn học nào.
            </p>
          )}
          {subjects.map((sub) => (
            <li
              key={sub.id}
              className={`p-4 cursor-pointer rounded-lg border-2 transition-all duration-200
                ${selectedSubject === sub.id ? "bg-blue-50 border-blue-500 shadow-sm" : "hover:bg-gray-50 border-gray-100"}`}
              onClick={() => handleSelectSubject(sub.id)}
            >
              <div
                className={`font-semibold ${selectedSubject === sub.id ? "text-blue-700" : "text-gray-700"}`}
              >
                {sub.name}
              </div>
              {sub.course && (
                <div className="text-xs text-gray-500 mt-1">
                  Thuộc khóa: {sub.course.title}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Cột Phải: Hiển thị Tài liệu / Video của môn học được chọn */}
      <div className="w-full md:w-2/3">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
          Tài Liệu & Bài Giảng
        </h2>

        {!selectedSubject && (
          <div className="bg-gray-50 border border-dashed border-gray-300 text-gray-500 p-8 rounded-lg text-center mt-4">
            👈 Vui lòng chọn môn học ở danh sách bên trái để xem nội dung
          </div>
        )}

        {loading && (
          <p className="text-blue-600 font-medium p-4 animate-pulse mt-4">
            Đang tải nội dung khóa học...
          </p>
        )}

        {!loading && selectedSubject && materials.length === 0 && (
          <p className="text-gray-500 bg-orange-50 p-4 rounded-lg mt-4 border border-orange-100">
            Giảng viên chưa cập nhật tài liệu cho môn học này.
          </p>
        )}

        {/* Danh sách các Chương (Chapters) */}
        {!loading &&
          materials.map((chapter) => (
            <div
              key={chapter.id}
              className="mb-6 mt-4 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">
                {chapter.title}
              </h3>

              {/* Render các Video */}
              {chapter.videos?.length > 0 && (
                <div className="mb-5">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-blue-500">🎥</span> Video Bài Giảng
                  </h4>
                  <ul className="space-y-2 pl-2">
                    {chapter.videos.map((v: any) => (
                      <li
                        key={v.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm bg-gray-50 p-3 rounded-md border border-gray-100"
                      >
                        <a
                          href={v.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-medium hover:text-blue-800 hover:underline flex-1 truncate"
                        >
                          {v.title}
                        </a>
                        <span className="text-gray-500 text-xs whitespace-nowrap bg-white px-2 py-1 rounded shadow-sm border border-gray-200">
                          ⏳ {Math.round(v.durationSeconds / 60)} phút
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Render Tài Liệu / Bài Tập */}
              {chapter.taskmen?.length > 0 && (
                <div className="mb-5">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-green-500">📄</span> Tài Liệu Đọc /
                    Bài Tập
                  </h4>
                  <ul className="space-y-2 pl-2">
                    {chapter.taskmen.map((t: any) => (
                      <li
                        key={t.id}
                        className="text-sm bg-gray-50 p-3 rounded-md border border-gray-100 flex items-center"
                      >
                        <a
                          href={t.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-600 font-medium hover:text-green-800 hover:underline flex-1 truncate"
                        >
                          {t.title}
                        </a>
                        <span className="text-xs font-mono bg-green-100 text-green-700 px-2 py-1 rounded ml-2 uppercase">
                          {t.fileType}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Render Bài Kiểm Tra */}
              {chapter.tests?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-purple-500">📝</span> Bài Kiểm Tra /
                    Quiz
                  </h4>
                  <ul className="space-y-2 pl-2">
                    {chapter.tests.map((t: any) => (
                      <li
                        key={t.id}
                        className="cursor-pointer p-3 bg-purple-50 rounded-md border border-purple-100 hover:bg-purple-100 transition"
                        onClick={() => {
                          if (t.testType === "ESSAY") {
                            navigate(`/student/assignment/${t.id}`, {
                              state: {
                                classGroupId: selectedClassGroupId,
                              },
                            });
                          } else {
                            navigate(`/student/quiz/${t.id}`, {
                              state: {
                                classGroupId: selectedClassGroupId,
                              },
                            });
                          }
                        }}
                      >
                        <span className="font-medium">{t.title}</span>
                        <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded">
                          {t.testType}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
