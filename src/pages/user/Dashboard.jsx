// src/pages/user/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Clock, Flame, Shirt, Trophy } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

// Swiper v10+
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Dashboard() {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [kostumRekomendasi, setKostumRekomendasi] = useState([]);
  const [totalSewa, setTotalSewa] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingKostum, setLoadingKostum] = useState(true);

  // Fetch riwayat transaksi & total kostum disewa
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          "https://68c3856b81ff90c8e6191cfc.mockapi.io/api/v1/Transaksi"
        );
        const userHistory = res.data.filter((t) => t.userId === user?.id);
        setHistory(userHistory.reverse().slice(0, 5));
        setTotalSewa(userHistory.length);
      } catch (err) {
        console.error("Gagal load riwayat transaksi:", err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [user]);

  // Fetch rekomendasi kostum dari API
  useEffect(() => {
    const fetchKostum = async () => {
      try {
        const res = await axios.get(
          "https://68c3856b81ff90c8e6191cfc.mockapi.io/api/v1/produk"
        );
        let data = res.data;

        // Filter sesuai gender user
        if (user?.gender?.toLowerCase() === "perempuan") {
          data = data.filter(
            (p) => p.category === "female" || p.category === "unisex"
          );
        } else if (user?.gender?.toLowerCase() === "laki-laki") {
          data = data.filter(
            (p) => p.category === "male" || p.category === "unisex"
          );
        }

        setKostumRekomendasi(data.slice(0, 10)); // max 10 kostum untuk slider
      } catch (err) {
        console.error("Gagal load kostum:", err);
      } finally {
        setLoadingKostum(false);
      }
    };
    fetchKostum();
  }, [user]);

  // tsParticles init
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions = {
    background: { color: "transparent" },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
      },
      modes: { repulse: { distance: 100 }, push: { quantity: 4 } },
    },
    particles: {
      color: { value: "#ff77ff" },
      links: { enable: true, color: "#ff77ff", distance: 150 },
      collisions: { enable: true },
      move: { enable: true, speed: 2, outModes: "bounce" },
      number: { value: 50, density: { enable: true, area: 800 } },
      opacity: { value: 0.7 },
      shape: { type: "circle" },
      size: { value: { min: 2, max: 5 } },
    },
    detectRetina: true,
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        isDark ? "bg-[#0f0a1a] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 relative overflow-hidden rounded-2xl p-8 shadow-lg"
        style={{
          background: "linear-gradient(to right, #ec4899, #8b5cf6, #6366f1)",
        }}
      >
        {/* Particles */}
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
          className="absolute top-0 left-0 w-full h-full"
        />

        {/* Hero Content */}
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold mb-2">
            Selamat Datang, {user?.name || "Cosplayer"}! 👋
          </h1>
          <p className="text-gray-200 text-lg">
            Jadilah karakter favoritmu hari ini, dan tunjukkan gaya terbaikmu!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-5 bg-white text-pink-600 font-semibold px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition"
          >
            🎭 Mulai Eksplorasi Kostum
          </motion.button>
          <div className="absolute -bottom-10 -right-10 opacity-30">
            <Flame size={200} />
          </div>
        </div>
      </motion.section>

      {/* STATISTIK */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatBox
          icon={<Shirt className="text-pink-400" />}
          label="Kostum Disewa"
          value={totalSewa}
          isDark={isDark}
        />
        <StatBox
          icon={<Star className="text-yellow-400" />}
          label="Rating Rata-rata"
          value="4.9"
          isDark={isDark}
        />
        <StatBox
          icon={<Trophy className="text-purple-400" />}
          label="Achievement"
          value="Fashion Master"
          isDark={isDark}
        />
      </section>

      {/* REKOMENDASI KOSTUM SLIDER */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          🔥 Rekomendasi Kostum Untukmu
        </h2>

        {loadingKostum ? (
          <p className="text-center text-gray-400 animate-pulse">
            Memuat kostum...
          </p>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={16}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
            className="py-2"
          >
            {kostumRekomendasi.map((item) => (
              <SwiperSlide key={item.id}>
                <div
                  className={`rounded-xl shadow-lg overflow-hidden border p-2 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                >
                  <img
                    src={item.Image || "https://via.placeholder.com/300x200"}
                    alt={item.ProductName || item.nama}
                    className="h-48 w-full object-cover rounded-md"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-lg mb-1">
                      {item.ProductName || item.nama}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      Rp {(item.Harga || item.harga)?.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star size={16} />{" "}
                      <span>{(item.Rating || 4.8).toFixed(1)}</span>
                    </div>
                    <button
                      className={`mt-3 w-full py-1.5 rounded-md font-medium transition ${
                        isDark
                          ? "bg-pink-600 hover:bg-pink-700 text-white"
                          : "bg-pink-600 hover:bg-pink-700 text-white"
                      }`}
                    >
                      Sewa Sekarang
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </motion.section>

      {/* RIWAYAT SEWA */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          🕓 Riwayat Sewa Terakhir
        </h2>

        {loadingHistory ? (
          <p className="text-center text-gray-400 animate-pulse">
            Memuat riwayat...
          </p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-400">Belum ada riwayat sewa.</p>
        ) : (
          <div className="space-y-3">
            {history.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-gray-100"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
              >
                <Clock className="text-pink-500" />
                <div>
                  <p className="font-medium">{item.namaProduk || item.nama}</p>
                  <span className="text-sm opacity-70">
                    {item.createdAt?.slice(0, 10)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatBox({ icon, label, value, isDark }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`flex flex-col items-center justify-center py-6 rounded-xl shadow-lg border ${
        isDark
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      <div className="mb-2">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-gray-400 text-sm">{label}</p>
    </motion.div>
  );
}
