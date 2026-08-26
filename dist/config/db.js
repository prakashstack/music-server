"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDB = async () => {
    if (!env_1.env.MONGODB_URI) {
        console.warn('??  MONGODB_URI is not set in server/.env.');
        console.warn('?? Add your MongoDB connection string (e.g. MongoDB Atlas URI) to server/.env: MONGODB_URI=mongodb+srv://...');
        console.warn('??  Server running on port 5000 in offline-DB mode. Music streaming API is fully functional!');
        return;
    }
    try {
        const conn = await mongoose_1.default.connect(env_1.env.MONGODB_URI, {
            dbName: env_1.env.DB_NAME,
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB connected (${env_1.env.DB_NAME}): ${conn.connection.host}`);
    }
    catch (error) {
        console.warn(`??  MongoDB connection error: Could not connect to ${env_1.env.MONGODB_URI}`);
        console.warn(`?? Please check your MONGODB_URI credentials or network connection.`);
        console.warn(`??  Server running on port ${env_1.env.PORT}. Music streaming API remains functional.`);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map