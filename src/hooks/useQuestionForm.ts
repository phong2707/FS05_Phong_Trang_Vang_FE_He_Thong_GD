import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/api/apiClient";
import axios from "axios";

type Scope = "CHAPTER" | "SUBJECT" | "COURSE";
type QuestionFormat = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "ESSAY";

type Answer = {
  answerText: string;
  isCorrect: boolean;
};

type ApiAnswer = {
  answerText: string;
  isCorrect: boolean;
  orderIndex?: number;
};

type RubricItem = {
  name: string;
  max: number;
};

type Question = {
  id: string;
  content: string;
  questionFormat: QuestionFormat;
  explanation: string | RubricItem[];
  difficulty: string;
  typeId: string;
  chapterId?: string;
  courseId?: string;
  answers: ApiAnswer[];
};

type Chapter = { id: string; title?: string; name?: string };

type Subject = {
  id: string;
  name: string;
  chapters?: Chapter[];
  course?: { id: string; title: string };
};

export function useQuestionForm({
  questionId,
  subjectId,
}: {
  questionId?: string;
  subjectId?: string;
}) {
  const navigate = useNavigate();
  const isEdit = !!questionId;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [scope, setScope] = useState<Scope>("CHAPTER");
  const [chapterId, setChapterId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [questionFormat, setQuestionFormat] =
    useState<QuestionFormat>("SINGLE_CHOICE");
  const [difficulty, setDifficulty] = useState("MEDIUM");

  const [content, setContent] = useState("");
  const [explanation, setExplanation] = useState("");
  const [rubric, setRubric] = useState<RubricItem[]>([
    { name: "Nội dung", max: 5 },
    { name: "Trình bày", max: 5 },
  ]);

  const [answers, setAnswers] = useState<Answer[]>([
    { answerText: "", isCorrect: false },
    { answerText: "", isCorrect: false },
  ]);

  // ===== LOAD QUESTION =====
  useEffect(() => {
    if (!questionId) return;

    (async () => {
      try {
        const res = await apiClient.get(`/v1/questions/${questionId}`);
        const q: Question = res.data.data;

        setTypeId(q.typeId);
        setQuestionFormat(q.questionFormat);
        setContent(q.content);
        setChapterId(q.chapterId || "");
        setDifficulty(q.difficulty || "MEDIUM");

        setScope(q.chapterId ? "CHAPTER" : q.courseId ? "COURSE" : "SUBJECT");

        if (q.questionFormat === "ESSAY") {
          setRubric(Array.isArray(q.explanation) ? q.explanation : []);
          setExplanation("");
          setAnswers([
            {
              answerText: q.answers?.[0]?.answerText || "",
              isCorrect: true,
            },
          ]);
        } else {
          setExplanation(
            typeof q.explanation === "string" ? q.explanation : "",
          );

          setAnswers(
            q.answers.map((a) => ({
              answerText: a.answerText,
              isCorrect: a.isCorrect,
            })),
          );
        }
      } catch {
        alert("Lỗi load câu hỏi");
      }
    })();
  }, [questionId]);

  useEffect(() => {
    if (!subjectId) return;

    (async () => {
      try {
        const res = await apiClient.get(`/v1/subjects/${subjectId}`);
        const data = res?.data?.data;

        setSubject(data);
        setChapters(data?.chapters || []);
      } catch {
        alert("Lỗi load subject");
      }
    })();
  }, [subjectId]);

  useEffect(() => {
    (async () => {
      const res = await apiClient.get("/v1/question-types");
      const data = res?.data?.data || [];

      if (data.length > 0) {
        setTypeId(data[0].id);
      }
    })();
  }, []);

  const totalScore = rubric.reduce((sum, r) => sum + r.max, 0);

  const isEmptyHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "").trim() === "";
  };

  const isValid = useMemo(() => {
    if (isEmptyHtml(content)) return false;
    if (!typeId) return false;

    if (questionFormat === "ESSAY") {
      if (scope === "CHAPTER" && !chapterId) return false;
      if (rubric.length === 0) return false;
      if (rubric.some((r) => !r.name.trim() || r.max <= 0)) return false;
    } else {
      if (answers.length < 2) return false;

      // ✅ CHECK nội dung CKEditor
      if (answers.some((a) => isEmptyHtml(a.answerText))) return false;

      // ✅ phải có đáp án đúng
      if (!answers.some((a) => a.isCorrect)) return false;

      // ✅ SINGLE chỉ có 1 đáp án đúng
      if (
        questionFormat === "SINGLE_CHOICE" &&
        answers.filter((a) => a.isCorrect).length !== 1
      ) {
        return false;
      }
    }

    return true;
  }, [content, rubric, answers, questionFormat, scope, chapterId]);

  const buildPayload = () => {
  const payload: Record<string, unknown> = {
    scope,
    typeId,
    content,
    explanation: questionFormat === "ESSAY" ? rubric : explanation,
    difficulty,
    questionFormat,
    maxMark: questionFormat === "ESSAY" ? totalScore : undefined,
  };

  // ✅ CONTROL THEO SCOPE
  if (scope === "CHAPTER") {
    payload.chapterId = chapterId;
    payload.subjectId = subject?.id;
    payload.courseId = subject?.course?.id;
  }

  if (scope === "SUBJECT") {
    payload.subjectId = subject?.id;
    payload.courseId = subject?.course?.id;
  }

  if (scope === "COURSE") {
    payload.courseId = subject?.course?.id;
  }

  // ✅ ANSWERS
  payload.answers =
    questionFormat === "ESSAY"
      ? [
          {
            answerText: answers[0]?.answerText || "",
            isCorrect: true,
          },
        ]
      : answers.map((a, i) => ({
          answerText: a.answerText,
          isCorrect: a.isCorrect,
          orderIndex: i + 1,
        }));

  return payload;
};

  const handleSubmit = async () => {
    if (!isValid) return;
    

    const payload = buildPayload();

    try {
      if (isEdit) {
        await apiClient.put(`/v1/questions/${questionId}`, payload);
      } else {
        await apiClient.post("/v1/questions", payload);
      }

      navigate(-1);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        alert(e.response?.data?.message || "Có lỗi xảy ra");
      }
    }
  };

  const addAnswer = () => {
    if (answers.length >= 6) return;

    setAnswers((prev) => [...prev, { answerText: "", isCorrect: false }]);
  };

  return {
    isEdit,

    subject,
    chapters,

    scope,
    setScope,
    chapterId,
    setChapterId,
    typeId,
    setTypeId,
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
  };
}
