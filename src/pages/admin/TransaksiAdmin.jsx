import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getTransaksi,
  addTransaksi,
  updateTransaksi,
  deleteTransaksi,
} from "../../api/mockapi";
import { useTheme } from "../../context/ThemeContext";

export default function TransaksiAdmin() {
  const { isDark } = useTheme();
  const [transaksi, setTransaksi] = useState([]);
  const [form, setForm] = useState({
    id: null,
    Name: "",
    ProductName: "",
    Total: "",
    Status: "Pending",
    Date: "",
    Image: "",
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 5;

  // 🔹 Load data awal
  const loadData = async () => {
    try {
      const res = await getTransaksi();
      setTransaksi([...res.data].reverse()); // data terbaru di atas
    } catch {
      Swal.fire("Error", "Gagal memuat data transaksi", "error");
    }
  };

  // 🔁 Refresh real-time (pause saat form terbuka)
  useEffect(() => {
    loadData();
    if (!showForm) {
      const interval = setInterval(loadData, 10000);
      return () => clearInterval(interval);
    }
  }, [showForm]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () =>
    setForm({
      id: null,
      Name: "",
      ProductName: "",
      Total: "",
      Status: "Pending",
      Date: "",
      Image: "",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.Name || !form.ProductName || !form.Total) {
      Swal.fire("Error", "Semua field wajib diisi!", "error");
      return;
    }

    const payload = {
      ...form,
      Total: Number(form.Total),
      Date: form.id ? form.Date : new Date().toISOString(),
    };

    try {
      if (form.id) {
        await updateTransaksi(form.id, payload);
        Swal.fire("Berhasil", "Transaksi berhasil diperbarui!", "success");
      } else {
        await addTransaksi(payload);
        Swal.fire("Berhasil", "Transaksi baru berhasil ditambahkan!", "success");
      }

      resetForm();
      setShowForm(false);
      loadData();
    } catch {
      Swal.fire("Error", "Gagal menyimpan transaksi", "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Yakin hapus transaksi?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTransaksi(id);
          loadData();
          Swal.fire("Terhapus!", "Transaksi berhasil dihapus.", "success");
        } catch {
          Swal.fire("Error", "Gagal menghapus transaksi", "error");
        }
      }
    });
  };

  const handleValidasi = async (t, status) => {
    if (t.Status === status) {
      Swal.fire("Info", `Status sudah ${status}`, "info");
      return;
    }

    try {
      await updateTransaksi(t.id, { ...t, Status: status });
      loadData();
      Swal.fire(
        "Sukses",
        `Transaksi ${status === "Disetujui" ? "disetujui ✅" : "ditolak ❌"}`,
        "success"
      );
    } catch {
      Swal.fire("Error", "Gagal update status transaksi", "error");
    }
  };

  // 🔍 Filter pencarian (lebih fleksibel)
  const filtered = transaksi.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.Name.toLowerCase().includes(q) ||
      t.ProductName.toLowerCase().includes(q) ||
      t.Status.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayed = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pastikan currentPage selalu valid
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [totalPages]);

  return (
    <div
      className={`p-6 min-h-screen transition-all duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
          : "bg-gradient-to-br from-blue-100 via-pink-50 to-white text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-extrabold mb-6 text-center drop-shadow-md text-pink-500 dark:text-pink-400">
        💳 Manajemen Transaksi Cosplay Rental
      </h1>

      {/* Search + Tambah */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <input
          type="text"
          placeholder="Cari pelanggan / produk / status..."
          className={`border rounded px-4 py-2 w-full md:w-1/3 shadow-sm transition-all focus:ring-2 ${
            isDark
              ? "bg-gray-800 border-gray-700 text-white focus:ring-pink-500"
              : "bg-white border-gray-300 text-gray-800 focus:ring-pink-400"
          }`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white px-5 py-2 rounded-lg shadow-md transition-all"
        >
          + Tambah Transaksi
        </button>
      </div>

      {/* Table */}
      <div
        className={`overflow-x-auto rounded-lg shadow-lg ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <table className="w-full border border-gray-300">
          <thead className={`${isDark ? "bg-gray-700" : "bg-pink-100"}`}>
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Produk</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Tanggal</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Gambar</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((t, i) => (
              <tr
                key={t.id || i}
                className={`text-center transition-all duration-200 ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-pink-50"
                }`}
              >
                <td className="border p-2">
                  {(currentPage - 1) * itemsPerPage + i + 1}
                </td>
                <td className="border p-2 font-semibold">{t.Name}</td>
                <td className="border p-2">{t.ProductName}</td>
               <td className="border p-2 text-pink-600 font-bold">
                     Rp {Number(t.Price ?? t.Total).toLocaleString("id-ID")}
                </td>
                <td className="border p-2">
                  {new Date(t.Date).toLocaleString("id-ID")}
                </td>
                <td
                  className={`border p-2 font-semibold ${
                    t.Status === "Pending"
                      ? "text-yellow-400"
                      : t.Status === "Disetujui"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {t.Status}
                </td>
                <td className="border p-2">
                  {t.Image && (
                    <img
                      src={t.Image}
                      alt={t.ProductName}
                      className="w-16 h-16 object-cover mx-auto rounded-lg shadow"
                    />
                  )}
                </td>
                <td className="border p-2 flex gap-2 justify-center flex-wrap">
                  <button
                    onClick={() => {
                      setForm({ ...t });
                      setShowForm(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() => handleValidasi(t, "Disetujui")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg shadow"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => handleValidasi(t, "Ditolak")}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg shadow"
                  >
                    Tolak
                  </button>
                </td>
              </tr>
            ))}

            {displayed.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  Tidak ada data transaksi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded transition-all ${
              currentPage === i + 1
                ? "bg-pink-600 text-white shadow-lg"
                : isDark
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div
            className={`${
              isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            } rounded-xl shadow-2xl p-6 w-96 animate-fadeIn`}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              {form.id ? "✏️ Edit Transaksi" : "🆕 Tambah Transaksi"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="Name"
                placeholder="Nama Pelanggan"
                className="w-full border px-3 py-2 rounded"
                value={form.Name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="ProductName"
                placeholder="Nama Produk"
                className="w-full border px-3 py-2 rounded"
                value={form.ProductName}
                onChange={handleChange}
              />
              <input
                type="number"
                name="Total"
                placeholder="Total Harga"
                className="w-full border px-3 py-2 rounded"
                value={form.Total}
                onChange={handleChange}
              />
              <input
                type="text"
                name="Image"
                placeholder="URL Gambar Produk"
                className="w-full border px-3 py-2 rounded"
                value={form.Image}
                onChange={handleChange}
              />
              <select
                name="Status"
                className="w-full border px-3 py-2 rounded"
                value={form.Status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
              </select>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
