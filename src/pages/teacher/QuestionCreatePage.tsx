// import { useParams } from "react-router-dom";
import TeacherDashboardLayout from "@/components/teacher/TeacherDashboardLayout";
import QuestionForm from "@/components/teacher/QuestionForm";

export default function QuestionCreatePage() {
  // const { subjectId } = useParams();

  

  return (
    <TeacherDashboardLayout>
      <div className="max-w-5xl mx-auto py-6">
        
        <QuestionForm />
      </div>
    </TeacherDashboardLayout>
  );
}
