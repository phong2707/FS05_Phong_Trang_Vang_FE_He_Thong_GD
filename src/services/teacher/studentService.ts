/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/api/apiClient';

// Mock dữ liệu fallback khi API thất bại
export const MOCK_SUBJECT_DATA = {
  subjectId: 'sub-1',
  subjectName: 'Lập trình Web',
  totalStudents: 3,
  classGroups: [
    {
      classGroupId: 'cg-1',
      classGroupName: 'Lớp Tối 2-4-6',
      status: 'ACTIVE',
      studentCount: 2,
      students: [
        {
          userId: 'u-1',
          studentCode: 'SV001',
          fullName: 'Nguyễn Văn An',
          email: 'an@example.com',
          avatarUrl: null,
          phoneNumber: '0901234567',
          status: 'ACTIVE',
          joinedAt: '2025-09-01T00:00:00.000Z',
        },
        {
          userId: 'u-2',
          studentCode: 'SV002',
          fullName: 'Trần Thị Bình',
          email: 'binh@example.com',
          avatarUrl: null,
          phoneNumber: null,
          status: 'PENDING',
          joinedAt: '2025-09-02T00:00:00.000Z',
        },
      ],
    },
    {
      classGroupId: 'cg-2',
      classGroupName: 'Lớp Cuối tuần',
      status: 'ACTIVE',
      studentCount: 1,
      students: [
        {
          userId: 'u-3',
          studentCode: 'SV003',
          fullName: 'Lê Quốc Cường',
          email: 'cuong@example.com',
          avatarUrl: null,
          phoneNumber: '0987654321',
          status: 'INACTIVE',
          joinedAt: '2025-09-05T00:00:00.000Z',
        },
      ],
    },
  ],
};

// Wrapper with mock fallback được đóng gói ở đây để reuse
const withMockFallback = async <T,>(
  apiCall: () => Promise<T>,
  fallback: () => T
): Promise<T> => {
  try {
    return await apiCall();
  } catch {
    return fallback();
  }
};

export const studentService = {
  // Lấy tất cả sinh viên theo subject (grouped by classGroup)
  getStudents: async (subjectId: string) => {
    return withMockFallback(async () => {
      const res = await api.get(`/v1/teacher/subjects/${subjectId}/students`);
      return res?.data?.data;
    }, () => MOCK_SUBJECT_DATA as any);
  },

  // Lấy sinh viên của 1 classGroup cụ thể
  getStudentsByClassGroup: async (subjectId: string, classGroupId: string) => {
    return withMockFallback(async () => {
      const res = await api.get(`/v1/teacher/subjects/${subjectId}/students`, {
        params: { classGroupId },
      });
      return res?.data?.data;
    }, () => {
      const cg = (MOCK_SUBJECT_DATA.classGroups as any[]).find((g) => g.classGroupId === classGroupId);
      if (!cg) return { ...MOCK_SUBJECT_DATA, classGroups: [] } as any;
      return { ...MOCK_SUBJECT_DATA, classGroups: [cg], totalStudents: cg.studentCount } as any;
    });
  },
};

export default studentService;
