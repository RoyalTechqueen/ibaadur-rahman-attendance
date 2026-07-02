import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiBookOpen,
  FiCheckCircle,
  FiUserX,
  FiRefreshCcw,
  FiPauseCircle,
} from "react-icons/fi";

import { supabase } from "../../lib/supabase";


interface DashboardStats {
  students: number;
  teachers: number;
  schedules: number;

  attendance: number;
  completed: number;
  absent: number;
  makeup: number;

  holdStudents: number;
}

interface RecentAttendance {
  id: string;
  session_date: string;
  status: string;

  schedule: {
    student: {
      full_name: string;
    };

    teacher: {
      full_name: string;
    };
  };
}

interface HoldStudent {
  id: string;
  full_name: string;
}

const Dashboard = () => {
  const [loading, setLoading] =
    useState(true);

  const [adminName, setAdminName] =
    useState("");

  const [stats, setStats] =
    useState<DashboardStats>({
      students: 0,
      teachers: 0,
      schedules: 0,

      attendance: 0,
      completed: 0,
      absent: 0,
      makeup: 0,

      holdStudents: 0,
    });

  const [recentAttendance, setRecentAttendance] =
    useState<RecentAttendance[]>([]);

  const [holdStudents, setHoldStudents] =
    useState<HoldStudent[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: admin } =
          await supabase
            .from("users")
            .select("full_name")
            .eq("id", user.id)
            .single();

        if (admin) {
          setAdminName(admin.full_name);
        }
      }

      const [
        studentsResult,

        teachersResult,

        schedulesResult,

        attendanceResult,

        completedResult,

        absentResult,

        makeupResult,

        holdCountResult,

        holdStudentsResult,

        recentAttendanceResult,
      ] = await Promise.all([
        supabase
          .from("students")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("users")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("role", "teacher"),

        supabase
          .from("student_schedules")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("class_sessions")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("class_sessions")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("status", "completed"),

        supabase
          .from("class_sessions")
          .select("*", {
            count: "exact",
            head: true,
          })
          .in("status", [
            "student_absent",
            "teacher_absent",
          ]),

        supabase
          .from("class_sessions")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq(
            "status",
            "makeup_pending"
          ),

        supabase
          .from("students")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("status", "inactive"),

        supabase
          .from("students")
          .select("id, full_name")
          .eq("status", "inactive")
          .limit(5),

        supabase
          .from("class_sessions")
          .select(`
            id,
            session_date,
            status,

            schedule:student_schedules(
              student:students(
                full_name
              ),

              teacher:users(
                full_name
              )
            )
          `)
          .order("created_at", {
            ascending: false,
          })
          .limit(5),
      ]);

      setStats({
        students:
          studentsResult.count ?? 0,

        teachers:
          teachersResult.count ?? 0,

        schedules:
          schedulesResult.count ?? 0,

        attendance:
          attendanceResult.count ?? 0,

        completed:
          completedResult.count ?? 0,

        absent:
          absentResult.count ?? 0,

        makeup:
          makeupResult.count ?? 0,

        holdStudents:
          holdCountResult.count ?? 0,
      });

      setHoldStudents(
        holdStudentsResult.data ?? []
      );
const formattedAttendance: RecentAttendance[] = (
  recentAttendanceResult.data ?? []
).map((item) => {
  const schedule = item.schedule as unknown as {
    student: {
      full_name: string;
    };

    teacher: {
      full_name: string;
    };
  };

  return {
    id: item.id,
    session_date: item.session_date,
    status: item.status,

    schedule: {
      student: {
        full_name:
          schedule.student.full_name,
      },

      teacher: {
        full_name:
          schedule.teacher.full_name,
      },
    },
  };
});

