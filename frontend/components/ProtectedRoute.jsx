import { Navigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { role } = useAuth();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "candidate") {
      return <Navigate to="/analyze" replace />;
    } else if (role === "company") {
      return <Navigate to="/rank" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
