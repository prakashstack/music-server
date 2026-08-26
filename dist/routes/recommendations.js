"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recommendationsController_1 = require("../controllers/recommendationsController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Optional auth - works for both guests and authenticated users
router.get('/sections', (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
    if (token) {
        return (0, auth_1.authenticate)(req, res, () => recommendationsController_1.recommendationsController.getSections(req, res));
    }
    return recommendationsController_1.recommendationsController.getSections(req, res);
});
exports.default = router;
//# sourceMappingURL=recommendations.js.map