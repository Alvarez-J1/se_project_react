import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  isLoggedIn,
  isAuthChecking,
  redirectTo = "/",
  fallback = null,
  children,
}) {
  if (isAuthChecking) return fallback ?? null;
  return isLoggedIn ? children : <Navigate to={redirectTo} replace />;
  // replace means it won’t keep the current URL in history, so the user can’t hit “back” and end up on a protected page again.
}