setRecentAttendance(formattedAttendance);
setRecentAttendance(formattedAttendance);
      setRecentAttendance(
        formattedAttendance
      );

      setLoading(false);
    };

    void fetchDashboard();
  }, []);
    const overviewCards = [
    {
      title: "Students",
      value: stats.students,
      icon: FiUsers,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Teachers",
      value: stats.teachers,
      icon: FiUserCheck,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Schedules",
      value: stats.schedules,
      icon: FiCalendar,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Attendance Records",
      value: stats.attendance,
      icon: FiBookOpen,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const attendanceCards = [
    {
      title: "Completed",
      value: stats.completed,
      icon: FiCheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Absent",
      value: stats.absent,
      icon: FiUserX,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Pending Makeup",
      value: stats.makeup,
      icon: FiRefreshCcw,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Students On Hold",
      value: stats.holdStudents,
      icon: FiPauseCircle,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Welcome */}

      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 text-white shadow-lg">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

          <div>
            <h1 className="text-3xl font-bold">
              Assalamu Alaikum,
              {" "}
              {adminName || "Admin"}
            </h1>

            <p className="mt-3 text-emerald-100">
              Welcome back to the
              Ibaadur Rahman Attendance
              System.
            </p>

            <p className="mt-2 text-sm text-emerald-200">
              {new Date().toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-emerald-100">
              Overall Attendance
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              {loading
                ? "--"
                : stats.attendance}
            </h2>

            <p className="mt-2 text-sm text-emerald-200">
              attendance records
            </p>
          </div>

        </div>
      </div>

      {/* Overview */}

      <div>

        <div className="mb-5">
          <h2 className="text-xl font-bold">
            Overview
          </h2>

          <p className="text-slate-500">
            Current system statistics.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {overviewCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-slate-500">
                      {card.title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold">
                      {loading
                        ? "--"
                        : card.value}
                    </h2>
                  </div>

                  <div
                    className={`rounded-xl p-4 ${card.color}`}
                  >
                    <Icon size={24} />
                  </div>

                </div>
              </div>
            );
          })}

        </div>

      </div>

      {/* Attendance Summary */}

      <div>

        <div className="mb-5">
          <h2 className="text-xl font-bold">
            Attendance Summary
          </h2>

          <p className="text-slate-500">
            Monitor attendance across
            the centre.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {attendanceCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-slate-500">
                      {card.title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold">
                      {loading
                        ? "--"
                        : card.value}
                    </h2>
                  </div>

                  <div
                    className={`rounded-xl p-4 ${card.color}`}
                  >
                    <Icon size={24} />
                  </div>

                </div>
              </div>
            );
          })}

        </div>

      </div>
            {/* Bottom Section */}

      <div className="grid gap-6 xl:grid-cols-3">

        {/* Recent Attendance */}

        <div className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Recent Attendance
              </h2>

              <p className="text-slate-500">
                Latest attendance submissions.
              </p>
            </div>

            <Link
              to="/attendance"
              className="text-sm font-medium text-emerald-600 hover:underline"
            >
              View All
            </Link>
          </div>

          {recentAttendance.length === 0 ? (
            <div className="rounded-xl border border-dashed py-12 text-center">
              <p className="text-slate-500">
                No attendance records found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAttendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div>
                    <h3 className="font-semibold">
                      {
                        record.schedule.student
                          .full_name
                      }
                    </h3>

                    <p className="text-sm text-slate-500">
                      {
                        record.schedule.teacher
                          .full_name
                      }
                    </p>
                  </div>

                  <div className="text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        record.status ===
                        "completed"
                          ? "bg-green-100 text-green-700"
                          : record.status ===
                              "student_absent"
                            ? "bg-yellow-100 text-yellow-700"
                            : record.status ===
                                "teacher_absent"
                              ? "bg-blue-100 text-blue-700"
                              : record.status ===
                                  "makeup_pending"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-red-100 text-red-700"
                      }`}
                    >
                      {record.status.replaceAll(
                        "_",
                        " "
                      )}
                    </span>

                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(
                        record.session_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}

        <div className="space-y-6">

          {/* Quick Actions */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-bold">
              Quick Actions
            </h2>

            <div className="space-y-3">

              <Link
                to="/students/add"
                className="block rounded-xl bg-emerald-600 px-5 py-3 text-center font-medium text-white transition hover:bg-emerald-700"
              >
                + Add Student
              </Link>

              <Link
                to="/teachers"
                className="block rounded-xl bg-blue-600 px-5 py-3 text-center font-medium text-white transition hover:bg-blue-700"
              >
                Manage Teachers
              </Link>

              <Link
                to="/schedules/add"
                className="block rounded-xl bg-purple-600 px-5 py-3 text-center font-medium text-white transition hover:bg-purple-700"
              >
                Create Schedule
              </Link>

              <Link
                to="/attendance"
                className="block rounded-xl bg-orange-600 px-5 py-3 text-center font-medium text-white transition hover:bg-orange-700"
              >
                Attendance Records
              </Link>

            </div>

          </div>

          {/* Students On Hold */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Students On Hold
              </h2>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                {stats.holdStudents}
              </span>

            </div>

            {holdStudents.length === 0 ? (
              <p className="text-slate-500">
                No students are currently on hold.
              </p>
            ) : (
              <div className="space-y-3">

                {holdStudents.map(
                  (student) => (
                    <div
                      key={student.id}
                      className="rounded-xl border p-3"
                    >
                      <p className="font-medium">
                        {student.full_name}
                      </p>
                    </div>
                  )
                )}

                <Link
                  to="/students"
                  className="block pt-2 text-sm font-medium text-emerald-600 hover:underline"
                >
                  View All Students →
                </Link>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;