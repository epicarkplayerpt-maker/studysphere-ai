// server.js - StudySphere Ultimate Backend (Secured, Robust, Future-Proof)
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const fsPromises = require('fs/promises');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

// Fallback for older Node versions
if (typeof fetch !== 'function') {
  console.error('Global fetch is not available. Please upgrade to Node 18+ or install node-fetch.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// 1. Security & Middleware (Helmet CSP)
// =========================
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'", "'unsafe-inline'", "'unsafe-eval'",
          "https://accounts.google.com", "https://apis.google.com",
          "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com",
          "https://ogs.google.com", "https://www.googleapis.com"
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://accounts.google.com", "https://cdn.jsdelivr.net", "https://ogs.google.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net", "data:"],
        imgSrc: ["'self'", "data:", "http:", "https:", "blob:", "https://lh3.googleusercontent.com", "https://*.googleusercontent.com"],
        frameSrc: ["'self'", "https://accounts.google.com", "https://apis.google.com", "https://ogs.google.com", "https://www.googleapis.com"],
        connectSrc: ["'self'", "https://generativelanguage.googleapis.com", "https://oauth2.googleapis.com", "https://accounts.google.com", "https://*.googleusercontent.com", "https://*.googleapis.com", "https://cdnjs.cloudflare.com", "https://ogs.google.com", "ws:", "wss:"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    }
  })
);

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5500', 'http://localhost:5500'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// =========================
// 2. Postgres connection & Auto-Init
// =========================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const initDatabase = async () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      google_id VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      picture_url TEXT,
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
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS user_data (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`
  ];
  
  try {
    for (const q of queries) await pool.query(q);
    console.log('[DB] Tables verified/initialized successfully.');
  } catch (err) {
    console.error('[DB] Failed to initialize tables:', err);
  }
};

// =========================
// 3. Config & Auth Setup
// =========================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'epicarkplayerpt@gmail.com').split(',');

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.txt', '.md', '.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) cb(null, true);
    else cb(new Error('Invalid file type. Only .txt, .md, .pdf, and .docx are allowed.'));
  }
});

// UPDATED: Routed to gemini-3.1-flash-lite as requested
const GEMINI_MODEL_FALLBACKS = [
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.0-flash'
];

// =========================
// 4. Auth Middleware (Fixed for Guest Mode)
// =========================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // If no token or invalid token (e.g., Guest Mode mock token), allow as guest instead of blocking
  if (!token) {
    req.user = { userId: null, email: 'guest', isGuest: true };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Gracefully handle frontend's Guest/Offline mock tokens
      req.user = { userId: null, email: 'guest', isGuest: true };
      return next();
    }
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (!req.user || !ADMIN_EMAILS.includes(req.user.email)) {
    return res.status(403).json({ error: 'Forbidden: Admin access only' });
  }
  next();
};

// =========================
// 5. Gemini AI Helpers
// =========================
async function callGeminiModelOnce(model, contents, systemInstruction) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const payload = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192 
    }
  };

  // Properly inject system prompt for Gemini
  if (systemInstruction && systemInstruction.trim()) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction.trim() }]
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify(payload)
  });

  return response;
}

async function callGeminiWithFallback(contents, systemInstruction) {
  const errors = [];

  for (const model of GEMINI_MODEL_FALLBACKS) {
    try {
      const response = await callGeminiModelOnce(model, contents, systemInstruction);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error (${response.status}) with model ${model}:`, errorText);
        errors.push({ model, status: response.status, body: errorText });
        if (response.status === 401 || response.status === 403) throw new Error(`Gemini auth failed.`);
        continue;
      }

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join(' ').trim() || 'No response was generated.';
      const usage = data.usageMetadata || data.usage || null;

      console.log(`[Chat] Provider: Gemini, Model: ${model}, Tokens: ${usage?.totalTokenCount ?? 'N/A'}`);
      return { reply, model, usage };
    } catch (err) {
      console.error(`Gemini network/parse error with model ${model}:`, err);
      errors.push({ model, error: err.message });
      continue;
    }
  }

  throw new Error('All Gemini models are currently unavailable.');
}

