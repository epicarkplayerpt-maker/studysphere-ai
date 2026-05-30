// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// If your Node version is < 18, uncomment the next two lines:
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());                   // Allow cross-origin in case you host frontend separately
app.use(express.json());           // Parse JSON request bodies

// Serve static frontend files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * AI Chat Proxy Endpoint
 * Secures the OpenRouter API key and handles the external request.
 *
 * Frontend should POST to /api/chat with:
 * {
 *   "messages": [
 *     { "role": "system", "content": "You are a helpful marketing assistant." },
 *     { "role": "user", "content": "Write a headline for ..." }
 *   ]
 * }
 */
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  // 1. Validate incoming payload
  if (!messages || !Array.isArray(messages)) {
    return res
      .status(400)
      .json({ error: 'Invalid request: A messages array is required.' });
  }

  // 2. Securely retrieve API key from environment variables
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('CRITICAL: OPENROUTER_API_KEY is not set in environment variables.');
    return res
      .status(500)
      .json({ error: 'Server configuration error. Please contact support.' });
  }

  try {
    // 3. Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',       // you can change this later
        'X-Title': 'Marketing AI Assistant'            // app name on OpenRouter
      },
      body: JSON.stringify({
        model: 'openrouter/free',                      // free router model
        messages: messages
      })
    });

    // 4. Handle OpenRouter errors gracefully
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`OpenRouter API Error (${response.status}):`, errorData);
      return res.status(response.status).json({
        error: 'The AI service is currently unavailable or rate-limited. Please try again later.'
      });
    }

    // 5. Parse and format the successful response
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response was generated.';

    res.json({ reply });
  } catch (error) {
    console.error('Internal Server Error during OpenRouter fetch:', error);
    res.status(500).json({ error: 'An unexpected internal server error occurred.' });
  }
});

// Serve index.html for the root path ONLY
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running securely on http://localhost:${PORT}`);
  console.log(`📂 Serving static files from: ${path.join(__dirname, 'public')}`);
});