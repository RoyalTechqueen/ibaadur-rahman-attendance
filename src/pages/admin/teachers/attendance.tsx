import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiUser,
} from "react-icons/fi";

import AttendanceForm, {
  type AttendanceFormData,
} from "../../../components/teachers/attendanceform";

import { supabase } from "../../../lib/supabase";

interface Student {
  id: string;
  full_name: string;
}

interface Schedule {
  id: string;
  day_of_week: string;
}

interface AttendanceHistory {
  id: string;
  session_date: string;
  status: string;
  lesson_covered: string | null;
  homework: string | null;
}

const Attendance = () => {
  const { studentId } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [student, setStudent] =
    useState<Student | null>(null);

  const [schedules, setSchedules] =
    useState<Schedule[]>([]);

  const [history, setHistory] =
    useState<AttendanceHistory[]>([]);

  const [attendanceDate, setAttendanceDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) return;

      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Student Information

      const {
        data: studentData,
        error: studentError,
      } = await supabase
        .from("students")
        .select("id, full_name")
        .eq("id", studentId)
        .single();

      if (studentError) {
        toast.error(studentError.message);
        setLoading(false);
        return;
      }

      setStudent(studentData);

      // Student schedules

      const {
        data: scheduleData,
        error: scheduleError,
      } = await supabase
        .from("student_schedules")
        .select(`
          id,
          day_of_week
        `)
        .eq("student_id", studentId)
        .eq("teacher_id", user.id)
        .eq("status", "active")
        .order("day_of_week");

      if (scheduleError) {
        toast.error(scheduleError.message);
        setLoading(false);
        return;
      }

      setSchedules(scheduleData ?? []);

      const scheduleIds =
        (scheduleData ?? []).map(
          (schedule) => schedule.id
        );

      if (scheduleIds.length === 0) {
        setLoading(false);
        return;
      }

      // Attendance History

      const {
        data: historyData,
        error: historyError,
      } = await supabase
        .from("class_sessions")
        .select(`
          id,
          session_date,
          status,
          lesson_covered,
          homework,
          schedule_id
        `)
        .in("schedule_id", scheduleIds)
        .order("session_date", {
          ascending: false,
        });

      if (historyError) {
        toast.error(historyError.message);
      } else {
        setHistory(historyData ?? []);
      }

      setLoading(false);
    };

    void fetchData();
  }, [studentId]);
    const selectedDay = new Date(attendanceDate)
    .toLocaleDateString("en-US", {
      weekday: "long",
    });

  const selectedSchedule = schedules.find(
    (schedule) =>
      schedule.day_of_week === selectedDay
  );

  const handleSubmit = async (
    form: AttendanceFormData
  ) => {
    if (!selectedSchedule) {
      toast.error(
        `This student has no class scheduled on ${selectedDay}.`
      );
      return;
    }

    // Check if attendance already exists
    const {
      data: existingAttendance,
      error: checkError,
    } = await supabase
      .from("class_sessions")
      .select("id")
      .eq(
        "schedule_id",
        selectedSchedule.id
      )
      .eq(
        "session_date",
        attendanceDate
      )
      .maybeSingle();

    if (checkError) {
      toast.error(checkError.message);
      return;
    }

    if (existingAttendance) {
      toast.error(
        "Attendance has already been recorded for this class."
      );
      return;
    }

    const status =
      form.makeup_date !== ""
        ? "makeup_pending"
        : form.status;

    const { error } = await supabase
      .from("class_sessions")
      .insert([
        {
          schedule_id:
            selectedSchedule.id,

          session_date:
            attendanceDate,

          status,

          reason:
            form.reason || null,

          makeup_date:
            form.makeup_date || null,

          lesson_covered:
            form.lesson_summary ||
            null,

          homework:
            form.homework || null,

          remarks:
            form.remarks || null,
        },
      ]);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      "Attendance saved successfully."
    );

    // Refresh history
    const {
      data: refreshedHistory,
    } = await supabase
      .from("class_sessions")
      .select(`
        id,
        session_date,
        status,
        lesson_covered,
        homework,
        schedule_id
      `)
      .in(
        "schedule_id",
        schedules.map(
          (schedule) => schedule.id
        )
      )
      .order("session_date", {
        ascending: false,
      });

    setHistory(
      refreshedHistory ?? []
    );
  };
    if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />

          <p className="mt-4 text-slate-500">
            Loading student information...
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow">
        <h2 className="text-2xl font-bold">
          Student not found
        </h2>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100"
      >
        <FiArrowLeft />
        Back
      </button>

      {/* Header */}

      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white/20 p-5">
            <FiUser size={28} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {student.full_name}
            </h1>

            <p className="mt-1 text-emerald-100">
              Manage attendance and
              lesson records.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-3 font-semibold">
            Assigned Class Days
          </h3>

          <div className="flex flex-wrap gap-3">
            {schedules.map((schedule) => (
              <span
                key={schedule.id}
                className="rounded-full bg-white/20 px-4 py-2 text-sm"
              >
                {schedule.day_of_week}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Date */}

      <div className="rounded-3xl bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-bold">
          Attendance Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block font-medium">
              Attendance Date
            </label>

            <input
              type="date"
              value={attendanceDate}
              onChange={(e) =>
                setAttendanceDate(
                  e.target.value
                )
              }
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Class Day
            </label>

            <div
              className={`rounded-xl border px-4 py-3 font-medium ${
                selectedSchedule
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {selectedSchedule
                ? selectedSchedule.day_of_week
                : `No class scheduled on ${selectedDay}`}
            </div>
          </div>

        </div>
      </div>

      {/* Attendance Form */}

      {selectedSchedule ? (
        <div className="rounded-3xl bg-white p-8 shadow">
          <AttendanceForm
            onSubmit={handleSubmit}
          />
        </div>
      ) : (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <h3 className="text-xl font-semibold text-red-700">
            Invalid Attendance Date
          </h3>

          <p className="mt-2 text-red-600">
            This student is not scheduled
            for classes on{" "}
            <strong>{selectedDay}</strong>.
            Please choose one of the
            assigned class days above.
          </p>
        </div>
      )}

      {/* Attendance History */}

      <div className="rounded-3xl bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-bold">
          Attendance History
        </h2>

        {history.length === 0 ? (
          <div className="rounded-xl border border-dashed py-16 text-center">
            No attendance records yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-4">
                    Date
                  </th>

                  <th>Status</th>

                  <th>
                    Lesson Summary
                  </th>

                  <th>Homework</th>
                </tr>
              </thead>

              <tbody>
                {history.map(
                  (session) => (
                    <tr
                      key={session.id}
                      className="border-b"
                    >
                      <td className="py-4">
                        {new Date(
                          session.session_date
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
                          {session.status.replaceAll(
                            "_",
                            " "
                          )}
                        </span>
                      </td>

                      <td>
                        {session.lesson_covered ??
                          "-"}
                      </td>

                      <td>
                        {session.homework ??
                          "-"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;