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
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 backdrop-blur-xl space-y-6 transition-colors duration-200">
      <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Status Grouping</h2>

      <div className="space-y-4">
        {/* To Do Progress */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span className="text-zinc-500 dark:text-zinc-400">To Do</span>
            <span className="text-zinc-600 dark:text-zinc-300">
              {todoCount} Tasks ({todoPercent})
            </span>
          </div>
          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-950 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800/80">
            <div className="h-full bg-zinc-400 dark:bg-zinc-500 rounded-full" style={{ width: `${todoPercent}%` }} />
          </div>
        </div>

        {/* In Progress Progress */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium text-indigo-600 dark:text-indigo-400">In Progress</span>
            <span className="text-indigo-600 dark:text-indigo-400">
              {inProgressCount} Tasks ({inProgressPercent})
            </span>
          </div>
          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-950 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800/80">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${inProgressPercent}%` }} />
          </div>
        </div>

        {/* Completed Progress */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium text-emerald-600 dark:text-emerald-400">Completed</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {completedCount} Tasks ({completedPercent})
            </span>
          </div>
          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-950 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800/80">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${completedPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusOverview;
