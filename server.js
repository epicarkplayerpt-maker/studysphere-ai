// server.js - StudySphere Backend using Gemini API with model fallback + Google ID token auth + Postgres logging

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');

// If your Node version is < 18, uncomment this:
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// Postgres connection
// =========================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// =========================
// Config
// =========================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Model priority list: best -> worst for Gemini
const GEMINI_MODEL_FALLBACKS = [
  'gemini-3.5-flash',
  'gemini-3.1-pro',
  'gemini-3.1-flash',
  'gemini-3.1-flash-lite'
];

// =========================
// Gemini helpers
// =========================
async function callGeminiModelOnce(model, contents) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048
      }
    })
  });

  return response;
}

async function callGeminiWithFallback(contents) {
  const errors = [];

  for (const model of GEMINI_MODEL_FALLBACKS) {
    try {
      const response = await callGeminiModelOnce(model, contents);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error (${response.status}) with model ${model}:`, errorText);

        errors.push({ model, status: response.status, body: errorText });

        if (response.status === 401) {
          throw new Error(`Gemini authentication failed with model ${model}.`);
        }

        continue;
      }

      const data = await response.json();

      const reply =
        data?.candidates?.[0]?.content?.parts
          ?.map(p => p.text || '')
          .join(' ')
          .trim() || 'No response was generated.';

      const usage = data.usage || null;

      console.log(`[Chat] Provider: Gemini, Model: ${model}, Tokens: ${usage?.totalTokens ?? 'N/A'}`);

      return { reply, model, usage };
    } catch (err) {
      console.error(`Gemini network/parse error with model ${model}:`, err);
      errors.push({ model, error: err.message });
      continue;
    }
  }

  console.error('All Gemini models failed in fallback chain:', errors);
  throw new Error('All Gemini models are currently unavailable. Please try again later.');
}

// =========================
// Health check
// =========================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    provider: 'gemini',
    primaryModel: GEMINI_MODEL_FALLBACKS[0],
    fallbackChain: GEMINI_MODEL_FALLBACKS,
    geminiApiKeyConfigured: Boolean(GEMINI_API_KEY),
    googleClientConfigured: Boolean(GOOGLE_CLIENT_ID),
    timestamp: new Date().toISOString()
  });
});

// =========================
// Google ID token auth
// =========================
// Frontend sends: { idToken: "..." } from Google Identity Services.
// We verify it against Google's tokeninfo endpoint and return { user }.
// We also upsert into the Postgres users table.
app.post('/api/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Missing idToken' });
    }
    if (!GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID not set in environment');
      return res.status(500).json({ error: 'Server auth misconfiguration' });
    }

    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );

    if (!verifyRes.ok) {
      const text = await verifyRes.text();
      console.error('Google token verification failed:', verifyRes.status, text);
      return res.status(401).json({ error: 'Invalid Google ID token' });
    }

    const payload = await verifyRes.json();

    // Check audience matches our client id
    if (payload.aud !== GOOGLE_CLIENT_ID) {
      console.error('Google ID token aud mismatch:', payload.aud, 'expected', GOOGLE_CLIENT_ID);
      return res.status(401).json({ error: 'Token audience mismatch' });
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || payload.email;
    const picture = payload.picture || null;

    const user = { sub: googleId, email, name, picture };

    // Upsert into users table (hardened)
    try {
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

      const params = [
        googleId || '',
        email || '',
        name || email || '',
        picture || null,
      ];

      const result = await pool.query(upsertUserQuery, params);

      let userId;
      if (result.rows.length > 0) {
        userId = result.rows[0].id;
      } else {
        // Fallback in case RETURNING didn't give a row
        const fallback = await pool.query(
          'SELECT id FROM users WHERE google_id = $1 LIMIT 1',
          [googleId]
        );
        if (fallback.rows.length === 0) {
          throw new Error('User upsert did not return an id and no user found in fallback.');
        }
        userId = fallback.rows[0].id;
      }

      console.log('Google user verified and upserted:', email, 'userId:', userId);

      // For now, just return user + userId; later you can issue a JWT
      res.json({ user: { ...user, userId } });
    } catch (dbErr) {
      console.error('Error upserting user into DB:', dbErr);
      return res.status(500).json({
        error: 'Failed to persist user',
        detail: process.env.NODE_ENV === 'development' ? dbErr.message : undefined,
      });
    }
  } catch (err) {
    console.error('Error in /api/auth/google:', err);
    res.status(500).json({ error: 'Failed to verify Google ID token' });
  }
});

// =========================
// Main chat endpoint (Gemini with fallback)
// Frontend sends: { messages: [{ role, content }, ...], userId }
// We return: { reply, model, usage } and log to sessions if userId is present.
// =========================
app.post('/api/chat', async (req, res) => {
  const startTime = Date.now();

  try {
    const { messages, userId } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid request: messages array is required' });
    }

    if (!GEMINI_API_KEY) {
      console.error('ERROR: GEMINI_API_KEY not set in environment');
      return res.status(500).json({ error: 'Server configuration error: GEMINI_API_KEY missing' });
    }

    const contents = [];
    let systemPrefix = '';

    for (const msg of messages) {
      if (!msg.role || !msg.content) continue;

      if (msg.role === 'system') {
        systemPrefix += msg.content + '\n\n';
      } else {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: (systemPrefix ? systemPrefix : '') + msg.content }]
        });
        systemPrefix = '';
      }
    }

    if (contents.length === 0) {
      return res.status(400).json({ error: 'No valid user/assistant messages provided' });
    }

    const { reply, model, usage } = await callGeminiWithFallback(contents);

    const duration = Date.now() - startTime;
    console.log(`[Chat] Completed via model ${model} in ${duration}ms`);

    // Log to sessions table if we have a userId
    if (userId) {
      try {
        const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
        const inputText = lastUserMessage ? lastUserMessage.content : '';

        await pool.query(
          `INSERT INTO sessions (user_id, tool, subject, input_text, output_text)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            userId,
            'chat',    // generic tool name for now
            null,      // subject (you can pass it from the frontend later)
            inputText,
            reply
          ]
        );
      } catch (logErr) {
        console.error('Failed to log chat session:', logErr);
      }
    }

    return res.json({ reply, model, usage });
  } catch (err) {
    console.error('Chat endpoint error (Gemini fallback):', err);
    return res.status(500).json({
      error: 'AI service is currently unavailable. Please try again in a moment.',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// =========================
// Simple admin APIs (owner-only)
// =========================
function isAdmin(email) {
  return email === 'epicarkplayerpt@gmail.com';
}

// For now, use a header to prove admin identity: x-admin-email: your email
app.get('/api/admin/users', async (req, res) => {
  const adminEmail = req.header('x-admin-email');
  if (!adminEmail || !isAdmin(adminEmail)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const result = await pool.query(`
      SELECT id, google_id, email, name, picture_url, created_at, last_seen_at
      FROM users
      ORDER BY last_seen_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching admin users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/admin/sessions', async (req, res) => {
  const adminEmail = req.header('x-admin-email');
  if (!adminEmail || !isAdmin(adminEmail)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const result = await pool.query(`
      SELECT s.id, s.tool, s.subject, s.input_text, s.output_text, s.created_at,
             u.email, u.name
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
      LIMIT 500
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching admin sessions:', err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// =========================
// SPA catch-all route
// =========================
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =========================
// Error handling middleware
// =========================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

// =========================
// Start server
// =========================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║          StudySphere AI Workspace - Backend Server         ║
╠════════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT.toString().padEnd(27)}║
║  Provider:         Gemini (fallback chain)                 ║
║  Models (priority): ${GEMINI_MODEL_FALLBACKS.join('  >  ').padEnd(34)}║
║  GEMINI_API_KEY:   ${GEMINI_API_KEY ? '✓ Configured' : '✗ Missing (check .env)'}${GEMINI_API_KEY ? '                            ' : '                     '}║
║  GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID ? '✓ Configured' : '✗ Missing (check .env)'}${GOOGLE_CLIENT_ID ? '                            ' : '                     '}║
╚════════════════════════════════════════════════════════════╝
  `);

  if (!GEMINI_API_KEY) {
    console.warn('\n⚠️  WARNING: GEMINI_API_KEY is not set!');
    console.warn('   Create a .env file with: GEMINI_API_KEY=your_key_here\n');
  }
  if (!GOOGLE_CLIENT_ID) {
    console.warn('\n⚠️  WARNING: GOOGLE_CLIENT_ID is not set!');
    console.warn('   Create a .env file with: GOOGLE_CLIENT_ID=your_client_id_here\n');
  }
});

module.exports = app;