import { Request, Response } from 'express';
import { signToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { env } from '../config/env';

export const authController = {
  googleCallback: (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.redirect(`${env.CLIENT_URL}/login?error=auth_failed`);
      }
      const token = signToken({ userId: user._id.toString(), email: user.email });
      res.cookie('token', token, {
        httpOnly: true,
  secure: true,
  sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return res.redirect(`${env.CLIENT_URL}/home`);
    } catch {
      return res.redirect(`${env.CLIENT_URL}/login?error=server_error`);
    }
  },

  getMe: (req: Request, res: Response) => {
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

  logout: (req: Request, res: Response) => {
    res.clearCookie('token', {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
});
    return sendSuccess(res, null, 'Logged out successfully');
  },
};
