import React from 'react';

interface TaskPriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
}

const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({ priority }) => {
  return (
    <span
      className={`px-1.5 py-0.5 text-[10px] font-bold rounded capitalize border ${
        priority === 'high'
          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          : priority === 'medium'
          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
      }`}
    >
      {priority}
    </span>
  );
};

export default TaskPriorityBadge;
