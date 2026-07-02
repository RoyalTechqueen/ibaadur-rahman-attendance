import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import StudentForm from "../../../components/students/StudentsForm";
import { supabase } from "../../../lib/supabase";

type StudentFormData = {
  full_name: string;
  gender: "Male" | "Female";
  phone_number: string;
  status: "active" | "inactive";
};

const EditStudent = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [student, setStudent] =
    useState<StudentFormData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error(error.message);
      } else {
        setStudent(data);
      }

      setLoading(false);
    };

    fetchStudent();
  }, [id]);

  const handleUpdate = async (
    values: StudentFormData
  ) => {
    const { error } = await supabase
      .from("students")
      .update(values)
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Student updated successfully");

    navigate("/students");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!student) {
    return <p>Student not found.</p>;
  }

  return (
    <StudentForm
      mode="edit"
      defaultValues={student}
      onSubmit={handleUpdate}
    />
  );
};

export default EditStudent;