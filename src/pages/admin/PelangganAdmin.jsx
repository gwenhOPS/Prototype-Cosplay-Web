import { useEffect, useState } from "react";

export default function PelangganAdmin() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ id: null, nama: "", nohp: "", alamat: "" });

  // load dari localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("pelanggan")) || [];
    setCustomers(saved);
  }, []);

  const saveToLocal = (data) => {
    localStorage.setItem("pelanggan", JSON.stringify(data));
    setCustomers(data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    let newData;
    if (form.id) {
      newData = customers.map((c) => (c.id === form.id ? form : c));
    } else {
      newData = [...customers, { ...form, id: Date.now() }];
    }
    saveToLocal(newData);
    setForm({ id: null, nama: "", nohp: "", alamat: "" });
  };

  const handleEdit = (c) => setForm(c);

  const handleDelete = (id) => {
    const filtered = customers.filter((c) => c.id !== id);
    saveToLocal(filtered);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manajemen Pelanggan (Local)</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          name="nama"
          value={form.nama}
          onChange={handleChange}
          placeholder="Nama Pelanggan"
          className="border p-2 w-full"
        />
        <input
          name="nohp"
          value={form.nohp}
          onChange={handleChange}
          placeholder="Nomor HP"
          className="border p-2 w-full"
        />
        <input
          name="alamat"
          value={form.alamat}
          onChange={handleChange}
          placeholder="Alamat"
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {form.id ? "Update" : "Tambah"}
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {customers.map((c) => (
          <div key={c.id} className="border p-3 rounded shadow">
            <h2 className="font-bold">{c.nama}</h2>
            <p>📱 {c.nohp}</p>
            <p>🏠 {c.alamat}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(c)} className="bg-yellow-500 px-2 text-white">
                Edit
              </button>
              <button onClick={() => handleDelete(c.id)} className="bg-red-500 px-2 text-white">
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
