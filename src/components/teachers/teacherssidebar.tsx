import {
  FiHome,
  FiLogOut,
} from "react-icons/fi";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";

import { supabase } from "../../lib/supabase";

const TeacherSidebar = () => {
  const navigate = useNavigate();

  const menus = [
    {
      name: "Dashboard",
      icon: FiHome,
      path: "/teacher/dashboard",
    },
  ];

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
    <aside className="hidden w-64 bg-emerald-700 text-white lg:block">
      <div className="border-b border-emerald-600 p-6">
        <h2 className="text-xl font-bold">
          Ibaadur Rahman
        </h2>

        <p className="text-sm text-emerald-200">
          Teacher Portal
        </p>
      </div>

      <nav className="flex h-[calc(100vh-96px)] flex-col justify-between px-4 py-6">
        <div className="space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <NavLink
                key={menu.name}
                to={menu.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                    isActive
                      ? "bg-white font-medium text-emerald-700"
                      : "hover:bg-emerald-600"
                  }`
                }
              >
                <Icon />

                {menu.name}
              </NavLink>
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-red-600"
        >
          <FiLogOut />

          Logout
        </button>
      </nav>
    </aside>
  );
};

export default TeacherSidebar;