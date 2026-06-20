import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];

  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value ?? defaultValue!;
};

export const env = {
  PORT: getEnvVar('PORT', '8000'),
  MONGO_URL: getEnvVar('MONGO_URL'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  CLIENT_URL: getEnvVar('CLIENT_URL', 'http://localhost:5173'),
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
};
