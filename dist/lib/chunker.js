"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFileBuffer = parseFileBuffer;
exports.chunkCode = chunkCode;
exports.chunkText = chunkText;
exports.buildSemanticIndex = buildSemanticIndex;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
const logger_1 = __importDefault(require("./logger"));
/**
 * Extract raw text from file buffers based on MIME types.
 */
async function parseFileBuffer(buffer, mimeType, filename) {
    try {
        const lowerFilename = filename.toLowerCase();
        if (mimeType.startsWith('text/') || filename.match(/\.(txt|md|csv|html|xml|json|js|ts|tsx|py|java|c|cpp|go|rs|sql|sh|yml|yaml)$/i)) {
            return buffer.toString('utf8');
        }
        else if (mimeType === 'application/pdf' || lowerFilename.endsWith('.pdf')) {
            try {
                let pdfParser = pdf_parse_1.default;
                // Unwrap default export if present
                if (pdfParser && pdfParser.default) {
                    pdfParser = pdfParser.default;
                }
                // 1. Try class-based parser (Mehmet Kozan's version)
                if (pdfParser && typeof pdfParser.PDFParse === 'function') {
                    const parser = new pdfParser.PDFParse({ data: buffer });
                    const result = await parser.getText();
                    const text = result?.text || '';
                    await parser.destroy();
                    return text;
                }
                // 2. Try standard function-based parser
                if (typeof pdfParser === 'function') {
                    const data = await pdfParser(buffer);
                    return data.text || '';
                }
                // 3. Last resort require fallback
                const rawPdfParse = require('pdf-parse');
                // 3a. Try class-based parser on required module
                if (rawPdfParse && typeof rawPdfParse.PDFParse === 'function') {
                    const parser = new rawPdfParse.PDFParse({ data: buffer });
                    const result = await parser.getText();
                    const text = result?.text || '';
                    await parser.destroy();
                    return text;
                }
                // 3b. Try function-based parser on required module
                if (typeof rawPdfParse === 'function') {
                    const data = await rawPdfParse(buffer);
                    return data.text || '';
                }
                throw new Error('No functional PDF parser found');
            }
            catch (pdfErr) {
                logger_1.default.warn('PDF parsing failed for %s, falling back to raw text recovery: %s', filename, pdfErr);
                throw pdfErr; // will be handled by outer catch
            }
        }
        else if (mimeType.includes('wordprocessingml.document') || lowerFilename.endsWith('.docx') || lowerFilename.endsWith('.doc')) {
            try {
                const data = await mammoth_1.default.extractRawText({ buffer });
                return data.value || '';
            }
            catch (docxErr) {
                logger_1.default.warn('DOCX parsing failed for %s, falling back to raw text recovery: %s', filename, docxErr);
                throw docxErr; // will be handled by outer catch
            }
        }
        else {
            return `[Raw File Decoded: ${filename} - MIME: ${mimeType}]`;
        }
    }
    catch (error) {
        logger_1.default.error('Error parsing file buffer for %s: %s', filename, error);
        // Graceful fallback: Extract clean ASCII printable strings from the buffer so the file ingestion succeeds.
        const cleanPreview = buffer.slice(0, 5000).toString('ascii').replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
        return `[Ingested File: ${filename} (MIME: ${mimeType}). Extraction failed, fallback preview content: ${cleanPreview.slice(0, 2000)}]`;
    }
}
/**
 * Semantically chunks source code files based on logical definitions (functions, classes, methods).
 */
function chunkCode(code, filename) {
    const lines = code.split('\n');
    const chunks = [];
    let currentChunk = [];
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
function chunkText(text, filename, maxChunkSize = 4000) {
    const paragraphs = text.split(/\n\s*\n/);
    const chunks = [];
    let currentChunk = [];
    let currentSize = 0;
    let chunkIndex = 1;
    for (const paragraph of paragraphs) {
        const trimmed = paragraph.trim();
        if (!trimmed)
            continue;
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
function buildSemanticIndex(files) {
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
