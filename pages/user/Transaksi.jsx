import React, { useEffect, useState } from "react";
import { getTransaksi, getProduk } from "../../api/mockapi";
import { useTheme } from "../../context/ThemeContext";

// 🔹 Komponen Badge Status
function Badge({ status }) {
  const base =
    "px-3 py-1 rounded-full text-xs font-semibold inline-block text-center transition-all duration-300";
  const styles = {
    Pending:
      "bg-yellow-100 text-yellow-700 border border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700",
    Disetujui:
      "bg-green-100 text-green-700 border border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
    Ditolak:
      "bg-red-100 text-red-700 border border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700",
  };
  return (
    <span className={`${base} ${styles[status] || ""} animate-fade-in`}>
      {status}
    </span>
  );
}

// 🔹 Skeleton Loading
function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="p-3 border border-gray-200 dark:border-gray-700">
          <div
            className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${
              i % 2 === 0 ? "w-24" : "w-16"
            }`}
          ></div>
        </td>
      ))}
    </tr>
  );
}

export default function TransaksiUserDashboard() {
  const { isDark } = useTheme();
  const [transaksi, setTransaksi] = useState([]);
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [resTransaksi, resProduk] = await Promise.all([
        getTransaksi(),
        getProduk(),
      ]);
      setTransaksi(resTransaksi.data);
      setProdukList(resProduk.data);
    } catch (err) {
      console.error("Gagal load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Fungsi bantu cari harga & gambar produk
  const findProductDetail = (productName) =>
    produkList.find((p) => p.ProductName === productName);

  return (
    <div className="p-6 md:p-10 transition-colors duration-500">
      <div
        className={`shadow-xl rounded-2xl p-8 border ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 border-gray-700"
            : "bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 border-gray-200"
        }`}
      >
        {/* 🔹 Judul */}
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          📦{" "}
          <span
            className={`underline underline-offset-4 ${
              isDark ? "decoration-pink-400" : "decoration-pink-500"
            }`}
          >
            Riwayat Transaksi Saya
          </span>
        </h1>

        {/* 🔹 Tabel */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <table
            className={`w-full text-sm rounded-lg overflow-hidden shadow-md ${
              isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
            }`}
          >
            <thead
              className={`${
                isDark
                  ? "bg-gray-800 text-gray-200 border-b border-gray-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <tr>
                <th className="p-3 font-semibold border border-gray-200 dark:border-gray-700 text-left">
                  Produk
                </th>
                <th className="p-3 font-semibold border border-gray-200 dark:border-gray-700 text-left">
                  Nama
                </th>
                <th className="p-3 font-semibold border border-gray-200 dark:border-gray-700 text-left">
                  Total
                </th>
                <th className="p-3 font-semibold border border-gray-200 dark:border-gray-700 text-left">
                  Tanggal
                </th>
                <th className="p-3 font-semibold border border-gray-200 dark:border-gray-700 text-left">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : transaksi.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-gray-500 dark:text-gray-400 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">🛒</span>
                      <p>Belum ada transaksi yang tercatat</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transaksi.map((t) => {
                  const productDetail = findProductDetail(t.ProductName);
                  const finalPrice = Number(t.Price ?? productDetail?.Price ?? t.Total ?? 0);
                  const finalImage =
                    productDetail?.Image || t.Image || null;

                  return (
                    <tr
                      key={t.id}
                      className={`transition-all duration-200 ease-in-out cursor-pointer ${
                        isDark
                          ? "hover:bg-gray-800 hover:scale-[1.01]"
                          : "hover:bg-pink-50 hover:scale-[1.01]"
                      }`}
                    >
                      {/* 🔹 Produk + Gambar */}
                      <td className="p-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          {finalImage ? (
                            <img
                              src={finalImage}
                              alt={t.ProductName}
                              className="w-12 h-12 object-cover rounded-lg shadow-sm transition-transform duration-200 hover:scale-125"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                              -
                            </div>
                          )}
                          <span
                            className="truncate max-w-[150px] md:max-w-xs"
                            title={t.ProductName}
                          >
                            {t.ProductName}
                          </span>
                        </div>
                      </td>

                      {/* 🔹 Nama */}
                      <td className="p-3 border border-gray-200 dark:border-gray-700">
                        {t.Name}
                      </td>

                      {/* 🔹 Total Harga */}
                      <td className="p-3 border border-gray-200 dark:border-gray-700 font-semibold text-pink-500">
                        Rp {Number(finalPrice).toLocaleString("id-ID")}
                      </td>

                      {/* 🔹 Tanggal */}
                      <td className="p-3 border border-gray-200 dark:border-gray-700">
                        {new Date(t.Date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>

                      {/* 🔹 Status */}
                      <td className="p-3 border border-gray-200 dark:border-gray-700">
                        <Badge status={t.Status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
