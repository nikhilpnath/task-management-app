import { Outlet } from "react-router";
import ThemeToggle from "@/components/common/ThemeToggle";

const AuthLayout = () => {
  return (
    <main className="relative min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-50 transition-colors duration-150 flex flex-col justify-center">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xs" />
      </div>
      <Outlet />
    </main>
  );
};

export default AuthLayout;
