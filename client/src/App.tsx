import React, { useEffect } from "react";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { store, useAppDispatch, useAppSelector } from "./store/store";
import { router } from "./routes/Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { login, logout } from "./store/slices/authSlice";
import { apiFetch } from "./api/client";
import ErrorBoundary from "./components/common/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable default refetching on window focus
      staleTime: 1000 * 60 * 2, // 2 minutes: instant tab switching from cache
      retry: 1,
    },
  },
});

const AuthInit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only verify with backend if the user is marked as authenticated
    if (!isAuthenticated) return;

    const checkAuth = async () => {
      try {
        const data = await apiFetch('/auth/me');
        dispatch(login({ user: data.user }));
      } catch (err: any) {
        if (err?.status === 401) {
          dispatch(logout());
        }
      }
    };
    checkAuth();
  }, [dispatch, isAuthenticated]);

  // Render children immediately without blocking!
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
