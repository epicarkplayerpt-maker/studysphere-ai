"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = __importDefault(require("./lib/logger"));
const auth_1 = require("./middleware/auth");
// Force load and override from local .env to bypass any system-wide environment variables
const envPath = path_1.default.join(__dirname, '../.env');
if (fs_1.default.existsSync(envPath)) {
    const envConfig = dotenv_1.default.parse(fs_1.default.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}
else {
    dotenv_1.default.config();
}
// Verify critical environment keys at boot
const requiredEnvKeys = ['DATABASE_URL', 'GEMINI_API_KEY', 'PORT'];
const missingKeys = requiredEnvKeys.filter(key => !process.env[key]);
if (missingKeys.length > 0) {
    logger_1.default.error('CRITICAL: Boot process aborted. Missing environment variables: %s', missingKeys.join(', '));
    process.exit(1);
}
const auth_2 = __importDefault(require("./routes/auth"));
const study_1 = __importDefault(require("./routes/study"));
const chat_1 = __importDefault(require("./routes/chat"));
const health_1 = __importDefault(require("./routes/health"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, express_1.default)();
app.set('trust proxy', 1); // Required for Railway's reverse proxy so rate limiting uses real client IPs
const PORT = process.env.NODE_ENV === 'production' ? 8080 : (process.env.PORT || 3000);
// ==========================================
// 1. Security Headers & CORS Configuration
// ==========================================
app.use((0, helmet_1.default)({
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
}));
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        'https://studysphere-ai.up.railway.app',
        'https://studysphere-ai-production.up.railway.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173'
    ];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            logger_1.default.warn(`CORS blocked for origin: ${origin}`);
            callback(null, false);
        }
    },
    credentials: true,
}));
// ==========================================
// 2. High Payload Body Parsers & Parsers
// ==========================================
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((0, cookie_parser_1.default)());
// Serve static assets from fronted build output
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Global state-based session parser
app.use(auth_1.authenticateToken);
// ==========================================
// 3. Security Rate-Limiting Rules
// ==========================================
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 login/auth requests per window
    standardHeaders: true,
    legacyHeaders: false,
    validate: { keyGeneratorIpFallback: false },
    message: { error: 'Too many authentication attempts. Please slow down.' },
});
const studyLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200, // Limit each user to 200 API queries per window
    standardHeaders: true,
    legacyHeaders: false,
    validate: { keyGeneratorIpFallback: false },
    keyGenerator: (req) => (req.user ? req.user.userId : req.ip || 'anonymous'),
    message: { error: 'Study service rate limit exceeded. Please try again later.' },
});
// ==========================================
// 4. API Gateways & Routing
// ==========================================
app.use('/api/auth', authLimiter, auth_2.default);
app.use('/api/study', studyLimiter, study_1.default);
app.use('/api/chat', studyLimiter, chat_1.default);
app.use('/api/admin', studyLimiter, admin_1.default);
app.use('/api', health_1.default);
// Fallback for React Router (Express 5 wildcard routing compatibility)
app.get(/.*/, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
// ==========================================
// 5. Global Error Handling
// ==========================================
app.use((err, req, res, next) => {
    logger_1.default.error('Unhandled server error: %s', err.stack || err.message || err);
    res.status(500).json({ error: 'Internal Server Error. Processing halted safely.' });
});
// ==========================================
// 6. Guest Session Pruning Worker
// ==========================================
const prisma_1 = __importDefault(require("./lib/prisma"));
const pruneExpiredGuests = async () => {
    try {
        const cutoff = new Date();
        cutoff.setHours(cutoff.getHours() - 24); // 24 hours ago
        // Find guest users older than 24 hours
        const expiredGuests = await prisma_1.default.user.findMany({
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
            await prisma_1.default.user.deleteMany({
                where: { id: { in: ids } },
            });
            logger_1.default.info('Pruned %d expired guest users from database.', expiredGuests.length);
        }
    }
    catch (error) {
        logger_1.default.error('Error during expired guest pruning: %s', error.message);
    }
};
// Run pruning immediately on boot, and then hourly
pruneExpiredGuests();
setInterval(pruneExpiredGuests, 60 * 60 * 1000);
// ==========================================
// 7. Graceful Shutdown for Railway/Production
// ==========================================
const gracefulShutdown = async (signal) => {
    logger_1.default.info('Received %s signal. Starting graceful shutdown...', signal);
    await prisma_1.default.$disconnect();
    process.exit(0);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Start listening
const listenPort = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
app.listen(listenPort, '0.0.0.0', () => {
    logger_1.default.info('StudySphere AI server listening on http://0.0.0.0:%s', listenPort);
});
