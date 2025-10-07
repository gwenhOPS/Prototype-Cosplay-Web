import React, { useEffect, useState } from "react";
import axios from "axios";
import { createTransaksi } from "../../api/mockapi";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "../../utils/toast";
import Pagination from "../../components/Pagination";

export default function ProductList() {
  const { isDark } = useTheme();
  const [produk, setProduk] = useState([]);
  const [cart, setCart] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const user = JSON.parse(localStorage.getItem("user"));
  // const navigate = useNavigate();
  const { search } = useLocation();

  // Ambil query search dari Navbar
  const params = new URLSearchParams(search);
  const searchQuery = params.get("search") || "";

  // Fetch produk dari MockAPI
  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        "https://68c3856b81ff90c8e6191cfc.mockapi.io/api/v1/produk"
      );
      setProduk(data);
    } catch (err) {
      console.error("Gagal fetch produk:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter produk sesuai searchQuery
  const filteredProduk = produk.filter((p) =>
    p.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProduk.length / itemsPerPage);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [totalPages, page]);

  const paginatedProduk = filteredProduk.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const addToCart = (item) => {
    const isExist = cart.some((c) => c.id === item.id);
    if (isExist) {
      toast(`Produk "${item.nama}" sudah ada di keranjang!`);
      return;
    }

    const updatedCart = [...cart, item];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast(`Produk "${item.nama}" berhasil ditambahkan ke keranjang ✅`);
  };

  const handleSewa = (item) => {
    setSelectedProduct(item);
    setShowPopup(true);
  };

  const submitSewa = async () => {
    if (!selectedProduct) return;

    try {
      await createTransaksi({
        Name: user?.name || "Guest",
        ProductName: selectedProduct.nama,
        Price: Number(selectedProduct.harga),
        WaktuSewa: selectedProduct.waktusewa,
        Image: selectedProduct.gambar,
        Deskripsi: selectedProduct.deskripsi,
        Date: new Date().toISOString(),
        Status: "Pending",
      });

      toast(`Pesanan ${selectedProduct.nama} berhasil disewa!`);
      setShowPopup(false);
    } catch {
      toast("Terjadi kesalahan saat membuat pesanan.", "error");
    }
  };

  const truncate = (text, length = 100) =>
    text.length > length ? text.substring(0, length) + "..." : text;

  return (
    <div
      className={`p-6 min-h-screen transition-all ${
        isDark
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎭 Daftar Kostum Cosplay
      </h1>

      {searchQuery && (
        <p className="mb-4 text-center">
          Hasil pencarian untuk: <span className="font-semibold">{searchQuery}</span>
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedProduk.length > 0 ? (
          paginatedProduk.map((p) => (
            <div
              key={p.id}
              className={`rounded-xl shadow-lg p-4 flex flex-col justify-between transform hover:scale-105 transition duration-300 ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                  : "bg-white hover:bg-pink-50"
              }`}
            >
              <img
                src={p.gambar}
                alt={p.nama}
                className="h-60 w-full object-cover rounded-lg mb-3"
              />
              <h2 className="font-bold text-lg mb-1">{p.nama}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                {truncate(p.deskripsi || "", 80)}
              </p>
              <p className="font-semibold text-pink-600 dark:text-pink-400">
                Rp {Number(p.harga).toLocaleString()} {p.waktusewa}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => addToCart(p)}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1 py-2 rounded-lg"
                >
                  + Keranjang
                </button>
                <button
                  onClick={() => handleSewa(p)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1 py-2 rounded-lg"
                >
                  Sewa
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">Produk tidak ditemukan.</p>
        )}
  </div>
      <Pagination
        page={page}
        setPage={(p) => {
          setPage(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        total={totalPages}
      />

      {/* Popup */}
      {showPopup && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl shadow-2xl p-6 w-full max-w-md transition-all ${
              isDark ? "bg-gray-800 text-gray-100" : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Konfirmasi Sewa</h2>
            <img
              src={selectedProduct.gambar}
              alt={selectedProduct.nama}
              className="h-48 w-full object-cover rounded-lg mb-3"
            />
            <h3 className="font-bold text-lg">{selectedProduct.nama}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
              {selectedProduct.deskripsi}
            </p>
            <p className="font-semibold">
              Rp {Number(selectedProduct.harga).toLocaleString()}
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={submitSewa}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
