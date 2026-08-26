import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UserModel } from '../models/User';
import { sendError } from '../utils/response';

import mongoose from 'mongoose';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const payload = verifyToken(token);

    if (mongoose.connection.readyState === 1) {
      const user = await UserModel.findById(payload.userId);
      if (!user) {
        sendError(res, 'User not found', 401);
        return;
      }
      (req as any).user = user;
    } else {
      (req as any).user = {
        _id: payload.userId,
        name: payload.email?.split('@')[0] || 'User',
        email: payload.email,
        profileImage: '',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };
    }

    next();
  } catch {
    sendError(res, 'Invalid or expired token', 401);
  }
};
