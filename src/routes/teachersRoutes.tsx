import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Props {
  children: React.ReactNode;
}

const TeacherRoute = ({ children }: Props) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (data?.role === "teacher") {
        setAuthorized(true);
      }

      setLoading(false);
    };

    void checkUser();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default TeacherRoute;