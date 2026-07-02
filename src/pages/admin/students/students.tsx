import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import StudentStats from "../../../components/students/studentsStats";
import StudentFilters from "../../../components/students/studentFilters";
import StudentTable from "../../../components/students/studentsTable";
import Pagination from "../../../components/common/pagination";

import { supabase } from "../../../lib/supabase";
import type { Student } from "../../../types/students";

const STUDENTS_PER_PAGE = 10;

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Dashboard Stats
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [inactiveStudents, setInactiveStudents] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredStudents, setFilteredStudents] = useState(0);

  // Filters
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  

  const fetchStudentStats = useCallback(async () => {
    const [
      { count: total, error: totalError },
      { count: active, error: activeError },
      { count: inactive, error: inactiveError },
    ] = await Promise.all([
      supabase
        .from("students")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("students")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),

      supabase
        .from("students")
        .select("*", { count: "exact", head: true })
        .eq("status", "inactive"),
    ]);

    if (totalError || activeError || inactiveError) {
      toast.error("Failed to load student statistics.");
      return;
    }

    setTotalStudents(total ?? 0);
    setActiveStudents(active ?? 0);
    setInactiveStudents(inactive ?? 0);
  }, []);

  const fetchStudents = useCallback(
    async (page: number) => {
      setLoading(true);

      const from = (page - 1) * STUDENTS_PER_PAGE;
      const to = from + STUDENTS_PER_PAGE - 1;

      let query = supabase
        .from("students")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (gender) {
        query = query.eq("gender", gender);
      }

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error, count } = await query.range(from, to);

      if (error) {
        toast.error(error.message);
      } else {
        setStudents((data as Student[]) ?? []);
        setFilteredStudents(count ?? 0);
      }

      setLoading(false);
    },
    [gender, status]
  );

  useEffect(() => {
    fetchStudentStats();
  }, [fetchStudentStats]);

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage, fetchStudents]);

  useEffect(() => {
    setCurrentPage(1);
  }, [gender, status]);

  const totalPages = Math.ceil(
    filteredStudents / STUDENTS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Students
          </h1>

          <p className="mt-1 text-slate-500">
            Manage all registered students.
          </p>
        </div>

        <Link
          to="/students/add"
          className="rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
        >
          + Add Student
        </Link>
      </div>

      <StudentStats
        totalStudents={totalStudents}
        activeStudents={activeStudents}
        inactiveStudents={inactiveStudents}
      />

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <StudentFilters
            gender={gender}
            status={status}
            onGenderChange={setGender}
            onStatusChange={setStatus}
          />
        </div>

        <StudentTable
          students={students}
          loading={loading}
        />
                <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Students;