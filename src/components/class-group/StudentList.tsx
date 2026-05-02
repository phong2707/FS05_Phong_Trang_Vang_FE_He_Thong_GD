export default function StudentList({
  students,
  onRemove,
}: {
  students: any[];
  onRemove: (studentId: string) => Promise<void>;
}) {
  if (students.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Chưa có sinh viên trong nhóm lớp.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {students.map((item) => (
        <div
          key={item.user.id}
          className="flex items-center justify-between
          p-4 rounded-xl border border-gray-100 hover:bg-teal-50"
        >
          <div>
            <p className="font-semibold text-gray-900">
              {item.user.firstName} {item.user.lastName}
            </p>
            <p className="text-sm text-gray-500">
              {item.user.email}
            </p>
          </div>

          <button
            onClick={() => onRemove(item.user.id)}
            className="text-sm px-4 py-2 rounded-lg
            bg-red-50 text-red-600 hover:bg-red-100"
          >
            Xóa
          </button>
        </div>
      ))}
    </div>
  );
}