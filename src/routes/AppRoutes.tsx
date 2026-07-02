import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/login";

// Admin
import DashboardLayout from "../components/layouts/DashboardLayout";
import Dashboard from "../pages/admin/dashboard";
import Students from "../pages/admin/students/students";
import AddStudent from "../pages/admin/students/Addstudents";
import EditStudent from "../pages/admin/students/EditStudents";
import Teachers from "../pages/admin/teachers/teachers";
import Schedules from "../pages/admin/schedules/schedules";
import AddSchedule from "../pages/admin/schedules/Addschedule";
import AdminAttendance from "../pages/admin/attendance/attendance";
import TeacherLayout from "../components/layouts/teacherlayout";
import TeacherDashboard from "../pages/admin/teachers/dashboard";
import Attendance from "../pages/admin/teachers/attendance";
import AdminRoute from "./adminRoutes";
import TeacherRoute from "./teachersRoutes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          element={
            <AdminRoute>
              <DashboardLayout />
            </AdminRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/students" element={<Students />} />
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/students/edit/:id" element={<EditStudent />} />

          <Route path="/teachers" element={<Teachers />} />

          <Route path="/schedules" element={<Schedules />} />
          <Route path="/schedules/add" element={<AddSchedule />} />
          <Route path="/attendance" element={<AdminAttendance />} />
        </Route>

        <Route
          element={
            <TeacherRoute>
              <TeacherLayout />
            </TeacherRoute>
          }
        >
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        </Route>
        <Route
          path="/teacher/students/:studentId/attendance"
          element={<Attendance />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
