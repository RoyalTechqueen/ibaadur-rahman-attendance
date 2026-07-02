import { Outlet } from "react-router-dom";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";

import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-5 py-4 shadow lg:hidden">
          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <FiMenu size={24} />
          </button>

          <h2 className="font-semibold">
            Ibaadur Rahman
          </h2>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;