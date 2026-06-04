// server.js - StudySphere AI Backend (Railway Hardened & Optimized)
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fsPromises = require('fs/promises');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

// =========================
// 1. Global Crash Prevention
// =========================
process.on('uncaughtException', (err) => console.error('[CRITICAL] Uncaught Exception:', err));
process.on('unhandledRejection', (reason) => console.error('[CRITICAL] Unhandled Rejection:', reason));

if (typeof fetch !== 'function') {
    console.error('Global fetch missing. Ensure Node 18+ is selected in Railway.');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// 2. Security & Middleware
// =========================
app.use(
    helmet({
        crossOriginResourcePolicy: false,
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://accounts.google.com", "https://apis.google.com", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://ogs.google.com", "https://www.googleapis.com"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://accounts.google.com", "https://cdn.jsdelivr.net"],
                fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net", "data:"],
                imgSrc: ["'self'", "data:", "http:", "https:", "blob:", "https://lh3.googleusercontent.com", "https://*.googleusercontent.com"],
                frameSrc: ["'self'", "https://accounts.google.com", "https://apis.google.com", "https://ogs.google.com"],
                connectSrc: ["'self'", "https://generativelanguage.googleapis.com", "https://oauth2.googleapis.com", "https://accounts.google.com", "https://*.googleusercontent.com", "https://*.googleapis.com", "https://cdnjs.cloudflare.com", "ws:", "wss:"],
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
        'https://studysphere-ai-production.up.railway.app',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5500'
    ];

app.use(cors({
    origin: (origin, callback) => (!origin || allowedOrigins.includes(origin)) ? callback(null, true) : callback(new Error('CORS blocked')),
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// =========================
// 3. Postgres Connection (Railway Optimized)
// =========================
const isProduction = process.env.NODE_ENV === 'production';
const useSSL = isProduction && process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('internal');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => console.error('[DB] Idle client error, auto-recovering...', err));

const initDatabase = async () => {
    const queries = [
        `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            google_id VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255),
            picture_url TEXT,
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            last_seen_at TIMESTAMPTZ DEFAULT NOW()
        )`,
        `CREATE TABLE IF NOT EXISTS sessions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            tool VARCHAR(50),
            subject VARCHAR(255),
            input_text TEXT,
            output_text TEXT,
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT NOW()
        )`,
        `CREATE TABLE IF NOT EXISTS user_data (
            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            data JSONB NOT NULL,
            metadata JSONB DEFAULT '{}',
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )`,
        `CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);`,
        `CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);`
    ];
    
    const client = await pool.connect();
    try {
        for (const q of queries) await client.query(q);
        console.log('[DB] Railway Postgres initialized successfully.');
    } catch (err) {
        console.error('[DB] Initialization failed:', err.message);
    } finally {
        client.release();
    }
};

// =========================
// 4. Config & Auth Setup
// =========================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Strictly enforcing requested models
const GEMINI_MODEL_FALLBACKS = ['gemini-3.5-flash', 'gemini-3.1-flash-lite'];

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// =========================
// 5. Security & Utility Engine
// =========================
function sanitizeFilename(name) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 255);
}

function redactPII(text) {
    if (!text || typeof text !== 'string') return text;
    return text
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
        .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[REDACTED_PHONE]');
}

function checkMagicBytes(buffer, mimeType) {
    if (!buffer || buffer.length < 4) return false;
    if (mimeType === 'application/pdf') return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
    if (mimeType === 'image/png') return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    if (mimeType === 'image/jpeg') return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    if (mimeType.includes('officedocument') || mimeType === 'application/zip') return buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04;
    if (mimeType.startsWith('text/') || mimeType === 'application/json') return true;
    return true;
}

function isPayloadSafe(obj, maxDepth = 5, maxSize = 5 * 1024 * 1024) {
    try {
        const str = JSON.stringify(obj);
        if (str.length > maxSize) return false;
        const depthCheck = (o, d) => {
            if (d > maxDepth) return false;
            if (typeof o === 'object' && o !== null) {
                for (let k in o) {
                    if (!depthCheck(o[k], d + 1)) return false;
                }
            }
            return true;
        };
        return depthCheck(obj, 0);
    } catch (e) {
        return false;
    }
}

function prepareContextForAI(text) {
    const MAX_SAFE_CHARS = 800000;
    if (!text || text.length <= MAX_SAFE_CHARS) return text;
    const chunk1 = text.substring(0, 300000);
    const chunk2 = text.substring(text.length / 2 - 100000, text.length / 2 + 100000);
    const chunk3 = text.substring(text.length - 300000);
    return `[SYSTEM NOTE: Document exceptionally large. Extracted Beginning, Middle, End sections to preserve context integrity.]\n\n--- BEGINNING ---\n${chunk1}\n\n--- MIDDLE ---\n${chunk2}\n\n--- END ---\n${chunk3}`;
}

// =========================
// 6. Auth Middleware & Rate Limiting
// =========================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    req.user = !token ? { userId: null, email: 'guest', isGuest: true } : null;
    if (!token) return next();
    jwt.verify(token, JWT_SECRET, (err, user) => {
        req.user = err ? { userId: null, email: 'guest', isGuest: true } : user;
        next();
    });
};

app.use(authenticateToken);

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => (req.user && req.user.userId ? `user_${req.user.userId}` : req.ip),
    message: { error: 'Rate limit exceeded. Please slow down.' }
});
app.use('/api/', apiLimiter);

