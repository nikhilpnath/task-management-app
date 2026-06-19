import { lazy, Suspense } from "react";

// Loading Fallback spinner
const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent"></div>
  </div>
);

// Map page imports for lazy loading
const pathToModuleMap = {
  LoginPage: () => import("@/pages/LoginPage"),
  RegisterPage: () => import("@/pages/RegisterPage"),
  DashboardPage: () => import("@/pages/DashboardPage"),
  TasksPage: () => import("@/pages/TasksPage"),
  CreateTaskPage: () => import("@/pages/CreateTaskPage"),
  EditTaskPage: () => import("@/pages/EditTaskPage"),
  NoRoute: () => import("@/pages/NoRoute"),
} as const;

type ComponentKey = keyof typeof pathToModuleMap;

export const lazyLoad = (
  path: ComponentKey,
  namedExport?: keyof Awaited<
    ReturnType<(typeof pathToModuleMap)[ComponentKey]>
  >
) => {
  const LazyComponent = lazy(() => {
    const promise = pathToModuleMap[path]();
    if (!namedExport) {
      return promise as Promise<{ default: React.ComponentType<any> }>;
    } else {
      return promise.then((module: any) => ({ default: module[namedExport] }));
    }
  });

  return function LazyWrapper() {
    return (
      <Suspense fallback={<PageLoader />}>
        <LazyComponent />
      </Suspense>
    );
  };
};
