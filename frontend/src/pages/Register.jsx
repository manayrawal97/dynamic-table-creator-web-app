import api from "../api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const submit = async () => {
    await api.post("/auth/register", form);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[420px] p-10 rounded-3xl shadow-xl">

        <h2 className="text-4xl font-serif font-bold mb-2">Create Account</h2>
        <p className="text-gray-500 mb-8">Start creating dynamic tables</p>
        <label className="font-medium">Name</label>
        <input
          className="w-full border rounded-xl p-3 mt-1 mb-5 outline-none"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <label className="font-medium">Email</label>
        <input
          className="w-full border rounded-xl p-3 mt-1 mb-5 outline-none"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <label className="font-medium">Password</label>
        <input
          type="password"
          className="w-full border rounded-xl p-3 mt-1 mb-8 outline-none"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={submit}
          className="w-full bg-orange-400 text-white py-3 rounded-xl font-semibold hover:bg-orange-500 transition"
        >
          Sign Up
        </button>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <span
            className="text-orange-400 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Sign In
          </span>
        </p>

      </div>
    </div>
  );
}
