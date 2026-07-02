export interface Teacher {
  id: string;
  user_id: string;
  full_name: string;
  gender: "Male" | "Female";
  status: "active" | "hold";
  created_at: string;
  updated_at: string;
}