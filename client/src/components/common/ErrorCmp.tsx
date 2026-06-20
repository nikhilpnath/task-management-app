import React from "react";

type TProp = {
  text: string;
  path?: string;
  btnText?: string;
  btnAction: () => void;
};

const ErrorCmp: React.FC<TProp> = ({ text, path, btnText = "Go Back", btnAction }) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-12 text-center transition-colors duration-200">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          {text}
        </h1>
        {path && (
          <p className="font-mono text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 rounded-md inline-block">
            {path}
          </p>
        )}
      </div>
      {btnText && btnAction && (
        <button
          onClick={btnAction}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 px-6 font-medium text-sm text-white dark:text-zinc-900 shadow hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          {btnText}
        </button>
      )}
    </div>
  );
};

export default ErrorCmp;
