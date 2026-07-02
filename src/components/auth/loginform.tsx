import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      toast.error("Unable to retrieve user.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    setLoading(false);

    if (profileError || !profile) {
      toast.error("User profile not found.");

      await supabase.auth.signOut();

      return;
    }

    toast.success("Login successful!");

    if (profile.role === "admin") {
      navigate("/dashboard");
    } else if (profile.role === "teacher") {
      navigate("/teacher/dashboard");
    } else {
      toast.error("Unauthorized user.");

      await supabase.auth.signOut();
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
    >
      <h1 className="mb-2 text-center text-3xl font-bold">
        Login
      </h1>

      <p className="mb-8 text-center text-gray-500">
        Ibaadur Rahman Attendance System
      </p>

      <div className="space-y-5">
        <div>
          <label>Email</label>

          <input
            type="email"
            className="mt-2 w-full rounded-lg border px-4 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            className="mt-2 w-full rounded-lg border px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 py-3 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;