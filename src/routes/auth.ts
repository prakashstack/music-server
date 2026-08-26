import { Router } from 'express';
import passport from 'passport';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/google', authLimiter, passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), authController.googleCallback);
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authController.logout);

export default router;
