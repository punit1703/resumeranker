import { Navigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

export default function PublicRoute({ children }) {
  const { role } = useAuth();

  if (role === "candidate") {
    return <Navigate to="/analyze" replace />;
  }
  
  if (role === "company") {
    return <Navigate to="/rank" replace />;
  }

  return children;
}
