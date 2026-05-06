// frontend/src/pages/teacher/ClassGroupStudentsPage.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getStudentsInGroup,
  addStudentToGroup,
  removeStudentFromGroup,
} from '@/api/classGroupUser.api';
import StudentList from '@/components/class-group/StudentList';
import AddStudentForm from '@/components/class-group/AddStudentForm';

import { AxiosError } from "axios";

type StudentInGroup = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export default function ClassGroupStudentsPage() {
  const { classGroupId } = useParams();
  const [students, setStudents] = useState<StudentInGroup[]>([]);

  useEffect(() => {
    if (!classGroupId) return;

    // ✅ React‑recommended pattern
    (async () => {
      try {
        const res = await getStudentsInGroup(classGroupId);
        setStudents(res.data.data);
      } catch (error) {
        console.error('Failed to fetch students', error);
      }
    })();
  }, [classGroupId]);

  const refreshStudents = async () => {
    if (!classGroupId) return;
    const res = await getStudentsInGroup(classGroupId);
    setStudents(res.data.data);
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-teal-100">
      <h1 className="text-xl font-bold mb-6">
        Danh sách sinh viên trong nhóm lớp
      </h1>

      <AddStudentForm
  onAdd={async (email) => {
    try {
      await addStudentToGroup(classGroupId!, email);
      await refreshStudents();
    } catch (err: unknown) {
      
{
      if (err instanceof AxiosError) {
        throw new Error(
          (err.response?.data as { message?: string })?.message ||
            "Ghi danh thất bại"
        );
      }

      throw new Error("Ghi danh thất bại");

    }
  }}
}
/>

      <StudentList
        students={students}
        onRemove={async (studentId) => {
          await removeStudentFromGroup(classGroupId!, studentId);
          refreshStudents();
        }}
      />
    </div>
  );
}