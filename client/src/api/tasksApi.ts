import { apiFetch } from './client';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: string;
  createdBy: string;
  createdAt: string;
}

export const fetchTasks = async (): Promise<Task[]> => {
  return apiFetch<Task[]>('/tasks');
};

export const createTask = async (
  taskData: Omit<Task, 'id' | 'createdAt' | 'createdBy'>
): Promise<Task> => {
  return apiFetch<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
};

export const updateTask = async (
  id: string,
  taskData: Partial<Task>
): Promise<Task> => {
  return apiFetch<Task>(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });
};

export const deleteTask = async (id: string): Promise<{ id: string }> => {
  return apiFetch<{ id: string }>(`/tasks/${id}`, {
    method: 'DELETE',
  });
};