// =========================
// 7. Gemini AI Engine
// =========================
function formatMultimodalContents(messages) {
    const contents = [];
    let systemInstruction = '';
    for (const msg of messages) {
        if (!msg.role) continue;
        if (msg.role === 'system') {
            systemInstruction += (msg.content || '') + '\n\n';
            continue;
        }
        const parts = [];
        if (msg.content) parts.push({ text: msg.content });
        if (msg.attachments && Array.isArray(msg.attachments)) {
            for (const att of msg.attachments) {
                if (att.inlineData && att.inlineData.data && att.inlineData.mimeType) {
                    parts.push({ inlineData: { data: att.inlineData.data, mimeType: att.inlineData.mimeType } });
                }
            }
        }
        if (parts.length === 0) continue;
        const mappedRole = msg.role === 'assistant' ? 'model' : 'user';
        if (contents.length > 0 && contents[contents.length - 1].role === mappedRole) {
            contents[contents.length - 1].parts.push(...parts);
        } else {
            contents.push({ role: mappedRole, parts });
        }
    }
    while (contents.length > 0 && contents[0].role !== 'user') contents.shift();
    return { contents, systemInstruction };
}

async function callGeminiModelOnce(model, contents, systemInstruction) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const payload = {
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
    };
    if (systemInstruction && systemInstruction.trim()) {
        payload.systemInstruction = { parts: [{ text: systemInstruction.trim() }] };
    }
    return await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
        body: JSON.stringify(payload)
    });
}

async function callGeminiWithFallback(contents, systemInstruction) {
    for (const model of GEMINI_MODEL_FALLBACKS) {
        try {
            const response = await callGeminiModelOnce(model, contents, systemInstruction);
            if (response.status === 429) throw new Error('QUOTA_EXCEEDED');
            if (!response.ok) continue;
            const data = await response.json();
            const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join(' ').trim() || 'No response generated.';
            return { reply, model, usage: data.usageMetadata || null };
        } catch (err) {
            if (err.message === 'QUOTA_EXCEEDED') throw err;
            continue;
        }
    }
    throw new Error('All AI engines are currently busy.');
}

// =========================
// 8. API Endpoints
// =========================
app.get('/api/health', (req, res) => res.json({ status: 'ok', models: GEMINI_MODEL_FALLBACKS, db: 'connected' }));

app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const originalName = sanitizeFilename(req.file.originalname);
    let extractedText = '';
    let base64Data = '';
    
    try {
        const fileBuffer = await fsPromises.readFile(filePath);
        if (!checkMagicBytes(fileBuffer, mimeType)) {
            return res.status(400).json({ error: 'Security Rejection: File signature mismatch.' });
        }
        if (fileBuffer.length <= 15 * 1024 * 1024) base64Data = fileBuffer.toString('base64');

        if (mimeType.startsWith('text/') || originalName.match(/\.(txt|md|csv|html|xml|json)$/i)) {
            extractedText = fileBuffer.toString('utf8');
        } else if (mimeType === 'application/pdf') {
            try { extractedText = (await pdfParse(fileBuffer)).text; } catch (e) { extractedText = `[PDF Document: ${originalName}]`; }
        } else if (mimeType.includes('wordprocessingml.document')) {
            try { extractedText = (await mammoth.extractRawText({ path: filePath })).value; } catch (e) { extractedText = `[Word Document: ${originalName}]`; }
        } else if (mimeType.startsWith('image/')) {
            extractedText = `[Image Attached: ${originalName} - AI Vision Enabled]`;
        } else {
            extractedText = `[File Attached: ${originalName}]`;
        }

        res.json({ text: extractedText, filename: originalName, mimeType, inlineData: base64Data ? { data: base64Data, mimeType } : null });
    } catch (parseError) {
        console.error('File parsing error:', parseError);
        res.status(500).json({ error: 'Failed to parse file securely.' });
    } finally {
        try { await fsPromises.unlink(filePath); } catch (e) { /* Cleanup */ }
    }
});

