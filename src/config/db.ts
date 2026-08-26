import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<void> => {
  if (!env.MONGODB_URI) {
    console.warn('??  MONGODB_URI is not set in server/.env.');
    console.warn('?? Add your MongoDB connection string (e.g. MongoDB Atlas URI) to server/.env: MONGODB_URI=mongodb+srv://...');
    console.warn('??  Server running on port 5000 in offline-DB mode. Music streaming API is fully functional!');
    return;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      dbName: env.DB_NAME,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected (${env.DB_NAME}): ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`??  MongoDB connection error: Could not connect to ${env.MONGODB_URI}`);
    console.warn(`?? Please check your MONGODB_URI credentials or network connection.`);
    console.warn(`??  Server running on port ${env.PORT}. Music streaming API remains functional.`);
  }
};
