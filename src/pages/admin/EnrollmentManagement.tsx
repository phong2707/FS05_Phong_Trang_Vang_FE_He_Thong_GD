/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import enrollmentService from "@/services/enrollment.service";
import type { AdminEnrollmentItem } from "@/services/enrollment.service";

export default function EnrollmentManagement() {
  const [items, setItems] = useState<AdminEnrollmentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await enrollmentService.getPendingEnrollments({
        status: "PENDING",
        page: 1,
        limit: 50,
      });
      setItems(res.enrollments || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Không thể tải danh sách đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (enrollmentId: string) => {
    setApprovingId(enrollmentId);
    setError("");
    try {
      await enrollmentService.adminApproveEnrollment(enrollmentId);
      await fetchPending();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Duyệt đơn thất bại.");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý đăng ký khóa học</h1>
        <button
          onClick={fetchPending}
          className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
        >
          Làm mới
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-600">
                <th className="px-4 py-3">Sinh viên</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Khóa học</th>
                <th className="px-4 py-3">Thanh toán</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày đăng ký</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-slate-500" colSpan={7}>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-500" colSpan={7}>
                    Không có đơn đăng ký chờ duyệt.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {item.user ? `${item.user.firstName} ${item.user.lastName}` : item.userId}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.user?.email || "-"}</td>
                    <td className="px-4 py-3 text-slate-700">{item.course?.title || item.courseId}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {item.transaction?.paymentMethod || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-amber-100 text-amber-700 px-2 py-1 text-xs font-semibold">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(item.enrolledAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleApprove(item.id)}
                        disabled={approvingId === item.id}
                        className="px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {approvingId === item.id ? "Đang duyệt..." : "Duyệt"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
