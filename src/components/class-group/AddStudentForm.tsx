import { useState } from "react";

export default function AddStudentForm({
  onAdd,
}: {
  onAdd: (email: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      await onAdd(email);
      setEmail("");
    } catch (error: unknown) {
  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError("Có lỗi xảy ra");
  }
}
 finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex gap-3">
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null); // ✅ xoá lỗi khi user nhập lại
          }}
          placeholder="Nhập email của sinh viên"
          className={`flex-1 px-4 py-2 rounded-xl border ${
            error ? "border-red-500" : "border-gray-200"
          }`}
        />

        <button
          onClick={handleAdd}
          disabled={loading}
          className="px-5 py-2 rounded-xl bg-emerald-600
          text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Đang ghi danh..." : "Ghi danh"}
        </button>
      </div>

      {/* ✅ THÔNG BÁO LỖI */}
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}