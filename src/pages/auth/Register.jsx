import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaPhoneAlt } from "react-icons/fa";
import AuthLayout from "../../layouts/AuthLayout";
import { registerUser } from "../../api/api-cosplay";


export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
  });
  const [error, setError] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await registerUser(form);
    console.log("Register success:", res);
    navigate("/login");
  } catch (err) {
    setError(err.message || "Gagal mendaftar");
  }
};

  return (
    <AuthLayout
      title="Buat Akunmu Sekarang 💫"
      subtitle="Gabung dan mulai perjalanan Cosplay-mu bersama komunitas kami!"
      isDark={isDark}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4"
      >
        {error && <div className="text-red-400 text-sm">{error}</div>}

        <input
          type="text"
          placeholder="Nama Lengkap"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={`border p-3 rounded-xl outline-none transition-all ${
            isDark
              ? "bg-gray-700/70 border-pink-500/30 text-pink-200 placeholder-pink-300/50 focus:border-pink-400"
              : "bg-white border-pink-300 focus:ring-2 focus:ring-pink-400"
          }`}
        />

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

        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          className={`border p-3 rounded-xl outline-none transition-all ${
            isDark
              ? "bg-gray-700/70 border-pink-500/30 text-pink-200 focus:border-pink-400"
              : "bg-white border-pink-300 focus:ring-2 focus:ring-pink-400"
          }`}
        >
          <option value="" disabled>
            Pilih Gender
          </option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
          <option value="Unisex">Unisex</option>
        </select>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white py-3 rounded-xl font-semibold shadow-md"
        >
          Register ✨
        </button>

        <p
          className={`mt-2 text-sm text-center ${
            isDark ? "text-pink-200/70" : "text-gray-600"
          }`}
        >
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-pink-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
