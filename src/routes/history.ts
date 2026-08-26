import { Router } from 'express';
import { historyController } from '../controllers/historyController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/plays', historyController.getPlayHistory);
router.post('/plays', historyController.recordPlay);
router.get('/searches', historyController.getSearchHistory);
router.post('/searches', historyController.recordSearch);

export default router;
