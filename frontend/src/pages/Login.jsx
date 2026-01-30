import api from "../api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async () => {
    const res = await api.post("/auth/login", form);
    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[420px] p-10 rounded-3xl shadow-xl">

        <h2 className="text-4xl font-serif font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8">Sign in to manage your tables</p>

        <label className="font-medium">Email</label>
        <input
          className="w-full border rounded-xl p-3 mt-1 mb-5 focus:border-orange-400 outline-none" placeholder="Enter email" value={form.email}  autoComplete="email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <label className="font-medium">Password</label>
        <input
          type="password" value={form.password}  autoComplete="password"
          className="w-full border rounded-xl p-3 mt-1 mb-8 outline-none"placeholder="Enter password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={submit}
          className="w-full bg-orange-400 text-white py-3 rounded-xl font-semibold hover:bg-orange-500 transition"
        >
          Sign In
        </button>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-orange-400 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>

      </div>
    </div>
  );
}
