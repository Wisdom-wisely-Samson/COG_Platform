import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleActive,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

// All user routes require authentication
router.use(protect);

router.get('/',           authorize('SUPER_ADMIN', 'DEPARTMENT_HEAD'), getUsers);
router.post('/',          authorize('SUPER_ADMIN'), createUser);
router.put('/:id',        authorize('SUPER_ADMIN'), updateUser);
router.delete('/:id',     authorize('SUPER_ADMIN'), deleteUser);
router.patch('/:id/active', authorize('SUPER_ADMIN'), toggleActive);

export default router;
