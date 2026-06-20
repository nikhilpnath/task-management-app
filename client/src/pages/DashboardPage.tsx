import React from 'react';
import { useAppSelector } from '@/store/store';
import { useTasks } from '@/hooks/useTasks';
import SummaryCard from '@/components/dashboard/SummaryCard';
import StatusOverview from '@/components/dashboard/StatusOverview';
import TaskPriorityBadge from '@/components/tasks/TaskPriorityBadge';

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
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`; // "YYYY-MM-DD" in local timezone
  const overdueTasksCount = userTasks.filter((t) => {
    if (!t.dueDate || t.dueDate.trim() === '' || t.status === 'done') return false;
    return t.dueDate < todayStr;
  }).length;

  // Calculate percentages for progress bars
  const completedPercent = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
  const inProgressPercent = totalTasks > 0 ? Math.round((inProgressTasksCount / totalTasks) * 100) : 0;
  const todoPercent = totalTasks > 0 ? Math.round((todoTasksCount / totalTasks) * 100) : 0;

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[300px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600/30 border-t-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-rose-500">
        Error loading dashboard metrics: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 transition-colors duration-200">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Overview of your task metrics and progress.</p>
      </header>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Total Tasks" value={totalTasks} />
        <SummaryCard
          title="Overdue Tasks"
          value={overdueTasksCount}
          textColor="text-red-600 dark:text-red-400"
          borderColor="border-red-200 dark:border-red-500/20"
          bgColor="bg-red-50 dark:bg-red-950/10"
        />
        <SummaryCard title="Completed" value={completedTasksCount} textColor="text-emerald-600 dark:text-emerald-400" />
        <SummaryCard title="In Progress" value={inProgressTasksCount} textColor="text-indigo-600 dark:text-indigo-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Grouping Breakdown */}
        <StatusOverview
          todoCount={todoTasksCount}
          inProgressCount={inProgressTasksCount}
          completedCount={completedTasksCount}
          todoPercent={todoPercent}
          inProgressPercent={inProgressPercent}
          completedPercent={completedPercent}
        />

        {/* Task List with Priority Visual Indicators */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 backdrop-blur-xl transition-colors duration-200">
          <h2 className="text-xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">Tasks & Priorities</h2>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {userTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/50 pb-3 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium block">{task.title}</span>
                  {task.dueDate && task.dueDate.trim() !== '' && (
                    <span className={`text-[11px] font-medium block ${
                      task.dueDate < todayStr ? 'text-red-600 dark:text-red-400' : 'text-zinc-500'
                    }`}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                      {task.dueDate < todayStr && ' (Overdue)'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Priority indicator */}
                  <TaskPriorityBadge priority={task.priority} />

                  {/* Status indicator */}
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${
                    task.status === 'done' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    task.status === 'in-progress' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                    'bg-zinc-100 dark:bg-zinc-800/30 text-zinc-600 dark:text-zinc-400'
                  }`}>
                    {task.status === 'done' ? 'Done' : task.status === 'in-progress' ? 'In Progress' : 'To Do'}
                  </span>
                </div>
              </div>
            ))}

            {userTasks.length === 0 && (
              <div className="text-sm text-zinc-500 text-center py-8">No tasks created yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
