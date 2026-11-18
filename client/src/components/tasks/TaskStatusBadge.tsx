import React from 'react';

interface TaskStatusBadgeProps {
  status: 'todo' | 'in-progress' | 'done';
}

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  const config = {
    done: {
      label: 'Done',
      wrapper: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60',
      dot: 'bg-emerald-500',
    },
    'in-progress': {
      label: 'In Progress',
      wrapper: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/60',
      dot: 'bg-indigo-500',
    },
    todo: {
      label: 'To Do',
      wrapper: 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      dot: 'bg-slate-400 dark:bg-slate-500',
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border transition-colors ${config.wrapper}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};

export default TaskStatusBadge;
