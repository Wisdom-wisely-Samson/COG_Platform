import { Router } from 'express';
import { login, getMe, forgotPassword, resetPassword, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login',           login);
router.get('/me',               protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password',  resetPassword);
router.post('/change-password', protect, changePassword);

export default router;
