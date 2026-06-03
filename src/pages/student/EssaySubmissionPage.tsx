import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useParams, useLocation } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editorConfig = { licenseKey: "GPL" };
type LocationState = {
  classGroupId?: string;
};

export default function EssaySubmissionPage() {
  const { testId } = useParams();
  const location = useLocation();

  // ✅ lấy classGroupId từ navigation
  const classGroupId =
    (location.state as LocationState)?.classGroupId ||
    "c990f176-38ea-419c-8341-8a2a64357191"; // fallback nếu reload

  const [essay, setEssay] = useState<string>(() => {
    return localStorage.getItem(`essay_draft_${testId}`) || "";
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [questionHtml, setQuestionHtml] = useState("");

  // ✅ load đề bài
  useEffect(() => {
    if (!testId) return;
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8000/api/v1/tests/${testId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không lấy được đề bài");
        return res.json();
      })
      .then((data) => {
        const q = data?.data?.testQuestions?.[0]?.question?.content;
        if (q) setQuestionHtml(q);
      })
      .catch((err) => console.error(err));
  }, [testId]);

  // ✅ submit
  const handleSubmit = async () => {
    if (!essay || essay.trim() === "") {
      alert("Vui lòng nhập bài làm");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/v1/assignments/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          testId,
          classGroupId,
          essayAnswer: essay,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setSuccess(true);

      // ✅ xóa draft theo testId
      localStorage.removeItem(`essay_draft_${testId}`);
    } catch (e: unknown) {
      const err = e as Error;
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ autosave theo từng bài (PRO)
  useEffect(() => {
    if (!testId) return;

    const t = setTimeout(() => {
      localStorage.setItem(`essay_draft_${testId}`, essay);
    }, 800);

    return () => clearTimeout(t);
  }, [essay, testId]);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow border p-6 space-y-5">
        <h1 className="text-xl font-bold">📝 Làm bài tự luận</h1>

        {/* ✅ đề bài */}
        <div
          className="p-4 bg-gray-50 border rounded-lg leading-relaxed"
          dangerouslySetInnerHTML={{
            __html:
              questionHtml || "<p class='text-gray-400'>Đang tải đề bài...</p>",
          }}
        />

        {/* ✅ editor */}
        <div>
          <label className="font-semibold block mb-2">Bài làm của bạn</label>

          <CKEditor
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            editor={ClassicEditor as any}
            data={essay}
            config={editorConfig}
            onChange={(_, editor) => setEssay(editor.getData())}
          />
        </div>

        {/* ✅ action */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            Nội dung được auto lưu ✔
          </span>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-teal-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Đang nộp..." : "Nộp bài"}
          </button>
        </div>

        {/* ✅ success */}
        {success && (
          <div className="text-green-600 font-semibold">
            ✅ Nộp bài thành công! Chờ giáo viên chấm.
          </div>
        )}
      </div>
    </div>
  );
}
