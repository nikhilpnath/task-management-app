import React from 'react';
import type { Task } from '@/store/slices/tasksSlice';
import TaskPriorityBadge from './TaskPriorityBadge';

interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDeleteClick: (id: string) => void;
  onStatusChange: (task: Task, newStatus: 'todo' | 'in-progress' | 'done') => void;
}

const TaskCard: React.FC<TaskCardProps> = React.memo(({ task, onEdit, onDeleteClick, onStatusChange }) => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isOverdue = task.dueDate && task.dueDate < todayStr;

  return (
    <div className="group relative flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/80 transition-all duration-200 shadow-sm text-zinc-900 dark:text-white">
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-semibold text-sm text-zinc-800 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white line-clamp-1">{task.title}</h4>
        <TaskPriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {task.dueDate && task.dueDate.trim() !== '' && (
        <div className="flex items-center gap-1.5 text-[11px] mt-3">
          <svg className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-500' : 'text-zinc-500 dark:text-zinc-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={isOverdue ? 'text-rose-500 font-semibold' : 'text-zinc-500 dark:text-zinc-500'}>
            {new Date(task.dueDate).toLocaleDateString()}
            {isOverdue && ' (Overdue)'}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800/40">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value as any)}
          className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task.id)}
            className="p-1 rounded-md text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDeleteClick(task.id)}
            className="p-1 rounded-md text-zinc-500 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/20 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

export default TaskCard;
