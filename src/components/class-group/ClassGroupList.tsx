import { useNavigate } from 'react-router-dom';

interface ClassGroup {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface Props {
  groups: ClassGroup[];
  onUpdate: (id: string, data: { status: 'ACTIVE' | 'INACTIVE' }) => void;
  onDelete: (id: string) => void;
}

export default function ClassGroupList({
  groups,
  onUpdate,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  return (
    <table className="w-full border mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Tên nhóm</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>

      <tbody>
        {groups.map((g) => (
          <tr key={g.id} className="border-t">
            <td className="p-2">{g.name}</td>
            <td>{g.status}</td>

            <td className="space-x-2">
              {/* ✅ NÚT QUẢN LÝ SINH VIÊN */}
              <button
                className="btn btn-success"
                onClick={() =>
                  navigate(`/teacher/class-groups/${g.id}/students`)
                }
              >
                Quản lý sinh viên
              </button>

              <button
                className="btn"
                onClick={() =>
                  onUpdate(g.id, {
                    status:
                      g.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                  })
                }
              >
                Đổi trạng thái
              </button>

              <button
                className="btn btn-danger"
                onClick={() => onDelete(g.id)}
              >
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}