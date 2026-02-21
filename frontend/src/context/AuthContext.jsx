import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();

  useEffect(() => {
    // Sync state with localStorage if it changes externally (optional, but good for multi-tab)
    const storedRole = localStorage.getItem("role");
    if (storedRole !== role) {
      setRole(storedRole);
    }
  }, []);

  const login = (newRole) => {
    localStorage.setItem("role", newRole);
    setRole(newRole);
    if (newRole === "company") {
        navigate("/create-job"); 
    } else {
        navigate("/analyze");
    }
  };

  const logout = () => {
    localStorage.removeItem("role");
    setRole(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
