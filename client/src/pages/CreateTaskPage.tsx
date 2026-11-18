import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useCreateTask } from '@/hooks/useTasks';
import TaskForm from '@/components/tasks/TaskForm';
import type { TaskFormValues } from '@/components/tasks/TaskForm';

const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createTask, isPending } = useCreateTask();

  const onSubmit = (data: TaskFormValues) => {
    createTask(data, {
      onSuccess: () => {
        navigate('/tasks');
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/tasks" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          Tasks
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-slate-900 dark:text-white" aria-current="page">
          New Task
        </span>
      </nav>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs transition-colors duration-150">
        <header className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create New Task
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fill in the parameters below to publish a new task to your team board.
          </p>
        </header>

        <TaskForm
          onSubmit={onSubmit}
          isSubmitting={isPending}
          buttonLabel="Create Task"
          onCancel={() => navigate('/tasks')}
        />
      </div>
    </div>
  );
};

export default CreateTaskPage;
