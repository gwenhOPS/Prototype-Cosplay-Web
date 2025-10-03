import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getTransaksi, getProduk } from "../../api/mockapi";
import { useTheme } from "../../context/ThemeContext";

export default function DashboardAdmin() {
  const [list, setList] = useState([]);
  const [produkList, setProdukList] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [pendapatanData, setPendapatanData] = useState([]);
  const { isDark } = useTheme();

  useEffect(() => {
    (async () => {
      const r = await getTransaksi();
      const p = await getProduk();

      setList(r.data);
      setProdukList(p.data);

      // === STATUS ===
      const statusCount = r.data.reduce((acc, x) => {
        acc[x.Status] = (acc[x.Status] || 0) + 1;
        return acc;
      }, {});

      setStatusData([
        { name: "Pending", value: statusCount["Pending"] || 0 },
        { name: "Disetujui", value: statusCount["Disetujui"] || 0 },
        { name: "Ditolak", value: statusCount["Ditolak"] || 0 },
      ]);

      // === PENDAPATAN HARIAN ===
      const dailyRevenue = {};
      r.data.forEach((x) => {
        const day = new Date(x.Date).toLocaleDateString("id-ID");
        dailyRevenue[day] =
          (dailyRevenue[day] || 0) + Number(x.Price ?? x.Total ?? 0);
      });

      setPendapatanData(
        Object.entries(dailyRevenue).map(([date, total]) => ({ date, total }))
      );
    })();
  }, []);

  // === TOTAL PENDAPATAN ===
  const totalPendapatan = list
    .filter((x) => x.Status === "Disetujui")
    .reduce((s, x) => s + Number(x.Price ?? x.Total ?? 0), 0);

  // === CARD DATA ===
  const cardData = [
    {
      title: "Total Pendapatan",
      value: `Rp${totalPendapatan.toLocaleString("id-ID")}`,
    },
    {
      title: "Jumlah Transaksi",
      value: list.length,
    },
    {
      title: "Produk Tersedia",
      value: produkList.length,
    },
    {
      title: "Produk Disewa Unik",
      value: new Set(list.map((x) => x.ProductName)).size,
    },
  ];

  // === PRODUK POPULER ===
  const produkPopuler = [...list].reduce((acc, x) => {
    const nama = x.ProductName;
    acc[nama] = (acc[nama] || 0) + 1;
    return acc;
  }, {});

  const populerList = Object.entries(produkPopuler)
    .map(([namaProduk, jumlahSewa]) => {
      const t = list.find((x) => x.ProductName === namaProduk);
      return {
        namaProduk,
        jumlahSewa,
        deskripsi: t?.Deskripsi || "-",
        harga: t?.Price || 0,
      };
    })
    .sort((a, b) => b.jumlahSewa - a.jumlahSewa)
    .slice(0, 5);

  const COLORS = ["#FFBB28", "#FF8042", "#00C49F", "#0088FE", "#FF6666"];

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      {/* === CARD SECTION === */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {cardData.map((c, i) => (
          <div
            key={i}
            className={`rounded-xl shadow p-4 flex flex-col justify-between transition-all duration-300 ${
              isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
            }`}
          >
            <h3
              className={`text-sm font-semibold ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {c.title}
            </h3>
            <p className="text-2xl font-bold mt-2">{c.value}</p>
          </div>
        ))}
      </div>

      {/* === CHART SECTION === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart (Status) */}
        <div
          className={`rounded-xl shadow p-4 transition-all duration-300 ${
            isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">Status Transaksi</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1f2937" : "#fff",
                  color: isDark ? "#f9fafb" : "#000",
                  border: "none",
                }}
                formatter={(v) => `${v} transaksi`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart (Pendapatan Harian) */}
        <div
          className={`rounded-xl shadow p-4 transition-all duration-300 ${
            isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">Pendapatan Harian</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pendapatanData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#444" : "#ccc"}
              />
              <XAxis dataKey="date" stroke={isDark ? "#fff" : "#000"} />
              <YAxis stroke={isDark ? "#fff" : "#000"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1f2937" : "#fff",
                  color: isDark ? "#f9fafb" : "#000",
                  border: "none",
                }}
                formatter={(v) => `Rp${v.toLocaleString("id-ID")}`}
              />
              <Bar dataKey="total" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* === PRODUK POPULER === */}
      <div
        className={`rounded-xl shadow p-4 transition-all duration-300 ${
          isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4">Produk Paling Populer</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr
              className={`border-b ${
                isDark ? "border-gray-700" : "border-gray-300"
              }`}
            >
              <th className="p-2 text-left">Produk</th>
              <th className="p-2 text-left">Jumlah Disewa</th>
              <th className="p-2 text-left">Harga</th>
              <th className="p-2 text-left">Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            {populerList.map((p, i) => (
              <tr
                key={i}
                className={`border-b ${
                  isDark ? "border-gray-700" : "border-gray-200"
                } hover:bg-gray-100 dark:hover:bg-gray-700 transition-all`}
              >
                <td className="p-2">{p.namaProduk}</td>
                <td className="p-2">{p.jumlahSewa}</td>
                <td className="p-2">
                  Rp{p.harga.toLocaleString("id-ID")}
                </td>
                <td className="p-2">{p.deskripsi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
