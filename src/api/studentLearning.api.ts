import api from "./apiClient";

export const studentLearningApi = {
  getSchedules: () => api.get("/v1/student/schedules"),

  getMySubjects() {
    return api.get("/v1/student/subjects");
  },
  getMyTests() {
    return api.get("/v1/student/tests");
  },

  getMaterials(subjectId: string) {
    return api.get(`/v1/student/subjects/${subjectId}/materials`);
  },

  getMaterialDetail(materialId: string) {
    return api.get(`/v1/student/materials/${materialId}`);
  },

  getMyGrades: () => api.get("/v1/student/grades"),

  getMyAttendances: () => api.get("/v1/student/attendances"),

  startTest: (payload: { testId: string }) => {
    console.log("API BODY startTest:", payload); // ✅ DEBUG
    return api.post("/v1/tests/start", payload);
  },

  submitTest: (payload: {
    testId: string;
    classGroupId: string; // Cần lấy từ đâu đó, ví dụ từ context hoặc props
    sessionToken: string;
    answers: {
      questionId: string;
      answerId?: string;
    }[];
  }) => api.post("/v1/tests/submit", payload),

  submitAssignment: (payload: {
    testId: string;
    classGroupId: string; // Cần lấy từ đâu đó
    essayAnswer: string;
  }) => api.post("/assignments/submit", payload),
};
