import { Navigate } from "react-router-dom";

function ProtectedRoute({ currentUser, allowedRole, children }) {
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (currentUser.role !== allowedRole) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return children;
}

export default ProtectedRoute;
