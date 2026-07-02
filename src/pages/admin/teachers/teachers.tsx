import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import TeacherStats from "../../../components/teachers/teacherstats";
import TeacherTable from "../../../components/teachers/teachertable";

import { supabase } from "../../../lib/supabase";
import type { Teacher } from "../../../types/teachers";

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "teacher")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setTeachers(data as Teacher[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    void fetchTeachers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Teachers
          </h1>

          <p className="mt-1 text-slate-500">
            View and manage all teachers.
          </p>
        </div>
      </div>

      <TeacherStats teachers={teachers} />

      <div className="rounded-2xl bg-white p-6 shadow-sm">


        <TeacherTable
          teachers={teachers}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Teachers;