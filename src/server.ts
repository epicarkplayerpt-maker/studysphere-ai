import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import logger from './lib/logger';
import { authenticateToken } from './middleware/auth';

// Force load and override from local .env to bypass any system-wide environment variables
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
} else {
  dotenv.config();
}

// Verify critical environment keys at boot
const requiredEnvKeys = ['DATABASE_URL', 'GEMINI_API_KEY', 'PORT'];
const missingKeys = requiredEnvKeys.filter(key => !process.env[key]);
if (missingKeys.length > 0) {
  logger.error('CRITICAL: Boot process aborted. Missing environment variables: %s', missingKeys.join(', '));
  process.exit(1);
}

import authRouter from './routes/auth';
import studyRouter from './routes/study';
import chatRouter from './routes/chat';
import healthRouter from './routes/health';
import adminRouter from './routes/admin';

const app = express();
app.set('trust proxy', 1); // Required for Railway's reverse proxy so rate limiting uses real client IPs
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. Security Headers & CORS Configuration
// ==========================================
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://accounts.google.com", "https://apis.google.com", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net", "https://accounts.google.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net", "data:"],
        imgSrc: ["'self'", "data:", "http:", "https:", "blob:"],
        frameSrc: ["'self'", "https://accounts.google.com"],
        connectSrc: ["'self'", "https://oauth2.googleapis.com", "https://accounts.google.com", "https://generativelanguage.googleapis.com", "ws:", "wss:"],
        mediaSrc: ["'self'", "https://assets.mixkit.co", "data:", "blob:"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    }
  })
);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'https://studysphere-ai.up.railway.app',
      'https://studysphere-ai-production.up.railway.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173'
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked for origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
  })
);

// ==========================================
// 2. High Payload Body Parsers & Parsers
// ==========================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Serve static assets from fronted build output
app.use(express.static(path.join(__dirname, '../public')));

// Global state-based session parser
app.use(authenticateToken);

// ==========================================
// 3. Security Rate-Limiting Rules
// ==========================================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 login/auth requests per window
  standardHeaders: true,
  legacyHeaders: false,
  validate: { keyGeneratorIpFallback: false },
  message: { error: 'Too many authentication attempts. Please slow down.' },
});

const studyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // Limit each user to 200 API queries per window
  standardHeaders: true,
  legacyHeaders: false,
  validate: { keyGeneratorIpFallback: false },
  keyGenerator: (req: Request) => (req.user ? req.user.userId : req.ip || 'anonymous'),
  message: { error: 'Study service rate limit exceeded. Please try again later.' },
});

// ==========================================
// 4. API Gateways & Routing
// ==========================================
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/study', studyLimiter, studyRouter);
app.use('/api/chat', studyLimiter, chatRouter);
app.use('/api/admin', studyLimiter, adminRouter);
app.use('/api', healthRouter);

// Fallback for React Router (Express 5 wildcard routing compatibility)
app.get(/.*/, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ==========================================
// 5. Global Error Handling
// ==========================================
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled server error: %s', err.stack || err.message || err);
  res.status(500).json({ error: 'Internal Server Error. Processing halted safely.' });
});

// ==========================================
// 6. Guest Session Pruning Worker
// ==========================================
import prisma from './lib/prisma';

const pruneExpiredGuests = async () => {
  try {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 24); // 24 hours ago
    
    // Find guest users older than 24 hours
    const expiredGuests = await prisma.user.findMany({
      where: {
        email: {
          startsWith: 'guest-',
          endsWith: '@studysphere.local',
        },
        createdAt: {
          lt: cutoff,
        },
      },
      select: { id: true, email: true },
    });

    if (expiredGuests.length > 0) {
      const ids = expiredGuests.map(g => g.id);
      await prisma.user.deleteMany({
        where: { id: { in: ids } },
      });
      logger.info('Pruned %d expired guest users from database.', expiredGuests.length);
    }
  } catch (error: any) {
    logger.error('Error during expired guest pruning: %s', error.message);
  }
};

// Run pruning immediately on boot, and then hourly
pruneExpiredGuests();
setInterval(pruneExpiredGuests, 60 * 60 * 1000);

// ==========================================
// 7. Graceful Shutdown for Railway/Production
// ==========================================
const gracefulShutdown = async (signal: string) => {
  logger.info('Received %s signal. Starting graceful shutdown...', signal);
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start listening
app.listen(PORT, () => {
  logger.info('StudySphere AI server listening on http://localhost:%s', PORT);
});
