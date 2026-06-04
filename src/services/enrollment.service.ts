/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api/apiClient";

export type PaymentMethod = "VNPAY" | "MANUAL";

export interface EnrollCoursePayload {
  courseId: string;
  paymentMethod: PaymentMethod;
  guestEmail?: string;
  guestFirstName?: string;
  guestLastName?: string;
  guestPhoneNumber?: string;
}

export interface EnrollmentDto {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
}

export interface TransactionDto {
  id: string;
  amount: number;
  paymentMethod: PaymentMethod | string;
  status: string;
  referenceCode?: string | null;
  createdAt?: string;
}

export interface EnrollCourseResponse {
  message: string;
  enrollment: EnrollmentDto;
  transaction: TransactionDto;
  vnpayUrl?: string;
}

export interface AdminEnrollmentItem {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    phoneNumber?: string | null;
  };
  course?: {
    id: string;
    title: string;
    price: number;
    discountPrice?: number | null;
  };
  transaction?: TransactionDto | null;
}

export interface AdminEnrollmentListResponse {
  message: string;
  enrollments: AdminEnrollmentItem[];
  pagination?: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminApproveResponse {
  message: string;
  enrollment: EnrollmentDto;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
  } | null;
}

export const enrollmentService = {
  async enrollCourse(payload: EnrollCoursePayload): Promise<EnrollCourseResponse> {
    const res = await api.post("/v1/enrollments", payload);
    return res.data;
  },

  async getTransactionDetails(transactionId: string): Promise<any> {
    const res = await api.get(`/v1/enrollments/transactions/${transactionId}`);
    return res.data.transaction;
  },

  async getPendingEnrollments(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<AdminEnrollmentListResponse> {
    const res = await api.get("/v1/admin/enrollments", { params });
    return res.data;
  },

  async adminApproveEnrollment(enrollmentId: string): Promise<AdminApproveResponse> {
    const res = await api.post(`/v1/admin/enrollments/${enrollmentId}/approve`);
    return res.data;
  },
};

export default enrollmentService;
