import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Task } from '@/api/tasksApi';
import TaskCard from './TaskCard';

interface TaskListProps {
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  taskList: Task[];
  columnColor: string;
  onEdit: (id: string) => void;
  onDeleteClick: (id: string) => void;
  onStatusChange: (task: Task, newStatus: 'todo' | 'in-progress' | 'done') => void;
  onCreateQuickTask?: (title: string, status: 'todo' | 'in-progress' | 'done') => void;
  isCreating?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  title,
  status,
  taskList,
  columnColor,
  onEdit,
  onDeleteClick,
  onStatusChange,
  onCreateQuickTask,
  isCreating = false,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const [isAdding, setIsAdding] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');

  const handleSubmitQuickAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickTitle.trim() || !onCreateQuickTask) return;
    onCreateQuickTask(quickTitle.trim(), status);
    setQuickTitle('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitQuickAdd();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setQuickTitle('');
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border transition-all duration-150 p-4 h-fit min-h-0 md:min-h-[420px] ${
        isOver
          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/30'
          : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-slate-200 dark:border-slate-800">
        <span className={`w-2.5 h-2.5 rounded-full ${columnColor}`} aria-hidden="true" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {title}
        </h3>
        <span className="font-tabular bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold rounded-full text-slate-600 dark:text-slate-400">
          {taskList.length}
        </span>
      </div>

      {/* Task Cards Container */}
      <div className="space-y-3 flex-1 min-h-[80px]">
        {taskList.length === 0 ? (
          <div className="h-28 flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-700/80 rounded-lg p-4 text-center transition-colors">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              No tasks in {title}
            </span>
          </div>
        ) : (
          taskList.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDeleteClick={onDeleteClick}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>

      {/* Inline Quick Add Form or Trigger Button */}
      {onCreateQuickTask && (
        <div className="mt-3 pt-2">
          {isAdding ? (
            <div className="rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 p-2.5 shadow-sm space-y-2">
              <input
                type="text"
                autoFocus
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Task title (press Enter to save)..."
                disabled={isCreating}
                className="w-full text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-slate-900 dark:text-white placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Enter to save · Esc to cancel
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setQuickTitle('');
                    }}
                    className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmitQuickAdd()}
                    disabled={!quickTitle.trim() || isCreating}
                    className="px-2.5 py-1 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white rounded shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {isCreating ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add task</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;
