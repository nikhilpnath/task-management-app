import React from 'react';

interface TaskFiltersProps {
  statusFilter: 'all' | 'todo' | 'in-progress' | 'done';
  setStatusFilter: (val: 'all' | 'todo' | 'in-progress' | 'done') => void;
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  setPriorityFilter: (val: 'all' | 'low' | 'medium' | 'high') => void;
  sortBy: 'createdAt-desc' | 'createdAt-asc' | 'dueDate-asc' | 'dueDate-desc';
  setSortBy: (val: 'createdAt-desc' | 'createdAt-asc' | 'dueDate-asc' | 'dueDate-desc') => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 mb-8 transition-colors duration-200">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-500">Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-500">Priority Filter</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-500">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
        >
          <option value="createdAt-desc">Newest Created First</option>
          <option value="createdAt-asc">Oldest Created First</option>
          <option value="dueDate-asc">Due Date (Ascending)</option>
          <option value="dueDate-desc">Due Date (Descending)</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
