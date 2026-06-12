"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const logger_1 = __importDefault(require("../lib/logger"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Enforce authentication on all admin endpoints
router.use(auth_1.checkAuthRequired);
/**
 * Middleware to restrict access to Admins only
 */
function checkAdminAccess(req, res, next) {
    if (!req.user || req.user.email.toLowerCase() !== 'epicarkplayerpt@gmail.com') {
        logger_1.default.warn('Forbidden admin metrics access attempt by user: %s', req.user?.email || 'anonymous');
        res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
        return;
    }
    next();
}
/**
 * @route GET /api/admin/metrics
 * @desc Get real-time PostgreSQL database usage metrics, session logs, and token usage
 */
router.get('/metrics', checkAdminAccess, async (req, res) => {
    try {
        // 1. Fetch user counts (Registered vs Guest)
        const totalUsers = await prisma_1.default.user.count();
        const guestUsers = await prisma_1.default.user.count({
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
        const activeSessions = await prisma_1.default.session.findMany({
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
        const tokenUsages = await prisma_1.default.tokenUsage.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        let totalPromptTokens = 0;
        let totalCompletionTokens = 0;
        let totalTokens = 0;
        const actionBreakdown = {};
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
        const personalUsages = await prisma_1.default.tokenUsage.findMany({
            where: { userId: req.user.userId }
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
    }
    catch (error) {
        logger_1.default.error('Failed to fetch admin metrics: %s', error.stack || error.message);
        res.status(500).json({ error: 'Failed to compile database metrics.' });
    }
});
exports.default = router;
