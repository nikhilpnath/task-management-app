import { Router } from 'express';
import authRoutes from './authRoutes';
import taskRoutes from './taskRoutes';
import { apiLimiter, authLimiter } from '../middleware/rateLimitMiddleware';

const router = Router();

// Authentication routes protected by the strict authLimiter
router.use('/auth', authLimiter, authRoutes);

// Task CRUD routes protected by the general apiLimiter
router.use('/tasks', apiLimiter, taskRoutes);

export default router;
