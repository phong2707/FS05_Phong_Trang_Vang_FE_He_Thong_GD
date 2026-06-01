import api from "./apiClient";

export const studentLearningApi = {
  getSchedules: () => api.get("/student/schedules"),

  getMySubjects: () => api.get("/student/subjects"),

  getMaterials: (subjectId: string) =>
    api.get(`/student/subjects/${subjectId}/materials`),
};
