import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import logger from './logger';

/**
 * Extract raw text from file buffers based on MIME types.
 */
export async function parseFileBuffer(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  try {
    const lowerFilename = filename.toLowerCase();
    if (mimeType.startsWith('text/') || filename.match(/\.(txt|md|csv|html|xml|json|js|ts|tsx|py|java|c|cpp|go|rs|sql|sh|yml|yaml)$/i)) {
      return buffer.toString('utf8');
    } else if (mimeType === 'application/pdf' || lowerFilename.endsWith('.pdf')) {
      let parsedText = '';
      let pdfParser: any = pdfParse;
      
      // Unwrap default export if present
      if (pdfParser && pdfParser.default) {
        pdfParser = pdfParser.default;
      }

      // Method 1: Try class-based constructor on imported module (Kozan style: new pdfParser.PDFParse({ data: buffer }))
      if (!parsedText && pdfParser && typeof pdfParser.PDFParse === 'function') {
        try {
          const parser = new pdfParser.PDFParse({ data: buffer });
          const result = await parser.getText();
          parsedText = result?.text || '';
          await parser.destroy();
        } catch (e: any) {
          logger.debug('PDF Method 1 failed: %s', e.message || e);
        }
      }

      // Method 2: Try instantiating imported module directly as class constructor (Kozan style: new pdfParser({ data: buffer }))
      if (!parsedText && typeof pdfParser === 'function') {
        try {
          const parser = new (pdfParser as any)({ data: buffer });
          const result = await parser.getText();
          parsedText = result?.text || '';
          await parser.destroy();
        } catch (e: any) {
          logger.debug('PDF Method 2 failed: %s', e.message || e);
        }
      }

      // Method 3: Try standard function-based execution on imported module (Standard style: pdfParser(buffer))
      if (!parsedText && typeof pdfParser === 'function') {
        try {
          const data = await pdfParser(buffer);
          parsedText = data.text || '';
        } catch (e: any) {
          logger.debug('PDF Method 3 failed: %s', e.message || e);
        }
      }

      // Method 4: Fallback to dynamic require('pdf-parse') and check constructor/functions
      if (!parsedText) {
        try {
          const rawPdfParse = require('pdf-parse');
          let resolvedParser = rawPdfParse;
          if (resolvedParser && resolvedParser.default) {
            resolvedParser = resolvedParser.default;
          }

          // Method 4a: Check PDFParse property constructor on required module
          if (resolvedParser && typeof resolvedParser.PDFParse === 'function') {
            try {
              const parser = new resolvedParser.PDFParse({ data: buffer });
              const result = await parser.getText();
              parsedText = result?.text || '';
              await parser.destroy();
            } catch (e: any) {
              logger.debug('PDF Method 4a failed: %s', e.message || e);
            }
          }

          // Method 4b: Check if required module itself is the constructor
          if (!parsedText && typeof resolvedParser === 'function') {
            try {
              const parser = new (resolvedParser as any)({ data: buffer });
              const result = await parser.getText();
              parsedText = result?.text || '';
              await parser.destroy();
            } catch (e: any) {
              logger.debug('PDF Method 4b failed: %s', e.message || e);
            }
          }

          // Method 4c: Standard function-based execution on required module
          if (!parsedText && typeof resolvedParser === 'function') {
            try {
              const data = await resolvedParser(buffer);
              parsedText = data.text || '';
            } catch (e: any) {
              logger.debug('PDF Method 4c failed: %s', e.message || e);
            }
          }
        } catch (e: any) {
          logger.debug('PDF dynamic require fallback failed: %s', e.message || e);
        }
      }

      if (parsedText) {
        return parsedText;
      } else {
        logger.warn('All PDF parsing methods failed for %s, raising exception to invoke raw recovery.', filename);
        throw new Error('No functional PDF parser succeeded');
      }
    } else if (mimeType.includes('wordprocessingml.document') || lowerFilename.endsWith('.docx') || lowerFilename.endsWith('.doc')) {
      try {
        const data = await mammoth.extractRawText({ buffer });
        return data.value || '';
      } catch (docxErr) {
        logger.warn('DOCX parsing failed for %s, falling back to raw text recovery: %s', filename, docxErr);
        throw docxErr; // will be handled by outer catch
      }
    } else {
      return `[Raw File Decoded: ${filename} - MIME: ${mimeType}]`;
    }
  } catch (error) {
    logger.error('Error parsing file buffer for %s: %s', filename, error);
    // Graceful fallback: Extract clean ASCII printable strings from the buffer so the file ingestion succeeds.
    const cleanPreview = buffer.slice(0, 5000).toString('ascii').replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
    return `[Ingested File: ${filename} (MIME: ${mimeType}). Extraction failed, fallback preview content: ${cleanPreview.slice(0, 2000)}]`;
  }
}

