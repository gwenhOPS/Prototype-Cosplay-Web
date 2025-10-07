import React, { createContext, useContext, useEffect, useState } from "react";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  // gabungan sistem kamu + sistem template
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // open state utama (desktop)
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isMobileOpen, setIsMobileOpen] = useState(false); // khusus mobile toggle

  // sama kayak "isExpanded" di template
  const isExpanded = isSidebarOpen;

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  // deteksi window resize buat ubah mode mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        isExpanded,       // alias untuk sidebar desktop
        isSidebarOpen,    // state desktop
        toggleSidebar,
        isMobile,
        isMobileOpen,
        setIsMobileOpen,
        isHovered,
        setIsHovered,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
