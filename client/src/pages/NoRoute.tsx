import React from 'react';

const NoRoute: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white p-4 transition-colors duration-200">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-extrabold tracking-widest text-indigo-500">404</h1>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm rounded-lg inline-block text-zinc-500 dark:text-zinc-400 transition-colors duration-200">
          Page Not Found
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NoRoute;
