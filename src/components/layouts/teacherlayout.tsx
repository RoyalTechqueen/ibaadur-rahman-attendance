import { Outlet } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "../teachers/teacherssidebar";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";


const TeacherLayout = () => {
 const navigate = useNavigate();
 const handleLogout = async () => {
     const { error } =
       await supabase.auth.signOut();
 
     if (error) {
       toast.error(error.message);
       return;
     }
 
     toast.success(
       "Logged out successfully."
     );
 
     navigate("/", {
       replace: true,
     });
   };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <TeacherSidebar />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Header */}
        <header className="flex items-center justify-between border-b bg-white px-4 py-4 shadow lg:hidden">
          <h1 className="text-lg font-semibold text-green-700">
            Teacher Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-red-600 transition hover:bg-red-100"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;