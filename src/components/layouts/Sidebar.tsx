import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiClipboard,
  FiLogOut,
  FiX,
} from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: FiHome,
  },
  {
    name: "Students",
    path: "/students",
    icon: FiUsers,
  },
  {
    name: "Teachers",
    path: "/teachers",
    icon: FiUserCheck,
  },
  {
    name: "Class Schedule",
    path: "/schedules",
    icon: FiCalendar,
  },
  {
    name: "Attendance",
    path: "/attendance",
    icon: FiClipboard,
  },
  
  
];
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
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
    <>
      {/* Mobile Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-emerald-900 text-white transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-6 border-b border-emerald-700">
          <div>
            <h1 className="font-bold text-xl">
              Ibaadur Rahman 
            </h1>

            <p className="text-sm text-emerald-200">
              Attendance System
            </p>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 transition
                  ${
                    isActive
                      ? "bg-emerald-700"
                      : "hover:bg-emerald-800"
                  }`
                }
              >
                <Icon size={20} />
                {link.name}
              </NavLink>
            );
          })}
           <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-red-600"
        >
          <FiLogOut />

          Logout
        </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;