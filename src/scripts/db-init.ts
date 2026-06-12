import { Client } from 'pg';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
const envPath = path.join(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
} else {
  dotenv.config();
}

async function initDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }

  console.log('Connecting to database to ensure pgvector is enabled...');
  const client = new Client({
    connectionString: dbUrl,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully.');
    
    // Enable pgvector extension
    console.log('Executing: CREATE EXTENSION IF NOT EXISTS vector;');
    await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
    console.log('pgvector extension is enabled.');
  } catch (err: any) {
    console.error('Error enabling pgvector extension:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }

  console.log('\nRunning database migrations via Prisma...');
  try {
    // Run prisma migrate deploy to apply migrations synchronously
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Database migrations deployed successfully.');
  } catch (err: any) {
    console.error('Prisma migration deployment failed:', err.message);
    process.exit(1);
  }
}

initDb();
