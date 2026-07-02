import type { Student } from "../../types/students";
import { FiEdit2, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

interface StudentTableProps {
  students: Student[];
  loading: boolean;
}

const StudentTable = ({
  students,
  loading,
}: StudentTableProps) => {
  if (loading) {
    return (
      <div className="flex h-56 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />

          <p className="mt-4 text-slate-500">
            Loading students...
          </p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-300">
        <div className="text-center">
          <FiUser
            size={42}
            className="mx-auto text-slate-400"
          />

          <h3 className="mt-4 text-lg font-semibold">
            No Students Found
          </h3>

          <p className="mt-2 text-slate-500">
            Add a student to get started.
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
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Student
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Gender
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                Phone Number
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
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-t border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                      {student.full_name
                        .split(" ")
                        .map((name) => name[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        {student.full_name}
                      </p>

                      <p className="text-sm text-slate-500">
                        Student
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span className="capitalize text-slate-700">
                    {student.gender}
                  </span>
                </td>

                <td className="px-6 py-5 text-slate-700">
                  {student.phone_number || "-"}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      student.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>

                <td className="px-6 py-5 text-center">
                  <Link
                    to={`/students/edit/${student.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-100 p-2.5 text-blue-600 transition hover:bg-blue-200"
                    title="Edit Student"
                  >
                    <FiEdit2 size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;