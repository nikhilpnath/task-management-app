import React from 'react';

interface TaskPriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
}

const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({ priority }) => {
  const styles = {
    high: {
      wrapper: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60',
      dot: 'bg-rose-500',
    },
    medium: {
      wrapper: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60',
      dot: 'bg-amber-500',
    },
    low: {
      wrapper: 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      dot: 'bg-slate-400 dark:bg-slate-500',
    },
  }[priority];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full capitalize border transition-colors ${styles.wrapper}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      <span>{priority}</span>
    </span>
  );
};

export default TaskPriorityBadge;
