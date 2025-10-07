import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { useLayout } from "../context/LayoutContext";

export default function DashboardLayout({ children }) {
  const { isDark } = useTheme();
  const { isExpanded, isMobile, isMobileOpen } = useLayout();

  return (
    <div className={`flex h-screen ${isDark ? "dark" : ""}`}>
      {/* Sidebar tetap muncul di desktop atau saat mobile open */}
      {(isExpanded || isMobileOpen) && <Sidebar />}

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
