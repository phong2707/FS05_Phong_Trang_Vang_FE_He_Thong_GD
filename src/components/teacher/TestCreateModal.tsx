import { useEffect, useMemo, useState } from "react";
import { X, Trash2 } from "lucide-react";
import apiClient from "@/api/apiClient";

import {
  type CreateTestPayload,
  type GenerationRule,
  subjectTestsService,
} from "@/services/teacher/subjectTestsService";

interface Props {
  subjectId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 1 | 2 | 3;

type ChapterItem = {
  id: string;
  title: string;
};
type ChapterApi = {
  id: string;
  title?: string;
  name?: string;
};

type QuestionItem = {
  id: string;
  content: string;
  questionFormat: string;
  chapterId?: string;
};

export default function TestCreateModal({
  subjectId,
  open,
  onClose,
  onSuccess,
}: Props) {
  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);

  // ===== BASIC =====
  const [scope, setScope] = useState<"CHAPTER" | "SUBJECT">("CHAPTER");
  const [testType, setTestType] = useState<"QUIZ" | "ESSAY">("QUIZ");

  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [chapterId, setChapterId] = useState("");

  // ===== INFO =====
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [maxAttempts, setMaxAttempts] = useState(1);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // ===== QUESTIONS =====
  const [mode, setMode] = useState<"MANUAL" | "AUTO">("MANUAL");

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // AUTO rules
  const [rules, setRules] = useState<GenerationRule[]>([]);

  const [ruleDifficulty, setRuleDifficulty] = useState("");

  const [ruleCount, setRuleCount] = useState(1);

  // ===== LOAD =====

  useEffect(() => {
    if (!open) return;

    (async () => {
      // ✅ LẤY CHAPTER TỪ SUBJECT (giống QuestionForm)
      const subjectRes = await apiClient.get(`/v1/subjects/${subjectId}`);
      console.log("subject API:", subjectRes.data);
      const ch = subjectRes.data.data?.chapters || [];

      const normalizedChapters: ChapterItem[] = ch.map((c: ChapterApi) => ({
        id: c.id,
        title: c.title || c.name || "",
      }));

      // ✅ QUESTIONS giữ nguyên
      const qs = await subjectTestsService.getSubjectQuestions(
        subjectId,
        chapterId,
      );
      console.log("questions API:", qs);

      setChapters(normalizedChapters);
      setQuestions(qs);
      console.log("questions:", qs);
    })();
  }, [open, subjectId, chapterId]);

