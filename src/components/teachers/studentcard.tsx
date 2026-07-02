import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";

interface StudentCardProps {
  student: {
    student_id: string;

    student: {
      full_name: string;
    };

    days: string[];
  };
}

const StudentCard = ({
  student,
}: StudentCardProps) => {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-3">
              <FiUser
                size={22}
                className="text-emerald-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                {student.student.full_name}
              </h2>

              <p className="text-sm text-slate-500">
                {student.days.length}{" "}
                {student.days.length === 1
                  ? "class"
                  : "classes"}{" "}
                per week
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-500">
              Class Days
            </p>

            <div className="flex flex-wrap gap-2">
              {student.days.map((day) => (
                <span
                  key={day}
                  className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700"
                >
                  <FiCalendar className="mr-1 inline" />
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Link
          to={`/teacher/students/${student.student_id}/attendance`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
        >
          Manage Attendance

          <FiChevronRight />
        </Link>
      </div>
    </div>
  );
};

export default StudentCard;