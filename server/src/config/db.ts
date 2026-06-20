import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async () => {
  try {
    const connUri = env.MONGO_URL;
    const conn = await mongoose.connect(connUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
};
