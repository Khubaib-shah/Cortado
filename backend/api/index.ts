import express from 'express';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from '../src/middleware/cors';
import { authenticateToken } from '../src/middleware/auth';
import { errorHandler, notFoundHandler } from '../src/middleware/errorHandler';
import { connectDB } from '../src/config/db';
import { seedDatabase } from '../src/lib/seed';
import apiRoutes from '../src/routes/index';

const app = express();

app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect DB on each cold start (cached via isConnected flag)
app.use(async (_req, res, next) => {
  try {
    await connectDB();
    await seedDatabase();
    next();
  } catch (err) {
    console.error('DB error in serverless handler:', err);
    res.status(500).json({ error: 'Database connection failed.' });
  }
});

app.use(authenticateToken);
app.use('/api', apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
