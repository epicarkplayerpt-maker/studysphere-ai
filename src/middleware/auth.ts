import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import logger from '../lib/logger';

/**
 * Middleware to verify stateful session tokens from HTTP-only cookies.
 */
export async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.session_token;

  if (!token) {
    next();
    return;
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    const isLocal = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
    const clearOptions = {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && !isLocal,
      sameSite: isLocal ? 'lax' : 'strict',
    } as const;

    if (!session) {
      res.clearCookie('session_token', clearOptions);
      next();
      return;
    }

    // Check if session has expired
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { token } }).catch(() => {});
      res.clearCookie('session_token', clearOptions);
      next();
      return;
    }

    const isGuest = session.user.email.startsWith('guest-') && session.user.email.endsWith('@studysphere.local');

    req.user = {
      userId: session.user.id,
      email: session.user.email,
      name: isGuest ? 'Guest User' : session.user.email.split('@')[0],
      isGuest,
    };

    next();
  } catch (error) {
    logger.error('Session authentication error: %s', error);
    next();
  }
}

/**
 * Middleware to enforce authentication on specific endpoints.
 */
export function checkAuthRequired(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required. Please sign in or continue as Guest.' });
    return;
  }
  next();
}
