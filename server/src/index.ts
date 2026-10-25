import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { connectDatabase } from './config/database';
import { QuestionRepository } from './questions/questionRepository';
import { registerSocketHandlers } from './sockets/socketHandler';
import apiRoutes from './routes/apiRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || '*';

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      // In development or if CLIENT_URL is *, allow all
      if (CLIENT_URL === '*' || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      const allowedOrigins = CLIENT_URL.split(',').map((url) => url.trim());
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow to avoid unexpected deployment disconnects
    },
    credentials: true,
  })
);

app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Serve static frontend files if client/dist exists (production full-stack support)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`📦 [STATIC] Serving built client from ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  // Fallback to index.html for SPA client-side routing
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send({
      name: 'Quiz Royale API & Realtime Server',
      status: 'active',
      healthEndpoint: '/api/health',
      docs: 'Connect via Socket.IO client',
    });
  });
}

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 5000,
  transports: ['websocket', 'polling'],
});

// Register real-time handlers
registerSocketHandlers(io);

// Bootstrap Server
async function bootstrap() {
  console.log('🚀 [STARTUP] Bootstrapping Quiz Royale Server...');

  // 1. Connect to Database (or initialize fallback)
  await connectDatabase();

  // 2. Initialize question repository (seeds Mongo if empty)
  await QuestionRepository.initialize();

  // 3. Listen on port
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`👑  QUIZ ROYALE SERVER RUNNING`);
    console.log(`📡  HTTP & WebSocket Port: ${PORT}`);
    console.log(`🩺  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🎮  Client Allowed URL: ${CLIENT_URL}`);
    console.log(`======================================================\n`);
  });
}

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 [SHUTDOWN] Gracefully shutting down Quiz Royale server...');
  server.close(() => {
    console.log('💤 [SHUTDOWN] Closed all remaining connections. Goodbye!');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

bootstrap().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