/**
 * Semantically chunks source code files based on logical definitions (functions, classes, methods).
 */
export function chunkCode(code: string, filename: string): string[] {
  const lines = code.split('\n');
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentContext = 'Global Context';
  
  // Detect structural blocks (classes, functions, namespaces) across JS, TS, Python, C++, Go, Java
  const structurePatterns = [
    /class\s+([A-Za-z0-9_]+)/,
    /function\s+([A-Za-z0-9_]+)/,
    /def\s+([A-Za-z0-9_]+)/,
    /func\s+([A-Za-z0-9_]+)/,
    /const\s+([A-Za-z0-9_]+)\s*=\s*(async\s*)?\([^)]*\)\s*=>/,
    /struct\s+([A-Za-z0-9_]+)/,
    /interface\s+([A-Za-z0-9_]+)/,
    /type\s+([A-Za-z0-9_]+)/
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let matchedName = '';
    
    for (const pattern of structurePatterns) {
      const match = line.match(pattern);
      if (match && match[1]) {
        matchedName = match[1];
        break;
      }
    }

    // If we detect a new logical block and current chunk is large enough (e.g. 30 lines or 1500 chars), flush it
    if (matchedName && (currentChunk.length > 30 || currentChunk.join('\n').length > 1500)) {
      const header = `/* --- File: ${filename} | Context: ${currentContext} --- */\n`;
      chunks.push(header + currentChunk.join('\n'));
      currentChunk = [];
      currentContext = matchedName;
    }

    currentChunk.push(line);
  }

  if (currentChunk.length > 0) {
    const header = `/* --- File: ${filename} | Context: ${currentContext} --- */\n`;
    chunks.push(header + currentChunk.join('\n'));
  }

  return chunks;
}

/**
 * General text chunker for non-code assets (PDFs, Word docs, plain text)
 */
export function chunkText(text: string, filename: string, maxChunkSize = 4000): string[] {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentSize = 0;
  let chunkIndex = 1;

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;
    
    if (currentSize + trimmed.length > maxChunkSize && currentChunk.length > 0) {
      const header = `/* --- File: ${filename} | Section: ${chunkIndex} --- */\n`;
      chunks.push(header + currentChunk.join('\n\n'));
      currentChunk = [];
      currentSize = 0;
      chunkIndex++;
    }

    currentChunk.push(trimmed);
    currentSize += trimmed.length;
  }

  if (currentChunk.length > 0) {
    const header = `/* --- File: ${filename} | Section: ${chunkIndex} --- */\n`;
    chunks.push(header + currentChunk.join('\n\n'));
  }

  return chunks;
}

/**
 * Unified semantic index builder for multiple files
 */
export interface SemanticIndex {
  filename: string;
  fileType: string;
  chunks: string[];
}

export function buildSemanticIndex(files: { name: string; content: string; fileType: string }[]): SemanticIndex[] {
  return files.map(file => {
    const isCode = file.name.match(/\.(js|ts|tsx|py|java|c|cpp|go|rs|sh|sql)$/i) !== null;
    const chunks = isCode ? chunkCode(file.content, file.name) : chunkText(file.content, file.name);
    return {
      filename: file.name,
      fileType: file.fileType,
      chunks
    };
  });
}
