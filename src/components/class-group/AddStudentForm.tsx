import { useState } from 'react';

export default function AddStudentForm({
  onAdd,
}: {
  onAdd: (studentId: string) => Promise<void>;
}) {
  const [studentId, setStudentId] = useState('');

  return (
    <div className="mb-6 flex gap-3">
      <input
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        placeholder="Nhập Student ID"
        className="flex-1 px-4 py-2 rounded-xl border border-gray-200"
      />

      <button
        onClick={() => {
          if (!studentId) return;
          onAdd(studentId);
          setStudentId('');
        }}
        className="px-5 py-2 rounded-xl bg-emerald-600 
        text-white font-semibold hover:bg-emerald-700"
      >
        Ghi danh
      </button>
    </div>
  );
}