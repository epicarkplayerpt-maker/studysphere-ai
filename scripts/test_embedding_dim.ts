import { GeminiService } from '../src/services/gemini';
import dotenv from 'dotenv';
dotenv.config();

const gemini = new GeminiService();

async function run() {
  try {
    const embedding = await gemini.getEmbedding('test');
    console.log('Embedding dimension length:', embedding.length);
  } catch (err: any) {
    console.error('Failed to get embedding:', err.message);
  }
}

run();
