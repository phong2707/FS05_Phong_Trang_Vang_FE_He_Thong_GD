import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const success = searchParams.get('success') === 'true';
  const message = searchParams.get('message') || (success ? 'Thanh toán thành công. Cảm ơn bạn đã đăng ký!' : 'Thanh toán không thành công. Vui lòng thử lại.');
  const transactionId = searchParams.get('transactionId');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-10 text-center">
          <div className="mx-auto mb-8 w-24 h-24 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            {success ? <CheckCircle2 size={50} /> : <XCircle size={50} />}
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {success ? 'Thanh toán hoàn tất' : 'Thanh toán không thành công'}
          </h1>

          <p className="text-slate-600 text-lg mb-6">{message}</p>

          {transactionId && (
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 mb-6">
              <span className="font-semibold">Mã giao dịch:</span>
              <span>{transactionId}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/courses')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-5 py-3 text-white font-semibold hover:bg-[#0d6560] transition"
            >
              <ArrowLeft size={18} />
              Quay về khóa học
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100 transition"
            >
              Xem trạng thái đăng ký
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
