import React from 'react';
import { useNavigate } from 'react-router';
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
    <div className="p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-8 backdrop-blur-xl transition-colors duration-200">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Create New Task
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Fill in the information to publish a new task to your board.</p>
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
