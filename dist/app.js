"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const passport_1 = __importDefault(require("./config/passport"));
const env_1 = require("./config/env");
const rateLimiter_1 = require("./middleware/rateLimiter");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = __importDefault(require("./routes/auth"));
const music_1 = __importDefault(require("./routes/music"));
const favorites_1 = __importDefault(require("./routes/favorites"));
const history_1 = __importDefault(require("./routes/history"));
const recommendations_1 = __importDefault(require("./routes/recommendations"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
// Security
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use((0, cors_1.default)({
    origin: env_1.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Logging
if (env_1.env.NODE_ENV !== 'test')
    app.use((0, morgan_1.default)('dev'));
// Session (for Passport)
app.use((0, express_session_1.default)({
    secret: env_1.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: env_1.env.MONGODB_URI ? connect_mongo_1.default.create({
        clientPromise: mongoose_1.default.connection.asPromise().then((m) => m.getClient()),
    }) : undefined,
    cookie: { secure: env_1.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 },
}));
// Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Rate limiting
app.use(rateLimiter_1.generalLimiter);
// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
// Routes
app.use('/auth', auth_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/music', music_1.default);
app.use('/api/favorites', favorites_1.default);
app.use('/api/history', history_1.default);
app.use('/api/recommendations', recommendations_1.default);
app.use('/api/user', user_1.default);
// 404 handler
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
// Error handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map