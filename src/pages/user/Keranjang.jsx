import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "../../utils/toast";

export default function Keranjang() {
  const { isDark } = useTheme();
  const [cart, setCart] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadCart = () => {
      const data = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(data);
    };
    loadCart();
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  // 🔹 Hapus item dari keranjang
  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // 🔹 Checkout handler
  const checkout = async () => {
    if (cart.length === 0) {
      toast("Keranjang kosong! Tambahkan produk dulu.", "error");
      return;
    }

    const total = cart.reduce((acc, item) => acc + Number(item.harga), 0);

    try {
      await Promise.all(
        cart.map((item) =>
          axios.post("https://68c3856b81ff90c8e6191cfc.mockapi.io/api/v1/transaksi", {
            Name: user?.name || "Guest",
            ProductName: item.nama,
            Total: Number(item.harga),
            WaktuSewa: item.waktusewa,
            Image: item.gambar,
            Deskripsi: item.deskripsi,
            Status: "Pending",
            Date: new Date().toISOString(),
          })
        )
      );

      localStorage.removeItem("cart");
      setCart([]);
      toast("Checkout berhasil! 🎉", "success");
    } catch (err) {
      console.error("Gagal checkout:", err);
      toast("Terjadi kesalahan saat checkout.", "error");
    }
  };

  const totalHarga = cart.reduce((acc, item) => acc + Number(item.harga), 0);

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-pink-200 via-purple-200 to-blue-100 text-gray-900"
      }`}
    >
      <div
        className={`max-w-xl mx-auto shadow-2xl rounded-2xl p-6 transition-all duration-300 ${
          isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
        }`}
      >
        <h1 className="text-3xl font-extrabold text-center text-pink-500 dark:text-pink-400 mb-6">
          🛒 Keranjang Sewa
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Keranjang kosong
          </p>
        ) : (
          <div className="space-y-3">
            {cart.map((c, i) => (
              <div
                key={i}
                className={`flex justify-between items-center px-4 py-2 rounded-lg shadow-sm transition-all duration-300 ${
                  isDark
                    ? "bg-gray-700 border border-gray-600 hover:bg-gray-600"
                    : "bg-pink-50 border border-pink-200 hover:bg-pink-100 hover:shadow-md"
                }`}
              >
                <div>
                  <p
                    className={`font-semibold ${
                      isDark ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {c.nama}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    Rp {Number(c.harga).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(i)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                  title="Hapus dari keranjang"
                >
                  ❌
                </button>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4 border-t mt-4 border-gray-300 dark:border-gray-600">
              <span className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
                Total:
              </span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                Rp {totalHarga.toLocaleString()}
              </span>
            </div>

            <button
              onClick={checkout}
              className="w-full mt-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg"
            >
              Checkout Sekarang ✅
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
