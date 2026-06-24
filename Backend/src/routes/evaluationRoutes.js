import { Router } from 'express';
import { evaluateTask } from '../controllers/evaluationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.post('/:taskId', evaluateTask);

export default router;