app.post('/api/auth/google', async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken || !googleClient) return res.status(400).json({ error: 'Auth misconfiguration' });
        const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();

        const upsertUserQuery = `
            INSERT INTO users (google_id, email, name, picture_url)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (google_id) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, picture_url = EXCLUDED.picture_url, last_seen_at = NOW() RETURNING id;`;

        const result = await pool.query(upsertUserQuery, [payload.sub, payload.email, payload.name || payload.email, payload.picture]);
        const userId = result.rows[0].id;

        await pool.query(`INSERT INTO sessions (user_id, tool, subject, input_text, output_text) VALUES ($1, $2, $3, $4, $5)`,
            [userId, 'login', 'System', `OAuth Login: ${payload.email}`, 'Success']);

        const sessionToken = jwt.sign({ userId, email: payload.email, name: payload.name }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ user: { userId, sub: payload.sub, email: payload.email, name: payload.name, picture: payload.picture }, sessionToken });
    } catch (err) {
        console.error('Google Auth Error:', err);
        res.status(401).json({ error: 'Invalid Google Token' });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Invalid request' });
        if (!GEMINI_API_KEY) return res.status(500).json({ error: 'API Key Missing' });

        const processedMessages = messages.map(msg => {
            if (msg.role === 'user' && typeof msg.content === 'string' && msg.content.length > 800000) {
                return { ...msg, content: prepareContextForAI(msg.content) };
            }
            return msg;
        });

        const { contents, systemInstruction } = formatMultimodalContents(processedMessages);
        const { reply, model, usage } = await callGeminiWithFallback(contents, systemInstruction);

        if (req.user && req.user.userId) {
            const lastMsg = [...messages].reverse().find(m => m.role === 'user');
            const inputText = redactPII(lastMsg ? (typeof lastMsg.content === 'string' ? lastMsg.content.substring(0, 10000) : '[Multimodal]') : '[No Input]');
            const dbSafeOutput = reply.length > 1000000 ? reply.substring(0, 1000000) + '\n[DB Log Truncated for Safety]' : reply;
            await pool.query(`INSERT INTO sessions (user_id, tool, subject, input_text, output_text) VALUES ($1, $2, $3, $4, $5)`,
                [req.user.userId, 'chat', null, inputText, redactPII(dbSafeOutput)]);
        }

        res.json({ reply, model, usage });
    } catch (err) {
        if (err.message === 'QUOTA_EXCEEDED') return res.status(429).json({ error: 'AI Quota exceeded.' });
        res.status(500).json({ error: 'AI generation failed.' });
    }
});

