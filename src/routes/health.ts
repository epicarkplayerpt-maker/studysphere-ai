import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import logger from '../lib/logger';

const router = Router();

router.get('/health', async (req: Request, res: Response): Promise<void> => {
  const dbHealthy = await prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false);

  if (!dbHealthy) {
    logger.error('Health check failed: database unreachable');
  }

  const statusCode = dbHealthy ? 200 : 503;
  res.status(statusCode).json({
    status: dbHealthy ? 'ok' : 'degraded',
    dbHealthy,
    database: dbHealthy ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
