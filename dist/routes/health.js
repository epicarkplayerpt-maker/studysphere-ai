"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const logger_1 = __importDefault(require("../lib/logger"));
const router = (0, express_1.Router)();
router.get('/health', async (req, res) => {
    const dbHealthy = await prisma_1.default.$queryRaw `SELECT 1`.then(() => true).catch(() => false);
    if (!dbHealthy) {
        logger_1.default.error('Health check failed: database unreachable');
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
exports.default = router;
