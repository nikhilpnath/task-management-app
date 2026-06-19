import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  // Simple check for presence of token in localStorage to guard routes.
  // If not authenticated, redirect to /login.
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
