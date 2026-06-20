import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes';
import errorHandler from './middleware/errorMiddleware';
import { env } from './config/env';
import { CorsOptions } from 'cors';

const app = express();

// Security Middleware
app.use(helmet());
app.disable('x-powered-by');

// CORS configuration using CLIENT_URL from environment variables
const corsOptions: CorsOptions = {
  origin: [env.CLIENT_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Cookie & Body Parsers
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount all API routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
