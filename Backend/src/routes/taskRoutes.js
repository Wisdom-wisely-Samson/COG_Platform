import { Router } from 'express';
import { createTask, getTasks, updateTaskStatus, deleteTask } from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(protect);

router.get('/',    getTasks);
router.post('/',   authorize('SUPER_ADMIN', 'DEPARTMENT_HEAD', 'TEAM_MEMBER'), upload.array('files', 10), createTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', authorize('SUPER_ADMIN', 'DEPARTMENT_HEAD'), deleteTask);

export default router;
