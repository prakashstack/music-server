import { Router } from 'express';
import { musicController } from '../controllers/musicController';
import { searchLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/trending', musicController.getTrending);
router.get('/new-releases', musicController.getNewReleases);
router.get('/search', searchLimiter, musicController.search);
router.get('/genres', musicController.getGenres);
router.get('/genre/:genre', musicController.getGenreSongs);
router.get('/stream/:id', musicController.streamSong);
router.get('/song/:id', musicController.getSong);
router.get('/album/:id', musicController.getAlbum);
router.get('/artist/:id', musicController.getArtist);
router.get('/lyrics/:id', musicController.getLyrics);

export default router;
