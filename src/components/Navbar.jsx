import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Search, X, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLayout } from "../context/LayoutContext"; // Context layout

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { toggleSidebar, isMobile } = useLayout(); // Ambil dari context

  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const [query, setQuery] = useState("");

  const userMenu = [
    { label: "Dashboard", path: "/" },
    { label: "Kostum", path: "/produk" },
    { label: "Keranjang", path: "/keranjang" },
    { label: "Transaksi", path: "/transaksi" },
    { label: "Akun", path: "/account" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpenMobile(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/produk?search=${encodeURIComponent(query)}`);
      setQuery("");
      setShowSearchMobile(false);
      setIsOpenMobile(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-500 ${
        isDark
          ? "bg-gray-900/70 text-white border-b border-gray-700"
          : "bg-white/70 text-gray-900 border-b border-pink-200"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* 🔹 Logo (bisa toggle sidebar di desktop, buka menu di mobile) */}
        <button
          onClick={() => {
            if (isMobile) return setIsOpenMobile((prev) => !prev);
            toggleSidebar();
          }}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 transition-all
            bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white font-bold group-hover:scale-110`}
          >
            ✦
          </div>
          <span
            className={`text-xs tracking-wider font-semibold italic ${
              isDark ? "text-gray-300" : "text-gray-600"
            } group-hover:text-pink-500 transition`}
          >
            CosRent Portal
          </span>
        </button>

        {/* 🔹 Desktop Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Cari kostum..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 transition-all shadow-inner ${
                isDark
                  ? "bg-gray-800/70 border border-gray-700 text-white focus:ring-pink-400"
                  : "bg-white/70 border border-pink-300 text-gray-800 focus:ring-pink-400"
              }`}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all shadow-md ${
              isDark
                ? "bg-pink-600/80 hover:bg-pink-700 text-white"
                : "bg-pink-400/80 hover:bg-pink-500 text-white"
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User section */}
          {user ? (
            <>
              <span
                className={`text-sm font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white transition-all shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-full bg-green-500/80 hover:bg-green-600 text-white transition-all shadow-md"
            >
              Login
            </Link>
          )}
        </div>

        {/* 🔹 Mobile Control */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setShowSearchMobile(!showSearchMobile)}
            className={`${isDark ? "text-gray-200" : "text-gray-800"}`}
          >
            <Search size={24} />
          </button>
        </div>
      </div>

      {/* 🔹 Mobile Search */}
      {showSearchMobile && (
        <div
          className={`absolute top-full left-0 w-full md:hidden p-4 shadow-lg backdrop-blur-md ${
            isDark ? "bg-gray-900/70" : "bg-white/70"
          }`}
        >
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Cari kostum..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`flex-1 px-3 py-2 rounded-full border focus:outline-none focus:ring ${
                isDark
                  ? "bg-gray-800/70 border-gray-700 text-white focus:ring-pink-400"
                  : "bg-white/70 border-gray-300 text-gray-800 focus:ring-pink-400"
              }`}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-pink-500/80 hover:bg-pink-600 text-white shadow-md transition"
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      )}

      {/* 🔹 Mobile Sidebar */}
      {isOpenMobile && isMobile && (
        <aside
          className={`fixed top-0 left-0 h-full w-2/3 p-6 gap-4 z-50 transition-transform duration-500 backdrop-blur-md ${
            isDark
              ? "bg-gray-900/80 text-white border-r border-gray-700"
              : "bg-white/80 text-gray-900 border-r border-pink-200"
          }`}
        >
          <button
            onClick={() => setIsOpenMobile(false)}
            className="self-end text-gray-500 hover:text-red-500 transition"
          >
            <X size={28} />
          </button>

          <button
            onClick={toggleTheme}
            className="w-full px-4 py-2 rounded-full bg-pink-500/80 hover:bg-pink-600 text-white flex items-center justify-center gap-2 shadow-md transition"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>

          <nav className="flex flex-col gap-3 mt-4">
            {userMenu.map((m) => {
              const isActive = location.pathname === m.path;
              return (
                <Link
                  key={m.path}
                  to={m.path}
                  onClick={() => setIsOpenMobile(false)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-pink-600/80 text-white shadow-md scale-[1.02]"
                      : "hover:bg-pink-500/70 hover:translate-x-1"
                  }`}
                >
                  {m.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 mt-4 rounded-full bg-red-500/80 hover:bg-red-600 text-white shadow-md transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpenMobile(false)}
                className="w-full px-4 py-2 mt-4 rounded-full bg-green-500/80 hover:bg-green-600 text-white shadow-md text-center transition"
              >
                Login
              </Link>
            )}
          </div>
        </aside>
      )}
    </header>
  );
}
