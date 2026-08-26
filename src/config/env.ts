import dotenv from 'dotenv';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || process.env.DATABASE_URL || '',
  DB_NAME: process.env.DB_NAME || 'resonance',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || `http://localhost:${process.env.PORT || '5000'}/api/auth/google/callback`,
  JWT_SECRET: process.env.JWT_SECRET || 'resonance-jwt-secret-change-in-production',
  SESSION_SECRET: process.env.SESSION_SECRET || 'resonance-session-secret-change-in-production',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  AUDIUS_API_URL: process.env.AUDIUS_API_URL || 'https://api.audius.co/v1',
  AUDIUS_APP_NAME: process.env.AUDIUS_APP_NAME || 'resonance',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
};
