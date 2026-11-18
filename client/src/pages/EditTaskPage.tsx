import React from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useTasks, useUpdateTask } from '@/hooks/useTasks';
import TaskForm from '@/components/tasks/TaskForm';
import type { TaskFormValues } from '@/components/tasks/TaskForm';

const EditTaskPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { data: tasks = [], isLoading } = useTasks();
  const { mutate: updateTask, isPending } = useUpdateTask();

  const task = tasks.find((t) => t.id === taskId);

  const onSubmit = (data: TaskFormValues) => {
    if (task) {
      updateTask(
        { id: task.id, data },
        {
          onSuccess: () => {
            navigate('/tasks');
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-12 flex justify-center items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-600/30 border-t-indigo-600" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Task not found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This task does not exist or may have already been deleted.
        </p>
        <button
          type="button"
          onClick={() => navigate('/tasks')}
          className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white transition-colors"
        >
          Return to Board
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/tasks" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          Tasks
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-slate-900 dark:text-white" aria-current="page">
          Edit Task
        </span>
      </nav>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs transition-colors duration-150">
        <header className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Edit Task
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update task details, delivery date, priority, or execution status.
          </p>
        </header>

        <TaskForm
          onSubmit={onSubmit}
          defaultValues={{
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate || '',
          }}
          isSubmitting={isPending}
          buttonLabel="Save Changes"
          onCancel={() => navigate('/tasks')}
        />
      </div>
    </div>
  );
};

export default EditTaskPage;
