import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  isLoggedIn,
  isAuthChecking,
  redirectTo = "/",
  fallback = null,
  children,
}) {
  if (isAuthChecking) return fallback;
  return isLoggedIn ? children : <Navigate to={redirectTo} replace />;
}
