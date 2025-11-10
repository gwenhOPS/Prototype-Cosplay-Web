import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import DashboardUser from './pages/user/Dashboard.jsx'
import ProductList from './pages/user/ProductList.jsx'
import TransaksiUser from './pages/user/Transaksi.jsx'
import Keranjang from './pages/user/Keranjang.jsx'
import Account from './pages/account/Account.jsx'
import DashboardAdmin from './pages/admin/DashboardAdmin.jsx'
import ProdukAdmin from './pages/admin/ProdukAdmin.jsx'
import PelangganAdmin from './pages/admin/PelangganAdmin.jsx'
import TransaksiAdmin from './pages/admin/TransaksiAdmin.jsx'
import { useAuth } from './context/AuthContext.jsx'
import Footer from './components/Footer.jsx'
import { AnimatePresence } from 'framer-motion'

export default function App(){
  const { user } = useAuth()
  if(!user) {
    return (<Routes><Route path="/register" element={<Register/>} /><Route path="*" element={<Login/>} /></Routes>)
  }

  return (
    <AnimatePresence mode="wait">
    <DashboardLayout>
      <Routes>
        {user.role === 'admin' ? (
          <>
            <Route path="/admin/dashboard" element={<DashboardAdmin/>} />
            <Route path="/admin/produk" element={<ProdukAdmin/>} />
            <Route path="/admin/pelanggan" element={<PelangganAdmin/>} />
            <Route path="/admin/transaksi" element={<TransaksiAdmin/>} />
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<DashboardUser/>} />
            <Route path="/produk" element={<ProductList/>} />
            <Route path="/keranjang" element={<Keranjang/>} />
            <Route path="/transaksi" element={<TransaksiUser/>} />
            <Route path="/account" element={<Account/>} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
      <Footer />
    </DashboardLayout>
    </AnimatePresence>
  )
}
