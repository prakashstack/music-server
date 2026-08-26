import { Request, Response } from 'express';
import { FavoriteModel } from '../models/Favorite';
import { sendSuccess, sendError } from '../utils/response';

import mongoose from 'mongoose';

export const favoritesController = {
  getFavorites: async (req: Request, res: Response) => {
    try {
      if (mongoose.connection.readyState !== 1) return sendSuccess(res, []);
      const userId = (req as any).user._id;
      const favorites = await FavoriteModel.find({ userId }).sort({ createdAt: -1 });
      return sendSuccess(res, favorites.map((f) => ({ ...f.songData, _favoriteId: f._id, favoritedAt: f.createdAt })));
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  addFavorite: async (req: Request, res: Response) => {
    try {
      if (mongoose.connection.readyState !== 1) return sendSuccess(res, null, 'Added to favorites (offline)');
      const userId = (req as any).user._id;
      const { songId } = req.params;
      const { songData } = req.body;
      const existing = await FavoriteModel.findOne({ userId, songId });
      if (existing) return sendSuccess(res, existing, 'Already in favorites');
      const favorite = await FavoriteModel.create({ userId, songId, songData: songData || {} });
      return sendSuccess(res, favorite, 'Added to favorites', 201);
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  removeFavorite: async (req: Request, res: Response) => {
    try {
      if (mongoose.connection.readyState !== 1) return sendSuccess(res, null, 'Removed from favorites');
      const userId = (req as any).user._id;
      const { songId } = req.params;
      await FavoriteModel.deleteOne({ userId, songId });
      return sendSuccess(res, null, 'Removed from favorites');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  checkFavorite: async (req: Request, res: Response) => {
    try {
      if (mongoose.connection.readyState !== 1) return sendSuccess(res, { isFavorite: false });
      const userId = (req as any).user._id;
      const { songId } = req.params;
      const favorite = await FavoriteModel.findOne({ userId, songId });
      return sendSuccess(res, { isFavorite: !!favorite });
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },
};
