"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const musicController_1 = require("../controllers/musicController");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
router.get('/trending', musicController_1.musicController.getTrending);
router.get('/new-releases', musicController_1.musicController.getNewReleases);
router.get('/search', rateLimiter_1.searchLimiter, musicController_1.musicController.search);
router.get('/genres', musicController_1.musicController.getGenres);
router.get('/genre/:genre', musicController_1.musicController.getGenreSongs);
router.get('/stream/:id', musicController_1.musicController.streamSong);
router.get('/song/:id', musicController_1.musicController.getSong);
router.get('/album/:id', musicController_1.musicController.getAlbum);
router.get('/artist/:id', musicController_1.musicController.getArtist);
router.get('/lyrics/:id', musicController_1.musicController.getLyrics);
exports.default = router;
//# sourceMappingURL=music.js.map