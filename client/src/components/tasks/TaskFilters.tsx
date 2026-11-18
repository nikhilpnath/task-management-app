import React from 'react';

interface TaskFiltersProps {
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  setPriorityFilter: (val: 'all' | 'low' | 'medium' | 'high') => void;
  sortBy: 'createdAt-desc' | 'createdAt-asc' | 'dueDate-asc' | 'dueDate-desc';
  setSortBy: (val: 'createdAt-desc' | 'createdAt-asc' | 'dueDate-asc' | 'dueDate-desc') => void;
  searchQuery?: string;
  setSearchQuery?: (val: string) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  searchQuery = '',
  setSearchQuery,
}) => {
  const isFiltered = priorityFilter !== 'all' || sortBy !== 'createdAt-desc' || searchQuery !== '';

  const handleReset = () => {
    setPriorityFilter('all');
    setSortBy('createdAt-desc');
    if (setSearchQuery) setSearchQuery('');
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
      
      {/* Search & Left Filters */}
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {setSearchQuery && (
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
          </div>
        )}

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-priority" className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Priority:
          </label>
          <select
            id="filter-priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
            className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors cursor-pointer"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Right: Sort and Reset */}
      <div className="flex items-center gap-3 justify-between sm:justify-end">
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-sort" className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="filter-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'createdAt-desc' | 'createdAt-asc' | 'dueDate-asc' | 'dueDate-desc')}
            className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors cursor-pointer"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Date (Earliest)</option>
            <option value="dueDate-desc">Due Date (Latest)</option>
          </select>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;