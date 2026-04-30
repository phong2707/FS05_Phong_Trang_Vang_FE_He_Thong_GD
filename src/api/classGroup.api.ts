import apiClient from '@/api/apiClient';

export const getClassGroups = (subjectId: string) =>
  apiClient.get(`/api/v1/class-groups?subjectId=${subjectId}`);

export const createClassGroup = (data: { subjectId: string; name: string }) =>
  apiClient.post('/api/v1/class-groups', data);

export const updateClassGroup = (
  id: string,
  data: { name?: string; status?: string }
) =>
  apiClient.put(`/api/v1/class-groups/${id}`, data);

export const deleteClassGroup = (id: string) =>
  apiClient.delete(`/api/v1/class-groups/${id}`);