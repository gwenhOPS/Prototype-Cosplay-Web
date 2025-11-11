import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaPhoneAlt } from "react-icons/fa";
import AuthLayout from "../../layouts/AuthLayout";
import { loginUser } from "../../api/api-cosplay";


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await loginUser(form);
    console.log("Login success:", res);
    localStorage.setItem("token", res.token); // kalau API-nya balikin token
    navigate("/");
  } catch (err) {
    setError(err.message || "Email atau password salah");
  }
};

  return (
    <AuthLayout
      title="Selamat Datang Kembali 👋"
      subtitle="Masuk untuk melanjutkan petualanganmu di dunia Cosplay Digital!"
      isDark={isDark}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4"
      >
        {error && <div className="text-red-400 text-sm">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`border p-3 rounded-xl outline-none transition-all ${
            isDark
              ? "bg-gray-700/70 border-pink-500/30 text-pink-200 placeholder-pink-300/50 focus:border-pink-400"
              : "bg-white border-pink-300 focus:ring-2 focus:ring-pink-400"
          }`}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className={`border p-3 rounded-xl outline-none transition-all ${
            isDark
              ? "bg-gray-700/70 border-pink-500/30 text-pink-200 placeholder-pink-300/50 focus:border-pink-400"
              : "bg-white border-pink-300 focus:ring-2 focus:ring-pink-400"
          }`}
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white py-3 rounded-xl font-semibold shadow-md"
        >
          Login 🔑
        </button>

        <p
          className={`mt-2 text-sm text-center ${
            isDark ? "text-pink-200/70" : "text-gray-600"
          }`}
        >
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-pink-400 font-semibold hover:underline"
          >
            Daftar Sekarang
          </Link>
        </p>

        <div
          className={`mt-6 text-center text-sm ${
            isDark ? "text-pink-200/60" : "text-gray-500"
          }`}
        >
          atau login dengan
        </div>

        <div className="flex gap-3 mt-2">
          {[ 
            { icon: <FcGoogle size={20} />, label: "Google" },
            { icon: <FaFacebook size={20} />, label: "Facebook", color: "text-blue-600" },
            { icon: <FaPhoneAlt size={18} />, label: "No HP", color: "text-green-600" },
          ].map((btn, i) => (
            <button
              key={i}
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 border rounded-lg p-2 transition-all ${
                isDark
                  ? "bg-gray-700/70 border-pink-400/20 hover:bg-gray-600/70"
                  : "hover:bg-gray-100"
              } ${btn.color || ""}`}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      </form>
    </AuthLayout>
  );
}
