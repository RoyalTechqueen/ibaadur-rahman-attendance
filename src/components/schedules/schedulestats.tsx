import { FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi";
import type { Schedule } from "../../types/schedule";

interface ScheduleStatsProps {
  schedules: Schedule[];
}

const ScheduleStats = ({ schedules }: ScheduleStatsProps) => {
  const totalSchedules = schedules.length;

  const activeSchedules = schedules.filter(
    (schedule) => schedule.status === "active"
  ).length;

  const inactiveSchedules = schedules.filter(
    (schedule) => schedule.status === "inactive"
  ).length;

  const stats = [
    {
      title: "Total Schedules",
      value: totalSchedules,
      icon: FiCalendar,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Active",
      value: activeSchedules,
      icon: FiCheckCircle,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Inactive",
      value: inactiveSchedules,
      icon: FiXCircle,
      color: "bg-red-100 text-red-700",
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
                <p className="text-gray-500">{stat.title}</p>

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

export default ScheduleStats;