import {
  FiUsers,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";

import type { Teacher } from "../../types/teachers";

interface TeacherStatsProps {
  teachers: Teacher[];
}

const TeacherStats = ({ teachers }: TeacherStatsProps) => {
  const totalTeachers = teachers.length;

  const activeTeachers = teachers.filter(
    (teacher) => teacher.status === "active"
  ).length;

  const holdTeachers = teachers.filter(
    (teacher) => teacher.status === "hold"
  ).length;

  const stats = [
    {
      title: "Total Teachers",
      value: totalTeachers,
      icon: FiUsers,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Active",
      value: activeTeachers,
      icon: FiUserCheck,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "On Hold",
      value: holdTeachers,
      icon: FiUserX,
      color: "bg-yellow-100 text-yellow-700",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {stat.value}
                </h2>
              </div>

              <div className={`rounded-xl p-4 ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeacherStats;