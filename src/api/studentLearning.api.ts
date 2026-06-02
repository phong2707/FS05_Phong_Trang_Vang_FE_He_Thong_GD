import api from "./apiClient";

export const studentLearningApi = {
  getSchedules: () => api.get("/student/schedules"),

  getMySubjects: () => api.get("/student/subjects"),

  getMaterials: (subjectId: string) =>
    api.get(`/student/subjects/${subjectId}/materials`),

  getMyGrades: () => api.get("/student/grades"),

  getMyAttendances: () => api.get("/student/attendances"),

  startTest: (payload: { testId: string }) =>
    api.post("/student/tests/start", payload),

  submitTest: (payload: {
    testId: string;
    classGroupId: string; // Cần lấy từ đâu đó, ví dụ từ context hoặc props
    sessionToken: string;
    answers: {
      questionId: string;
      answerId?: string;
    }[];
  }) => api.post("/student/tests/submit", payload),

  submitAssignment: (payload: {
    testId: string;
    classGroupId: string; // Cần lấy từ đâu đó
    essayAnswer: string;
  }) => api.post("/student/assignments/submit", payload),
};
