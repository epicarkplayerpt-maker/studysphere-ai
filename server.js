// server.js - StudySphere Backend using Gemini API with model fallback

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

// Model priority list: best -> worst
const GEMINI_MODEL_FALLBACKS = [
  'gemini-3.5-flash',
  'gemini-3.1-pro',
  'gemini-3.1-flash',
  'gemini-3.1-flash-lite'
];

// Helper: call a specific Gemini model once
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

// Helper: try models in order until one succeeds or all fail
async function callGeminiWithFallback(contents) {
  const errors = [];

  for (const model of GEMINI_MODEL_FALLBACKS) {
    try {
      const response = await callGeminiModelOnce(model, contents);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error (${response.status}) with model ${model}:`, errorText);

        // Collect error info, then fall through to next model
        errors.push({ model, status: response.status, body: errorText });

        // Only short-circuit for certain client errors where retrying makes no sense
        if (response.status === 401) {
          // Auth problem: retrying with other models won't fix it
          throw new Error(`Gemini authentication failed with model ${model}.`);
        }

        continue; // try next model in the list
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
      // Try the next model
      continue;
    }
  }

  // If we reach here, all models failed
  console.error('All Gemini models failed in fallback chain:', errors);
  throw new Error('All Gemini models are currently unavailable. Please try again later.');
}

// Health check endpoint - report highest priority model and key status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    provider: 'gemini',
    primaryModel: GEMINI_MODEL_FALLBACKS[0],
    fallbackChain: GEMINI_MODEL_FALLBACKS,
    geminiApiKeyConfigured: Boolean(GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// =========================
// Main chat endpoint (Gemini with fallback)
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

    // Call Gemini with fallback across multiple models
    const { reply, model, usage } = await callGeminiWithFallback(contents);

    const duration = Date.now() - startTime;
    console.log(`[Chat] Completed via model ${model} in ${duration}ms`);

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
║  Provider:         Gemini (fallback chain)                 ║
║  Models (priority): ${GEMINI_MODEL_FALLBACKS.join('  >  ').padEnd(34)}║
║  GEMINI_API_KEY:   ${GEMINI_API_KEY ? '✓ Configured' : '✗ Missing (check .env)'}${GEMINI_API_KEY ? '                            ' : '                     '}║
╚════════════════════════════════════════════════════════════╝
  `);

  if (!GEMINI_API_KEY) {
    console.warn('\n⚠️  WARNING: GEMINI_API_KEY is not set!');
    console.warn('   Create a .env file with: GEMINI_API_KEY=your_key_here\n');
  }
});

module.exports = app;