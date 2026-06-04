/* eslint-disable @typescript-eslint/no-unused-vars */
import { X, Copy, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface PaymentInstructionModalProps {
  isOpen: boolean;
  paymentMethod: 'VNPAY' | 'MANUAL';
  amount: number;
  enrollmentId: string;
  courseName: string;
  onClose: () => void;
}

const BANK_DETAILS = {
  accountHolder: 'Công ty TNHH Giáo dục Iviettech',
  accountNumber: '1234567890123456',
  bankName: 'Ngân hàng Vietcombank',
  branchName: 'Chi nhánh Hà Nội',
};

export default function PaymentInstructionModal({
  isOpen,
  paymentMethod,
  amount,
  enrollmentId,
  courseName,
  onClose,
}: PaymentInstructionModalProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [isTransferred, setIsTransferred] = useState(false);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">
            {paymentMethod === 'VNPAY' ? 'Hướng dẫn thanh toán' : 'Thông tin chuyển khoản'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-6">
          {paymentMethod === 'VNPAY' ? (
            // VNPAY: Show redirecting message with spinner
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-[#0f766e]" size={48} />
              <p className="text-center text-slate-600 font-semibold">
                Đang chuyển hướng đến VNPay...
              </p>
              <p className="text-center text-sm text-slate-500">
                Vui lòng không đóng trang này
              </p>
            </div>
          ) : (
            // MANUAL: Show bank details
            <div className="space-y-5">
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm text-amber-900 font-semibold mb-2">⚠️ Hướng dẫn chuyển khoản</p>
                <p className="text-xs text-amber-800">
                  Vui lòng chuyển khoản vào tài khoản dưới đây. Nội dung chuyển khoản <strong>bắt buộc</strong> phải là:
                </p>
              </div>

              {/* Nội dung chuyển khoản */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-xs text-slate-600 font-semibold mb-2">Nội dung chuyển khoản:</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono font-bold text-slate-900 break-all">
                    ENROLL-{enrollmentId}
                  </p>
                  <button
                    onClick={() =>
                      copyToClipboard(`ENROLL-${enrollmentId}`, 'transferContent')
                    }
                    className={`p-2 rounded-md transition ${
                      copied === 'transferContent'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {copied === 'transferContent' ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Thông tin tài khoản */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600 font-semibold mb-2">Chủ tài khoản:</p>
                  <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-sm text-slate-900 font-medium">{BANK_DETAILS.accountHolder}</p>
                    <button
                      onClick={() =>
                        copyToClipboard(BANK_DETAILS.accountHolder, 'accountHolder')
                      }
                      className={`p-2 rounded-md transition ${
                        copied === 'accountHolder'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {copied === 'accountHolder' ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-600 font-semibold mb-2">Số tài khoản:</p>
                  <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-mono text-sm font-bold text-slate-900">
                      {BANK_DETAILS.accountNumber}
                    </p>
                    <button
                      onClick={() =>
                        copyToClipboard(BANK_DETAILS.accountNumber, 'accountNumber')
                      }
                      className={`p-2 rounded-md transition ${
                        copied === 'accountNumber'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {copied === 'accountNumber' ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-600 font-semibold mb-2">Tên ngân hàng:</p>
                  <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{BANK_DETAILS.bankName}</p>
                      <p className="text-xs text-slate-500">{BANK_DETAILS.branchName}</p>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(BANK_DETAILS.bankName, 'bankName')
                      }
                      className={`p-2 rounded-md transition ${
                        copied === 'bankName'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {copied === 'bankName' ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-600 font-semibold mb-2">Số tiền:</p>
                  <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-lg font-bold text-emerald-700">
                      ₫{amount.toLocaleString('vi-VN')}
                    </p>
                    <button
                      onClick={() =>
                        copyToClipboard(amount.toString(), 'amount')
                      }
                      className={`p-2 rounded-md transition ${
                        copied === 'amount'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'hover:bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {copied === 'amount' ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                <p className="text-xs text-blue-900">
                  ℹ️ Sau khi chuyển khoản, hệ thống sẽ xác nhận trong vòng 1-2 phút.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-slate-200 text-right">
          {paymentMethod === 'MANUAL' ? (
            <button
              onClick={() => {
                setIsTransferred(true);
                setTimeout(onClose, 1500);
              }}
              disabled={isTransferred}
              className="px-4 py-2 rounded-lg bg-[#0f766e] text-white hover:bg-[#0d6560] disabled:opacity-50 transition"
            >
              {isTransferred ? '✓ Đã xác nhận' : 'Đã chuyển khoản'}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Đóng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
