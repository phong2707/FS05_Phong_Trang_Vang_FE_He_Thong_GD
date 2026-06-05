import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { studentLearningApi } from "@/api/studentLearning.api";

export default function MaterialDetail() {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        if (!materialId) return;
        const res = await studentLearningApi.getMaterialDetail(materialId);
        if (res.data.success) {
          setMaterial(res.data.data);
        }
      } catch (err: any) {
        console.error("Lỗi khi lấy tài liệu:", err);
        setError(err.response?.data?.message || "Không thể tải tài liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [materialId]);

  if (loading) return <div className="p-6">Đang tải tài liệu...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!material) return <div className="p-6">Không tìm thấy tài liệu.</div>;

  const renderContent = () => {
    switch (material.fileType?.toUpperCase()) {
      case "PDF":
        return (
          <iframe
            src={material.url}
            className="w-full h-[75vh] border-0 rounded-lg shadow-inner"
            title={material.title}
          />
        );
      case "LINK":
        return (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-dashed">
            <p className="mb-6 text-gray-700 font-medium">
              Tài liệu này là một liên kết (Website / Bài viết).
            </p>
            <a
              href={material.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 shadow"
            >
              Mở liên kết trong tab mới
            </a>
          </div>
        );
      case "VIDEO":
        return (
          <video
            controls
            className="w-full max-w-4xl mx-auto rounded-lg shadow"
          >
            <source src={material.url} type="video/mp4" />
            Trình duyệt không hỗ trợ thẻ video.
          </video>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-dashed">
            <p className="mb-6 text-gray-700 font-medium">
              Tài liệu này yêu cầu tải về để xem ({material.fileType}).
            </p>
            <a
              href={material.url}
              download
              className="px-6 py-2 bg-teal-600 text-white font-medium rounded hover:bg-teal-700 shadow"
            >
              Tải xuống tài liệu
            </a>
          </div>
        );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{material.title}</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 font-medium"
        >
          Trở lại
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
        {renderContent()}
      </div>
    </div>
  );
}
