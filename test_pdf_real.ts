import { PrismaClient } from './src/generated/client';

const prisma = new PrismaClient();

async function run() {
  try {
    const docs = await prisma.document.findMany({
      select: {
        id: true,
        name: true,
        fileType: true,
        content: true,
        base64: true
      }
    });

    console.log(`Found ${docs.length} total document(s) in DB:`);
    for (const doc of docs) {
      console.log(`- Name: ${doc.name}`);
      console.log(`  FileType: ${doc.fileType}`);
      console.log(`  Content Length: ${doc.content?.length || 0}`);
      console.log(`  Base64 Present: ${doc.base64 ? 'Yes' : 'No'} (length: ${doc.base64?.length || 0})`);
      if (doc.base64) {
        if (doc.fileType === 'application/pdf') {
          console.log(`  Attempting parser on ${doc.name}...`);
          const pdfParse = require('pdf-parse');
          const buffer = Buffer.from(doc.base64, 'base64');
          try {
            const result = await pdfParse(buffer);
            console.log(`  SUCCESS standard pdfParse: text length = ${result.text?.length}`);
            console.log(`  Preview: ${result.text?.substring(0, 150)}`);
          } catch (e: any) {
            console.log(`  FAILED standard pdfParse: ${e.message}`);
          }
          
          try {
            const parser = new pdfParse.PDFParse({ data: buffer });
            const result = await parser.getText();
            console.log(`  SUCCESS class PDFParse: text length = ${result?.text?.length}`);
          } catch (e: any) {
            console.log(`  FAILED class PDFParse: ${e.message}`);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
