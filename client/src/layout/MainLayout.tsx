import { Outlet } from "react-router";
import Navbar from "@/components/common/Navbar";
import { useIsFetching } from "@tanstack/react-query";
import ColdStartAlert from "@/components/common/ColdStartAlert";

const MainLayout = () => {
  const isFetching = useIsFetching();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-50 transition-colors duration-150">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ColdStartAlert isLoading={isFetching > 0} />
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
