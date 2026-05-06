// frontend/src/api/classGroupUser.api.ts
import apiClient from '@/api/apiClient';

// Lấy danh sách sinh viên trong nhóm lớp
export const getStudentsInGroup = (classGroupId: string) =>
  apiClient.get(`/v1/class-groups/${classGroupId}/students`);

// Ghi danh sinh viên vào nhóm lớp
export const addStudentToGroup = (
  classGroupId: string,
  email: string
) =>
  apiClient.post(
    `/v1/class-groups/${classGroupId}/students`,
    { email }
  );

// Xóa sinh viên khỏi nhóm lớp
export const removeStudentFromGroup = (
  classGroupId: string,
  studentId: string
) =>
  apiClient.delete(
    `/v1/class-groups/${classGroupId}/students/${studentId}`
  );