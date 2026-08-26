import { Router } from 'express';
import { recommendationsController } from '../controllers/recommendationsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Optional auth - works for both guests and authenticated users
router.get('/sections', (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    return authenticate(req, res, () => recommendationsController.getSections(req, res));
  }
  return recommendationsController.getSections(req, res);
});

export default router;
