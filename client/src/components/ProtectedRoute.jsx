import { Navigate } from "react-router-dom";


export default function ProtectedRoute({ children, user, allowedRoles }) {
  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "kirana" ? "/" : "/"} />;
  }

  return children;
}