"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const preferencesService_1 = require("../services/preferencesService");
const response_1 = require("../utils/response");
exports.userController = {
    getProfile: (req, res) => {
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
    getPreferences: async (req, res) => {
        try {
            const userId = req.user._id;
            const prefs = await preferencesService_1.preferencesService.getUserPreferences(userId.toString());
            return (0, response_1.sendSuccess)(res, prefs || {});
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
};
//# sourceMappingURL=userController.js.map