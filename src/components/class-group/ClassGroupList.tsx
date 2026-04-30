interface Props {
  groups: any[];
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export default function ClassGroupList({ groups, onUpdate, onDelete }: Props) {
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
              <button
                className="btn"
                onClick={() =>
                  onUpdate(g.id, { status: g.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })
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