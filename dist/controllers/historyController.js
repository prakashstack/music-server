"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyController = void 0;
const PlayHistory_1 = require("../models/PlayHistory");
const SearchHistory_1 = require("../models/SearchHistory");
const preferencesService_1 = require("../services/preferencesService");
const client_1 = require("../integrations/gemini/client");
const response_1 = require("../utils/response");
const mongoose_1 = __importDefault(require("mongoose"));
exports.historyController = {
    getPlayHistory: async (req, res) => {
        try {
            if (mongoose_1.default.connection.readyState !== 1)
                return (0, response_1.sendSuccess)(res, []);
            const userId = req.user._id;
            const page = parseInt(req.query.page) || 1;
            const limit = 20;
            const history = await PlayHistory_1.PlayHistoryModel.find({ userId })
                .sort({ playedAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);
            return (0, response_1.sendSuccess)(res, history);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
    recordPlay: async (req, res) => {
        try {
            if (mongoose_1.default.connection.readyState !== 1)
                return (0, response_1.sendSuccess)(res, null, 'Play recorded (offline)');
            const userId = req.user._id;
            const { songId, songData, completionPercentage = 0 } = req.body;
            if (!songId)
                return (0, response_1.sendError)(res, 'songId is required', 400);
            await PlayHistory_1.PlayHistoryModel.create({ userId, songId, songData: songData || {}, completionPercentage });
            if (songData) {
                preferencesService_1.preferencesService.updateFromPlay(userId.toString(), songData, completionPercentage).catch(console.error);
            }
            return (0, response_1.sendSuccess)(res, null, 'Play recorded');
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
    getSearchHistory: async (req, res) => {
        try {
            if (mongoose_1.default.connection.readyState !== 1)
                return (0, response_1.sendSuccess)(res, []);
            const userId = req.user._id;
            const history = await SearchHistory_1.SearchHistoryModel.find({ userId })
                .sort({ searchedAt: -1 })
                .limit(20);
            return (0, response_1.sendSuccess)(res, history);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
    recordSearch: async (req, res) => {
        try {
            const { query } = req.body;
            if (!query?.trim())
                return (0, response_1.sendError)(res, 'query is required', 400);
            const intent = await (0, client_1.classifySearchIntent)(query);
            if (mongoose_1.default.connection.readyState === 1) {
                const userId = req.user._id;
                await SearchHistory_1.SearchHistoryModel.create({
                    userId,
                    query: query.trim(),
                    category: intent.category,
                    metadata: intent,
                });
                preferencesService_1.preferencesService.updateFromSearch(userId.toString(), query.trim(), intent).catch(console.error);
            }
            return (0, response_1.sendSuccess)(res, { intent });
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
};
//# sourceMappingURL=historyController.js.map