// src/pages/user/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [history, setHistory] = useState(null);
  const [costumes, setCostumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🕓 Ambil data riwayat sewa (mock dari localStorage)
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("lastRental"));
    if (data) setHistory(data);
  }, []);

  // 🔹 Fetch data kostum dari MockAPI
  useEffect(() => {
    const fetchCostumes = async () => {
      try {
        const res = await axios.get("https://68c3856b81ff90c8e6191cfc.mockapi.io/api/v1/produk");
        let data = res.data;

        // 🔹 Optional filter rekomendasi berdasarkan gender
        if (user?.gender?.toLowerCase() === "perempuan") {
          data = data.filter(p => p.category === "female" || p.category === "unisex");
        } else if (user?.gender?.toLowerCase() === "laki-laki") {
          data = data.filter(p => p.category === "male" || p.category === "unisex");
        }

        // 🔹 Ambil maksimal 3 rekomendasi
        setCostumes(data.slice(0, 3));
      } catch (err) {
        console.error("Gagal load kostum:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCostumes();
  }, [user]);

  return (
    <div className="transition-all duration-500">
      {/* HERO */}
      <section className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg animate-pulse">
          Selamat Datang di Rental Cosplay 🎭
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl opacity-90">
          Sewa kostum anime, film, dan game favoritmu dengan mudah dan cepat!
        </p>
      </section>

      {/* STATISTIK */}
      <section
        className={`py-12 px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center font-semibold ${
          isDark ? "bg-gray-900 text-pink-300" : "bg-pink-100 text-pink-700"
        }`}
      >
        <div className="text-3xl">🧥 120+<p className="text-sm">Kostum</p></div>
        <div className="text-3xl">👤 400+<p className="text-sm">Penyewa</p></div>
        <div className="text-3xl">🎪 12<p className="text-sm">Event Aktif</p></div>
      </section>

      {/* REKOMENDASI */}
      <section
        className={`py-12 px-6 ${isDark ? "bg-gray-800 text-gray-100" : "bg-gray-50 text-gray-800"}`}
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          ✨ Rekomendasi Kostum Untukmu
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">Memuat kostum...</p>
        ) : (
          <div className="grid sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {costumes.map((c) => (
              <div
                key={c.id}
                className={`rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition duration-300 ${
                  isDark ? "bg-gray-700" : "bg-white"
                }`}
              >
                <img src={c.Image || "https://via.placeholder.com/300x200"} alt={c.ProductName} className="w-full h-52 object-cover" />
                <p className="p-3 text-center font-semibold">{c.ProductName}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* RIWAYAT */}
      {history && (
        <section
          className={`py-10 text-center ${isDark ? "bg-gray-900 text-pink-300" : "bg-pink-100 text-pink-700"}`}
        >
          <h2 className="text-xl font-bold mb-2">🕓 Riwayat Terakhir</h2>
          <p>
            Kamu terakhir menyewa:{" "}
            <span className="font-semibold text-pink-500">{history.item}</span>
          </p>
          <p className="text-sm opacity-80">Pada: {history.date}</p>
        </section>
      )}

      {/* CTA */}
      <section className={`py-12 text-center ${isDark ? "bg-gray-800" : "bg-pink-200"}`}>
        <button
          onClick={() => navigate("/produk")}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-md hover:scale-105 transition-transform"
        >
          🎨 Lihat Koleksi Kostum
        </button>
      </section>
    </div>
  );
}
  