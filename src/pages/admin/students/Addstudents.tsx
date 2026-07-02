import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import StudentForm from "../../../components/students/StudentsForm";
import { supabase } from "../../../lib/supabase";

type StudentFormData = {
  full_name: string;
  gender: "Male" | "Female";
  phone_number: string;
  status: "active" | "inactive";
};

const AddStudent = () => {
  const navigate = useNavigate();

  const handleCreateStudent = async (data: StudentFormData) => {
    const { error } = await supabase.from("students").insert([data]);

    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }

    toast.success("Student added successfully!");

    navigate("/students");
  };

  return (
    <StudentForm
      mode="create"
      onSubmit={handleCreateStudent}
    />
  );
};

export default AddStudent;