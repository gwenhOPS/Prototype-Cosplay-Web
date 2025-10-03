import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "../../utils/toast";

export default function Account() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    birthdate: user?.birthdate || "",
    gender: user?.gender || "",
    photo: user?.photo || "",
  });

  // Auto-update localStorage saat form berubah
  useEffect(() => {
    const updated = { ...user, ...form };
    localStorage.setItem("user", JSON.stringify(updated));
  }, [form]);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({ ...prev, photo: ev.target.result }));
        toast("success", "✨ Foto berhasil diperbarui!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`min-h-screen flex justify-center p-6 transition-all duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400"
      }`}
    >
      <div
        className={`w-full max-w-5xl shadow-2xl rounded-2xl p-8 border transition-all duration-300 ${
          isDark
            ? "bg-gray-900/90 border-gray-700"
            : "bg-white/90 border-pink-200"
        }`}
      >
        <h1
          className={`text-3xl font-bold mb-8 border-b pb-4 ${
            isDark
              ? "text-pink-400 border-gray-700"
              : "text-pink-600 border-pink-200"
          }`}
        >
          Ubah Biodata Diri ✨
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Kolom Kiri - Foto */}
          <div className="flex flex-col items-center text-center">
            <img
              src={
                form.photo ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-48 h-48 object-cover rounded-2xl shadow-md border-2 border-pink-400"
            />
            <label
              htmlFor="photo"
              className={`mt-4 px-4 py-2 rounded-lg cursor-pointer transition-all font-semibold ${
                isDark
                  ? "bg-pink-600 text-white hover:bg-pink-700"
                  : "bg-pink-400 text-white hover:bg-pink-500"
              }`}
            >
              Pilih Foto
            </label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhoto}
              className="hidden"
            />
            <p
              className={`mt-2 text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Maksimal 10MB (.JPG, .PNG)
            </p>
          </div>

          {/* Kolom Kanan - Biodata */}
          <div className="space-y-4">
            {[
              { label: "Nama", key: "name", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Nomor HP", key: "phone", type: "text" },
              { label: "Alamat", key: "address", type: "text" },
              { label: "Tanggal Lahir", key: "birthdate", type: "date" },
              { label: "Jenis Kelamin", key: "gender", type: "text" },
            ].map((item) => (
              <div key={item.key} className="flex flex-col">
                <label
                  className={`font-semibold text-sm mb-1 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </label>
                <input
                  type={item.type}
                  value={form[item.key]}
                  onChange={(e) =>
                    setForm({ ...form, [item.key]: e.target.value })
                  }
                  className={`border-2 rounded-lg p-2 outline-none transition-all ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-pink-500"
                      : "bg-white border-pink-300 focus:border-purple-500"
                  }`}
                  placeholder={`Masukkan ${item.label}`}
                />
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={logout}
                className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-5 py-2 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
