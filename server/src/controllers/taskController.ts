import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/taskService';
import { createError } from '../utils/errors';

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401);
    }

    const tasks = await taskService.getTasksForUser(req.user.email);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401);
    }

    const task = await taskService.createTaskForUser(req.body, req.user.email);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401);
    }

    const task = await taskService.updateTaskForUser(req.params.id as string, req.body, req.user.email);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw createError('User not authenticated', 401);
    }

    const result = await taskService.deleteTaskForUser(req.params.id as string, req.user.email);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
