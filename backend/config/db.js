import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedInMemoryStore } from './inMemoryStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  try {
    if (!uri) throw new Error('MONGODB_URI not defined in environment variables');
    console.log(`[MongoDB Connection Attempt]: Connecting to database...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // 5 seconds connection timeout
    });
    console.log(`[MongoDB Connected Successfully]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Notice]: Database connection failed (${error.message}).`);
    console.log(`[RAILOPT Engine]: Activating In-Memory High-Performance Simulation Store (520+ Tasks, 500+ Trains, 50+ Corridors ready).`);
    seedInMemoryStore();
    return null;
  }
};

export default connectDB;
