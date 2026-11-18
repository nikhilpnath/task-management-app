import React from 'react';
import { Link } from 'react-router';
import { useAppSelector } from '@/store/store';
import { useTasks } from '@/hooks/useTasks';
import SummaryCard from '@/components/dashboard/SummaryCard';
import StatusOverview from '@/components/dashboard/StatusOverview';
import TaskPriorityBadge from '@/components/tasks/TaskPriorityBadge';
import TaskStatusBadge from '@/components/tasks/TaskStatusBadge';

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: tasks = [], isLoading, error } = useTasks();

  // Filter tasks belonging to the logged-in user (case-insensitive)
  const userTasks = tasks.filter(
    (t) => t.createdBy.toLowerCase() === user?.email?.toLowerCase()
  );

  const totalTasks = userTasks.length;
  const completedTasksCount = userTasks.filter((t) => t.status === 'done').length;
  const inProgressTasksCount = userTasks.filter((t) => t.status === 'in-progress').length;
  const todoTasksCount = userTasks.filter((t) => t.status === 'todo').length;

  // Calculate overdue tasks count (due date is before today, and status is NOT done)
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const overdueTasksCount = userTasks.filter((t) => {
    if (!t.dueDate || t.dueDate.trim() === '' || t.status === 'done') return false;
    return t.dueDate < todayStr;
  }).length;

  // Calculate percentages for progress bars
  const completedPercent = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
  const inProgressPercent = totalTasks > 0 ? Math.round((inProgressTasksCount / totalTasks) * 100) : 0;
  const todoPercent = totalTasks > 0 ? Math.round((todoTasksCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Overview of your project telemetry, metrics, and active task progress.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <span>Open Board</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            to="/tasks/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-sm font-semibold text-white transition-colors shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Task</span>
          </Link>
        </div>
      </div>

      {error ? (
        <div className="p-8 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-center text-rose-600 dark:text-rose-400 text-sm">
          Error loading dashboard metrics: {error.message}
        </div>
      ) : isLoading ? (
        <div className="space-y-8">
          {/* Skeleton Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/30 animate-pulse p-5"
              />
            ))}
          </div>
          {/* Skeleton Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/30 animate-pulse p-6" />
            <div className="lg:col-span-2 h-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/30 animate-pulse p-6" />
          </div>
        </div>
      ) : (
        <>
          {/* Executive Telemetry Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Tasks"
              value={totalTasks}
              subtext={`${completedTasksCount} completed`}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            />
            <SummaryCard
              title="Overdue Tasks"
              value={overdueTasksCount}
              subtext={overdueTasksCount > 0 ? "Requires attention" : "All deadlines on schedule"}
              textColor={overdueTasksCount > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}
              borderColor={overdueTasksCount > 0 ? "border-rose-200 dark:border-rose-900/60" : "border-slate-200 dark:border-slate-800"}
              bgColor={overdueTasksCount > 0 ? "bg-rose-50/50 dark:bg-rose-950/20" : "bg-white dark:bg-slate-900"}
              icon={
                <svg className={`w-5 h-5 ${overdueTasksCount > 0 ? 'text-rose-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <SummaryCard
              title="Completed"
              value={completedTasksCount}
              subtext={`${completedPercent}% completion rate`}
              textColor="text-emerald-600 dark:text-emerald-400"
              icon={
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <SummaryCard
              title="In Progress"
              value={inProgressTasksCount}
              subtext={`${inProgressPercent}% of active load`}
              textColor="text-indigo-600 dark:text-indigo-400"
              icon={
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
          </div>

          {/* Breakdown & Active Feed Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Breakdown Matrix */}
            <StatusOverview
              todoCount={todoTasksCount}
              inProgressCount={inProgressTasksCount}
              completedCount={completedTasksCount}
              todoPercent={todoPercent}
              inProgressPercent={inProgressPercent}
              completedPercent={completedPercent}
            />

            {/* Task Priority & Workload Feed */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between transition-colors duration-150">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      Tasks & Priorities
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Recent assignments and delivery targets
                    </p>
                  </div>
                  <Link
                    to="/tasks"
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
                  >
                    <span>View all ({totalTasks})</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {userTasks.map((task) => {
                    const isOverdue = Boolean(task.dueDate && task.dueDate < todayStr && task.status !== 'done');
                    return (
                      <Link
                        key={task.id}
                        to="/tasks"
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800/70 hover:border-indigo-300 dark:hover:border-indigo-700/60 hover:shadow-xs transition-all"
                      >
                        <div className="space-y-1 overflow-hidden flex-1 min-w-0">
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate block transition-colors">
                            {task.title}
                          </span>
                          {task.dueDate && task.dueDate.trim() !== '' && (
                            <div className="flex items-center gap-1 text-[11px] pl-0.5">
                              <svg
                                className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span
                                className={`font-medium ${
                                  isOverdue
                                    ? 'text-rose-600 dark:text-rose-400 font-semibold'
                                    : 'text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                {isOverdue && ' (Overdue)'}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <TaskPriorityBadge priority={task.priority} />
                          <TaskStatusBadge status={task.status} />
                          <svg className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    );
                  })}

                  {userTasks.length === 0 && (
                    <div className="text-center py-12 px-4 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        No tasks created yet
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        Get started by adding tasks to your board to track your project progress.
                      </p>
                      <Link
                        to="/tasks/new"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition-colors"
                      >
                        + Create Your First Task
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
