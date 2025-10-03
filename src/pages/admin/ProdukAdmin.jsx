import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getProduk,
  addProduk,
  updateProduk,
  deleteProduk,
} from "../../api/mockapi";
import { useTheme } from "../../context/ThemeContext";

export default function ProdukAdmin() {
  const { isDark } = useTheme();
  const [produk, setProduk] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nama: "",
    harga: "",
    waktusewa: "",
    gambar: "",
    deskripsi: "",
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 5;

  const loadData = async () => {
    try {
      const res = await getProduk();
      setProduk(res.data);
    } catch {
      Swal.fire("Error", "Gagal memuat data produk", "error");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama || !form.harga || !form.waktusewa || !form.deskripsi) {
      Swal.fire("Error", "Nama, Harga, Waktu Sewa, dan Deskripsi wajib diisi!", "error");
      return;
    }

    const payload = { ...form, harga: Number(form.harga) };

    try {
      if (form.id) {
        await updateProduk(form.id, payload);
        Swal.fire("Berhasil", "Produk berhasil diperbarui!", "success");
      } else {
        await addProduk(payload);
        Swal.fire("Berhasil", "Produk baru berhasil ditambahkan!", "success");
      }

      setForm({ id: null, nama: "", harga: "", waktusewa: "", gambar: "", deskripsi: "" });
      setShowForm(false);
      loadData();
    } catch {
      Swal.fire("Error", "Gagal menyimpan produk", "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Yakin hapus produk?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduk(id);
          loadData();
          Swal.fire("Terhapus!", "Produk berhasil dihapus.", "success");
        } catch {
          Swal.fire("Error", "Gagal menghapus produk", "error");
        }
      }
    });
  };

  const filtered = produk.filter(
    (p) =>
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.waktusewa.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayed = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div
      className={`p-6 min-h-screen transition-all duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-extrabold mb-6 text-center drop-shadow-md">
        🎭 Manajemen Produk Rental Cosplay
      </h1>

      {/* Search + Tambah */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <input
          type="text"
          placeholder="Cari produk / waktu sewa..."
          className={`border rounded px-4 py-2 w-full md:w-1/3 shadow-sm transition-all focus:ring-2 ${
            isDark
              ? "bg-gray-800 border-gray-700 text-white focus:ring-pink-500"
              : "bg-white border-gray-300 text-gray-800 focus:ring-pink-400"
          }`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setShowForm(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg shadow-md transition-all"
        >
          + Tambah Produk
        </button>
      </div>

      {/* Table */}
      <div
        className={`overflow-x-auto rounded-lg shadow-lg ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <table className="w-full border border-gray-300">
          <thead className={`${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Harga</th>
              <th className="p-2 border">Waktu Sewa</th>
              <th className="p-2 border">Deskripsi</th>
              <th className="p-2 border">Gambar</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((p, i) => (
              <tr
                key={p.id}
                className={`text-center hover:scale-[1.01] transition-all duration-200 ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                }`}
              >
                <td className="border p-2">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                <td className="border p-2 font-semibold">{p.nama}</td>
                <td className="border p-2 text-pink-600 font-bold">
                  Rp {Number(p.harga).toLocaleString()}
                </td>
                <td className="border p-2">{p.waktusewa}</td>
                <td className="border p-2 text-left">{p.deskripsi}</td>
                <td className="border p-2">
                  {p.gambar && (
                    <img
                      src={p.gambar}
                      alt={p.nama}
                      className="w-16 h-16 object-cover mx-auto rounded shadow"
                    />
                  )}
                </td>
                <td className="border p-2 flex gap-2 justify-center flex-wrap">
                  <button
                    onClick={() => {
                      setForm({ ...p });
                      setShowForm(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
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
              {form.id ? "✏️ Edit Produk" : "🆕 Tambah Produk"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="nama"
                placeholder="Nama Produk"
                className="w-full border px-3 py-2 rounded"
                value={form.nama}
                onChange={handleChange}
              />
              <input
                type="number"
                name="harga"
                placeholder="Harga Produk"
                className="w-full border px-3 py-2 rounded"
                value={form.harga}
                onChange={handleChange}
              />
              <select
                name="waktusewa"
                className="w-full border px-3 py-2 rounded"
                value={form.waktusewa}
                onChange={handleChange}
              >
                <option value="">Pilih Waktu Sewa</option>
                <option value="/1hari">/1 hari</option>
                <option value="/3hari">/3 hari</option>
                <option value="/7hari">/7 hari</option>
              </select>
              <input
                type="text"
                name="gambar"
                placeholder="URL Gambar Produk"
                className="w-full border px-3 py-2 rounded"
                value={form.gambar}
                onChange={handleChange}
              />
              <textarea
                name="deskripsi"
                placeholder="Deskripsi Produk"
                className="w-full border px-3 py-2 rounded"
                value={form.deskripsi}
                onChange={handleChange}
              />

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
