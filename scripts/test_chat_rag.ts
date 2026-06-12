import { PrismaClient } from '../src/generated/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function run() {
  try {
    const binder = await prisma.binder.findFirst({
      include: { documents: true }
    });
    if (!binder) {
      console.log('No binders found in DB.');
      return;
    }
    console.log('Using binder ID:', binder.id);
    const mockVector = new Array(768).fill(0).map(() => Math.random() * 0.1);
    const vectorStr = `[${mockVector.join(',')}]`;
    console.log('Testing queryRawUnsafe with vectorStr length:', vectorStr.length);
    const relevantChunks = await prisma.$queryRawUnsafe<any[]>(
      `SELECT dc.content, d.name as "documentName", 1 - (dc.embedding <=> $1::vector) as similarity
       FROM "DocumentChunk" dc
       JOIN "Document" d ON dc."documentId" = d.id
       WHERE d."binderId" = $2
       ORDER BY dc.embedding <=> $1::vector
       LIMIT $3`,
      vectorStr,
      binder.id,
      6
    );
    console.log('Query succeeded! Results count:', relevantChunks.length);
    if (relevantChunks.length > 0) {
      console.log('First result similarity:', relevantChunks[0].similarity);
    }
  } catch (err: any) {
    console.error('Query failed with error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
