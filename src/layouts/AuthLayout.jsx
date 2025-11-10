import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function AuthLayout({ children, title, subtitle, isDark }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={`min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-purple-950 via-pink-900 to-gray-900"
          : "bg-gradient-to-br from-yellow-100 via-pink-100 to-white"
      }`}
    >
      {/* BACKGROUND DECORATION */}
      <div
        className={`absolute -top-24 -right-20 w-72 h-72 rounded-full blur-3xl opacity-30 ${
          isDark ? "bg-pink-600" : "bg-pink-300"
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          isDark ? "bg-purple-600" : "bg-purple-300"
        }`}
      />

      {/* CONTENT WRAPPER */}
      <div
        className={`relative z-10 w-full max-w-4xl flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl transition-all ${
          isDark ? "bg-gray-800/80" : "bg-white/70 backdrop-blur-md"
        }`}
      >
        {/* LEFT SIDE - INFO PANEL */}
        <div
          className={`flex-1 hidden md:flex flex-col justify-center p-12 transition-all ${
            isDark
              ? "bg-gradient-to-br from-pink-900/50 via-purple-900/50 to-gray-900/50"
              : "bg-gradient-to-br from-pink-100 via-purple-100 to-white"
          }`}
        >
          <h1
            className={`text-4xl font-bold mb-4 ${
              isDark ? "text-pink-300" : "text-pink-600"
            }`}
          >
            {title}
          </h1>
          <p
            className={`text-base ${
              isDark ? "text-pink-200/80" : "text-gray-700"
            }`}
          >
            {subtitle}
          </p>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="flex-1 p-10 md:p-12 flex items-center justify-center">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
