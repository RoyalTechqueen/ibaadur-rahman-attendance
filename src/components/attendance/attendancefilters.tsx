import { useEffect, useMemo, useState } from "react";

import type { AttendanceRecord } from "../../pages/admin/attendance/attendance";

interface AttendanceFiltersProps {
  attendance: AttendanceRecord[];
  onFilter: (
    records: AttendanceRecord[]
  ) => void;
}

const AttendanceFilters = ({
  attendance,
  onFilter,
}: AttendanceFiltersProps) => {
  const [search, setSearch] =
    useState("");

  const [teacher, setTeacher] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  const [date, setDate] =
    useState("");

  const teachers = useMemo(() => {
    const uniqueTeachers =
      attendance.map(
        (record) =>
          record.schedule.teacher.full_name
      );

    return [...new Set(uniqueTeachers)];
  }, [attendance]);

  useEffect(() => {
    let filtered = attendance;

    // Student Search
    if (search.trim()) {
      filtered = filtered.filter(
        (record) =>
          record.schedule.student.full_name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }

    // Teacher
    if (teacher !== "all") {
      filtered = filtered.filter(
        (record) =>
          record.schedule.teacher
            .full_name === teacher
      );
    }

    // Status
    if (status !== "all") {
      filtered = filtered.filter(
        (record) =>
          record.status === status
      );
    }

    // Date
    if (date !== "") {
      filtered = filtered.filter(
        (record) =>
          record.session_date === date
      );
    }

    onFilter(filtered);
  }, [
    attendance,
    search,
    teacher,
    status,
    date,
    onFilter,
  ]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {/* Search */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Search Student
          </label>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Student name..."
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

        {/* Teacher */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Teacher
          </label>

          <select
            value={teacher}
            onChange={(e) =>
              setTeacher(
                e.target.value
              )
            }
            className="w-full rounded-xl border px-4 py-3"
          >
            <option value="all">
              All Teachers
            </option>

            {teachers.map(
              (teacherName) => (
                <option
                  key={
                    teacherName
                  }
                  value={
                    teacherName
                  }
                >
                  {teacherName}
                </option>
              )
            )}
          </select>
        </div>

        {/* Status */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="w-full rounded-xl border px-4 py-3"
          >
            <option value="all">
              All Status
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="student_absent">
              Student Absent
            </option>

            <option value="teacher_absent">
              Teacher Absent
            </option>

            <option value="cancelled">
              Cancelled
            </option>

            <option value="makeup_pending">
              Makeup Pending
            </option>

            <option value="makeup_completed">
              Makeup Completed
            </option>
          </select>
        </div>

        {/* Date */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Attendance Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value
              )
            }
            className="w-full rounded-xl border px-4 py-3"
          />
        </div>

      </div>
    </div>
  );
};

export default AttendanceFilters;