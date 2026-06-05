import apiClient from "@/api/apiClient";
import { adminUserService } from "@/services/adminUserService";

export type ClassGroupStatus = "ACTIVE" | "INACTIVE";

export interface ClassGroup {
  id: string;
  subjectId: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  maxStudents: number | null;
  roomLink: string | null;
  status: ClassGroupStatus;
  createdAt: string;
  subject?: {
    id: string;
    name: string;
    course?: { id: string; title: string };
  };
  _count?: {
    groupUsers: number;
  };
}

export interface ClassGroupStudent {
  userId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
  };
}

export interface AvailableTeacher {
  subjectId: string;
  teacherId: string;
  type: "MAIN" | "TA";
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
  };
}

export interface ClassGroupListQuery {
  subjectId?: string;
  search?: string;
  status?: ClassGroupStatus;
  page?: number;
  limit?: number;
}

export interface CreateClassGroupPayload {
  subjectId: string;
  name: string;
  startDate?: string;
  endDate?: string;
  maxStudents?: number;
  roomLink?: string;
  status?: ClassGroupStatus;
}

export interface AddStudentResult {
  added: string[];
  failed: { userId: string; reason: string }[];
}

export interface SubjectOption {
  id: string;
  name: string;
  course?: {
    id: string;
    title: string;
  };
}

export interface AdminUserOption {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

const BASE = "/admin/class-groups";

export const classGroupService = {
  async getClassGroups(query: ClassGroupListQuery = {}) {
    const res = await apiClient.get(`${BASE}`, { params: query });
    return res.data?.data;
  },

  async getClassGroupById(id: string) {
    const res = await apiClient.get(`${BASE}/${id}`);
    return res.data?.data as ClassGroup;
  },

  async createClassGroup(payload: CreateClassGroupPayload) {
    const res = await apiClient.post(`${BASE}`, payload);
    return res.data?.data as ClassGroup;
  },

  async updateClassGroup(id: string, payload: Partial<CreateClassGroupPayload>) {
    const res = await apiClient.patch(`${BASE}/${id}`, payload);
    return res.data?.data as ClassGroup;
  },

  async deactivateClassGroup(id: string) {
    const res = await apiClient.delete(`${BASE}/${id}`);
    return res.data?.data as ClassGroup;
  },

  async getClassGroupStudents(classGroupId: string) {
    const res = await apiClient.get(`${BASE}/${classGroupId}/students`);
    return (res.data?.data ?? []) as ClassGroupStudent[];
  },

  async addStudents(classGroupId: string, userIds: string[]) {
    const res = await apiClient.post(`${BASE}/${classGroupId}/students`, { userIds });
    return res.data?.data as AddStudentResult;
  },

  async removeStudent(classGroupId: string, userId: string) {
    const res = await apiClient.delete(`${BASE}/${classGroupId}/students/${userId}`);
    return res.data?.data;
  },

  async getAvailableTeachers(classGroupId: string) {
    const res = await apiClient.get(`${BASE}/${classGroupId}/teachers`);
    return (res.data?.data ?? []) as AvailableTeacher[];
  },

  async getSubjectsWithoutClassGroup() {
    const [subjectRes, classGroupRes] = await Promise.all([
      apiClient.get("/subjects"),
      apiClient.get(`${BASE}`, { params: { page: 1, limit: 1000 } }),
    ]);

    const subjects = (subjectRes.data?.data ?? subjectRes.data ?? []) as SubjectOption[];
    const classGroups = (classGroupRes.data?.data?.items ?? classGroupRes.data?.data ?? []) as ClassGroup[];

    const usedSubjectIds = new Set(classGroups.map((g) => g.subjectId));
    return subjects.filter((s) => !usedSubjectIds.has(s.id));
  },

  async findUsersByEmails(emails: string[]) {
    const uniqueEmails = Array.from(
      new Set(
        emails
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean)
      )
    );

    if (uniqueEmails.length === 0) return [] as AdminUserOption[];

    const res = await adminUserService.getUsers({
      search: uniqueEmails.join(" "),
      page: 1,
      perPage: 200,
    });

    const rows = (res?.data ?? res?.users ?? []) as AdminUserOption[];
    const emailSet = new Set(uniqueEmails);
    return rows.filter((u) => emailSet.has((u.email ?? "").toLowerCase()));
  },
};
