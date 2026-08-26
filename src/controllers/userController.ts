import { Request, Response } from 'express';
import { UserPreferencesModel } from '../models/UserPreferences';
import { preferencesService } from '../services/preferencesService';
import { sendSuccess, sendError } from '../utils/response';

export const userController = {
  getProfile: (req: Request, res: Response) => {
    const user = (req as any).user;
    return sendSuccess(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    });
  },

  getPreferences: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user._id;
      const prefs = await preferencesService.getUserPreferences(userId.toString());
      return sendSuccess(res, prefs || {});
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },
};
