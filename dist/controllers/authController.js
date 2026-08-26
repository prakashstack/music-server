"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
const env_1 = require("../config/env");
exports.authController = {
    googleCallback: (req, res) => {
        try {
            const user = req.user;
            if (!user) {
                return res.redirect(`${env_1.env.CLIENT_URL}/login?error=auth_failed`);
            }
            const token = (0, jwt_1.signToken)({ userId: user._id.toString(), email: user.email });
            res.cookie('token', token, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            return res.redirect(`${env_1.env.CLIENT_URL}/home`);
        }
        catch {
            return res.redirect(`${env_1.env.CLIENT_URL}/login?error=server_error`);
        }
    },
    getMe: (req, res) => {
        const user = req.user;
        return (0, response_1.sendSuccess)(res, {
            id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
        });
    },
    logout: (req, res) => {
        res.clearCookie('token');
        return (0, response_1.sendSuccess)(res, null, 'Logged out successfully');
    },
};
//# sourceMappingURL=authController.js.map