import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/store/store";

const ProtectedRoute = () => {
  // Check Redux auth state to guard routes.
  // If not authenticated, redirect to /login (which is "/" route).
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
