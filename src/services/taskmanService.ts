// frontend/src/services/taskmanService.ts

import apiClient from '@/api/apiClient';
import type { TaskmanResource, ChapterWithResources } from '@/types/taskman';

/**
 * Fetch danh sách tài liệu của môn học (nhóm theo chương)
 */
export const fetchSubjectResources = async (
  subjectId: string
): Promise<ChapterWithResources[]> => {
  if (!subjectId) {
    throw new Error('subjectId không hợp lệ');
  }

  const response = await apiClient.get(`/v1/subjects/${subjectId}/resources`);
  return response?.data?.data || [];
};

/**
 * Tải file tài liệu lên
 */
export const uploadResourceFile = async (
  chapterId: string,
  file: File,
  title: string
): Promise<TaskmanResource> => {
  if (!chapterId || !file || !title.trim()) {
    throw new Error('Dữ liệu không đầy đủ');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);

  const response = await apiClient.post(
    `/v1/chapters/${chapterId}/resources/file`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response?.data?.data;
};

/**
 * Thêm link tài liệu
 */
export const addResourceLink = async (
  chapterId: string,
  title: string,
  url: string
): Promise<TaskmanResource> => {
  if (!chapterId || !title.trim() || !url.trim()) {
    throw new Error('Dữ liệu không đầy đủ');
  }

  const response = await apiClient.post(`/v1/chapters/${chapterId}/resources/link`, {
    title,
    url,
  });

  return response?.data?.data;
};

/**
 * Cập nhật trạng thái hiển thị tài liệu
 */
export const updateResourceVisibility = async (
  resourceId: string,
  isVisible: boolean
): Promise<TaskmanResource> => {
  if (!resourceId) {
    throw new Error('resourceId không hợp lệ');
  }

  const response = await apiClient.put(`/v1/resources/${resourceId}/visibility`, {
    isVisible,
  });

  return response?.data?.data;
};

/**
 * Xóa tài liệu
 */
export const deleteResource = async (resourceId: string): Promise<void> => {
  if (!resourceId) {
    throw new Error('resourceId không hợp lệ');
  }

  await apiClient.delete(`/v1/resources/${resourceId}`);
};

/**
 * Bọc API call với mock fallback
 */
export const withMockFallback = async <T,>(
  apiCall: () => Promise<T>,
  fallback: () => T
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    console.warn('API call failed, using mock fallback:', error);
    return fallback();
  }
};
