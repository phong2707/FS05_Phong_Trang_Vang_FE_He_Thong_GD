import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const editorConfig = { licenseKey: "GPL" };

type LocationState = {
  testId: string;
  classGroupId: string;
};

export default function DemoEssayPage() {
  const location = useLocation();
  const state = location.state as LocationState;

  const { testId, classGroupId } = state || {};
  console.log("classGroupId:", classGroupId);

  const [essay, setEssay] = useState<string>(() => {
    return localStorage.getItem(`demo_essay_${testId}`) || "";
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [questionHtml, setQuestionHtml] = useState("");

  // ✅ load đề bài (API thật)
  useEffect(() => {
    if (!testId) return;

    fetch(`/tests/${testId}`)
      .then((res) => res.json())
      .then((data) => {
        const q = data?.data?.testQuestions?.[0]?.question?.content;
        if (q) setQuestionHtml(q);
      })
      .catch(() => {
        // fallback demo nếu API fail
        setQuestionHtml(
          "<p><b>Đề demo:</b> Trình bày vai trò của AI trong giáo dục</p>"
        );
      });
  }, [testId]);

  // ✅ autosave
  useEffect(() => {
    const t = setTimeout(() => {
      if (testId) {
        localStorage.setItem(`demo_essay_${testId}`, essay);
      }
    }, 800);

    return () => clearTimeout(t);
  }, [essay, testId]);

  // ✅ submit (fake cho demo hoặc gọi API thật)
  const handleSubmit = async () => {
    if (!essay.trim()) {
      alert("Vui lòng nhập bài làm");
      return;
    }

    try {
      setLoading(true);

      // 👉 OPTION 1: FAKE (demo mượt nhất)
      await new Promise((res) => setTimeout(res, 1200));

      

      setSuccess(true);
      localStorage.removeItem(`demo_essay_${testId}`);
    } catch (e: unknown) {
  if (e instanceof Error) {
    alert(e.message);
  } else {
    alert("Submit lỗi");
  }
}
 finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow border p-6 space-y-5">
        <h1 className="text-xl font-bold">📝 Làm bài tự luận (Demo)</h1>

        {/* ✅ đề bài */}
        <div
          className="p-4 bg-gray-50 border rounded-lg"
          dangerouslySetInnerHTML={{
            __html:
              questionHtml ||
              "<p class='text-gray-400'>Đang tải đề bài...</p>",
          }}
        />

        {/* ✅ editor */}
        <div>
          <label className="font-semibold block mb-2">
            Bài làm của bạn
          </label>

          
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
            Auto lưu ✔
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
            ✅ Nộp bài thành công (Demo)!
          </div>
        )}
      </div>
    </div>
  );
}