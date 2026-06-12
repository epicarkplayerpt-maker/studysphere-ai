import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import logger from '../lib/logger';
import { checkAuthRequired } from '../middleware/auth';

const router = Router();

// Enforce authentication on all admin endpoints
router.use(checkAuthRequired);

/**
 * Middleware to restrict access to Admins only
 */
function checkAdminAccess(req: Request, res: Response, next: any) {
  if (!req.user || req.user.email.toLowerCase() !== 'epicarkplayerpt@gmail.com') {
    logger.warn('Forbidden admin metrics access attempt by user: %s', req.user?.email || 'anonymous');
    res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    return;
  }
  next();
}

/**
 * @route GET /api/admin/metrics
 * @desc Get real-time PostgreSQL database usage metrics, session logs, and token usage
 */
router.get('/metrics', checkAdminAccess, async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Fetch user counts (Registered vs Guest)
    const totalUsers = await prisma.user.count();
    const guestUsers = await prisma.user.count({
      where: {
        email: {
          startsWith: 'guest-',
          endsWith: '@studysphere.local'
        }
      }
    });
    const registeredUsers = totalUsers - guestUsers;

    // 2. Fetch active sessions (updated within the last 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const activeSessions = await prisma.session.findMany({
      where: {
        lastActiveAt: {
          gte: fifteenMinutesAgo
        }
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        lastActiveAt: 'desc'
      }
    });

    const activeSessionLogs = activeSessions.map(session => {
      const isGuest = session.user.email.startsWith('guest-') && session.user.email.endsWith('@studysphere.local');
      return {
        id: session.id,
        email: isGuest ? 'Guest User' : session.user.email,
        ipAddress: session.ipAddress || 'unknown',
        userAgent: session.userAgent ? session.userAgent.split(' ')[0] : 'unknown', // keep short for dashboard layout
        activeSeconds: session.activeSeconds,
        lastActiveAt: session.lastActiveAt,
        createdAt: session.createdAt
      };
    });

    // 3. Fetch token usage metrics
    const tokenUsages = await prisma.tokenUsage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;
    let totalTokens = 0;
    const actionBreakdown: Record<string, { prompt: number, completion: number, total: number, count: number }> = {};

    tokenUsages.forEach(usage => {
      totalPromptTokens += usage.promptTokens;
      totalCompletionTokens += usage.completionTokens;
      totalTokens += usage.totalTokens;

      const act = usage.action || 'Unknown';
      if (!actionBreakdown[act]) {
        actionBreakdown[act] = { prompt: 0, completion: 0, total: 0, count: 0 };
      }
      actionBreakdown[act].prompt += usage.promptTokens;
      actionBreakdown[act].completion += usage.completionTokens;
      actionBreakdown[act].total += usage.totalTokens;
      actionBreakdown[act].count += 1;
    });

    // 4. Fetch personal token metrics for the current admin (for comparison)
    const personalUsages = await prisma.tokenUsage.findMany({
      where: { userId: req.user!.userId }
    });
    let personalTokens = 0;
    personalUsages.forEach(pu => {
      personalTokens += pu.totalTokens;
    });

    res.json({
      metrics: {
        users: {
          total: totalUsers,
          registered: registeredUsers,
          guest: guestUsers
        },
        sessions: {
          activeCount: activeSessions.length,
          logs: activeSessionLogs
        },
        tokens: {
          totalPromptTokens,
          totalCompletionTokens,
          totalTokens,
          actionBreakdown
        },
        personal: {
          tokens: personalTokens
        }
      }
    });
  } catch (error: any) {
    logger.error('Failed to fetch admin metrics: %s', error.stack || error.message);
    res.status(500).json({ error: 'Failed to compile database metrics.' });
  }
});

export default router;
