import React from 'react';
import { useNavigate, useParams } from 'react-router';
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
      <div className="p-6 flex justify-center items-center min-h-[300px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600/30 border-t-indigo-600" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-center space-y-4">
          <p className="text-zinc-500 dark:text-zinc-400">Task not found or has been deleted.</p>
          <button
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors text-sm font-semibold text-white"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-8 backdrop-blur-xl transition-colors duration-200">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Edit Task
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Modify the existing task parameters.</p>
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
