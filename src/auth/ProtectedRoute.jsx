import { Navigate, useLocation } from "react-router-dom";
import LoadingState from "../components/feedback/LoadingState";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isLoading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState text="Bejelentkezési állapot ellenőrzése..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && user?.role_name !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
