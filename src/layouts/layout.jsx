import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLayout } from "../context/LayoutContext";
import {
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar, isMobile, isHovered, setIsHovered } = useLayout();

  const adminMenu = [
    { label: "Dashboard", path: "/admin", icon: <HomeIcon className="h-5 w-5" /> },
    { label: "Produk", path: "/admin/produk", icon: <CubeIcon className="h-5 w-5" /> },
    { label: "Transaksi", path: "/admin/transaksi", icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
  ];

  const userMenu = [
    { label: "Dashboard", path: "/", icon: <HomeIcon className="h-5 w-5" /> },
    { label: "Kostum", path: "/produk", icon: <CubeIcon className="h-5 w-5" /> },
    { label: "Keranjang", path: "/keranjang", icon: <ShoppingCartIcon className="h-5 w-5" /> },
    { label: "Transaksi", path: "/transaksi", icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
    { label: "Akun", path: "/account", icon: <UserCircleIcon className="h-5 w-5" /> },
  ];

  const menus = user?.role === "admin" ? adminMenu : userMenu;

  return (
    <>
      {/* 🔹 Mobile Toggle */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 m-2 rounded bg-pink-600 text-white fixed top-3 left-3 z-[100] shadow-md hover:bg-pink-700 transition"
        >
          {isSidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      )}

      {/* 🔹 Overlay (Mobile) */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={toggleSidebar} />
      )}

      {/* 🔹 Sidebar */}
      <motion.aside
        onMouseEnter={() => !isSidebarOpen && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          width: isMobile
            ? isSidebarOpen
              ? 260
              : 0
            : isSidebarOpen || isHovered
            ? 260
            : 80,
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 25,
        }}
        className={`fixed md:static top-0 left-0 h-full z-50 
          bg-gradient-to-b from-pink-500 via-purple-500 to-indigo-600 text-white shadow-2xl flex flex-col 
          overflow-hidden transition-all`}
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
      >
        {/* 🔸 Header */}
        <div className="flex flex-col items-center justify-center mt-6 mb-8">
          <div className="font-extrabold text-2xl tracking-wide drop-shadow-lg">✦</div>
          {(isSidebarOpen || isHovered) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-center mt-2"
            >
              <p className="text-sm italic opacity-80">
                {user?.role === "admin" ? "Admin Panel" : "Rental Cosplay"}
              </p>
              <div className="w-20 h-[2px] bg-white/40 mx-auto mt-2 rounded"></div>
            </motion.div>
          )}
        </div>

        {/* 🔹 Menu List */}
        <nav className="flex flex-col gap-2 w-full px-2">
          {menus.map((m, i) => {
            const isActive = location.pathname === m.path;
            return (
              <motion.div
                key={m.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={m.path}
                  onClick={() => isMobile && toggleSidebar()}
                  className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 
                    ${
                      isActive
                        ? "bg-white/30 backdrop-blur-md text-white shadow-md scale-[1.02]"
                        : "hover:bg-white/20 hover:translate-x-1"
                    } 
                    ${isSidebarOpen || isHovered ? "gap-3" : "justify-center"}`}
                  title={!isSidebarOpen && !isHovered ? m.label : ""}
                >
                  <span className={`${isActive ? "animate-bounce" : ""}`}>{m.icon}</span>
                  {(isSidebarOpen || isHovered) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="whitespace-nowrap"
                    >
                      {m.label}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* 🔸 Footer */}
        {(isSidebarOpen || isHovered) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-4 left-0 w-full text-center text-xs opacity-80"
          >
            <p className="font-light">© {new Date().getFullYear()} CosRent</p>
            <p className="italic text-pink-200">“Transform into your favorite character”</p>
          </motion.div>
        )}
      </motion.aside>
    </>
  );
}
