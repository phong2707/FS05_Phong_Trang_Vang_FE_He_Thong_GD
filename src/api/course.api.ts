export type Course = {
  id: string;
  name: string;
  description: string;
  semester: string;
  studentCount: number;
};

export const getAssignedCourses = async (): Promise<Course[]> => {
  // MOCK DATA – thay bằng API thật sau
  return Promise.resolve([
    {
      id: 'course-001',
      name: 'Lập trình Web',
      description: 'HTML, CSS, JavaScript, React',
      semester: 'HK1 2025',
      studentCount: 45,
    },
    {
      id: 'course-002',
      name: 'Cơ sở dữ liệu',
      description: 'SQL, Prisma, PostgreSQL',
      semester: 'HK1 2025',
      studentCount: 38,
    },
  ]);
};

export const getCourseDetail = async (id: string): Promise<Course> => {
  const courses = await getAssignedCourses();
  const course = courses.find(c => c.id === id);
  if (!course) throw new Error('Course not found');
  return course;
};
