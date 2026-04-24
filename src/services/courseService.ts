// src/services/courseService.ts
export type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  createdAt: string;
};

export async function getTeacherCourses(
  teacherId: string
): Promise<Course[]> {
  const res = await fetch(
    `/api/v1/teacher/courses?teacherId=${teacherId}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch teacher courses");
  }

  const data = await res.json();
  return data.data;
}