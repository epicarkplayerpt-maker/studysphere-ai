import { PrismaClient } from './src/generated/client';
import pdfParse from 'pdf-parse';

const prisma = new PrismaClient();

async function run() {
  try {
    const docs = await prisma.document.findMany({
      where: {
        fileType: 'application/pdf'
      }
    });

    for (const doc of docs) {
      console.log('------------------------------------');
      console.log('Document:', doc.name);
      console.log('Stored content in DB (first 200 chars):');
      console.log(JSON.stringify(doc.content.substring(0, 200)));
      
      if (doc.base64) {
        const buffer = Buffer.from(doc.base64, 'base64');
        try {
          const parser = new (pdfParse as any).PDFParse({ data: buffer });
          const result = await parser.getText();
          console.log(`Re-parsed text length: ${result?.text?.length}`);
          console.log(`Re-parsed text preview (first 200 chars):`);
          console.log(JSON.stringify(result?.text?.substring(0, 200)));
          await parser.destroy();
        } catch (e: any) {
          console.log(`Re-parsing failed: ${e.message}`);
        }
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
