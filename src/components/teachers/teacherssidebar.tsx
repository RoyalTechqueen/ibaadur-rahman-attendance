import { NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiLogOut } from "react-icons/fi";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

const TeacherSidebar = () => {
  const navItems = [
    {
      name: "Dashboard",
      path: "/teacher/dashboard",
      icon: <FiHome size={20} />,
    },
  ];
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
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col bg-white shadow-lg">
      {/* Header */}
      <div className="border-b p-5">
        <h2 className="text-xl font-bold text-green-700">
          Teacher Panel
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-600 transition hover:bg-red-50"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default TeacherSidebar;