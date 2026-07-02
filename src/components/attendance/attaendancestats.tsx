import {
  FiBookOpen,
  FiCheckCircle,
  FiUserX,
  FiXCircle,
} from "react-icons/fi";

import type { AttendanceRecord } from "../../pages/admin/attendance/attendance";

interface AttendanceStatsProps {
  attendance: AttendanceRecord[];
}

const AttendanceStats = ({
  attendance,
}: AttendanceStatsProps) => {
  const completed = attendance.filter(
    (item) => item.status === "completed"
  ).length;

  const studentAbsent = attendance.filter(
    (item) => item.status === "student_absent"
  ).length;

  const cancelled = attendance.filter(
    (item) => item.status === "cancelled"
  ).length;

  const stats = [
    {
      title: "Total Records",
      value: attendance.length,
      icon: FiBookOpen,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Completed",
      value: completed,
      icon: FiCheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Student Absent",
      value: studentAbsent,
      icon: FiUserX,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Cancelled",
      value: cancelled,
      icon: FiXCircle,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
  );
};

export default AttendanceStats;