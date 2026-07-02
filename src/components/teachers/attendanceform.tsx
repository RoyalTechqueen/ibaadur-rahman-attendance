import { useState } from "react";
import {
  FiBookOpen,
  FiCheckCircle,
  FiEdit3,
  FiMessageSquare,
  FiUserX,
  FiXCircle,
} from "react-icons/fi";

export interface AttendanceFormData {
  status:
    | "completed"
    | "student_absent"
    | "teacher_absent"
    | "cancelled";

  lesson_type:
    | "memorisation"
    | "revision"
    | "reading"
    | "tajweed"
    | "mixed";

  lesson_summary: string;

  homework: string;

  reason: string;

  makeup_date: string;

  remarks: string;
}

interface AttendanceFormProps {
  onSubmit: (
    data: AttendanceFormData
  ) => Promise<void>;
}

const statuses = [
  {
    value: "completed",
    label: "Class Held",
    icon: FiCheckCircle,
  },
  {
    value: "student_absent",
    label: "Student Absent",
    icon: FiUserX,
  },
  {
    value: "teacher_absent",
    label: "Teacher Absent",
    icon: FiUserX,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: FiXCircle,
  },
] as const;

const lessonTypes = [
  {
    value: "memorisation",
    label: "Memorisation",
  },
  {
    value: "revision",
    label: "Revision",
  },
  {
    value: "reading",
    label: "Reading",
  },
  {
    value: "tajweed",
    label: "Tajweed",
  },
  {
    value: "mixed",
    label: "Mixed",
  },
] as const;

const AttendanceForm = ({
  onSubmit,
}: AttendanceFormProps) => {
  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState<Record<string, string>>(
      {}
    );

  const [formData, setFormData] =
    useState<AttendanceFormData>({
      status: "completed",

      lesson_type:
        "memorisation",

      lesson_summary: "",

      homework: "",

      reason: "",

      makeup_date: "",

      remarks: "",
    });

  const classHeld =
    formData.status === "completed";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors: Record<
      string,
      string
    > = {};

    if (
      classHeld &&
      formData.lesson_summary.trim() ===
        ""
    ) {
      newErrors.lesson_summary =
        "Lesson summary is required.";
    }

    if (
      !classHeld &&
      formData.reason.trim() === ""
    ) {
      newErrors.reason =
        "Reason is required.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    await onSubmit(formData);

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-2xl bg-white p-8 shadow-sm"
    >
      {/* Status */}

      <div>
        <h2 className="mb-5 text-xl font-semibold">
          Attendance Status
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {statuses.map((status) => {
            const Icon = status.icon;

            const active =
              formData.status ===
              status.value;

            return (
              <button
                key={status.value}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    status: status.value,
                  })
                }
                className={`flex items-center gap-4 rounded-xl border p-5 transition ${
                  active
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-200 hover:border-emerald-500"
                }`}
              >
                <Icon size={24} />

                <span className="font-medium">
                  {status.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {classHeld ? (
        <div className="rounded-xl border p-6">
          <h2 className="mb-6 text-xl font-semibold">
            Lesson Information
          </h2>

          <div className="space-y-6">

            <div>
              <label className="mb-2 block font-medium">
                Lesson Type
              </label>

              <select
                name="lesson_type"
                value={
                  formData.lesson_type
                }
                onChange={
                  handleChange
                }
                className="w-full rounded-xl border px-4 py-3"
              >
                {lessonTypes.map(
                  (lesson) => (
                    <option
                      key={
                        lesson.value
                      }
                      value={
                        lesson.value
                      }
                    >
                      {lesson.label}
                    </option>
                  )
                )}
              </select>
            </div>
                        <div>
              <label className="mb-2 flex items-center gap-2 font-medium">
                <FiBookOpen />
                Lesson Summary
              </label>

              <textarea
                name="lesson_summary"
                rows={4}
                value={formData.lesson_summary}
                onChange={handleChange}
                placeholder="Summarise what was taught during today's lesson..."
                className="w-full rounded-xl border border-slate-300 p-3 focus:border-emerald-500 focus:outline-none"
              />

              {errors.lesson_summary && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.lesson_summary}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 font-medium">
                <FiEdit3 />
                Homework
              </label>

              <textarea
                name="homework"
                rows={3}
                value={formData.homework}
                onChange={handleChange}
                placeholder="Homework or revision for the student..."
                className="w-full rounded-xl border border-slate-300 p-3 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 font-medium">
                <FiMessageSquare />
                Remarks
              </label>

              <textarea
                name="remarks"
                rows={3}
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Additional remarks (optional)..."
                className="w-full rounded-xl border border-slate-300 p-3 focus:border-emerald-500 focus:outline-none"
              />
            </div>

          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
          <h2 className="mb-6 text-xl font-semibold text-orange-700">
            Absence Information
          </h2>

          <div className="space-y-6">

            <div>
              <label className="mb-2 block font-medium">
                {formData.status ===
                "student_absent"
                  ? "Reason for Student Absence"
                  : formData.status ===
                    "teacher_absent"
                  ? "Reason for Teacher Absence"
                  : "Reason for Cancellation"}
              </label>

              <textarea
                name="reason"
                rows={4}
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter the reason..."
                className="w-full rounded-xl border border-slate-300 p-3 focus:border-emerald-500 focus:outline-none"
              />

              {errors.reason && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.reason}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Makeup Date
              </label>

              <input
                type="date"
                name="makeup_date"
                value={formData.makeup_date}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none"
              />

              <p className="mt-2 text-sm text-slate-500">
                Optional. Leave blank if a
                makeup class has not yet been
                scheduled.
              </p>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 font-medium">
                <FiMessageSquare />
                Remarks
              </label>

              <textarea
                name="remarks"
                rows={3}
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Additional remarks (optional)..."
                className="w-full rounded-xl border border-slate-300 p-3 focus:border-emerald-500 focus:outline-none"
              />
            </div>

          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Saving Attendance..."
          : "Save Attendance"}
      </button>
    </form>
  );
};

export default AttendanceForm;