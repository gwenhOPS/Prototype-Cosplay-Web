import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("authUser");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (found) {
      setUser(found);
      localStorage.setItem("authUser", JSON.stringify(found));
      return { success: true, user: found };
    }
    return { success: false, message: "Email atau password salah" };
  };

  const register = (newUser) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find((u) => u.email === newUser.email);
    if (exists) {
      return { success: false, message: "Email sudah terdaftar" };
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem("authUser", JSON.stringify(newUser));

    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
