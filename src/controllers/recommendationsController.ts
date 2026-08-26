import { Request, Response } from 'express';
import { recommendationService } from '../services/recommendationService';
import { sendSuccess, sendError } from '../utils/response';

export const recommendationsController = {
  getSections: async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const sections = user
        ? await recommendationService.getPersonalizedSections(user._id.toString())
        : await recommendationService.getGuestSections();
      return sendSuccess(res, sections);
    } catch (err: any) {
      return sendError(res, err.message);
    }
  },
};
