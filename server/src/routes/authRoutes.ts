import { Router } from 'express';
import { registerUser, loginUser, getMe, logoutUser } from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getMe);
router.post('/logout', logoutUser);

export default router;
