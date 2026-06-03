import { useNavigate } from "react-router-dom";

export default function DemoStudentPage() {
  const navigate = useNavigate();

  const testId = "ID_THẬT_CỦA_BẠN";

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🎓 Demo Student</h1>

      <div
        className="p-4 border rounded cursor-pointer"
        onClick={() =>
          navigate("/demo/assignment", {
            state: {
              testId,
              classGroupId: "c990f176-38ea-419c-8341-8a2a64357191",
            },
          })
        }
      >
        📝 Làm bài tự luận
      </div>
    </div>
  );
}