  // ===== FILTER =====
  const filteredQ = useMemo(() => {
    let list = questions;

    console.log("chapterId current:", chapterId);

    // ✅ filter theo CHAPTER
    if (scope === "CHAPTER" && chapterId) {
      list = list.filter((q) => q.chapterId === chapterId);
    }

    // ✅ filter theo type
    if (testType === "QUIZ") {
      list = list.filter((q) =>
        ["SINGLE_CHOICE", "MULTIPLE_CHOICE"].includes(q.questionFormat),
      );
    }

    if (testType === "ESSAY") {
      list = list.filter((q) => q.questionFormat === "ESSAY");
    }

    // ✅ search
    if (search) {
      list = list.filter((q) =>
        q.content.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return list;
  }, [questions, search, chapterId, scope, testType]);

  console.log("questions:", questions);
  console.log("filteredQ:", filteredQ);

  // ===== RESET =====
  const reset = () => {
    setStep(1);
    setScope("CHAPTER");
    setTestType("QUIZ");
    setTitle("");
    setDuration(30);
    setMaxAttempts(1);
    setStartTime("");
    setEndTime("");
    setSelected([]);
    setRules([]);
  };

  // ===== SUBMIT =====
  const handleSubmit = async () => {
    if (!title) return alert("Nhập tiêu đề");

    if (duration <= 0) {
      return alert("Thời lượng phải > 0");
    }

    if (startTime && endTime) {
      if (new Date(startTime) >= new Date(endTime)) {
        return alert("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc");
      }
    }

    if (scope === "CHAPTER" && !chapterId) {
      return alert("Chọn chương");
    }

    if (testType === "QUIZ") {
      if (mode === "MANUAL" && selected.length === 0) {
        return alert("Chọn ít nhất 1 câu hỏi");
      }

      if (mode === "AUTO" && rules.length === 0) {
        return alert("Thêm ít nhất 1 rule");
      }
    }

    if (testType === "ESSAY" && selected.length === 0) {
      return alert("Chọn câu tự luận");
    }
    const ruleObject =
      mode === "AUTO"
        ? rules.reduce(
            (acc, r) => {
              if (r.difficulty === "EASY") acc.easy += r.totalCount;
              if (r.difficulty === "MEDIUM") acc.medium += r.totalCount;
              if (r.difficulty === "HARD") acc.hard += r.totalCount;
              return acc;
            },
            { easy: 0, medium: 0, hard: 0 },
          )
        : undefined;
    const payload: CreateTestPayload = {
      title,
      testType,
      durationMinutes: duration,
      startTime: startTime ? new Date(startTime).toISOString() : null,
      endTime: endTime ? new Date(endTime).toISOString() : null,
      maxAttempts,
      isAutoGenerated: mode === "AUTO",
      questionIds: mode === "MANUAL" ? selected : [],
      //   questionIds: mode === "MANUAL" ? selected : questions.map((q) => q.id),
      rule: ruleObject,
    };

    setSaving(true);
    try {
      console.log("mode:", mode);
      console.log("selected:", selected);
      console.log("rules:", rules);

      // console.log("payload:", payload);
      if (mode === "AUTO") {
        const finalPayload: CreateTestPayload = {
          title,
          testType,
          durationMinutes: duration,
          startTime: startTime ? new Date(startTime).toISOString() : null,
          endTime: endTime ? new Date(endTime).toISOString() : null,
          maxAttempts,
          isAutoGenerated: true,

          // ✅ bắt buộc cho TS
          questionIds: [],

          scope,
          chapterId: chapterId || undefined,
          subjectId: scope === "SUBJECT" ? subjectId : undefined,

          rule: ruleObject,
        };

        console.log("FINAL SEND:", finalPayload);

        await subjectTestsService.generateTest(finalPayload);
      } else {
        // ✅ MANUAL
        if (scope === "CHAPTER") {
          await subjectTestsService.createChapterTest(chapterId, payload);
        } else {
          await subjectTestsService.createSubjectTest(subjectId, payload);
        }
      }

      onSuccess();
      onClose();
      reset();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-5xl rounded-xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">Tạo bài kiểm tra</h2>
          <button
            onClick={() => {
              onClose();
              reset();
            }}
          >
            <X />
          </button>
        </div>

        {/* STEP */}
        <div className="flex gap-3 text-sm">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`px-3 py-1 rounded-full ${step === s ? "bg-teal-600 text-white" : "bg-gray-200"}`}
            >
              Bước {s}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <select
              value={testType}
              onChange={(e) => {
                setTestType(e.target.value as "QUIZ" | "ESSAY");
                setSelected([]);
              }}
            >
              <option value="QUIZ">Trắc nghiệm</option>
              <option value="ESSAY">Tự luận</option>
            </select>

            <select
              value={scope}
              onChange={(e) =>
                setScope(e.target.value as "CHAPTER" | "SUBJECT")
              }
            >
              <option value="CHAPTER">Theo chương</option>
              <option value="SUBJECT">Toàn môn</option>
            </select>

            {scope === "CHAPTER" && (
              <select
                value={chapterId}
                onChange={(e) => {
                  setChapterId(e.target.value);
                  setSelected([]);
                }}
              >
                <option>Chọn chương</option>
                {chapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={scope === "CHAPTER" && !chapterId}
            >
              Tiếp
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề"
            />

            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />

            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />

            <button onClick={() => setStep(1)}>Back</button>
            <button onClick={() => setStep(3)}>Next</button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            {testType === "ESSAY" && (
              <>
                <p className="text-sm text-gray-500">
                  Đã chọn: {selected.length} câu
                </p>

                <div className="max-h-64 overflow-y-auto">
                  {filteredQ.map((q) => (
                    <div key={q.id}>
                      <input
                        type="radio"
                        name="essay-question"
                        checked={selected.includes(q.id)}
                        onChange={() => setSelected([q.id])}
                      />
                      {q.content}
                    </div>
                  ))}
                </div>
              </>
            )}

            {testType === "QUIZ" && (
              <>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setMode("MANUAL");
                      setSelected([]);
                    }}
                    className={`px-3 py-1 rounded ${
                      mode === "MANUAL"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Chọn tay
                  </button>

                  <button
                    onClick={() => {
                      setMode("AUTO");
                      setSelected([]);
                    }}
                    className={`px-3 py-1 rounded ${
                      mode === "AUTO" ? "bg-teal-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    Random
                  </button>
                </div>

                {mode === "MANUAL" && (
                  <>
                    <p className="text-sm text-gray-500">
                      Đã chọn: {selected.length} câu
                    </p>

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search"
                    />

                    <div className="max-h-64 overflow-y-auto">
                      {filteredQ.map((q) => (
                        <div
                          key={q.id}
                          className={
                            testType === "QUIZ" && q.questionFormat === "ESSAY"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        >
                          <input
                            type="checkbox"
                            disabled={
                              testType === "QUIZ" &&
                              q.questionFormat === "ESSAY"
                            }
                            checked={selected.includes(q.id)}
                            onChange={() => {
                              if (selected.includes(q.id)) {
                                setSelected((prev) =>
                                  prev.filter((x) => x !== q.id),
                                );
                              } else {
                                setSelected((prev) => [...prev, q.id]);
                              }
                            }}
                          />
                          {q.content}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {mode === "AUTO" && (
                  <>
                    <div className="flex gap-2">
                      <select
                        value={ruleDifficulty}
                        onChange={(e) => setRuleDifficulty(e.target.value)}
                      >
                        <option value="">Chọn mức độ</option>
                        <option value="EASY">Dễ</option>
                        <option value="MEDIUM">Trung bình</option>
                        <option value="HARD">Khó</option>
                      </select>

                      <input
                        type="number"
                        min={1}
                        value={ruleCount}
                        onChange={(e) => setRuleCount(Number(e.target.value))}
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!ruleDifficulty) return alert("Chọn mức độ");

                        setRules([
                          ...rules,
                          {
                            difficulty: ruleDifficulty,
                            totalCount: ruleCount,
                          },
                        ]);

                        setRuleDifficulty("");
                        setRuleCount(1);
                      }}
                    >
                      Add rule
                    </button>

                    {rules.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <span>
                          {r.totalCount} câu ({r.difficulty})
                        </span>

                        <button
                          onClick={() =>
                            setRules((prev) =>
                              prev.filter((_, idx) => idx !== i),
                            )
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <p className="text-sm text-gray-500">
                      Tổng số câu:{" "}
                      {rules.reduce((sum, r) => sum + r.totalCount, 0)}
                    </p>
                  </>
                )}
              </>
            )}

            <button onClick={() => setStep(2)}>Back</button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`px-4 py-2 rounded bg-teal-600 text-white ${
                saving ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-700"
              }`}
            >
              {saving ? "Đang tạo..." : "Tạo"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
