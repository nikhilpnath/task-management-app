import { Outlet } from "react-router";
import ThemeToggle from "@/components/common/ThemeToggle";

const AuthLayout = () => {
  return (
    <main className="relative min-h-screen">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur shadow-sm" />
      </div>
      <Outlet />
    </main>
  );
};

export default AuthLayout;
