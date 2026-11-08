import { Outlet } from "react-router";
import Navbar from "@/components/common/Navbar";
import { useIsFetching } from "@tanstack/react-query";
import ColdStartAlert from "@/components/common/ColdStartAlert";

const MainLayout = () => {
  const isFetching = useIsFetching();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-200">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ColdStartAlert isLoading={isFetching > 0} />
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
