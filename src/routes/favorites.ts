import { Router } from 'express';
import { favoritesController } from '../controllers/favoritesController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', favoritesController.getFavorites);
router.post('/:songId', favoritesController.addFavorite);
router.delete('/:songId', favoritesController.removeFavorite);
router.get('/check/:songId', favoritesController.checkFavorite);

export default router;
