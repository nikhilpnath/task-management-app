import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import ErrorCmp from '@/components/common/ErrorCmp';

const NoRoute: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white p-4 transition-colors duration-200">
      <ErrorCmp
        text="Oops! We couldn't find the page"
        path={location.pathname}
        btnText="Go Back"
        btnAction={() => navigate(-1)}
      />
    </div>
  );
};

export default NoRoute;
