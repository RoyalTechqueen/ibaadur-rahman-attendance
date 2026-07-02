import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiEdit2,
  FiUsers,
} from "react-icons/fi";

import type { Schedule } from "../../types/schedule";

interface ScheduleTableProps {
  schedules: Schedule[];
  loading: boolean;
}

const ScheduleTable = ({
  schedules,
  loading,
}: ScheduleTableProps) => {
  if (loading) {
    return (
      <div className="flex h-56 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />

          <p className="mt-4 text-slate-500">
            Loading schedules...
          </p>
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-300">
        <div className="text-center">
          <FiCalendar
            size={42}
            className="mx-auto text-slate-400"
          />

          <h3 className="mt-4 text-lg font-semibold">
            No Schedules Found
          </h3>

          <p className="mt-2 text-slate-500">
            Create a class schedule to get
            started.
          </p>
        </div>
      </div>
    );
  }

  // Group schedules by student + teacher
  const groupedSchedules = Object.values(
    schedules.reduce(
      (acc, schedule) => {
        const key = `${schedule.student_id}-${schedule.teacher_id}`;

        if (!acc[key]) {
          acc[key] = {
            id: schedule.id,
            student: schedule.student,
            teacher: schedule.teacher,
            status: schedule.status,
            days: [],
          };
        }

        acc[key].days.push(
          schedule.day_of_week
        );

        return acc;
      },
      {} as Record<
        string,
        {
          id: string;
          student: Schedule["student"];
          teacher: Schedule["teacher"];
          status: string;
          days: string[];
        }
      >
    )
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Student
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Teacher
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Class Days
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Status
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {groupedSchedules.map(
              (schedule) => (
                <tr
                  key={schedule.id}
                  className="border-t border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                        {schedule.student?.full_name
                          ?.split(" ")
                          .map(
                            (n) => n[0]
                          )
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {
                            schedule.student
                              ?.full_name
                          }
                        </p>

                        <p className="text-sm text-slate-500">
                          Student
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <FiUsers className="text-emerald-600" />

                      <span className="font-medium text-slate-700">
                        {
                          schedule.teacher
                            ?.full_name
                        }
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      {schedule.days
                        .sort()
                        .map((day) => (
                          <span
                            key={day}
                            className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                          >
                            {day}
                          </span>
                        ))}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        schedule.status ===
                        "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {schedule.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <Link
                      to={`/schedules/edit/${schedule.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-blue-100 p-2.5 text-blue-600 transition hover:bg-blue-200"
                      title="Edit Schedule"
                    >
                      <FiEdit2
                        size={18}
                      />
                    </Link>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;