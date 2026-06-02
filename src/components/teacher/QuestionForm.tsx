import { useQuestionForm } from "@/hooks/useQuestionForm";

import { useParams, useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import React from "react";

// ===== TYPES =====
type Scope = "CHAPTER" | "SUBJECT" | "COURSE";

const editorConfig = { licenseKey: "GPL" };

export default function QuestionForm() {
  const { subjectId, questionId } = useParams();
  const navigate = useNavigate();

  const {
    isEdit,

    subject,
    chapters,
    scope,
    setScope,
    chapterId,
    setChapterId,

    questionFormat,
    setQuestionFormat,
    difficulty,
    setDifficulty,
    content,
    setContent,
    explanation,
    setExplanation,
    rubric,
    setRubric,
    answers,
    setAnswers,
    totalScore,
    isValid,
    handleSubmit,
    addAnswer,
  } = useQuestionForm({ questionId, subjectId });

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)}>←</button>
        <h1 className="text-xl font-semibold">
          {isEdit ? "Cập nhật câu hỏi" : "Tạo câu hỏi"}
        </h1>
      </div>

      {/* PHẠM VI */}
      <div>
        <label className="font-semibold block mb-2">Phạm vi câu hỏi</label>
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value as Scope)}
          className="border p-2 rounded w-full"
        >
          <option value="CHAPTER">Theo chương</option>
          <option value="SUBJECT">Theo môn</option>
          <option value="COURSE">Theo khóa</option>
        </select>
      </div>

      {/* CHƯƠNG / SUBJECT / COURSE */}
      {scope === "CHAPTER" ? (
        <select
          value={chapterId}
          onChange={(e) => setChapterId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Chọn chương</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title || c.name}
            </option>
          ))}
        </select>
      ) : scope === "SUBJECT" ? (
        <input
          value={subject?.name || ""}
          disabled
          className="border p-2 rounded w-full bg-gray-100"
        />
      ) : (
        <input
          value={subject?.course?.title || ""}
          disabled
          className="border p-2 rounded w-full bg-gray-100"
        />
      )}

      {/* LOẠI CÂU HỎI */}
      <div>
        <label className="font-semibold block mb-2">Loại câu hỏi</label>
        <select
          value={
            questionFormat === "SINGLE_CHOICE"
              ? "SINGLE"
              : questionFormat === "MULTIPLE_CHOICE"
                ? "MULTIPLE"
                : "ESSAY"
          }
          onChange={(e) => {
            const v = e.target.value;
            const f =
              v === "SINGLE"
                ? "SINGLE_CHOICE"
                : v === "MULTIPLE"
                  ? "MULTIPLE_CHOICE"
                  : "ESSAY";

            setQuestionFormat(f);

            if (f === "ESSAY") {
              setRubric([
                { name: "Nội dung", max: 5 },
                { name: "Trình bày", max: 5 },
              ]);
            } else {
              setExplanation("");
            }

            setAnswers(
              f === "ESSAY"
                ? [{ answerText: "", isCorrect: true }]
                : [
                    { answerText: "", isCorrect: false },
                    { answerText: "", isCorrect: false },
                  ],
            );
          }}
          className="border p-2 rounded w-full"
        >
          <option value="SINGLE">Trắc nghiệm 1 đáp án</option>
          <option value="MULTIPLE">Nhiều đáp án</option>
          <option value="ESSAY">Tự luận</option>
        </select>
      </div>

      {/* MỨC ĐỘ */}
      <div>
        <label className="font-semibold block mb-2">Mức độ câu hỏi</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="EASY">Dễ</option>
          <option value="MEDIUM">Trung bình</option>
          <option value="HARD">Khó</option>
        </select>
      </div>

      {/* NỘI DUNG */}
      <div>
        <label className="font-semibold mb-2 block">Nội dung câu hỏi</label>
        <CKEditor
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          editor={ClassicEditor as any}
          data={content}
          config={editorConfig}
          onChange={(_, ed) => setContent(ed.getData())}
        />
      </div>

      {/* RUBRIC */}
      <div>
        <label className="font-semibold mb-2 block">
          {questionFormat === "ESSAY" ? "Tiêu chí chấm" : "Giải thích"}
        </label>

        {questionFormat === "ESSAY" ? (
          <>
            {rubric.map((r, i) => (
              <div key={i} className="flex gap-3 mb-2">
                <input
                  value={r.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRubric((prev) =>
                      prev.map((x, idx) =>
                        idx === i ? { ...x, name: val } : x,
                      ),
                    );
                  }}
                  placeholder="Tên tiêu chí (VD: Nội dung)"
                  className="border p-2 rounded w-full"
                />

                <input
                  type="number"
                  value={r.max}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setRubric((prev) =>
                      prev.map((x, idx) =>
                        idx === i ? { ...x, max: val } : x,
                      ),
                    );
                  }}
                  className="border p-2 rounded w-24"
                />

                <button
                  onClick={() => {
                    if (rubric.length <= 1) return;
                    setRubric((prev) => prev.filter((_, idx) => idx !== i));
                  }}
                  className="text-red-500"
                >
                  🗑 Xóa
                </button>
              </div>
            ))}
            <div className="mt-2 text-sm text-gray-600">
              Tổng điểm: <b>{totalScore}</b>
            </div>
            {totalScore <= 0 && (
              <div className="text-red-500 text-sm">
                Tổng điểm phải lớn hơn 0
              </div>
            )}

            <button
              onClick={() =>
                setRubric((prev) => [...prev, { name: "", max: 1 }])
              }
              className="border px-3 py-1 rounded"
            >
              + Thêm tiêu chí
            </button>
          </>
        ) : (
          <CKEditor
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            editor={ClassicEditor as any}
            data={explanation}
            config={editorConfig}
            onChange={(_, ed) => setExplanation(ed.getData())}
          />
        )}
      </div>

      {/* ANSWERS */}
      <div>
        <h3 className="font-semibold mb-2">Đáp án</h3>

        {questionFormat === "ESSAY" ? (
          <CKEditor
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            editor={ClassicEditor as any}
            data={answers[0]?.answerText || ""}
            config={editorConfig}
            onChange={(_, ed) => {
              const val = ed.getData();
              setAnswers([{ answerText: val, isCorrect: true }]);
            }}
          />
        ) : (
          <>
            {answers.map((a, i) => (
              <div key={i} className="flex gap-3 mb-3">
                <input
                  type={
                    questionFormat === "SINGLE_CHOICE" ? "radio" : "checkbox"
                  }
                  checked={a.isCorrect}
                  onChange={() => {
                    if (questionFormat === "MULTIPLE_CHOICE") {
                      setAnswers((prev) =>
                        prev.map((x, idx) =>
                          idx === i ? { ...x, isCorrect: !x.isCorrect } : x,
                        ),
                      );
                    } else {
                      setAnswers((prev) =>
                        prev.map((x, idx) => ({
                          ...x,
                          isCorrect: idx === i,
                        })),
                      );
                    }
                  }}
                />

                <div className="flex-1">
                  <CKEditor
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    editor={ClassicEditor as any}
                    data={a.answerText}
                    config={editorConfig}
                    onChange={(_, ed) => {
                      const val = ed.getData();
                      setAnswers((prev) =>
                        prev.map((x, idx) =>
                          idx === i ? { ...x, answerText: val } : x,
                        ),
                      );
                    }}
                  />
                </div>

                <button
                  onClick={() => {
                    if (answers.length <= 2) return;
                    setAnswers((prev) => prev.filter((_, idx) => idx !== i));
                  }}
                  className="text-red-600"
                >
                  🗑 Xóa
                </button>
              </div>
            ))}

            <button onClick={addAnswer} className="border px-3 py-1 rounded">
              + Thêm đáp án
            </button>
          </>
        )}
      </div>
      {/* ACTION */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded"
        >
          Hủy
        </button>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`px-4 py-2 rounded text-white ${
            isValid ? "bg-teal-600" : "bg-gray-400"
          }`}
        >
          Lưu câu hỏi
        </button>
      </div>
    </div>
  );
}
