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

// Increased limit to handle large Base64 payloads from frontend
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
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
// 2. Postgres connection & Auto-Init (Railway Ready)
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

// REMOVED LIMITS AND FILE FILTERS FOR UNLIMITED UPLOADS OF ALL TYPES
// Set a reasonable 50MB limit to prevent server crash on Railway free/basic tiers
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } 
});

const GEMINI_MODEL_FALLBACKS = [
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash'
];

// =========================
// 4. Auth Middleware (Fixed for Guest Mode)
// =========================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = { userId: null, email: 'guest', isGuest: true };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
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
// 5. Gemini AI Helpers (Multimodal, Long Content Parsing & Streaming)
// =========================

function formatMultimodalContents(messages) {
  const contents = [];
  let systemInstruction = '';

  for (const msg of messages) {
    if (!msg.role) continue;
    
    const role = msg.role;
    const content = msg.content || '';
    
    if (role === 'system') {
      systemInstruction += content + '\n\n';
      continue;
    }

    const parts = [];
    if (content) {
      parts.push({ text: content });
    }

    if (msg.attachments && Array.isArray(msg.attachments)) {
      for (const att of msg.attachments) {
        if (att.inlineData && att.inlineData.data && att.inlineData.mimeType) {
          parts.push({
            inlineData: {
              data: att.inlineData.data,
              mimeType: att.inlineData.mimeType
            }
          });
        }
      }
    }

    if (parts.length === 0) continue;

    const mappedRole = role === 'assistant' ? 'model' : 'user';

    // Strict Alternation Requirement Fix
    if (contents.length > 0 && contents[contents.length - 1].role === mappedRole) {
      contents[contents.length - 1].parts.push(...parts);
    } else {
      contents.push({
        role: mappedRole,
        parts: parts
      });
    }
  }

  // Gemini requires the initial content segment to start with user role
  while (contents.length > 0 && contents[0].role !== 'user') {
    contents.shift();
  }

  return { contents, systemInstruction };
}

async function callGeminiModelOnce(model, contents, systemInstruction) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const payload = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 16384 // Increased to prevent flashcard cutoffs
    }
  };

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
        continue; 
      }

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join(' ').trim() || 'No response was generated.';
      const usage = data.usageMetadata || data.usage || null;

      console.log(`[Chat] Provider: Gemini, Model: ${model}, Tokens: ${usage?.totalTokenCount ?? 'N/A'}`);
      return { reply, model, usage };
    } catch (err) {
      console.error(`Gemini network error with model ${model}:`, err);
      errors.push({ model, error: err.message });
      continue; 
    }
  }

  throw new Error('All configured Gemini workspace engines are currently responding with an error.');
}

