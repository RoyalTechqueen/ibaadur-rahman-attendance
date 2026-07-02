import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { supabase } from "../../../lib/supabase";

import AttendanceStats from "../../../components/attendance/attaendancestats";
import AttendanceFilters from "../../../components/attendance/attendancefilters";
import AttendanceTable from "../../../components/attendance/attendancetable";

export interface AttendanceRecord {
  id: string;
  session_date: string;
  status: string;
  lesson_covered: string | null;
  homework: string | null;
  remarks: string | null;
  reason: string | null;
  makeup_date: string | null;

  schedule: {
    day_of_week: string;

    student: {
      full_name: string;
    };

    teacher: {
      full_name: string;
    };
  };
}

const Attendance = () => {
  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>([]);

  const [filteredAttendance, setFilteredAttendance] =
    useState<AttendanceRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

 const fetchAttendance = async () => {
  setLoading(true);

  const { data, error } = await supabase
    .from("class_sessions")
    .select(`
      id,
      session_date,
      status,
      lesson_covered,
      homework,
      remarks,
      reason,
      makeup_date,

      schedule:student_schedules!class_sessions_schedule_id_fkey(
        day_of_week,

        student:students!student_schedules_student_id_fkey(
          full_name
        ),

        teacher:users!student_schedules_teacher_id_fkey(
          full_name
        )
      )
    `)
    .order("session_date", {
      ascending: false,
    });

  if (error) {
    toast.error(error.message);
    setLoading(false);
    return;
  }

  const records: AttendanceRecord[] = (data ?? []).map(
    (item) => {
      const schedule = Array.isArray(item.schedule)
        ? item.schedule[0]
        : item.schedule;

      const student = Array.isArray(schedule?.student)
        ? schedule.student[0]
        : schedule?.student;

      const teacher = Array.isArray(schedule?.teacher)
        ? schedule.teacher[0]
        : schedule?.teacher;

      return {
        id: item.id,
        session_date: item.session_date,
        status: item.status,
        lesson_covered: item.lesson_covered,
        homework: item.homework,
        remarks: item.remarks,
        reason: item.reason,
        makeup_date: item.makeup_date,

        schedule: {
          day_of_week:
            schedule?.day_of_week ?? "",

          student: {
            full_name:
              student?.full_name ?? "",
          },

          teacher: {
            full_name:
              teacher?.full_name ?? "",
          },
        },
      };
    }
  );

  setAttendance(records);
  setFilteredAttendance(records);

  setLoading(false);
};

  useEffect(() => {
    void fetchAttendance();
  }, []);

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Attendance
        </h1>

        <p className="mt-2 text-slate-500">
          View and monitor all attendance
          records.
        </p>
      </div>

      {/* Stats */}

      <AttendanceStats
        attendance={attendance}
      />

      {/* Filters */}

      <AttendanceFilters
        attendance={attendance}
        onFilter={
          setFilteredAttendance
        }
      />

      {/* Table */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <AttendanceTable
          attendance={
            filteredAttendance
          }
          loading={loading}
        />

      </div>

    </div>
  );
};

export default Attendance;