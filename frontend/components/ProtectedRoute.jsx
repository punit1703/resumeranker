import { Navigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { role } = useAuth();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
