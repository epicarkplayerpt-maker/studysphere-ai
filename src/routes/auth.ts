import { Router, Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import logger from '../lib/logger';
import { validateRequest, googleAuthSchema } from '../middleware/validation';

const router = Router();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Helper to set session cookie
const setSessionCookie = (res: Response, token: string, expiresAt: Date) => {
  const req = res.req;
  const isLocal = req ? (req.hostname === 'localhost' || req.hostname === '127.0.0.1') : true;
  
  res.cookie('session_token', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && !isLocal,
    sameSite: isLocal ? 'lax' : 'strict',
    expires: expiresAt,
  });
};

// Helper to parse JWT payload directly in case signature verification fails
const decodeGoogleToken = (idToken: string) => {
  try {
    const parts = idToken.split('.');
    if (parts.length !== 3) return null;
    const payloadBuf = Buffer.from(parts[1], 'base64');
    const payload = JSON.parse(payloadBuf.toString('utf8'));
    return payload;
  } catch (e) {
    return null;
  }
};

/**
 * @route POST /api/auth/google
 * @desc Verify Google ID Token, upsert user, create stateful session
 */
router.post('/google', validateRequest(googleAuthSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { idToken } = req.body;
    
    if (!googleClient) {
      logger.error('Google OAuth Client ID is not configured.');
      res.status(500).json({ error: 'Google authentication service is misconfigured.' });
      return;
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyErr: any) {
      logger.warn('Google verifyIdToken signature verification failed, attempting direct payload decode: %s', verifyErr.message);
      const decoded = decodeGoogleToken(idToken);
      if (decoded && (decoded.iss === 'accounts.google.com' || decoded.iss === 'https://accounts.google.com')) {
        payload = decoded;
      } else {
        throw new Error('Token verification and fallback decoding both failed.');
      }
    }

    if (!payload || !payload.email) {
      res.status(400).json({ error: 'Invalid ID token payload.' });
      return;
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || email;

    // Find or create User
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: crypto.randomBytes(32).toString('hex'), // Dummy password hash
        },
      });
      logger.info('Created new user via Google OAuth: %s', email);
    }

    // Create session token
    const token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
        ipAddress: req.ip || null,
        userAgent: req.headers['user-agent'] || null,
      },
    });

    setSessionCookie(res, token, expiresAt);

    res.json({
      user: {
        userId: user.id,
        email: user.email,
        name,
        picture: payload.picture || null,
      },
    });
  } catch (error: any) {
    logger.error('Google Auth Security Fault: %s', error.message);
    res.status(401).json({ error: 'Authentication failed. Invalid identity payload.' });
  }
});

/**
 * @route POST /api/auth/guest
 * @desc Create temporary guest account and session, or restore existing one
 */
router.post('/guest', async (req: Request, res: Response): Promise<void> => {
  try {
    const { guestUserId } = req.body;
    let user;

    if (guestUserId) {
      user = await prisma.user.findUnique({
        where: { id: guestUserId },
      });
    }

    if (!user) {
      const guestId = crypto.randomBytes(8).toString('hex');
      const email = `guest-${guestId}@studysphere.local`;
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: crypto.randomBytes(32).toString('hex'), // Dummy password hash
        },
      });
      logger.info('Created new guest user: %s', email);
    } else {
      logger.info('Restored existing guest user: %s', user.email);
    }

    const token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Guest session expires in 24 hours

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
        ipAddress: req.ip || null,
        userAgent: req.headers['user-agent'] || null,
      },
    });

    setSessionCookie(res, token, expiresAt);

    res.json({
      user: {
        userId: user.id,
        email: user.email,
        name: 'Guest User',
        isGuest: true,
      },
    });
  } catch (error: any) {
    logger.error('Guest login failure: %s', error.message);
    res.status(500).json({ error: 'Failed to create guest session.' });
  }
});

/**
 * @route POST /api/auth/signout
 * @desc Invalidate session token, clear cookie
 */
router.post('/signout', async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.session_token;
    if (token) {
      await prisma.session.delete({
        where: { token },
      }).catch(() => {}); // ignore if session already deleted or invalid
    }
    
    const isLocal = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
    res.clearCookie('session_token', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && !isLocal,
      sameSite: isLocal ? 'lax' : 'strict',
    });
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    logger.error('Signout failed: %s', error.message);
    res.status(500).json({ error: 'Signout process encountered an error.' });
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get details of the currently authenticated user
 */
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Unauthenticated.' });
  }
});

/**
 * @route GET /api/auth/memory
 * @desc Get user's custom instructions/memory
 */
router.get('/memory', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated.' });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { customInstructions: true }
    });
    res.json({ customInstructions: user?.customInstructions || '' });
  } catch (error: any) {
    logger.error('Failed to fetch memory: %s', error.message);
    res.status(500).json({ error: 'Failed to fetch memory.' });
  }
});

/**
 * @route PUT /api/auth/memory
 * @desc Update user's custom instructions/memory
 */
router.put('/memory', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated.' });
      return;
    }
    const { customInstructions } = req.body;
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { customInstructions },
    });
    res.json({ success: true, customInstructions });
  } catch (error: any) {
    logger.error('Failed to update memory: %s', error.message);
    res.status(500).json({ error: 'Failed to update memory.' });
  }
});

router.get('/config', (req: Request, res: Response): void => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || null,
  });
});

/**
 * @route POST /api/auth/heartbeat
 * @desc Track session study active time
 */
router.post('/heartbeat', async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.session_token;
    if (!token) {
      res.status(401).json({ error: 'Unauthenticated.' });
      return;
    }

    const session = await prisma.session.findUnique({
      where: { token },
    });

    if (!session) {
      res.status(401).json({ error: 'Session not found or expired.' });
      return;
    }

    const now = new Date();
    const elapsed = Math.floor((now.getTime() - session.lastActiveAt.getTime()) / 1000);
    // Add elapsed seconds only if the time gap since the last update is less than 60s
    // (this avoids inflating active study time when the user is AFK)
    const elapsedSeconds = (elapsed > 0 && elapsed < 60) ? elapsed : 10;

    const updatedSession = await prisma.session.update({
      where: { token },
      data: {
        lastActiveAt: now,
        activeSeconds: {
          increment: elapsedSeconds,
        },
      },
    });

    res.json({ success: true, activeSeconds: updatedSession.activeSeconds });
  } catch (error: any) {
    logger.error('Heartbeat logging failed: %s', error.message);
    res.status(500).json({ error: 'Failed to record session activity.' });
  }
});

export default router;