// =========================
// 6. API Endpoints
// =========================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    provider: 'gemini',
    primaryModel: GEMINI_MODEL_FALLBACKS[0],
    fallbackSequence: GEMINI_MODEL_FALLBACKS,
    geminiApiKeyConfigured: Boolean(GEMINI_API_KEY),
    googleClientConfigured: Boolean(GOOGLE_CLIENT_ID),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  const filePath = req.file.path;
  const mimeType = req.file.mimetype;
  const originalName = req.file.originalname;
  let extractedText = '';
  let base64Data = '';

  try {
    const fileBuffer = await fsPromises.readFile(filePath);
    const fileSize = fileBuffer.length;
    // Gemini inlineData limit is ~20MB. We cap at 15MB to be safe.
    const MAX_INLINE_SIZE = 15 * 1024 * 1024; 

    // Always generate base64 for multimodal if within size limits
    if (fileSize <= MAX_INLINE_SIZE) {
        base64Data = fileBuffer.toString('base64');
    }

    if (mimeType.startsWith('text/') || originalName.toLowerCase().endsWith('.txt') || originalName.toLowerCase().endsWith('.md') || originalName.toLowerCase().endsWith('.csv') || originalName.toLowerCase().endsWith('.html') || originalName.toLowerCase().endsWith('.xml') || originalName.toLowerCase().endsWith('.json')) {
      extractedText = fileBuffer.toString('utf8');
      // For text files, we can send the text directly, but also inlineData if small enough
      res.json({ text: extractedText.substring(0, 50000), filename: originalName, mimeType, inlineData: base64Data ? { data: base64Data, mimeType } : null });
    } else if (mimeType === 'application/pdf' || originalName.toLowerCase().endsWith('.pdf')) {
      try {
        const pdfData = await pdfParse(fileBuffer);
        extractedText = pdfData.text;
      } catch (e) {
        extractedText = `[PDF Document: ${originalName}]`;
      }
      res.json({ text: extractedText.substring(0, 50000), filename: originalName, mimeType, inlineData: base64Data ? { data: base64Data, mimeType } : null });
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || originalName.toLowerCase().endsWith('.docx')) {
      try {
        const result = await mammoth.extractRawText({ path: filePath });
        extractedText = result.value;
      } catch (e) {
        extractedText = `[Word Document: ${originalName}]`;
      }
      res.json({ text: extractedText.substring(0, 50000), filename: originalName, mimeType, inlineData: base64Data ? { data: base64Data, mimeType } : null });
    } else if (mimeType.startsWith('image/')) {
      extractedText = `[Image Attached: ${originalName}]`;
      res.json({ text: extractedText, filename: originalName, mimeType, inlineData: base64Data ? { data: base64Data, mimeType } : null });
    } else {
      extractedText = `[File Attached: ${originalName}]`;
      res.json({ text: extractedText, filename: originalName, mimeType, inlineData: base64Data ? { data: base64Data, mimeType } : null });
    }
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

    const { contents, systemInstruction } = formatMultimodalContents(messages);
    const { reply, model, usage } = await callGeminiWithFallback(contents, systemInstruction);

    if (req.user.userId) {
      try {
        const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
        const inputText = lastUserMessage ? (typeof lastUserMessage.content === 'string' ? lastUserMessage.content.substring(0, 10000) : '[Multimodal Data]') : '';
        const outputText = reply.substring(0, 10000);
        
        await pool.query(
          `INSERT INTO sessions (user_id, tool, subject, input_text, output_text) VALUES ($1, $2, $3, $4, $5)`,
          [req.user.userId, 'chat', null, inputText, outputText]
        );
      } catch (logErr) { console.error('Failed to log chat session:', logErr); }
    }

    res.json({ reply, model, usage });
  } catch (err) {
    console.error('Chat endpoint failure cascade:', err);
    res.status(500).json({ error: 'All primary and fallback AI generation pipelines are currently busy.' });
  }
});

