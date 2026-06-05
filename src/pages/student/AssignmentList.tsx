import React, { useEffect, useState } from "react";
import { studentLearningApi } from "@/api/studentLearning.api";
import { useNavigate } from "react-router-dom";

type Material = {
  id: string;
  title: string;
  fileType: string;
  url: string;
};

type Chapter = {
  id: string;
  title: string;
  taskmen: Material[];
};

export default function AssignmentList() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // 1. Gọi API lấy danh sách môn học mà sinh viên đang tham gia
        const subjectsRes = await studentLearningApi.getMySubjects();
        if (!subjectsRes.data.success || subjectsRes.data.data.length === 0) {
          return; // Sinh viên chưa đăng ký môn học nào
        }

        // 2. Lấy ID của môn học đầu tiên làm mặc định
        const subjectId = subjectsRes.data.data[0].id;

        // 3. Truy vấn tài liệu dựa trên subjectId vừa lấy được
        const mtRes = await studentLearningApi.getMaterials(subjectId);

        if (mtRes.data.success) {
          const data = mtRes.data.data;

          console.log("MATERIALS:", data);

          const allMaterials: Material[] = [];

          data.forEach((chapter: Chapter) => {
            if (chapter.taskmen?.length > 0) {
              allMaterials.push(...chapter.taskmen);
            }
          });

          console.log("ALL MATERIALS:", allMaterials);

          setMaterials(allMaterials);
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
      <h1 className="text-xl font-bold">📚 Danh sách Tài liệu Học tập</h1>

      {materials.length === 0 && (
        <p className="text-gray-500">Chưa có tài liệu nào</p>
      )}

      {materials.map((m) => (
        <div
          key={m.id}
          className="p-4 border rounded hover:bg-gray-50 cursor-pointer flex justify-between items-center"
          onClick={() => {
            navigate(`/student/materials/${m.id}`);
          }}
        >
          <div>
            <p className="font-semibold">{m.title}</p>
            <p className="text-sm text-gray-500">Định dạng: {m.fileType}</p>
          </div>

          <span className="text-xs px-2 py-1 bg-teal-600 text-white rounded">
            Xem chi tiết
          </span>
        </div>
      ))}
    </div>
  );
}
