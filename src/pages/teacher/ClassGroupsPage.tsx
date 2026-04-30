import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getClassGroups,
  createClassGroup,
  updateClassGroup,
  deleteClassGroup,
} from '@/api/classGroup.api';
import ClassGroupList from '@/components/class-group/ClassGroupList';
import ClassGroupForm from '@/components/class-group/ClassGroupForm';

export default function ClassGroupsPage() {
  const { subjectId } = useParams();
  const [groups, setGroups] = useState<any[]>([]);

  const fetchGroups = async () => {
    if (!subjectId) return;
    const res = await getClassGroups(subjectId);
    setGroups(res.data.data);
  };

  useEffect(() => {
    fetchGroups();
  }, [subjectId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Quản lý nhóm lớp</h1>

      <ClassGroupForm
        subjectId={subjectId!}
        onSuccess={fetchGroups}
      />

      <ClassGroupList
        groups={groups}
        onUpdate={async (id, data) => {
          await updateClassGroup(id, data);
          fetchGroups();
        }}
        onDelete={async (id) => {
          await deleteClassGroup(id);
          fetchGroups();
        }}
      />
    </div>
  );
}