import { Navigate } from "react-router-dom";
import { useApp } from "../state/AppContext.jsx";

const ProtectedRoute = ({ children, roles }) => {
  const { state } = useApp();
  if (!state.authUser) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(state.authUser.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

export default ProtectedRoute;
