import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  // Role string ("candidate" or "company")
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || null);
  
  // Stored resume file to use everywhere
  const [globalResume, setGlobalResume] = useState(null);
  
  // Stored candidate name
  const [candidateName, setCandidateName] = useState(() => localStorage.getItem("candidateName") || "");

  const login = (selectedRole, currentToken, currentUserId, storedFile = null, name = "") => {
    setRole(selectedRole);
    setToken(currentToken);
    setUserId(currentUserId);
    localStorage.setItem("role", selectedRole);
    localStorage.setItem("token", currentToken);
    localStorage.setItem("userId", currentUserId);
    if (name) {
      setCandidateName(name);
      localStorage.setItem("candidateName", name);
    }
    if (storedFile) {
        setGlobalResume(storedFile);
    }
  };

  const logout = () => {
    setRole(null);
    setToken(null);
    setUserId(null);
    setGlobalResume(null);
    setCandidateName("");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("candidateName");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ role, token, userId, login, logout, globalResume, setGlobalResume, candidateName, setCandidateName }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
