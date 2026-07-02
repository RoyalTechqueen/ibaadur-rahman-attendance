import { useState } from "react";
import { FiEye } from "react-icons/fi";

import type { AttendanceRecord } from "../../pages/admin/attendance/attendance";
import AttendanceDetailsModal from "./attendancedetailsmodal";

interface AttendanceTableProps {
  attendance: AttendanceRecord[];
  loading: boolean;
}

const AttendanceTable = ({
  attendance,
  loading,
}: AttendanceTableProps) => {
  const [selectedAttendance, setSelectedAttendance] =
    useState<AttendanceRecord | null>(null);

  if (loading) {
    return (
      <p className="py-12 text-center">
        Loading attendance...
      </p>
    );
  }

  if (attendance.length === 0) {
    return (
      <p className="py-12 text-center">
        No attendance records found.
      </p>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";

      case "student_absent":
        return "bg-yellow-100 text-yellow-700";

      case "teacher_absent":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "makeup_pending":
        return "bg-purple-100 text-purple-700";

      case "makeup_completed":
        return "bg-indigo-100 text-indigo-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left text-sm uppercase text-slate-500">
              <th className="pb-4">
                Student
              </th>

              <th>
                Teacher
              </th>

              <th>
                Date
              </th>

              <th>
                Day
              </th>

              <th>
                Status
              </th>

              <th>
                Lesson
              </th>

              <th className="text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {attendance.map(
              (record) => (
                <tr
                  key={record.id}
                  className="border-b"
                >
                  <td className="py-5 font-medium">
                    {
                      record.schedule
                        .student
                        .full_name
                    }
                  </td>

                  <td>
                    {
                      record.schedule
                        .teacher
                        .full_name
                    }
                  </td>

                  <td>
                    {new Date(
                      record.session_date
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    {
                      record.schedule
                        .day_of_week
                    }
                  </td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status.replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  </td>

                  <td className="max-w-xs truncate">
                    {record.lesson_covered ??
                      "-"}
                  </td>

                  <td className="text-center">
                    <button
                      onClick={() =>
                        setSelectedAttendance(
                          record
                        )
                      }
                      className="rounded-lg bg-emerald-100 p-2 text-emerald-700 transition hover:bg-emerald-200"
                    >
                      <FiEye size={18} />
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {selectedAttendance && (
        <AttendanceDetailsModal
          attendance={
            selectedAttendance
          }
          onClose={() =>
            setSelectedAttendance(
              null
            )
          }
        />
      )}
    </>
  );
};

export default AttendanceTable;