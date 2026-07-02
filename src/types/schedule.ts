export interface Schedule {
  id: string;
  student_id: string;
  teacher_id: string;
  day_of_week: "Friday" | "Saturday" | "Sunday";
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;

  student?: {
    full_name: string;
  };

  teacher?: {
    full_name: string;
  };
}