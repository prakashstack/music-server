"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const historyController_1 = require("../controllers/historyController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/plays', historyController_1.historyController.getPlayHistory);
router.post('/plays', historyController_1.historyController.recordPlay);
router.get('/searches', historyController_1.historyController.getSearchHistory);
router.post('/searches', historyController_1.historyController.recordSearch);
exports.default = router;
//# sourceMappingURL=history.js.map