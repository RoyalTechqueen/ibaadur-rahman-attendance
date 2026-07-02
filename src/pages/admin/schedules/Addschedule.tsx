import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ScheduleForm, {
  type ScheduleFormData,
} from "../../../components/schedules/scheduleform";

import { supabase } from "../../../lib/supabase";

const AddSchedule = () => {
  const navigate = useNavigate();

  const handleCreateSchedule = async (
    data: ScheduleFormData
  ) => {
    if (data.days_of_week.length === 0) {
      toast.error("Please select at least one day.");
      return;
    }

    // Check existing schedules for this student
    const { data: existingSchedules, error: checkError } =
      await supabase
        .from("student_schedules")
        .select("day_of_week")
        .eq("student_id", data.student_id);

    if (checkError) {
      toast.error(checkError.message);
      return;
    }

    const existingDays =
      existingSchedules?.map(
        (schedule) => schedule.day_of_week
      ) ?? [];

    const duplicateDays = data.days_of_week.filter((day) =>
      existingDays.includes(day)
    );

    if (duplicateDays.length > 0) {
      toast.error(
        `Schedule already exists for: ${duplicateDays.join(
          ", "
        )}`
      );
      return;
    }

    const schedules = data.days_of_week.map((day) => ({
      student_id: data.student_id,
      teacher_id: data.teacher_id,
      day_of_week: day,
      status: data.status,
    }));

    const { error } = await supabase
      .from("student_schedules")
      .insert(schedules);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Schedules assigned successfully.");

    navigate("/schedules");
  };

  return (
    <ScheduleForm
      mode="create"
      onSubmit={handleCreateSchedule}
    />
  );
};

export default AddSchedule;