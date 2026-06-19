import React from 'react';

interface TaskStatusBadgeProps {
  status: 'todo' | 'in-progress' | 'done';
}

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${
        status === 'done'
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : status === 'in-progress'
          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
          : 'bg-zinc-700/10 text-zinc-400 border border-zinc-700/20'
      }`}
    >
      {status === 'done' ? 'Done' : status === 'in-progress' ? 'In Progress' : 'To Do'}
    </span>
  );
};

export default TaskStatusBadge;
