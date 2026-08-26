"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/env");
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const env_1 = require("./config/env");
process.on('unhandledRejection', (reason) => {
    console.warn('⚠️  Database / Network warning:', reason?.message || reason);
});
process.on('uncaughtException', (err) => {
    console.warn('⚠️  Network warning (suppressed):', err.message);
});
const start = async () => {
    await (0, db_1.connectDB)();
    app_1.default.listen(env_1.env.PORT, () => {
        console.log(`🚀 Resonance Server running on http://localhost:${env_1.env.PORT}`);
        console.log(`📡 Environment: ${env_1.env.NODE_ENV}`);
        console.log(`🎵 Music API: ${env_1.env.AUDIUS_API_URL}`);
    });
};
start().catch(console.error);
//# sourceMappingURL=server.js.map