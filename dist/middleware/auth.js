"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.checkAuthRequired = checkAuthRequired;
const prisma_1 = __importDefault(require("../lib/prisma"));
const logger_1 = __importDefault(require("../lib/logger"));
/**
 * Middleware to verify stateful session tokens from HTTP-only cookies.
 */
async function authenticateToken(req, res, next) {
    const token = req.cookies?.session_token;
    if (!token) {
        next();
        return;
    }
    try {
        const session = await prisma_1.default.session.findUnique({
            where: { token },
            include: { user: true },
        });
        const isLocal = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
        const clearOptions = {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' && !isLocal,
            sameSite: isLocal ? 'lax' : 'strict',
        };
        if (!session) {
            res.clearCookie('session_token', clearOptions);
            next();
            return;
        }
        // Check if session has expired
        if (session.expiresAt < new Date()) {
            await prisma_1.default.session.delete({ where: { token } }).catch(() => { });
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
    }
    catch (error) {
        logger_1.default.error('Session authentication error: %s', error);
        next();
    }
}
/**
 * Middleware to enforce authentication on specific endpoints.
 */
function checkAuthRequired(req, res, next) {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required. Please sign in or continue as Guest.' });
        return;
    }
    next();
}
