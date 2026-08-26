import './config/env';
import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

process.on('unhandledRejection', (reason: any) => {
  console.warn('⚠️  Database / Network warning:', reason?.message || reason);
});

process.on('uncaughtException', (err: Error) => {
  console.warn('⚠️  Network warning (suppressed):', err.message);
});

const start = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`🚀 Resonance Server running on http://localhost:${env.PORT}`);
    console.log(`📡 Environment: ${env.NODE_ENV}`);
    console.log(`🎵 Music API: ${env.AUDIUS_API_URL}`);
  });
};

start().catch(console.error);
