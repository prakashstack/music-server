"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const User_1 = require("../models/User");
const response_1 = require("../utils/response");
const mongoose_1 = __importDefault(require("mongoose"));
const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies?.token ||
            req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            (0, response_1.sendError)(res, 'Unauthorized', 401);
            return;
        }
        const payload = (0, jwt_1.verifyToken)(token);
        if (mongoose_1.default.connection.readyState === 1) {
            const user = await User_1.UserModel.findById(payload.userId);
            if (!user) {
                (0, response_1.sendError)(res, 'User not found', 401);
                return;
            }
            req.user = user;
        }
        else {
            req.user = {
                _id: payload.userId,
                name: payload.email?.split('@')[0] || 'User',
                email: payload.email,
                profileImage: '',
                createdAt: new Date(),
                lastLoginAt: new Date(),
            };
        }
        next();
    }
    catch {
        (0, response_1.sendError)(res, 'Invalid or expired token', 401);
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map