import { Router } from 'express';
import { getDepartments, createDepartment } from '../controllers/departmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/',  protect, getDepartments);
router.post('/', protect, authorize('SUPER_ADMIN'), createDepartment);

export default router;
