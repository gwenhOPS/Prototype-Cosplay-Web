import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaPhoneAlt } from "react-icons/fa";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);

    if (res.success) {
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/");
    } else {
      setError(res.message);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-purple-950 via-pink-900 to-gray-900"
          : "bg-gradient-to-br from-yellow-100 via-pink-100 to-white"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-500 ${
          isDark
            ? "bg-gray-800/80 border border-pink-500/20"
            : "bg-white/90"
        }`}
      >
        <h1
          className={`text-3xl font-bold mb-6 text-center drop-shadow ${
            isDark ? "text-pink-300" : "text-pink-600"
          }`}
        >
          Selamat Datang 👋
        </h1>

        {error && <div className="text-red-400 mb-3 text-sm">{error}</div>}

        {[
          { label: "Email", key: "email", type: "email" },
          { label: "Password", key: "password", type: "password" },
        ].map((item) => (
          <input
            key={item.key}
            type={item.type}
            placeholder={item.label}
            value={form[item.key]}
            onChange={(e) => setForm({ ...form, [item.key]: e.target.value })}
            className={`border p-3 w-full mb-3 rounded-lg outline-none transition-all ${
              isDark
                ? "bg-gray-700/80 border-pink-500/30 text-pink-200 placeholder-pink-300/50 focus:border-pink-400"
                : "bg-white border-pink-300 focus:ring-2 focus:ring-pink-400"
            }`}
          />
        ))}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white p-3 rounded-lg font-semibold transition-all shadow-md"
        >
          Login 🔑
        </button>

        <p
          className={`mt-4 text-sm text-center ${
            isDark ? "text-pink-200/70" : "text-gray-600"
          }`}
        >
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-pink-400 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

        <div
          className={`mt-6 text-center text-sm ${
            isDark ? "text-pink-200/60" : "text-gray-500"
          }`}
        >
          atau login dengan
        </div>

        <div className="flex gap-3 mt-4">
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
    </div>
  );
}
