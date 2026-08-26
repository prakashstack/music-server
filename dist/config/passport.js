"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
const User_1 = require("../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const googleClientId = env_1.env.GOOGLE_CLIENT_ID || 'placeholder_google_client_id';
const googleClientSecret = env_1.env.GOOGLE_CLIENT_SECRET || 'placeholder_google_client_secret';
if (!env_1.env.GOOGLE_CLIENT_ID) {
    console.warn('⚠️  GOOGLE_CLIENT_ID is not set in server/.env. Google OAuth login will require setting valid credentials.');
}
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: env_1.env.GOOGLE_CALLBACK_URL,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value || '';
        if (mongoose_1.default.connection.readyState === 1) {
            let user = await User_1.UserModel.findOne({ googleId: profile.id });
            if (!user) {
                user = await User_1.UserModel.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email,
                    profileImage: profile.photos?.[0]?.value || '',
                    lastLoginAt: new Date(),
                });
            }
            else {
                user.lastLoginAt = new Date();
                await user.save();
            }
            return done(null, user);
        }
        else {
            // DB offline -> return in-memory user
            const mockUser = {
                _id: '650000000000000000000001',
                googleId: profile.id,
                name: profile.displayName,
                email,
                profileImage: profile.photos?.[0]?.value || '',
                createdAt: new Date(),
                lastLoginAt: new Date(),
            };
            return done(null, mockUser);
        }
    }
    catch (err) {
        return done(err);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id.toString());
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.UserModel.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map