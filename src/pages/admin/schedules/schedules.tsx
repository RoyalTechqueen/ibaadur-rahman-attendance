import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Pagination from "../../../components/common/pagination";
import ScheduleStats from "../../../components/schedules/schedulestats";
import ScheduleTable from "../../../components/schedules/scheduletable";

import { supabase } from "../../../lib/supabase";
import type { Schedule } from "../../../types/schedule";

const ITEMS_PER_PAGE = 10;

const Schedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] =
    useState(1);

  const fetchSchedules = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("student_schedules")
      .select(`
        *,
        student:students(full_name),
        teacher:users(full_name)
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      toast.error(error.message);
    } else {
      setSchedules(data as Schedule[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    void fetchSchedules();
  }, []);

  const totalPages = Math.ceil(
    schedules.length / ITEMS_PER_PAGE
  );

  const paginatedSchedules =
    schedules.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Schedules
          </h1>

          <p className="mt-1 text-slate-500">
            Manage student class
            schedules.
          </p>
        </div>

        <Link
          to="/schedules/add"
          className="rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
        >
          + Add Schedule
        </Link>
      </div>

      <ScheduleStats schedules={schedules} />

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <ScheduleTable
          schedules={
            paginatedSchedules
          }
          loading={loading}
        />

        {!loading &&
          totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={
                  currentPage
                }
                totalPages={
                  totalPages
                }
                onPageChange={
                  setCurrentPage
                }
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default Schedules;