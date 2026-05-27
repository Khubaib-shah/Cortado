'use strict';
import 'dotenv/config';
import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './src/middleware/cors';
import { authenticateToken } from './src/middleware/auth';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler';
import { connectDB } from './src/config/db';
import { seedDatabase } from './src/lib/seed';
import { initSocket } from './src/lib/socket';
import apiRoutes from './src/routes/index';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Connect DB + seed
  await connectDB();
  await seedDatabase();

  // Init Socket.IO on the HTTP server
  initSocket(httpServer);

  // Middleware stack
  app.use(corsMiddleware);
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(authenticateToken);

  // API routes
  app.use('/api', apiRoutes);

  // 404 + error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Cortado backend running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
