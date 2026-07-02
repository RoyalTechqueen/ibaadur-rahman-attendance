import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const studentSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  gender: z.enum(["Male", "Female"]),
  phone_number: z.string().min(10, "Enter a valid phone number"),
  status: z.enum(["active", "inactive"]),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<StudentFormData>;
  onSubmit: (data: StudentFormData) => void;
}

const StudentForm = ({ mode, defaultValues, onSubmit }: StudentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      status: "active",
      ...defaultValues,
    },
  });

  const navigate = useNavigate();
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl bg-white p-8 shadow-sm"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          {mode === "create" ? "Add Student" : "Edit Student"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Fill in the student's information below.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Full Name */}
        <div>
          <label className="mb-2 block font-medium">Full Name</label>

          <input
            {...register("full_name")}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-emerald-500"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.full_name?.message}
          </p>
        </div>

        {/* Gender */}
        <div>
          <label className="mb-2 block font-medium">Gender</label>

          <select
            {...register("gender")}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <p className="mt-1 text-sm text-red-500">{errors.gender?.message}</p>
        </div>

        <div>
          <label className="mb-2 block font-medium">Phone Number</label>

          <input
            {...register("phone_number")}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-emerald-500"
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.phone_number?.message}
          </p>
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block font-medium">Status</label>

          <select
            {...register("status")}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Hold</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate("/students")}
          className="rounded-lg border px-6 py-3 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-emerald-600 px-6 py-3 text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {mode === "create" ? "Save Student" : "Update Student"}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
