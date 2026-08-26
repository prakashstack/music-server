import { Request, Response } from 'express';
import { PlayHistoryModel } from '../models/PlayHistory';
import { SearchHistoryModel } from '../models/SearchHistory';
import { preferencesService } from '../services/preferencesService';
import { classifySearchIntent } from '../integrations/gemini/client';
import { sendSuccess, sendError } from '../utils/response';

import mongoose from 'mongoose';

export const historyController = {
  getPlayHistory: async (req: Request, res: Response) => {
    try {
      if (mongoose.connection.readyState !== 1) return sendSuccess(res, []);
      const userId = (req as any).user._id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = 20;
      const history = await PlayHistoryModel.find({ userId })
        .sort({ playedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      return sendSuccess(res, history);
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  recordPlay: async (req: Request, res: Response) => {
    try {
      if (mongoose.connection.readyState !== 1) return sendSuccess(res, null, 'Play recorded (offline)');
      const userId = (req as any).user._id;
      const { songId, songData, completionPercentage = 0 } = req.body;
      if (!songId) return sendError(res, 'songId is required', 400);
      await PlayHistoryModel.create({ userId, songId, songData: songData || {}, completionPercentage });
      if (songData) {
        preferencesService.updateFromPlay(userId.toString(), songData, completionPercentage).catch(console.error);
      }
      return sendSuccess(res, null, 'Play recorded');
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  getSearchHistory: async (req: Request, res: Response) => {
    try {
      if (mongoose.connection.readyState !== 1) return sendSuccess(res, []);
      const userId = (req as any).user._id;
      const history = await SearchHistoryModel.find({ userId })
        .sort({ searchedAt: -1 })
        .limit(20);
      return sendSuccess(res, history);
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },

  recordSearch: async (req: Request, res: Response) => {
    try {
      const { query } = req.body;
      if (!query?.trim()) return sendError(res, 'query is required', 400);
      const intent = await classifySearchIntent(query);
      if (mongoose.connection.readyState === 1) {
        const userId = (req as any).user._id;
        await SearchHistoryModel.create({
          userId,
          query: query.trim(),
          category: intent.category,
          metadata: intent,
        });
        preferencesService.updateFromSearch(userId.toString(), query.trim(), intent).catch(console.error);
      }
      return sendSuccess(res, { intent });
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },
};
