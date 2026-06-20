import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long'),
  email: z.string().trim().pipe(z.email('Please enter a valid email address')),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const loginSchema = z.object({
  email: z.string().trim().pipe(z.email('Please enter a valid email address')),
  password: z.string().min(1, 'Password is required'),
});

const taskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  dueDate: z.string().optional().refine((val) => {
    if (!val) return true;
    return !isNaN(Date.parse(val));
  }, {
    message: 'Please enter a valid due date',
  }),
});

export const validateRegister = (body: any) => {
  const result = registerSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map(issue => issue.message);
    return { isValid: false, errors };
  }
  return { isValid: true, errors: [] };
};

export const validateLogin = (body: any) => {
  const result = loginSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map(issue => issue.message);
    return { isValid: false, errors };
  }
  return { isValid: true, errors: [] };
};

export const validateTask = (body: any) => {
  const result = taskSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map(issue => issue.message);
    return { isValid: false, errors };
  }
  return { isValid: true, errors: [] };
};

const taskUpdateSchema = taskSchema.partial();

export const validateTaskUpdate = (body: any) => {
  const result = taskUpdateSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map(issue => issue.message);
    return { isValid: false, errors };
  }
  return { isValid: true, errors: [] };
};
