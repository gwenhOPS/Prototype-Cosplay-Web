import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { useLayout } from "../context/LayoutContext"; // ⬅️ Tambah ini

export default function DashboardLayout({ children }) {
  const { isDark } = useTheme();
  const { isSidebarOpen } = useLayout(); // ⬅️ Ambil state dari context

  return (
    <div className={`flex h-screen ${isDark ? "dark" : ""}`}>
      {/* Sidebar muncul kalau open */}
      {isSidebarOpen && <Sidebar />}

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
