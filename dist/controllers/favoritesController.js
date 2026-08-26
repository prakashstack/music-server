"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoritesController = void 0;
const Favorite_1 = require("../models/Favorite");
const response_1 = require("../utils/response");
const mongoose_1 = __importDefault(require("mongoose"));
exports.favoritesController = {
    getFavorites: async (req, res) => {
        try {
            if (mongoose_1.default.connection.readyState !== 1)
                return (0, response_1.sendSuccess)(res, []);
            const userId = req.user._id;
            const favorites = await Favorite_1.FavoriteModel.find({ userId }).sort({ createdAt: -1 });
            return (0, response_1.sendSuccess)(res, favorites.map((f) => ({ ...f.songData, _favoriteId: f._id, favoritedAt: f.createdAt })));
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
    addFavorite: async (req, res) => {
        try {
            if (mongoose_1.default.connection.readyState !== 1)
                return (0, response_1.sendSuccess)(res, null, 'Added to favorites (offline)');
            const userId = req.user._id;
            const { songId } = req.params;
            const { songData } = req.body;
            const existing = await Favorite_1.FavoriteModel.findOne({ userId, songId });
            if (existing)
                return (0, response_1.sendSuccess)(res, existing, 'Already in favorites');
            const favorite = await Favorite_1.FavoriteModel.create({ userId, songId, songData: songData || {} });
            return (0, response_1.sendSuccess)(res, favorite, 'Added to favorites', 201);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
    removeFavorite: async (req, res) => {
        try {
            if (mongoose_1.default.connection.readyState !== 1)
                return (0, response_1.sendSuccess)(res, null, 'Removed from favorites');
            const userId = req.user._id;
            const { songId } = req.params;
            await Favorite_1.FavoriteModel.deleteOne({ userId, songId });
            return (0, response_1.sendSuccess)(res, null, 'Removed from favorites');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
    checkFavorite: async (req, res) => {
        try {
            if (mongoose_1.default.connection.readyState !== 1)
                return (0, response_1.sendSuccess)(res, { isFavorite: false });
            const userId = req.user._id;
            const { songId } = req.params;
            const favorite = await Favorite_1.FavoriteModel.findOne({ userId, songId });
            return (0, response_1.sendSuccess)(res, { isFavorite: !!favorite });
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
};
//# sourceMappingURL=favoritesController.js.map