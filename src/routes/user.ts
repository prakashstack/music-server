import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/profile', userController.getProfile);
router.get('/preferences', userController.getPreferences);

export default router;
