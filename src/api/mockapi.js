import axios from 'axios'
const api = axios.create({ baseURL: 'https://68c3856b81ff90c8e6191cfc.mockapi.io/api/v1' })

export const getUsers = () => api.get('/users')
export const addUser = (data) => api.post('/users', data)

export const getProduk = () => api.get('/produk')
export const addProduk = (data) => api.post('/produk', data)
export const updateProduk = (id,data) => api.put(`/produk/${id}`, data)
export const deleteProduk = (id) => api.delete(`/produk/${id}`)

export const getTransaksi = () => api.get('/Transaksi')
export const addTransaksi = (data) => api.post('/Transaksi', data)
export const createTransaksi = (data) => api.post("/Transaksi", data);
export const updateTransaksi = (id,data) => api.put(`/Transaksi/${id}`, data)
export const deleteTransaksi = (id) => api.delete(`/Transaksi/${id}`)

export default api
