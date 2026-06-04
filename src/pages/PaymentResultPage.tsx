/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import enrollmentService from '@/services/enrollment.service';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const success = searchParams.get('success') === 'true';
  const message =
    searchParams.get('message') ||
    (success
      ? 'Thanh toán thành công. Cảm ơn bạn đã đăng ký!'
      : 'Thanh toán không thành công. Vui lòng thử lại.');
  const transactionId = searchParams.get('transactionId');
  const enrollmentId = searchParams.get('enrollmentId');

  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!transactionId) {
        setLoading(false);
        return;
      }

      try {
        const data = await enrollmentService.getTransactionDetails(transactionId);
        setTransaction(data);
      } catch (err) {
        console.error('Error fetching transaction:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [transactionId]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 md:p-10">
          {/* Status Icon */}
          <div className="mx-auto mb-6 w-24 h-24 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            {success ? (
              <CheckCircle2 size={56} />
            ) : (
              <XCircle size={56} className="text-red-600" />
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-900 mb-4 text-center">
            {success ? 'Thanh toán hoàn tất' : 'Thanh toán không thành công'}
          </h1>

          {/* Message */}
          <p className="text-slate-600 text-lg mb-8 text-center">{message}</p>

          {/* Loading Transaction Details */}
          {loading && transactionId ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-[#0f766e] mr-2" size={24} />
              <p className="text-slate-600">Đang tải chi tiết giao dịch...</p>
            </div>
          ) : transaction ? (
            // Transaction Receipt
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 mb-8">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Chi tiết giao dịch</h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600">Mã giao dịch:</span>
                  <span className="font-mono font-semibold text-slate-900">{transaction.id}</span>
                </div>

                {transaction.enrollment?.course && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Khóa học:</span>
                    <span className="font-semibold text-slate-900">{transaction.enrollment.course.title}</span>
                  </div>
                )}

                {transaction.enrollment?.user && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Người đăng ký:</span>
                    <span className="font-semibold text-slate-900">
                      {transaction.enrollment.user.firstName} {transaction.enrollment.user.lastName}
                    </span>
                  </div>
                )}

                {transaction.enrollment?.user?.email && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Email:</span>
                    <span className="font-semibold text-slate-900">{transaction.enrollment.user.email}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600">Số tiền:</span>
                  <span className="font-bold text-lg text-[#0f766e]">
                    ₫{transaction.amount.toLocaleString('vi-VN')}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600">Phương thức thanh toán:</span>
                  <span className="font-semibold text-slate-900">
                    {transaction.paymentMethod === 'VNPAY' ? 'VNPay' : 'Chuyển khoản ngân hàng'}
                  </span>
                </div>

                {transaction.referenceCode && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600">Mã tham chiếu:</span>
                    <span className="font-mono text-slate-900">{transaction.referenceCode}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600">Trạng thái:</span>
                  <span
                    className={`font-bold px-3 py-1 rounded-full text-sm ${
                      transaction.status === 'SUCCESS'
                        ? 'bg-emerald-100 text-emerald-700'
                        : transaction.status === 'FAILED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {transaction.status === 'SUCCESS'
                      ? 'Thành công'
                      : transaction.status === 'FAILED'
                        ? 'Thất bại'
                        : 'Đang chờ'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">Ngày tạo:</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(transaction.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/courses')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-6 py-3 text-white font-semibold hover:bg-[#0d6560] transition"
            >
              <ArrowLeft size={18} />
              Quay về khóa học
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-100 transition"
            >
              Xem trạng thái đăng ký
            </button>
          </div>

          {/* Additional Info for Manual Payment */}
          {success && transaction?.paymentMethod === 'MANUAL' && (
            <div className="mt-8 rounded-2xl bg-blue-50 border border-blue-200 p-4">
              <p className="text-sm text-blue-900">
                <strong>ℹ️ Lưu ý:</strong> Đơn đăng ký của bạn đã được tiếp nhận. Hệ thống sẽ xác nhận
                thanh toán trong vòng 1-2 phút sau khi chúng tôi nhận được chuyển khoản của bạn.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
