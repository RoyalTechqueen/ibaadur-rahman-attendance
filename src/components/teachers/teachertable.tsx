import { FiUser } from "react-icons/fi";

import type { Teacher } from "../../types/teachers";

interface TeacherTableProps {
  teachers: Teacher[];
  loading: boolean;
}

const TeacherTable = ({
  teachers,
  loading,
}: TeacherTableProps) => {
  if (loading) {
    return (
      <div className="flex h-52 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />

          <p className="mt-4 text-slate-500">
            Loading teachers...
          </p>
        </div>
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="flex h-52 items-center justify-center rounded-2xl border border-dashed border-slate-300">
        <div className="text-center">
          <FiUser
            size={42}
            className="mx-auto text-slate-400"
          />

          <h3 className="mt-4 text-lg font-semibold">
            No Teachers Found
          </h3>

          <p className="mt-2 text-slate-500">
            Add a teacher to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                Teacher
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                Gender
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-600">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {teachers.map((teacher) => (
              <tr
                key={teacher.id}
                className="border-t border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                      {teacher.full_name
                        .split(" ")
                        .map((name) => name[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        {teacher.full_name}
                      </p>

                      <p className="text-sm text-slate-500">
                        Teacher
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span className="capitalize text-slate-700">
                    {teacher.gender}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      teacher.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {teacher.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherTable;