import React from 'react';

interface StatusOverviewProps {
  todoCount: number;
  inProgressCount: number;
  completedCount: number;
  todoPercent: number;
  inProgressPercent: number;
  completedPercent: number;
}

const StatusOverview: React.FC<StatusOverviewProps> = ({
  todoCount,
  inProgressCount,
  completedCount,
  todoPercent,
  inProgressPercent,
  completedPercent,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6 transition-colors duration-150">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Status Breakdown
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {todoCount + inProgressCount + completedCount} Total
        </span>
      </div>

      <div className="space-y-4">
        {/* Completed Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Completed
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-tabular font-medium">
              {completedCount} tasks ({completedPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${completedPercent}%` }}
            />
          </div>
        </div>

        {/* In Progress Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="text-indigo-700 dark:text-indigo-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" aria-hidden="true" />
              In Progress
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-tabular font-medium">
              {inProgressCount} tasks ({inProgressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${inProgressPercent}%` }}
            />
          </div>
        </div>

        {/* To Do Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" aria-hidden="true" />
              To Do
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-tabular font-medium">
              {todoCount} tasks ({todoPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-400 dark:bg-slate-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${todoPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusOverview;
