import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { supabase } from "../../lib/supabase";

const scheduleSchema = z.object({
  student_id: z.string().min(1, "Please select a student"),
  teacher_id: z.string().min(1, "Please select a teacher"),

  days_of_week: z
    .array(
      z.enum([
        "Friday",
        "Saturday",
        "Sunday",
      ])
    )
    .min(1, "Select at least one day"),

  status: z.enum(["active", "inactive"]),
});

export type ScheduleFormData = z.infer<
  typeof scheduleSchema
>;

interface ScheduleFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<ScheduleFormData>;
  onSubmit: (data: ScheduleFormData) => Promise<void>;
}

interface StudentOption {
  id: string;
  full_name: string;
}

interface TeacherOption {
  id: string;
  full_name: string;
}

const ScheduleForm = ({
  mode,
  defaultValues,
  onSubmit,
}: ScheduleFormProps) => {
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),

    defaultValues: {
      status: "active",
      days_of_week: [],
      ...defaultValues,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      // Students
      const {
        data: studentData,
        error: studentError,
      } = await supabase
        .from("students")
        .select("id, full_name")
        .eq("status", "active")
        .order("full_name");

      if (studentError) {
        toast.error(studentError.message);
      } else {
        setStudents(studentData ?? []);
      }

      // Teachers
      const {
        data: teacherData,
        error: teacherError,
      } = await supabase
        .from("users")
        .select("id, full_name")
        .eq("role", "teacher")
        .eq("status", "active")
        .order("full_name");

      if (teacherError) {
        toast.error(teacherError.message);
      } else {
        setTeachers(teacherData ?? []);
      }
    };

    void loadData();
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl bg-white p-8 shadow-sm"
    >
      <div>
        <h2 className="text-2xl font-bold">
          {mode === "create"
            ? "Assign Student Schedule"
            : "Edit Student Schedule"}
        </h2>

        <p className="mt-1 text-slate-500">
          Assign a student to a teacher and
          choose the class days.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Student */}
        <div>
          <label className="mb-2 block font-medium">
            Student
          </label>

          <select
            {...register("student_id")}
            className="w-full rounded-lg border px-4 py-3"
          >
            <option value="">
              Select Student
            </option>

            {students.map((student) => (
              <option
                key={student.id}
                value={student.id}
              >
                {student.full_name}
              </option>
            ))}
          </select>

          <p className="mt-1 text-sm text-red-500">
            {errors.student_id?.message}
          </p>
        </div>

        {/* Teacher */}
        <div>
          <label className="mb-2 block font-medium">
            Teacher
          </label>

          <select
            {...register("teacher_id")}
            className="w-full rounded-lg border px-4 py-3"
          >
            <option value="">
              Select Teacher
            </option>

            {teachers.map((teacher) => (
              <option
                key={teacher.id}
                value={teacher.id}
              >
                {teacher.full_name}
              </option>
            ))}
          </select>

          <p className="mt-1 text-sm text-red-500">
            {errors.teacher_id?.message}
          </p>
        </div>

        {/* Days */}
        <div className="md:col-span-2">
          <label className="mb-3 block font-medium">
            Class Days
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <label
                key={day}
                className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition hover:border-emerald-500 hover:bg-emerald-50"
              >
                <input
                  type="checkbox"
                  value={day}
                  {...register(
                    "days_of_week"
                  )}
                  className="h-4 w-4 accent-emerald-600"
                />

                <span className="font-medium">
                  {day}
                </span>
              </label>
            ))}
          </div>

          <p className="mt-2 text-sm text-red-500">
            {errors.days_of_week?.message}
          </p>
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block font-medium">
            Status
          </label>

          <select
            {...register("status")}
            className="w-full rounded-lg border px-4 py-3"
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>

          <p className="mt-1 text-sm text-red-500">
            {errors.status?.message}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
            ? "Assign Schedule"
            : "Update Schedule"}
        </button>
      </div>
    </form>
  );
};

export default ScheduleForm;