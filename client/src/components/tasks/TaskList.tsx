import React from 'react';
import type { Task } from '@/api/tasksApi';
import TaskCard from './TaskCard';

interface TaskListProps {
  title: string;
  taskList: Task[];
  columnColor: string;
  onEdit: (id: string) => void;
  onDeleteClick: (id: string) => void;
  onStatusChange: (task: Task, newStatus: 'todo' | 'in-progress' | 'done') => void;
}

const TaskList: React.FC<TaskListProps> = ({
  title,
  taskList,
  columnColor,
  onEdit,
  onDeleteClick,
  onStatusChange,
}) => {
  return (
    <div className="flex flex-col bg-zinc-100/40 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 h-fit">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800/50">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${columnColor}`} />
          <h3 className="text-base font-semibold text-zinc-700 dark:text-zinc-200">{title}</h3>
        </div>
        <span className="bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 text-xs font-semibold rounded-full text-zinc-500 dark:text-zinc-400">
          {taskList.length}
        </span>
      </div>

      <div className="space-y-4 flex-1">
        {taskList.length === 0 ? (
          <div className="h-32 flex items-center justify-center border border-dashed border-zinc-300 dark:border-zinc-800/60 rounded-xl text-xs text-zinc-400 dark:text-zinc-600">
            No tasks here
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
    </div>
  );
};

export default TaskList;
