import { createBrowserRouter, Navigate } from "react-router";

import MainLayout from "@/layout/MainLayout";
import AuthLayout from "@/layout/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

import { lazyLoad } from "./LazyLoading";

// Lazy loaded page components
const LoginPage = lazyLoad("LoginPage");
const RegisterPage = lazyLoad("RegisterPage");
const DashboardPage = lazyLoad("DashboardPage");
const TasksPage = lazyLoad("TasksPage");
const CreateTaskPage = lazyLoad("CreateTaskPage");
const EditTaskPage = lazyLoad("EditTaskPage");
const NoRoute = lazyLoad("NoRoute");

// Helper component to redirect authenticated users away from auth pages
const LoginOrRedirect = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />;
};

const RegisterOrRedirect = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />;
};

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <LoginOrRedirect />,
      },
      {
        path: "/login",
        element: <Navigate to="/" replace />,
      },
      {
        path: "/register",
        element: <RegisterOrRedirect />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/tasks",
            element: <TasksPage />,
          },
          {
            path: "/tasks/new",
            element: <CreateTaskPage />,
          },
          {
            path: "/tasks/:taskId/edit", 
            element: <EditTaskPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NoRoute />,
  },
]);
