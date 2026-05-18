import { useState } from 'react';

interface Props {
  subjectId: string;
  onSuccess: () => void;
}

export default function ClassGroupForm({ subjectId, onSuccess }: Props) {
  const [name, setName] = useState('');

  const submit = async () => {
    if (!name) return;
    await fetch('/api/v1/class-groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjectId, name }),
    });
    setName('');
    onSuccess();
  };

  return (
    <div className="flex gap-2">
      <input
        className="border p-2"
        placeholder="Tên nhóm lớp"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="btn" onClick={submit}>
        Thêm nhóm
      </button>
    </div>
  );
}