"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const child_process_1 = require("child_process");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Load environment variables
const envPath = path.join(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}
else {
    dotenv.config();
}
async function initDb() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('DATABASE_URL is not set.');
        process.exit(1);
    }
    console.log('Connecting to database to ensure pgvector is enabled...');
    const client = new pg_1.Client({
        connectionString: dbUrl,
    });
    try {
        await client.connect();
        console.log('Connected to PostgreSQL successfully.');
        // Enable pgvector extension
        console.log('Executing: CREATE EXTENSION IF NOT EXISTS vector;');
        await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
        console.log('pgvector extension is enabled.');
    }
    catch (err) {
        console.error('Error enabling pgvector extension:', err.message);
        process.exit(1);
    }
    finally {
        await client.end();
    }
    console.log('\nRunning database migrations via Prisma...');
    try {
        // Run prisma migrate deploy to apply migrations synchronously
        (0, child_process_1.execSync)('npx prisma migrate deploy', { stdio: 'inherit' });
        console.log('Database migrations deployed successfully.');
    }
    catch (err) {
        console.error('Prisma migration deployment failed:', err.message);
        process.exit(1);
    }
}
initDb();
