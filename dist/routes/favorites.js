"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favoritesController_1 = require("../controllers/favoritesController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', favoritesController_1.favoritesController.getFavorites);
router.post('/:songId', favoritesController_1.favoritesController.addFavorite);
router.delete('/:songId', favoritesController_1.favoritesController.removeFavorite);
router.get('/check/:songId', favoritesController_1.favoritesController.checkFavorite);
exports.default = router;
//# sourceMappingURL=favorites.js.map