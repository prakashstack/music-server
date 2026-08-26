import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env';
import { UserModel } from '../models/User';

import mongoose from 'mongoose';

const googleClientId = env.GOOGLE_CLIENT_ID || 'placeholder_google_client_id';
const googleClientSecret = env.GOOGLE_CLIENT_SECRET || 'placeholder_google_client_secret';

if (!env.GOOGLE_CLIENT_ID) {
  console.warn('⚠️  GOOGLE_CLIENT_ID is not set in server/.env. Google OAuth login will require setting valid credentials.');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || '';
        if (mongoose.connection.readyState === 1) {
          let user = await UserModel.findOne({ googleId: profile.id });
          if (!user) {
            user = await UserModel.create({
              googleId: profile.id,
              name: profile.displayName,
              email,
              profileImage: profile.photos?.[0]?.value || '',
              lastLoginAt: new Date(),
            });
          } else {
            user.lastLoginAt = new Date();
            await user.save();
          }
          return done(null, user);
        } else {
          // DB offline -> return in-memory user
          const mockUser: any = {
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
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
