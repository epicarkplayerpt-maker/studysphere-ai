// server.js - StudySphere Backend using Gemini API

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// If your Node version is < 18, uncomment this:
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// =========================
// Gemini API configuration
// =========================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Your exact model id:
const GEMINI_MODEL = 'gemini-3.1-flash-lite';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    provider: 'gemini',
    model: GEMINI_MODEL,
    timestamp: new Date().toISOString()
  });
});

// =========================
// Main chat endpoint (Gemini)
// Frontend sends: { messages: [{ role, content }, ...] }
// We return: { reply: "..." }
// =========================
app.post('/api/chat', async (req, res) => {
  const startTime = Date.now();

  try {
    const { messages } = req.body;

    // Validate incoming payload
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid request: messages array is required' });
    }

    if (!GEMINI_API_KEY) {
      console.error('ERROR: GEMINI_API_KEY not set in environment');
      return res.status(500).json({ error: 'Server configuration error: GEMINI_API_KEY missing' });
    }

    // Convert OpenAI-style messages to Gemini "contents"
    // messages: [{ role: 'system'|'user'|'assistant', content: '...' }, ...]
    const contents = [];
    let systemPrefix = '';

    for (const msg of messages) {
      if (!msg.role || !msg.content) continue;

      if (msg.role === 'system') {
        // Gemini has no separate system role; treat as prefix instructions
        systemPrefix += msg.content + '\n\n';
      } else {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: (systemPrefix ? systemPrefix : '') + msg.content }]
        });
        // only apply system text once, then reset
        systemPrefix = '';
      }
    }

    if (contents.length === 0) {
      return res.status(400).json({ error: 'No valid user/assistant messages provided' });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(geminiUrl, {
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error (${response.status}):`, errorText);

      if (response.status === 401) {
        return res.status(401).json({ error: 'Gemini authentication failed. Check GEMINI_API_KEY.' });
      }
      if (response.status === 429) {
        return res.status(429).json({ error: 'Gemini rate limit exceeded. Please try again later.' });
      }

      return res.status(response.status).json({ error: `Gemini API error: ${response.status}` });
    }

    const data = await response.json();

    // Extract reply text from Gemini response
    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text || '')
        .join(' ')
        .trim() || 'No response was generated.';

    const duration = Date.now() - startTime;
    console.log(`[Chat] Provider: Gemini, Model: ${GEMINI_MODEL}, Duration: ${duration}ms`);

    return res.json({ reply });
  } catch (err) {
    console.error('Chat endpoint error (Gemini):', err);
    return res.status(500).json({
      error: 'Internal server error while calling Gemini',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// =========================
// SPA catch-all route
// =========================
// Serve index.html for any non-API route (so /, /whatever all load the SPA)
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
/* Start server */
// =========================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║          StudySphere AI Workspace - Backend Server         ║
╠════════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT.toString().padEnd(27)}║
║  Provider:         Gemini                                  ║
║  Model configured: ${GEMINI_MODEL.padEnd(38)}║
║  GEMINI_API_KEY:   ${GEMINI_API_KEY ? '✓ Configured' : '✗ Missing (check .env)'}${GEMINI_API_KEY ? '                            ' : '                     '}║
╚════════════════════════════════════════════════════════════╝
  `);

  if (!GEMINI_API_KEY) {
    console.warn('\n⚠️  WARNING: GEMINI_API_KEY is not set!');
    console.warn('   Create a .env file with: GEMINI_API_KEY=your_key_here\n');
  }
});

module.exports = app;