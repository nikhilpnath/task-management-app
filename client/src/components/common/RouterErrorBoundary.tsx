import React from 'react';
import { useRouteError } from 'react-router';
import ErrorCmp from './ErrorCmp';

const RouterErrorBoundary: React.FC = () => {
  const error = useRouteError();
  console.error("React Router caught an error:", error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white p-4 transition-colors duration-200">
      <ErrorCmp
        text="An unexpected application error occurred"
        btnText="Refresh Page"
        btnAction={() => window.location.reload()}
      />
    </div>
  );
};

export default RouterErrorBoundary;
