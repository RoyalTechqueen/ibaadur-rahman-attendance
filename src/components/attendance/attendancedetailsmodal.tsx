import { FiX } from "react-icons/fi";

import type { AttendanceRecord } from "../../pages/admin/attendance/attendance";

interface AttendanceDetailsModalProps {
  attendance: AttendanceRecord;
  onClose: () => void;
}

const AttendanceDetailsModal = ({
  attendance,
  onClose,
}: AttendanceDetailsModalProps) => {
  const status = attendance.status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-2xl font-bold">
              Attendance Details
            </h2>

            <p className="mt-1 text-slate-500">
              View attendance information.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Body */}

        <div className="space-y-8 p-6">

          {/* Student & Teacher */}

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <p className="text-sm text-slate-500">
                Student
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                {
                  attendance.schedule.student
                    .full_name
                }
              </h3>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Teacher
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                {
                  attendance.schedule.teacher
                    .full_name
                }
              </h3>
            </div>

          </div>

          {/* Dates */}

          <div className="grid gap-6 md:grid-cols-3">

            <div>
              <p className="text-sm text-slate-500">
                Attendance Date
              </p>

              <h3 className="mt-1 font-semibold">
                {new Date(
                  attendance.session_date
                ).toLocaleDateString()}
              </h3>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Class Day
              </p>

              <h3 className="mt-1 font-semibold">
                {
                  attendance.schedule
                    .day_of_week
                }
              </h3>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Status
              </p>

              <h3 className="mt-1 font-semibold">
                {status}
              </h3>
            </div>

          </div>

          {/* Lesson Summary */}

          <div>
            <p className="mb-2 text-sm text-slate-500">
              Lesson Summary
            </p>

            <div className="rounded-xl border bg-slate-50 p-4">
              {attendance.lesson_covered ||
                "-"}
            </div>
          </div>

          {/* Homework */}

          <div>
            <p className="mb-2 text-sm text-slate-500">
              Homework
            </p>

            <div className="rounded-xl border bg-slate-50 p-4">
              {attendance.homework || "-"}
            </div>
          </div>

          {/* Reason */}

          <div>
            <p className="mb-2 text-sm text-slate-500">
              Reason
            </p>

            <div className="rounded-xl border bg-slate-50 p-4">
              {attendance.reason || "-"}
            </div>
          </div>

          {/* Remarks */}

          <div>
            <p className="mb-2 text-sm text-slate-500">
              Remarks
            </p>

            <div className="rounded-xl border bg-slate-50 p-4">
              {attendance.remarks || "-"}
            </div>
          </div>

          {/* Makeup Date */}

          <div>
            <p className="mb-2 text-sm text-slate-500">
              Makeup Date
            </p>

            <div className="rounded-xl border bg-slate-50 p-4">
              {attendance.makeup_date
                ? new Date(
                    attendance.makeup_date
                  ).toLocaleDateString()
                : "-"}
            </div>
          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t p-6">

          <button
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-3 font-medium hover:bg-slate-100"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};

export default AttendanceDetailsModal;