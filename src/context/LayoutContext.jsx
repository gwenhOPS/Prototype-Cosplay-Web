import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  // Hindari akses langsung window di server
  const getIsMobile = () => (typeof window !== "undefined" ? window.innerWidth < 1024 : false);

  const [isMobile, setIsMobile] = useState(getIsMobile());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // alias desktop sidebar expansion
  const isExpanded = isSidebarOpen;

  // toggle dengan logika adaptif
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsMobileOpen(prev => !prev);
    } else {
      setIsSidebarOpen(prev => !prev);
    }
  }, [isMobile]);

  // optimize resize detection
  useEffect(() => {
    let lastIsMobile = getIsMobile();

    const handleResize = () => {
      const currentIsMobile = getIsMobile();
      if (currentIsMobile !== lastIsMobile) {
        setIsMobile(currentIsMobile);
        lastIsMobile = currentIsMobile;
        // reset toggle biar gak bug di transisi mode
        setIsMobileOpen(false);
        if (currentIsMobile) setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // cache context biar gak trigger re-render berlebihan
  const contextValue = useMemo(
    () => ({
      isExpanded,
      isSidebarOpen,
      toggleSidebar,
      isMobile,
      isMobileOpen,
      setIsMobileOpen,
      isHovered,
      setIsHovered,
    }),
    [isExpanded, isSidebarOpen, isMobile, isMobileOpen, isHovered, toggleSidebar]
  );

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