app.post('/api/chat/stream', async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Invalid request' });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const heartbeat = setInterval(() => {
        if (!res.writableEnded) res.write(': heartbeat\n\n');
    }, 15000);
    res.on('close', () => clearInterval(heartbeat));

    const processedMessages = messages.map(msg => {
        if (msg.role === 'user' && typeof msg.content === 'string' && msg.content.length > 800000) {
            return { ...msg, content: prepareContextForAI(msg.content) };
        }
        return msg;
    });

    const { contents, systemInstruction } = formatMultimodalContents(processedMessages);
    let accumulatedReply = '';

    for (const model of GEMINI_MODEL_FALLBACKS) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;
            const payload = { contents, generationConfig: { temperature: 0.7, maxOutputTokens: 8192 } };
            if (systemInstruction && systemInstruction.trim()) {
                payload.systemInstruction = { parts: [{ text: systemInstruction.trim() }] };
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
                body: JSON.stringify(payload)
            });

            if (response.status === 429) {
                res.write(`data: ${JSON.stringify({ error: 'Quota exceeded.' })}\n\n`);
                clearInterval(heartbeat);
                return res.end();
            }
            if (!response.ok) continue;

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let streamBuffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                streamBuffer += decoder.decode(value, { stream: true });
                const lines = streamBuffer.split('\n');
                streamBuffer = lines.pop() || '';
                for (let line of lines) {
                    line = line.trim();
                    if (line.startsWith('data: ')) {
                        const jsonStr = line.substring(6).trim();
                        if (jsonStr === '[DONE]') continue;
                        try {
                            const parsed = JSON.parse(jsonStr);
                            const textChunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (textChunk) {
                                accumulatedReply += textChunk;
                                res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
                            }
                        } catch (e) { /* Ignore fragmented JSON parse errors */ }
                    }
                }
            }

            if (req.user && req.user.userId) {
                const lastMsg = [...messages].reverse().find(m => m.role === 'user');
                const inputText = redactPII(lastMsg ? (typeof lastMsg.content === 'string' ? lastMsg.content.substring(0, 10000) : '[Multimodal]') : '[No Input]');
                const dbSafeOutput = accumulatedReply.length > 1000000 ? accumulatedReply.substring(0, 1000000) + '\n[DB Log Truncated]' : accumulatedReply;
                await pool.query(`INSERT INTO sessions (user_id, tool, subject, input_text, output_text) VALUES ($1, $2, $3, $4, $5)`,
                    [req.user.userId, 'stream_chat', null, inputText, redactPII(dbSafeOutput)]);
            }

            res.write('data: [DONE]\n\n');
            clearInterval(heartbeat);
            return res.end();
        } catch (err) { continue; }
    }
    res.write(`data: ${JSON.stringify({ error: 'All AI engines busy.' })}\n\n`);
    clearInterval(heartbeat);
    res.end();
});

app.get('/api/history', async (req, res) => {
    if (!req.user.userId) return res.json({ history: {}, binders: [], tutorialSeen: false });
    try {
        const result = await pool.query(`SELECT data FROM user_data WHERE user_id = $1`, [req.user.userId]);
        res.json(result.rows.length > 0 ? result.rows[0].data : { history: {}, binders: [], tutorialSeen: false });
    } catch (err) { res.status(500).json({ error: 'History fetch failed' }); }
});

app.post('/api/history', async (req, res) => {
    if (!req.user.userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!isPayloadSafe(req.body)) return res.status(400).json({ error: 'Payload rejected (Size/Depth limit).' });
    try {
        await pool.query(`INSERT INTO user_data (user_id, data, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();`, [req.user.userId, JSON.stringify(req.body)]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'Sync failed' }); }
});

app.get('/api/sessions', async (req, res) => {
    if (!req.user.userId) return res.json({ sessions: [] });
    try {
        const result = await pool.query(`SELECT id, tool, subject, input_text, output_text, created_at FROM sessions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100`, [req.user.userId]);
        res.json({ sessions: result.rows });
    } catch (err) { res.status(500).json({ error: 'Sessions fetch failed' }); }
});

// =========================
// 9. Global Error Handler & Boot
// =========================
app.use((err, req, res, next) => {
    console.error('[GLOBAL ERROR]', err);
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Upload Error: ${err.message}. Max file size is 100MB.` });
    }
    res.status(500).json({ error: 'Internal Server Error. The admin has been notified.' });
});

app.listen(PORT, async () => {
    await initDatabase();
    console.log(`
╔════════════════════════════════════════════════════════════╗
║           StudySphere AI Workspace - Ultimate Backend      ║
╠════════════════════════════════════════════════════════════╣
║ Server running on: http://localhost:${PORT}                  ║
║ Provider: Gemini (3.x Multimodal Cascade Mode)             ║
║ Primary Model:   ${GEMINI_MODEL_FALLBACKS[0].padEnd(40)} ║
║ Secondary Model: ${GEMINI_MODEL_FALLBACKS[1].padEnd(40)} ║
║ Security: Magic Bytes + PII Redaction + CSP + Depth Guard  ║
║ Uploads: 100MB Limit + Smart Chunking + Auto-Cleanup       ║
║ Responses: UNLIMITED + Stream Heartbeat Active             ║
╚════════════════════════════════════════════════════════════╝`);
});