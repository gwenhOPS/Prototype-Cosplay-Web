// src/api/api-cosplay.js
import axios from "axios";

const API_BASE = "https://episematic-daron-proindustry.ngrok-free.dev"; // base URL

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// === AUTH SECTION ===
export const registerUser = async (data) => {
  try {
    const res = await api.post("/register", data);
    return res.data;
  } catch (err) {
    console.error("Register error:", err);
    throw err.response?.data || { message: "Gagal register" };
  }
};

export const loginUser = async (data) => {
  try {
    const res = await api.post("/login", data);
    return res.data;
  } catch (err) {
    console.error("Login error:", err);
    throw err.response?.data || { message: "Gagal login" };
  }
};

// === PRODUK / TRANSAKSI / PELANGGAN ===
export const getProduk = () => api.get("/produk");
export const addProduk = (data) => api.post("/produk", data);
export const updateProduk = (id, data) => api.put(`/produk/${id}`, data);
export const deleteProduk = (id) => api.delete(`/produk/${id}`);

// nanti bisa lanjut bikin transaksi & pelanggan juga
