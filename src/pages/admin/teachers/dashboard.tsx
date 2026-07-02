import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiBookOpen,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";

import { supabase } from "../../../lib/supabase";
import StudentCard from "../../../components/teachers/studentcard";

interface TeacherStudent {
  student_id: string;

  student: {
    full_name: string;
  };

  days: string[];
}

const TeacherDashboard = () => {
  const [teacherName, setTeacherName] =
    useState("");

  const [students, setStudents] =
    useState<TeacherStudent[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Teacher Name
      const { data: teacher } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (teacher) {
        setTeacherName(teacher.full_name);
      }

      // Fetch assigned students
      const { data, error } =
        await supabase
          .from("student_schedules")
          .select(`
            student_id,
            day_of_week,
            student:students!student_schedules_student_id_fkey(
              full_name
            )
          `)
          .eq("teacher_id", user.id)
          .eq("status", "active")
          .order("day_of_week");

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      const grouped = new Map<
        string,
        TeacherStudent
      >();

      (data ?? []).forEach((item) => {
        const student =
          item.student as unknown as {
            full_name: string;
          };

        if (
          !grouped.has(item.student_id)
        ) {
          grouped.set(item.student_id, {
            student_id:
              item.student_id,

            student: {
              full_name:
                student?.full_name ?? "",
            },

            days: [],
          });
        }

        grouped
          .get(item.student_id)!
          .days.push(item.day_of_week);
      });

      setStudents([
        ...grouped.values(),
      ]);

      setLoading(false);
    };

    void fetchDashboard();
  }, []);

  const totalClasses =
    students.reduce(
      (sum, student) =>
        sum + student.days.length,
      0
    );

  const stats = [
    {
      title: "My Students",
      value: students.length,
      icon: FiUsers,
      color:
        "bg-blue-100 text-blue-600",
    },
    {
      title: "Weekly Classes",
      value: totalClasses,
      icon: FiCalendar,
      color:
        "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Active Schedules",
      value: totalClasses,
      icon: FiBookOpen,
      color:
        "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-2xl bg-emerald-600 p-8 text-white">
        <h1 className="text-3xl font-bold">
          Assalamu Alaikum,
          {" "}
          {teacherName}
        </h1>

        <p className="mt-2 text-emerald-100">
          Welcome back.
          Manage your students and
          record attendance whenever
          a class is held.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`rounded-xl p-4 ${stat.color}`}
                >
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Students */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            My Students
          </h2>

          <p className="text-slate-500">
            Select a student to
            manage attendance and
            view previous records.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="rounded-xl border border-dashed py-20 text-center">
            <h3 className="text-xl font-semibold">
              No students assigned
            </h3>

            <p className="mt-2 text-slate-500">
              Once an administrator
              assigns students to
              you, they will appear
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {students.map((student) => (
              <StudentCard
                key={
                  student.student_id
                }
                student={student}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;