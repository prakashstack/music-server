"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationsController = void 0;
const recommendationService_1 = require("../services/recommendationService");
const response_1 = require("../utils/response");
exports.recommendationsController = {
    getSections: async (req, res) => {
        try {
            const user = req.user;
            const sections = user
                ? await recommendationService_1.recommendationService.getPersonalizedSections(user._id.toString())
                : await recommendationService_1.recommendationService.getGuestSections();
            return (0, response_1.sendSuccess)(res, sections);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
};
//# sourceMappingURL=recommendationsController.js.map