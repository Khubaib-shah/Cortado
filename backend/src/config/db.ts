import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(env.MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('✓ MongoDB connected');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    throw error;
  }
}
