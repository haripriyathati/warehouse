import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, user, allowedRoles }) {
  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "kirana" ? "/" : "/"} />;
  }

  return children;
}