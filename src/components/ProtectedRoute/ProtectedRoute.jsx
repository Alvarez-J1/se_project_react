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
}

//   if (!isLoggedIn) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// }
