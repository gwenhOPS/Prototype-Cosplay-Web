import React from "react";
import { Link, useLocation } from "react-router-dom";
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
  const { isSidebarOpen, toggleSidebar, isMobile, isHovered, setIsHovered } =
    useLayout();

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
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      )}

      {/* 🔹 Overlay (Mobile) */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* 🔹 Sidebar */}
      <aside
        onMouseEnter={() => !isSidebarOpen && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed md:static top-0 left-0 h-full z-50
          bg-gradient-to-b from-pink-500 via-purple-500 to-indigo-600 text-white shadow-2xl flex flex-col
          transition-all duration-500 ease-in-out
          ${
            isMobile
              ? `${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}`
              : `${isSidebarOpen || isHovered ? "w-64" : "w-20"}`
          }`}
      >
        {/* 🔸 Header */}
        <div
          className={`flex flex-col items-center justify-center mt-6 mb-8 transition-all duration-500 ${
            isSidebarOpen || isHovered ? "gap-2" : ""
          }`}
        >
          {/* Logo */}
          <div className="font-extrabold text-2xl tracking-wide drop-shadow-lg">
            ✦
          </div>

          {(isSidebarOpen || isHovered) && (
            <>
              <p className="text-sm italic opacity-80 mt-1">
                {user?.role === "admin" ? "Admin Panel" : "Rental Cosplay"}
              </p>
              <div className="w-20 h-[2px] bg-white/40 mx-auto mt-2 rounded"></div>
            </>
          )}
        </div>

        {/* 🔹 Menu List */}
        <nav className="flex flex-col gap-3 w-full px-2">
          {menus.map((m) => {
            const isActive = location.pathname === m.path;
            return (
              <Link
                key={m.path}
                to={m.path}
                onClick={() => isMobile && toggleSidebar()}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-white/30 backdrop-blur-md text-white shadow-md scale-[1.02]"
                    : "hover:bg-white/20 hover:translate-x-1"
                }`}
                title={!isSidebarOpen && !isHovered ? m.label : ""}
              >
                <span className={`${isActive ? "animate-bounce" : ""}`}>
                  {m.icon}
                </span>
                {(isSidebarOpen || isHovered) && <span>{m.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* 🔸 Footer */}
        {(isSidebarOpen || isHovered) && (
          <div className="absolute bottom-4 left-0 w-full text-center text-xs opacity-80">
            <p className="font-light">© {new Date().getFullYear()} CosRent</p>
            <p className="italic text-pink-200">
              “Transform into your favorite character”
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
