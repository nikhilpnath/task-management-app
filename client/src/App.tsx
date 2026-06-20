import React, { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { store, useAppDispatch } from "./store/store";
import { router } from "./routes/Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { login, logout } from "./store/slices/authSlice";
import { apiFetch } from "./api/client";
import ErrorBoundary from "./components/common/ErrorBoundary";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable default refetching on window focus
      retry: 1,
    },
  },
});

const AuthInit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await apiFetch('/auth/me');
        dispatch(login({ user: data.user }));
      } catch (err) {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600/30 border-t-indigo-600" />
      </div>
    );
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInit>
          <ErrorBoundary>
            <RouterProvider router={router} />
          </ErrorBoundary>
        </AuthInit>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