// =========================
// 6. API Endpoints
// =========================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    provider: 'gemini',
    primaryModel: GEMINI_MODEL_FALLBACKS[0],
    geminiApiKeyConfigured: Boolean(GEMINI_API_KEY),
    googleClientConfigured: Boolean(GOOGLE_CLIENT_ID),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  const filePath = req.file.path;
  const mimeType = req.file.mimetype;
  const originalName = req.file.originalname.toLowerCase();
  let extractedText = '';

  try {
    if (mimeType === 'text/plain' || originalName.endsWith('.txt') || originalName.endsWith('.md')) {
      extractedText = await fsPromises.readFile(filePath, 'utf8');
    } else if (mimeType === 'application/pdf' || originalName.endsWith('.pdf')) {
      const dataBuffer = await fsPromises.readFile(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || originalName.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    } else {
      throw new Error('Unsupported file type.');
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text. File might be empty or image-based.' });
    }

    res.json({ text: extractedText });
  } catch (parseError) {
    console.error('File parsing error:', parseError);
    res.status(500).json({ error: 'Failed to parse file.' });
  } finally {
    try { await fsPromises.unlink(filePath); } catch (e) { /* Ignore */ }
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'Missing idToken' });
    if (!googleClient) return res.status(500).json({ error: 'Server auth misconfiguration' });

    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || payload.email;
    const picture = payload.picture || null;

    const upsertUserQuery = `
      INSERT INTO users (google_id, email, name, picture_url)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (google_id)
      DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        picture_url = EXCLUDED.picture_url,
        last_seen_at = NOW()
      RETURNING id;
    `;

    const result = await pool.query(upsertUserQuery, [googleId, email, name, picture]);
    const userId = result.rows[0].id;

    const sessionToken = jwt.sign(
      { userId, email, name }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({ 
      user: { userId, sub: googleId, email, name, picture },
      sessionToken 
    });
  } catch (err) {
    console.error('Error in /api/auth/google:', err);
    res.status(401).json({ error: 'Invalid Google ID token or DB error' });
  }
});

app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid request: messages array is required' });
    }
    if (!GEMINI_API_KEY) return res.status(500).json({ error: 'GEMINI_API_KEY missing' });

    const contents = [];
    let systemInstruction = '';

    // Properly separate System Instructions from User/Model turns
    for (const msg of messages) {
      if (!msg.role || !msg.content) continue;
      if (msg.role === 'system') {
        systemInstruction += msg.content + '\n\n';
      } else {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }
    }

    const { reply, model, usage } = await callGeminiWithFallback(contents, systemInstruction);

    // Only log to DB if user is authenticated (prevents Foreign Key errors for Guests)
    if (req.user.userId) {
      try {
        const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
        const inputText = lastUserMessage ? lastUserMessage.content.substring(0, 10000) : '';
        const outputText = reply.substring(0, 10000);
        
        await pool.query(
          `INSERT INTO sessions (user_id, tool, subject, input_text, output_text) VALUES ($1, $2, $3, $4, $5)`,
          [req.user.userId, 'chat', null, inputText, outputText]
        );
      } catch (logErr) { console.error('Failed to log chat session:', logErr); }
    }

    res.json({ reply, model, usage });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({ error: 'AI service is currently unavailable.' });
  }
});

app.post('/api/history', authenticateToken, async (req, res) => {
  if (req.user.isGuest) return res.json({ success: true }); // Skip DB save for guests
  try {
    const userId = req.user.userId;
    const { history, binders, tutorialSeen } = req.body;
    const data = { history, binders, tutorialSeen };
    
    await pool.query(
      `INSERT INTO user_data (user_id, data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [userId, data]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving user data:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.get('/api/history', authenticateToken, async (req, res) => {
  if (req.user.isGuest) return res.json({ history: {}, binders: [], tutorialSeen: false });
  try {
    const userId = req.user.userId;
    const result = await pool.query('SELECT data FROM user_data WHERE user_id = $1', [userId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0].data);
    } else {
      res.json({ history: {}, binders: [], tutorialSeen: false });
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Secured Admin Endpoints
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, google_id, email, name, picture_url, created_at, last_seen_at FROM users ORDER BY last_seen_at DESC`);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch users' }); }
});

app.get('/api/admin/sessions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.tool, s.subject, s.input_text, s.output_text, s.created_at, u.email, u.name
      FROM sessions s JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC LIMIT 500
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch sessions' }); }
});

// SPA catch-all
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

// =========================
// 7. Start server
// =========================
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║          StudySphere AI Workspace - Backend Server         ║
╠════════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT.toString().padEnd(27)}║
║  Provider:         Gemini (fallback chain)                 ║
║  Primary Model:    ${GEMINI_MODEL_FALLBACKS[0].padEnd(27)}║
║  GEMINI_API_KEY:   ${GEMINI_API_KEY ? '✓ Configured' : '✗ Missing (check .env)'}                            ║
║  GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID ? '✓ Configured' : '✗ Missing (check .env)'}                            ║
║  Security:         JWT Auth, Rate Limit, Helmet, CORS      ║
╚════════════════════════════════════════════════════════════╝
    `);
  });
});

module.exports = app;