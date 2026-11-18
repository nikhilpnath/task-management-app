import React from "react";

type TProp = {
  text: string;
  path?: string;
  btnText?: string;
  btnAction: () => void;
};

const ErrorCmp: React.FC<TProp> = ({ text, path, btnText = "Go Back", btnAction }) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-12 text-center transition-colors duration-150">
      <div className="space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-500 dark:text-slate-400 mb-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          {text}
        </h1>
        {path && (
          <p className="font-mono text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 px-3 py-1 rounded-md inline-block">
            {path}
          </p>
        )}
      </div>
      {btnText && btnAction && (
        <button
          type="button"
          onClick={btnAction}
          className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 px-5 text-sm font-semibold text-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors cursor-pointer"
        >
          {btnText}
        </button>
      )}
    </div>
  );
};

export default ErrorCmp;
