import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

const teacherSchema = z.object({
  user_id: z.string().min(1, "Please select a teacher account"),
  full_name: z.string().min(2, "Full name is required"),
  gender: z.enum(["Male", "Female"]),
  status: z.enum(["active", "hold"]),
});

export type TeacherFormData = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<TeacherFormData>;
  onSubmit: (data: TeacherFormData) => void | Promise<void>;
}

interface TeacherUser {
  id: string;
  full_name: string;
}

const TeacherForm = ({
  mode,
  defaultValues,
  onSubmit,
}: TeacherFormProps) => {
  const [teacherUsers, setTeacherUsers] = useState<TeacherUser[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      status: "active",
      ...defaultValues,
    },
  });

  useEffect(() => {
    const fetchTeacherUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name")
        .eq("role", "teacher");

      if (error) {
        toast.error(error.message);
        return;
      }

      setTeacherUsers(data || []);
    };

    fetchTeacherUsers();
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl bg-white p-8 shadow-sm"
    >
      <div>
        <h2 className="text-2xl font-bold">
          {mode === "create"
            ? "Add Teacher"
            : "Edit Teacher"}
        </h2>

        <p className="text-gray-500">
          Manage teacher information.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Teacher Account */}
        <div>
          <label className="mb-2 block font-medium">
            Teacher Login Account
          </label>

          <select
            {...register("user_id")}
            className="w-full rounded-lg border px-4 py-3"
          >
            <option value="">
              Select Teacher Account
            </option>

            {teacherUsers.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.full_name}
              </option>
            ))}
          </select>

          <p className="mt-1 text-sm text-red-500">
            {errors.user_id?.message}
          </p>
        </div>

        {/* Full Name */}
        <div>
          <label className="mb-2 block font-medium">
            Full Name
          </label>

          <input
            {...register("full_name")}
            className="w-full rounded-lg border px-4 py-3"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.full_name?.message}
          </p>
        </div>

        {/* Gender */}
        <div>
          <label className="mb-2 block font-medium">
            Gender
          </label>

          <select
            {...register("gender")}
            className="w-full rounded-lg border px-4 py-3"
          >
            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>
          </select>

          <p className="mt-1 text-sm text-red-500">
            {errors.gender?.message}
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

            <option value="hold">
              Hold
            </option>
          </select>

          <p className="mt-1 text-sm text-red-500">
            {errors.status?.message}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-emerald-600 px-6 py-3 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {mode === "create"
            ? "Save Teacher"
            : "Update Teacher"}
        </button>
      </div>
    </form>
  );
};

export default TeacherForm;