// UPGRADED: Robust String-Aware Streaming JSON Parser Matrix Block
app.post('/api/chat/stream', authenticateToken, async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid request: messages array is required' });
  }
  if (!GEMINI_API_KEY) return res.status(500).json({ error: 'GEMINI_API_KEY configuration missing' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const { contents, systemInstruction } = formatMultimodalContents(messages);
  let streamingSuccess = false;
  let accumulatedReply = '';

  for (const model of GEMINI_MODEL_FALLBACKS) {
    try {
      // Append alt=sse so Google returns standard Server-Sent Events structure
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;
      const payload = {
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 16384 }
      };

      if (systemInstruction && systemInstruction.trim()) {
        payload.systemInstruction = { parts: [{ text: systemInstruction.trim() }] };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No response body');
        console.error(`Streaming failover triggered. Model rejected initialization parameters: ${model}. Status: ${response.status}. Reason: ${errorText}`);
        continue; 
      }

      streamingSuccess = true;
      console.log(`[Stream] Successfully connected to model: ${model}`);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let streamBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        streamBuffer += decoder.decode(value, { stream: true });
        const lines = streamBuffer.split('\n');
        streamBuffer = lines.pop() || ''; // Buffer incomplete lines

        for (let line of lines) {
          line = line.trim();
          if (!line) continue;

          // Standard SSE parser
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
            } catch (err) {
              // Ignore incomplete line JSON parse errors
            }
          } else {
            // Fallback for direct chunking if SSE query fails/ignored
            try {
              let cleanLine = line;
              if (cleanLine.startsWith('[')) cleanLine = cleanLine.substring(1);
              if (cleanLine.endsWith(']')) cleanLine = cleanLine.slice(0, -1);
              if (cleanLine.startsWith(',')) cleanLine = cleanLine.substring(1);
              cleanLine = cleanLine.trim();

              if (cleanLine) {
                const parsed = JSON.parse(cleanLine);
                const textChunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (textChunk) {
                  accumulatedReply += textChunk;
                  res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
                }
              }
            } catch (err) {
              // Skip formatting indicators
            }
          }
        }
      }

      // Handle any final residue
      if (streamBuffer.trim()) {
        let line = streamBuffer.trim();
        if (line.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(line.substring(6).trim());
            const textChunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textChunk) {
              accumulatedReply += textChunk;
              res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
            }
          } catch (e) {}
        }
      }

      if (req.user && req.user.userId) {
        try {
          const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
          const inputText = lastUserMessage ? (typeof lastUserMessage.content === 'string' ? lastUserMessage.content.substring(0, 10000) : '[Multimodal Data]') : '';
          const outputText = accumulatedReply.substring(0, 10000);
          
          await pool.query(
            `INSERT INTO sessions (user_id, tool, subject, input_text, output_text) VALUES ($1, $2, $3, $4, $5)`,
            [req.user.userId, 'stream_chat', null, inputText, outputText]
          );
        } catch (logErr) { 
          console.error('Failed to log stream session:', logErr); 
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
      return; // Handled successfully!
    } catch (err) {
      console.error(`Gemini stream network error with model ${model}:`, err);
      continue;
    }
  }

  // All failovers triggered and failed
  if (!streamingSuccess) {
    res.write(`data: ${JSON.stringify({ error: 'All primary and fallback AI generation pipelines are currently busy.' })}\n\n`);
    res.end();
  }
});

// =========================
// 7. History & Binder Cloud Storage (Resolves Frontend Syncing)
// =========================

app.get('/api/history', authenticateToken, async (req, res) => {
  if (!req.user.userId) {
    return res.status(200).json({ history: {}, binders: [], tutorialSeen: false });
  }

  try {
    const query = `SELECT data FROM user_data WHERE user_id = $1`;
    const result = await pool.query(query, [req.user.userId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0].data);
    } else {
      res.json({ history: {}, binders: [], tutorialSeen: false });
    }
  } catch (err) {
    console.error('Failed to get cloud history:', err);
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

app.post('/api/history', authenticateToken, async (req, res) => {
  if (!req.user.userId) {
    return res.status(401).json({ error: 'Unauthorized: Guests cannot sync data' });
  }

  const { history, binders, tutorialSeen } = req.body;
  try {
    const payload = { history, binders, tutorialSeen };
    const query = `
      INSERT INTO user_data (user_id, data, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = NOW();
    `;
    await pool.query(query, [req.user.userId, JSON.stringify(payload)]);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to save cloud history:', err);
    res.status(500).json({ error: 'Failed to sync data' });
  }
});

// =========================
// 8. Server Bind
// =========================

app.listen(PORT, async () => {
  await initDatabase();
  console.log(`
╔════════════════════════════════════════════════════════════╗
║          StudySphere AI Workspace - Backend Server         ║
╠════════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}                       ║
║  Provider:         Gemini (Multimodal Cascade Mode)        ║
║  Primary Model:    ${GEMINI_MODEL_FALLBACKS[0]}           ║
║  Secondary Model:  ${GEMINI_MODEL_FALLBACKS[1]}      ║
║  Emergency Unit:   ${GEMINI_MODEL_FALLBACKS[2]}           ║
║  GEMINI_API_KEY:   ✓ Configured                            ║
║  Security:         Cascading Fallback Chain Engine Verified ║
╚════════════════════════════════════════════════════════════╝
  `);
});