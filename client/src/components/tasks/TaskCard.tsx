import React, { useState, useEffect, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Task } from '@/api/tasksApi';
import TaskPriorityBadge from './TaskPriorityBadge';

interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDeleteClick: (id: string) => void;
  onStatusChange: (task: Task, newStatus: 'todo' | 'in-progress' | 'done') => void;
}

const TaskCard: React.FC<TaskCardProps> = React.memo(({ task, onEdit, onDeleteClick, onStatusChange }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  // Suppress overdue alarm if task is already completed
  const isOverdue = Boolean(task.dueDate && task.dueDate < todayStr && task.status !== 'done');

  useEffect(() => {
    setIsExpanded(false);
  }, [task.description]);

  useEffect(() => {
    const el = descriptionRef.current;
    if (el) {
      if (!isExpanded) {
        setHasOverflow(el.scrollHeight > el.clientHeight);
      }
    }
  }, [task.description, isExpanded]);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : undefined,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col rounded-lg border bg-white dark:bg-slate-900 p-4 transition-all duration-150 text-slate-900 dark:text-slate-100 shadow-xs ${
        isDragging
          ? 'opacity-50 ring-2 ring-indigo-500/40 shadow-xl border-indigo-500 scale-[1.02]'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
      }`}
    >
      {/* Title & Priority Header with Drag Grip */}
      <div className="flex justify-between items-start gap-2.5">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <div
            {...listeners}
            {...attributes}
            className="text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mt-0.5 shrink-0 cursor-grab active:cursor-grabbing p-1 -m-1 touch-none"
            title="Drag card to move between columns"
            aria-label="Drag card handle"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="5" cy="4" r="1.5" />
              <circle cx="11" cy="4" r="1.5" />
              <circle cx="5" cy="8" r="1.5" />
              <circle cx="11" cy="8" r="1.5" />
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="11" cy="12" r="1.5" />
            </svg>
          </div>
          <h4
            onClick={() => onEdit(task.id)}
            className="font-semibold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex-1"
            title="Click to view or edit task"
          >
            {task.title}
          </h4>
        </div>
        <div className="shrink-0">
          <TaskPriorityBadge priority={task.priority} />
        </div>
      </div>

      {/* Description with Expand/Collapse */}
      {task.description && (
        <div className="mt-2.5">
          <p
            ref={descriptionRef}
            className={`text-xs text-slate-600 dark:text-slate-400 leading-relaxed ${
              isExpanded ? 'line-clamp-none' : 'line-clamp-3'
            }`}
          >
            {task.description}
          </p>
          {hasOverflow && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mt-1 focus-visible:outline-none focus-visible:underline transition-colors cursor-pointer"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {/* Due Date Indicator */}
      {task.dueDate && task.dueDate.trim() !== '' && (
        <div className="flex items-center gap-1.5 text-xs mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <svg
            className={`w-3.5 h-3.5 shrink-0 ${isOverdue ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span
            className={`font-tabular ${
              isOverdue
                ? 'text-rose-600 dark:text-rose-400 font-semibold text-[11px]'
                : 'text-slate-500 dark:text-slate-400 text-[11px]'
            }`}
          >
            {(() => {
              const parts = task.dueDate.split('-');
              if (parts.length === 3) {
                const [y, m, d] = parts;
                return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString();
              }
              return new Date(task.dueDate).toLocaleDateString();
            })()}
            {isOverdue && ' (Overdue)'}
          </span>
        </div>
      )}

      {/* Footer Controls: Status Dropdown & Action Buttons */}
      <div className="flex items-center justify-between gap-2 mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value as 'todo' | 'in-progress' | 'done')}
          aria-label={`Change status for task: ${task.title}`}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors cursor-pointer"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(task.id)}
            className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors cursor-pointer"
            title="Edit Task"
            aria-label={`Edit task: ${task.title}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          
          <button
            type="button"
            onClick={() => onDeleteClick(task.id)}
            className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-colors cursor-pointer"
            title="Delete Task"
            aria-label={`Delete task: ${task.title}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

export default TaskCard;
