import Task from '../models/Task';
import { validateTask } from '../validators';
import { createError } from '../utils/errors';

export const getTasksForUser = async (email: string) => {
  return await Task.find({ createdBy: email.toLowerCase() })
    .sort({ createdAt: -1 });
};

export const createTaskForUser = async (body: any, email: string) => {
  const { isValid, errors } = validateTask(body);
  if (!isValid) {
    throw createError(errors.join(', '), 400);
  }

  const { title, description, priority, status, dueDate } = body;

  return await Task.create({
    title,
    description,
    priority,
    status,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    createdBy: email.toLowerCase(),
  });
};

export const updateTaskForUser = async (id: string, body: any, email: string) => {
  const { isValid, errors } = validateTask(body);
  if (!isValid) {
    throw createError(errors.join(', '), 400);
  }

  const task = await Task.findById(id);
  if (!task) {
    throw createError('Task not found', 404);
  }

  // Restrict update to creator
  if (task.createdBy !== email.toLowerCase()) {
    throw createError('Access denied. You can only modify tasks you created.', 403);
  }

  const { title, description, priority, status, dueDate } = body;

  task.title = title;
  task.description = description;
  task.priority = priority || task.priority;
  task.status = status || task.status;
  task.dueDate = dueDate ? new Date(dueDate) : undefined;

  await task.save();
  return task;
};

export const deleteTaskForUser = async (id: string, email: string) => {
  const task = await Task.findById(id);
  if (!task) {
    throw createError('Task not found', 404);
  }

  // Restrict delete to creator
  if (task.createdBy !== email.toLowerCase()) {
    throw createError('Access denied. You can only delete tasks you created.', 403);
  }

  await Task.findByIdAndDelete(id);
  return { id };
};
