import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasksApi';
import type { Task } from '../api/tasksApi';

export const useTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<Task, Error, Omit<Task, 'id' | 'createdAt' | 'createdBy'>>({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<Task, Error, { id: string; data: Partial<Task> }>({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation<{ id: string }, Error, string>({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
