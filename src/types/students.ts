export interface Student {
  id: string;
  full_name: string;
  gender: string;
  phone_number: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}