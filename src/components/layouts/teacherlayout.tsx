import { Outlet } from "react-router-dom";
import TeacherSidebar from "../teachers/teacherssidebar";


const TeacherLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <TeacherSidebar />

      <div className="flex flex-1 flex-col">
        

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;