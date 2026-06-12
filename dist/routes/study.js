"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordTokenUsage = recordTokenUsage;
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const logger_1 = __importDefault(require("../lib/logger"));
const upload_1 = require("../middleware/upload");
const chunker_1 = require("../lib/chunker");
const gemini_1 = require("../services/gemini");
const auth_1 = require("../middleware/auth");
const search_1 = require("../lib/search");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const gemini = new gemini_1.GeminiService();
/**
 * Helper to record token usage for Zenith AI API interactions
 */
async function recordTokenUsage(userId, modelName, usage, action) {
    try {
        if (!usage)
            return;
        const promptTokens = usage.promptTokenCount || 0;
        const completionTokens = usage.candidatesTokenCount || 0;
        const totalTokens = usage.totalTokenCount || (promptTokens + completionTokens);
        await prisma_1.default.tokenUsage.create({
            data: {
                userId,
                modelName,
                promptTokens,
                completionTokens,
                totalTokens,
                action,
            }
        });
    }
    catch (error) {
        logger_1.default.error('Failed to record token usage: %s', error.message);
    }
}
// ==========================================
// Zenith AI JSON Schemas
// ==========================================
const flashcardsSchema = {
    type: "array",
    description: "List of generated flashcards",
    items: {
        type: "object",
        properties: {
            front: {
                type: "string",
                description: "Clear, direct question or concept prompt for active recall (do not include the answer here)"
            },
            back: {
                type: "string",
                description: "A brief, accurate answer or explanation (maximum 2 sentences)"
            }
        },
        required: ["front", "back"]
    }
};
const podcastSchema = {
    type: "array",
    description: "List of dialogue turns in the podcast between Alex and Taylor",
    items: {
        type: "object",
        properties: {
            speaker: {
                type: "string",
                enum: ["Alex", "Taylor"],
                description: "The speaker name, either Alex or Taylor"
            },
            text: {
                type: "string",
                description: "The dialogue text spoken by the host"
            }
        },
        required: ["speaker", "text"]
    }
};
const examSchema = {
    type: "array",
    description: "List of mock exam questions",
    items: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                description: "Unique question index number starting from 1"
            },
            type: {
                type: "string",
                enum: ["mcq", "short", "code"],
                description: "Type of the question: mcq for multiple choice, short for conceptual short answer, code for programming tasks"
            },
            question: {
                type: "string",
                description: "The question text itself"
            },
            options: {
                type: "array",
                items: { type: "string" },
                description: "List of 4 multiple-choice options. Leave empty if type is short or code"
            },
            correctAnswer: {
                type: "string",
                description: "The correct answer explanation, key terms, or code snippet outline"
            }
        },
        required: ["id", "type", "question", "options", "correctAnswer"]
    }
};
const gradingSchema = {
    type: "object",
    properties: {
        score: {
            type: "integer",
            description: "Overall score from 0 to 100 percentage"
        },
        questionGrades: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    userAnswer: { type: "string" },
                    score: {
                        type: "integer",
                        description: "Score from 0 to 10"
                    },
                    feedback: { type: "string" }
                },
                required: ["question", "userAnswer", "score", "feedback"]
            }
        },
        gapAnalysis: {
            type: "string",
            description: "A markdown string analyzing the user's conceptual gaps"
        },
        suggestedPathways: {
            type: "array",
            items: { type: "string" },
            description: "List of suggested study pathways or next steps"
        }
    },
    required: ["score", "questionGrades", "gapAnalysis", "suggestedPathways"]
};
// Enforce authentication on all study routes
router.use(auth_1.checkAuthRequired);
// ==========================================
// 1. Binder Management Endpoints
// ==========================================
router.post('/binders', (0, validation_1.validateRequest)(validation_1.createBinderSchema), async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.userId;
        const binder = await prisma_1.default.binder.create({
            data: {
                userId,
                name,
                description: description || null,
            },
        });
        res.status(201).json(binder);
    }
    catch (error) {
        logger_1.default.error('Failed to create binder: %s', error.message);
        res.status(500).json({ error: 'Failed to create binder.' });
    }
});
router.get('/binders', async (req, res) => {
    try {
        const userId = req.user.userId;
        const binders = await prisma_1.default.binder.findMany({
            where: { userId },
            include: {
                _count: {
                    select: { documents: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ binders });
    }
    catch (error) {
        logger_1.default.error('Failed to fetch binders: %s', error.message);
        res.status(500).json({ error: 'Failed to fetch binders.' });
    }
});
router.delete('/binders/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        // Verify ownership
        const binder = await prisma_1.default.binder.findFirst({
            where: { id, userId },
        });
        if (!binder) {
            res.status(404).json({ error: 'Binder not found or unauthorized.' });
            return;
        }
        await prisma_1.default.binder.delete({
            where: { id },
        });
        res.json({ success: true, message: 'Binder and all its documents deleted.' });
    }
    catch (error) {
        logger_1.default.error('Failed to delete binder: %s', error.message);
        res.status(500).json({ error: 'Failed to delete binder.' });
    }
});
// ==========================================
// 2. Document & File Ingestion Endpoints
// ==========================================
// Helper to validate and sanitize uploaded files to prevent malware and injection
function validateAndSanitizeFile(file) {
    const allowedExtensions = [
        // Documents & Text
        'pdf', 'docx', 'doc', 'txt', 'md', 'rtf', 'odt', 'pages', 'csv', 'tsv',
        // Presentations & Spreadsheets
        'ppt', 'pptx', 'key', 'xls', 'xlsx', 'numbers',
        // Web & Code
        'js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'sh', 'yaml', 'yml',
        'java', 'c', 'cpp', 'h', 'cs', 'go', 'rs', 'sql', 'xml', 'swift', 'rb', 'php', 'pl',
        // Images & Media (Expanded with modern and common formats)
        'png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp', 'ico', 'avif', 'heic', 'heif', 'tiff', 'psd',
        // Audio & Video
        'mp3', 'wav', 'm4a', 'aac', 'ogg', 'mp4', 'mov', 'avi', 'mkv',
        // Archives & Configs
        'zip', 'tar', 'gz', 'rar', '7z', 'env', 'config', 'ini'
    ];
    // 1. Sanitize original filename (prevent path traversal and unsafe characters)
    let safeName = file.originalname || 'unnamed_file';
    // Remove multiple dots, path traversal patterns
    safeName = safeName.replace(/\.\.+/g, '.');
    safeName = safeName.replace(/[\/\\]/g, ''); // strip directory separators
    // Only allow alphanumeric, dots, hyphens, underscores, and spaces
    safeName = safeName.replace(/[^a-zA-Z0-9_\-\. ]/g, '').trim();
    if (!safeName || safeName === '.' || safeName.startsWith('.')) {
        safeName = `unnamed_file_${Date.now()}`;
    }
    // Get extension
    const parts = safeName.split('.');
    const ext = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'txt';
    if (!allowedExtensions.includes(ext)) {
        return { safeName, error: `Blocked: Extension '.${ext}' is not allowed for security reasons.` };
    }
    // 2. Validate MIME type
    // If it's a document/binary, verify type. If it's plain text or source code, bypass strict MIME check 
    // since different browsers/OS detect mimetypes of code files differently.
    const isPdfOrDocx = ext === 'pdf' || ext === 'docx' || ext === 'doc';
    if (isPdfOrDocx) {
        const allowedDocMimeTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'application/octet-stream' // fallback
        ];
        if (file.mimetype && !allowedDocMimeTypes.includes(file.mimetype)) {
            logger_1.default.warn('MIME type mismatch for file %s: %s (allowed: %j), but allowing fallback parsing.', safeName, file.mimetype, allowedDocMimeTypes);
        }
    }
    // 3. Signature (Magic Bytes) Verification for PDFs and DOCXs
    const buffer = file.buffer;
    if (!buffer || buffer.length < 4) {
        return { safeName, error: 'Blocked: File payload is empty or corrupted.' };
    }
    // PDF signature check: %PDF
    if (ext === 'pdf') {
        const isPdf = buffer.slice(0, 1024).toString('ascii').includes('%PDF');
        if (!isPdf) {
            logger_1.default.warn('PDF signature check mismatch for %s, passing to parser.', safeName);
        }
    }
    // DOCX signature check: PK ZIP
    if (ext === 'docx') {
        const isDocx = buffer[0] === 0x50 && buffer[1] === 0x4b;
        if (!isDocx) {
            logger_1.default.warn('DOCX signature check mismatch for %s, passing to parser.', safeName);
        }
    }
    return { safeName };
}
/**
 * Helper to recursively summarize long document texts using Zenith AI
 */
async function generateRecursiveSummary(text, filename, userId) {
    const maxSegmentLength = 15000;
    if (text.length <= maxSegmentLength) {
        const systemInstruction = `You are Zenith AI's high-fidelity summarizer. Synthesize the provided document text into a comprehensive, authoritative summary of about 300-500 words. Capture all key facts, terminology, structure, and formulas.`;
        const prompt = `Generate a high-fidelity summary for the file "${filename}":\n\n${text}`;
        const result = await gemini.generateResponse([{ role: 'user', content: prompt }], systemInstruction);
        await recordTokenUsage(userId, 'gemini-3.1-flash-lite', result.usage, 'Document Summarization');
        return result.text;
    }
    // Split and recursively summarize
    const segments = [];
    for (let i = 0; i < text.length; i += maxSegmentLength) {
        segments.push(text.substring(i, i + maxSegmentLength));
    }
    logger_1.default.info('Splitting long text into %d segments for recursive summarization.', segments.length);
    const summaries = [];
    for (let idx = 0; idx < segments.length; idx++) {
        const seg = segments[idx];
        const systemInstruction = `You are Zenith AI's high-fidelity summarizer. Synthesize this section of the document into a concise summary retaining key facts.`;
        const prompt = `Summarize section ${idx + 1} of the file "${filename}":\n\n${seg}`;
        const result = await gemini.generateResponse([{ role: 'user', content: prompt }], systemInstruction);
        await recordTokenUsage(userId, 'gemini-3.1-flash-lite', result.usage, 'Document Summarization');
        summaries.push(result.text);
    }
    const combinedSummaries = summaries.join('\n\n');
    return generateRecursiveSummary(combinedSummaries, filename, userId);
}
async function generateFlashcardsForBinderBackground(binderId, userId) {
    try {
        const binder = await prisma_1.default.binder.findFirst({
            where: { id: binderId, userId },
            include: { documents: true }
        });
        if (!binder || binder.documents.length === 0) {
            return;
        }
        const documentsText = binder.documents
            .map(doc => `[Doc: ${doc.name}]\n${doc.content}`)
            .join('\n\n');
        const systemPrompt = `
You are a StudySphere Flashcard Generator.
Analyze the provided study documents and generate 6-10 high-quality flashcards following the spaced repetition format.
Each flashcard must have a "front" (a clear, direct question, concept prompt, or fill-in-the-blank) and a "back" (a brief, accurate answer or explanation, maximum 2 sentences).

Your output MUST be a valid JSON array of flashcard objects:
[
  {
    "front": "Question details here...",
    "back": "Answer details here..."
  }
]

Strictly return ONLY the raw JSON array. Do not wrap it in markdown code blocks.
    `.trim();
        const response = await gemini.generateResponse([{ role: 'user', content: `Analyze the documents and generate a comprehensive set of flashcards:\n\n${documentsText}` }], systemPrompt, true, flashcardsSchema);
        await recordTokenUsage(userId, 'gemini-3.1-flash-lite', response.usage, 'Flashcard Generation (Auto)');
        let cleanJsonText = response.text.trim();
        if (cleanJsonText.startsWith('```')) {
            cleanJsonText = cleanJsonText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }
        const cards = JSON.parse(cleanJsonText);
        for (const card of cards) {
            if (card.front && card.back) {
                await prisma_1.default.flashcard.create({
                    data: {
                        userId,
                        front: card.front,
                        back: card.back,
                        interval: 0,
                        easeFactor: 2.5,
                        reps: 0,
                        nextReview: new Date(),
                    }
                });
            }
        }
        logger_1.default.info('Automatically generated and saved %d flashcards for user %s on upload.', cards.length, userId);
    }
    catch (error) {
        logger_1.default.error('Failed to auto-generate flashcards for binder %s: %s', binderId, error.stack || error.message);
    }
}
router.post('/binders/:binderId/documents', upload_1.upload.array('files', 10), async (req, res) => {
    try {
        const binderId = req.params.binderId;
        const userId = req.user.userId;
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({ error: 'No files uploaded.' });
            return;
        }
        // Verify binder ownership
        const binder = await prisma_1.default.binder.findFirst({
            where: { id: binderId, userId },
        });
        if (!binder) {
            res.status(404).json({ error: 'Binder not found or unauthorized.' });
            return;
        }
        const createdDocs = [];
        // Pre-validate all files in batch before ingesting to maintain transactional cleanliness
        for (const file of files) {
            const validation = validateAndSanitizeFile(file);
            if (validation.error) {
                logger_1.default.warn('Blocked upload attempt for file %s: %s', file.originalname, validation.error);
                res.status(400).json({ error: validation.error });
                return;
            }
            // Mutate the originalname and filename to use sanitized safeName
            file.originalname = validation.safeName;
        }
        for (const file of files) {
            let parsedText = await (0, chunker_1.parseFileBuffer)(file.buffer, file.mimetype, file.originalname);
            // Perform recursive summarization if text is long enough
            let summaryText = '';
            if (parsedText && parsedText.length > 15000) {
                logger_1.default.info('Document is long (%d chars). Generating recursive high-fidelity summary...', parsedText.length);
                try {
                    summaryText = await generateRecursiveSummary(parsedText, file.originalname, userId);
                    logger_1.default.info('Generated recursive summary for %s: %d characters.', file.originalname, summaryText.length);
                    parsedText = `[Project Zenith Recursive Document Summary]:\n${summaryText}\n\n[Full Document Text]:\n${parsedText}`;
                }
                catch (sumErr) {
                    logger_1.default.error('Failed to generate recursive summary: %s', sumErr.message);
                }
            }
            const doc = await prisma_1.default.document.create({
                data: {
                    binderId,
                    name: file.originalname,
                    fileType: file.mimetype || 'application/octet-stream',
                    content: parsedText || '',
                    base64: file.buffer.toString('base64'),
                },
            });
            // Segment text into semantic chunks
            const isCode = file.originalname.match(/\.(js|ts|tsx|py|java|c|cpp|go|rs|sh|sql)$/i) !== null;
            const chunks = isCode ? (0, chunker_1.chunkCode)(parsedText, file.originalname) : (0, chunker_1.chunkText)(parsedText, file.originalname);
            // Generate and save embeddings for chunks
            if (chunks && chunks.length > 0) {
                logger_1.default.info('Generating vector embeddings for %d chunk(s) of document %s...', chunks.length, file.originalname);
                try {
                    const embeddings = await gemini.getEmbeddings(chunks);
                    for (let i = 0; i < chunks.length; i++) {
                        const chunkText = chunks[i];
                        const vector = embeddings[i];
                        if (!vector)
                            continue;
                        const vectorStr = `[${vector.join(',')}]`;
                        await prisma_1.default.$executeRawUnsafe(`INSERT INTO "DocumentChunk" (id, "documentId", content, embedding, "createdAt") VALUES ($1, $2, $3, $4::vector, NOW())`, crypto_1.default.randomUUID(), doc.id, chunkText, vectorStr);
                    }
                    logger_1.default.info('Successfully stored vector chunks for document %s.', file.originalname);
                }
                catch (embErr) {
                    logger_1.default.error('Failed to generate/store embeddings for document %s: %s', file.originalname, embErr.message);
                    // Fall back gracefully so document upload still succeeds
                }
            }
            createdDocs.push({ id: doc.id, name: doc.name, size: parsedText.length });
        }
        // Auto-generate flashcards in the background asynchronously
        if (createdDocs.length > 0) {
            generateFlashcardsForBinderBackground(binderId, userId).catch(err => {
                logger_1.default.error('Background flashcard generation error for binder %s: %s', binderId, err.message);
            });
        }
        res.status(201).json({
            message: `Successfully uploaded and ingested ${createdDocs.length} files.`,
            documents: createdDocs,
        });
    }
    catch (error) {
        logger_1.default.error('File ingestion pipeline error: %s', error.message);
        res.status(500).json({ error: 'Failed to process files securely.' });
    }
});
router.post('/binders/:binderId/documents/url', async (req, res) => {
    try {
        const binderId = req.params.binderId;
        const userId = req.user.userId;
        const { url } = req.body;
        if (!url || typeof url !== 'string' || !url.startsWith('http')) {
            res.status(400).json({ error: 'A valid website URL starting with http/https is required.' });
            return;
        }
        // Verify binder ownership
        const binder = await prisma_1.default.binder.findFirst({
            where: { id: binderId, userId },
        });
        if (!binder) {
            res.status(404).json({ error: 'Binder not found or unauthorized.' });
            return;
        }
        // Fetch page content using our search library utility
        const content = await (0, search_1.fetchPageContent)(url);
        if (!content || content.trim().length === 0) {
            res.status(400).json({ error: 'Could not fetch readable text from this website. The page might be empty or blocking automated requests.' });
            return;
        }
        // Extract title from URL or generate a name
        let docName = url.replace(/^https?:\/\/(www\.)?/, '').substring(0, 50);
        if (docName.length === 50)
            docName += '...';
        docName = `[Web Scrape] ${docName}`;
        // Create document in binder
        const newDoc = await prisma_1.default.document.create({
            data: {
                binderId,
                name: docName,
                fileType: 'web-crawler',
                content,
            }
        });
        // Segment text into semantic chunks and generate vector embeddings
        const chunks = (0, chunker_1.chunkText)(content, docName);
        if (chunks && chunks.length > 0) {
            logger_1.default.info('Generating vector embeddings for %d chunk(s) of URL %s...', chunks.length, url);
            try {
                const embeddings = await gemini.getEmbeddings(chunks);
                for (let i = 0; i < chunks.length; i++) {
                    const chunkTextVal = chunks[i];
                    const vector = embeddings[i];
                    if (!vector)
                        continue;
                    const vectorStr = `[${vector.join(',')}]`;
                    await prisma_1.default.$executeRawUnsafe(`INSERT INTO "DocumentChunk" (id, "documentId", content, embedding, "createdAt") VALUES ($1, $2, $3, $4::vector, NOW())`, crypto_1.default.randomUUID(), newDoc.id, chunkTextVal, vectorStr);
                }
                logger_1.default.info('Successfully stored vector chunks for URL %s.', url);
            }
            catch (embErr) {
                logger_1.default.error('Failed to generate/store embeddings for URL %s: %s', url, embErr.message);
                // Fall back gracefully so document creation still succeeds
            }
        }
        // Auto-generate flashcards in background asynchronously
        generateFlashcardsForBinderBackground(binderId, userId).catch(err => {
            logger_1.default.error('Failed to auto-generate flashcards for binder %s: %s', binderId, err.stack || err.message);
        });
        res.status(201).json({
            message: 'Successfully scraped page and added to binder.',
            document: {
                id: newDoc.id,
                name: newDoc.name,
                fileType: newDoc.fileType,
                createdAt: newDoc.createdAt
            }
        });
    }
    catch (error) {
        logger_1.default.error('Failed to scrape and ingest URL: %s', error.stack || error.message);
        res.status(500).json({ error: 'Failed to scrape and ingest URL.' });
    }
});
router.get('/binders/:binderId/documents', async (req, res) => {
    try {
        const binderId = req.params.binderId;
        const userId = req.user.userId;
        // Verify binder ownership
        const binder = await prisma_1.default.binder.findFirst({
            where: { id: binderId, userId },
        });
        if (!binder) {
            res.status(404).json({ error: 'Binder not found or unauthorized.' });
            return;
        }
        const documents = await prisma_1.default.document.findMany({
            where: { binderId },
            select: {
                id: true,
                name: true,
                fileType: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ documents });
    }
    catch (error) {
        logger_1.default.error('Failed to fetch documents: %s', error.message);
        res.status(500).json({ error: 'Failed to fetch documents.' });
    }
});
router.get('/documents/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const doc = await prisma_1.default.document.findFirst({
            where: {
                id,
                binder: { userId },
            },
        });
        if (!doc) {
            res.status(404).json({ error: 'Document not found or unauthorized.' });
            return;
        }
        res.json({ document: doc });
    }
    catch (error) {
        logger_1.default.error('Failed to fetch document content: %s', error.message);
        res.status(500).json({ error: 'Failed to fetch document content.' });
    }
});
router.delete('/documents/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const doc = await prisma_1.default.document.findFirst({
            where: {
                id,
                binder: { userId },
            },
        });
        if (!doc) {
            res.status(404).json({ error: 'Document not found or unauthorized.' });
            return;
        }
        await prisma_1.default.document.delete({
            where: { id },
        });
        res.json({ success: true, message: 'Document deleted successfully.' });
    }
    catch (error) {
        logger_1.default.error('Failed to delete document: %s', error.message);
        res.status(500).json({ error: 'Failed to delete document.' });
    }
});
// ==========================================
// 3. Multi-File Semantic Synthesis Route
// ==========================================
router.post('/query', (0, validation_1.validateRequest)(validation_1.querySchema), async (req, res) => {
    try {
        const binderId = req.body.binderId;
        const query = req.body.query;
        const deepResearch = req.body.deepResearch;
        const userId = req.user.userId;
        let contextText = '';
        let binderName = 'All Global Binders';
        // 1. Vector Database RAG Retrieval
        let dbChunks = [];
        let hasSemanticResults = false;
        // Scan for explicit URLs in user query
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matchedUrls = query.match(urlRegex) || [];
        let directScrapedContextText = '';
        if (matchedUrls.length > 0) {
            logger_1.default.info('Detected URLs in query: %s. Performing direct page scrapes...', matchedUrls.join(', '));
            const uniqueUrls = [...new Set(matchedUrls)].slice(0, 3);
            const directScraped = await Promise.all(uniqueUrls.map(async (url, idx) => {
                try {
                    const content = await (0, search_1.fetchPageContent)(url);
                    return {
                        index: idx + 1,
                        url,
                        content: content || 'Failed to retrieve page text.'
                    };
                }
                catch (err) {
                    logger_1.default.warn('Failed to scrape URL %s in study query: %s', url, err);
                    return {
                        index: idx + 1,
                        url,
                        content: 'Failed to retrieve page text.'
                    };
                }
            }));
            directScrapedContextText = directScraped
                .map(p => `[Scraped Link #${p.index}]\nURL: ${p.url}\nContent:\n${p.content}`)
                .join('\n\n');
        }
        // Generate query embedding
        logger_1.default.info('Generating embedding for user search query...');
        const queryEmbedding = await gemini.getEmbedding(query);
        const vectorStr = `[${queryEmbedding.join(',')}]`;
        if (binderId) {
            const binder = await prisma_1.default.binder.findFirst({
                where: { id: binderId, userId },
            });
            if (!binder) {
                res.status(404).json({ error: 'Binder not found or unauthorized.' });
                return;
            }
            binderName = binder.name;
            try {
                // Query database for matching chunks in this binder
                dbChunks = await prisma_1.default.$queryRawUnsafe(`SELECT dc.content, d.name as "documentName", 1 - (dc.embedding <=> $1::vector) as similarity
           FROM "DocumentChunk" dc
           JOIN "Document" d ON dc."documentId" = d.id
           WHERE d."binderId" = $2
           ORDER BY dc.embedding <=> $1::vector
           LIMIT $3`, vectorStr, binderId, 12);
                if (dbChunks && dbChunks.length > 0) {
                    hasSemanticResults = true;
                }
            }
            catch (ragErr) {
                logger_1.default.error('PGVector binder query failed, falling back: %s', ragErr.message);
            }
            // Fallback direct DB load if pgvector fails or yields empty results
            if (!hasSemanticResults) {
                const binderDocs = await prisma_1.default.document.findMany({
                    where: { binderId },
                    select: { name: true, content: true }
                });
                if (binderDocs.length > 0) {
                    let fallbackText = '';
                    for (const doc of binderDocs) {
                        if (doc.content) {
                            const docSnippet = doc.content.substring(0, 150000); // Limit size per file to prevent prompt overflow
                            fallbackText += `<chunk index="fallback" document="${doc.name}" similarity="fallback">\n${docSnippet}\n</chunk>\n\n`;
                        }
                    }
                    contextText = fallbackText.trim();
                }
            }
        }
        else {
            try {
                // Query database for matching chunks globally across all binders of this user
                dbChunks = await prisma_1.default.$queryRawUnsafe(`SELECT dc.content, d.name as "documentName", 1 - (dc.embedding <=> $1::vector) as similarity
           FROM "DocumentChunk" dc
           JOIN "Document" d ON dc."documentId" = d.id
           JOIN "Binder" b ON d."binderId" = b.id
           WHERE b."userId" = $2
           ORDER BY dc.embedding <=> $1::vector
           LIMIT $3`, vectorStr, userId, 12);
                if (dbChunks && dbChunks.length > 0) {
                    hasSemanticResults = true;
                }
            }
            catch (ragErr) {
                logger_1.default.error('PGVector global query failed, falling back: %s', ragErr.message);
            }
            // Fallback direct DB load if pgvector fails or yields empty results
            if (!hasSemanticResults) {
                const userDocs = await prisma_1.default.document.findMany({
                    where: { binder: { userId } },
                    select: { name: true, content: true }
                });
                if (userDocs.length > 0) {
                    let fallbackText = '';
                    for (const doc of userDocs) {
                        if (doc.content) {
                            const docSnippet = doc.content.substring(0, 150000); // Limit size per file to prevent prompt overflow
                            fallbackText += `<chunk index="fallback" document="${doc.name}" similarity="fallback">\n${docSnippet}\n</chunk>\n\n`;
                        }
                    }
                    contextText = fallbackText.trim();
                }
            }
        }
        if (hasSemanticResults && dbChunks && dbChunks.length > 0) {
            contextText = dbChunks
                .map((c, idx) => `<chunk index="${idx}" document="${c.documentName}" similarity="${Number(c.similarity).toFixed(3)}">\n${c.content}\n</chunk>`)
                .join('\n\n');
        }
        // 2. Deep Research / Antigravity Theory Module (Web Search)
        let webSearchText = '';
        const isAntigravityQuery = query.toLowerCase().match(/(antigravity|anti-gravity|propulsion|biefeld|electrogravitics|warp drive|alcubierre|gravitational)/i) !== null;
        if (deepResearch || isAntigravityQuery) {
            logger_1.default.info('Deep Research Mode activated (Query: "%s"). Initiating scientific literature web crawl...', query);
            try {
                const webResults = await (0, search_1.searchWeb)(query);
                if (webResults && webResults.length > 0) {
                    webSearchText = webResults
                        .map((res, idx) => `<web_result index="${idx}" title="${res.title}" url="${res.url}">\n${res.snippet}\n</web_result>`)
                        .join('\n\n');
                }
            }
            catch (webErr) {
                logger_1.default.error('Deep Research web search failed: %s', webErr);
            }
        }
        if (!contextText.trim() && !webSearchText.trim() && !directScrapedContextText.trim()) {
            res.status(400).json({ error: 'No relevant study materials found. Please upload documents to your binder or provide a web URL first.' });
            return;
        }
        // Combine database context and web search context
        let combinedContext = '';
        if (contextText.trim()) {
            combinedContext += `<vector_database_context>\n${contextText}\n</vector_database_context>\n\n`;
        }
        if (webSearchText.trim()) {
            combinedContext += `<web_search_context>\n${webSearchText}\n</web_search_context>\n\n`;
        }
        if (directScrapedContextText.trim()) {
            combinedContext += `<direct_scraped_contents>\n${directScrapedContextText}\n</direct_scraped_contents>\n\n`;
        }
        // Fetch custom instructions
        const userRecord = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { customInstructions: true },
        });
        const customInstructions = userRecord?.customInstructions || '';
        // Format request following strict XML encapsulation mandates
        const wrappedPrompt = gemini.wrapInXmlTags({ binderId: binderId || 'global', binderName, userId, deepResearch: !!(deepResearch || isAntigravityQuery) }, combinedContext, query);
        const systemInstruction = `
You are the Zenith AI Interactive Assistant (never refer to yourself as Google Gemini or a Gemini model. You are Zenith AI, created by the Zenith team).
Analyze the user query based on the encapsulated files, web results, and scraped contents inside the XML tags.

[HIGH-FIDELITY RETRIEVAL & NO-HALLUCINATION MODE]
You operate in High-Fidelity Retrieval mode. When answering questions:
1. Prioritize peer-reviewed scientific journals, authoritative textbook chapters, government (.gov/.edu) publications, and primary sources.
2. Always cite specific source files, section names, or paper titles when citing information.
3. STRICT HALLUCINATION RULE: You must NEVER hallucinate, invent facts, or present unverified information. If the exact answer is not present in the provided document context or authoritative search results, or if you do not know something, explicitly state: "I do not have access to that information in the provided context." Do not fabricate answers.
4. Ensure complete fidelity to technical terms, definitions, formulas, and data structures.

Other Guidelines:
1. Identify concept overlaps and synthesise connections between multiple database chunks and web search results.
2. Resolve potential contradictions or terminology differences.
3. Cite specific file names or web result titles and URLs when referencing information.
4. If the user greets you or asks simple questions (like 'hi', 'hello'), respond in a conversational tone without code blocks or diagrams.
5. When writing diagrams, use Mermaid syntax enclosed in \`\`\`mermaid blocks. Follow these strict rules to prevent rendering syntax errors:
   - Every node label containing parentheses, brackets, quotes, braces, commas, or special punctuation MUST be wrapped in double quotes. Example: A["My Label (Special)"].
   - Avoid any HTML tags in labels.
   - Keep flowcharts simple (e.g., graph TD).
${customInstructions ? `\n[USER PERSONALIZATION PREFERENCES]\nAdhere to the following personalization rules and constraints:\n${customInstructions}` : ''}
    `.trim();
        const result = await gemini.generateResponse([{ role: 'user', content: wrappedPrompt }], systemInstruction);
        // Record token usage
        await recordTokenUsage(userId, 'gemini-3.1-flash-lite', result.usage, 'Synthesis Query');
        // Save historical study record (skip for guest users)
        if (!req.user.isGuest) {
            await prisma_1.default.studyHistory.create({
                data: {
                    userId,
                    query,
                    response: result.text,
                },
            });
        }
        res.json({
            response: result.text,
            model: 'gemini-3.1-flash-lite',
            usage: result.usage || null,
        });
    }
    catch (error) {
        logger_1.default.error('Semantic Synthesis Query Error: %s', error.stack || error.message);
        res.status(500).json({ error: 'Failed to process semantic synthesis query.' });
    }
});
// ==========================================
// 4. Interactive Spaced Repetition (SRS)
// ==========================================
router.post('/binders/:binderId/flashcards/generate', async (req, res) => {
    try {
        const binderId = req.params.binderId;
        const userId = req.user.userId;
        const { prompt, count } = req.body;
        const binder = await prisma_1.default.binder.findFirst({
            where: { id: binderId, userId },
            include: { documents: true }
        });
        if (!binder) {
            res.status(404).json({ error: 'Binder not found or unauthorized.' });
            return;
        }
        if (binder.documents.length === 0) {
            res.status(400).json({ error: 'No documents in this binder. Please upload files first.' });
            return;
        }
        const documentsText = binder.documents
            .map(doc => `[Doc: ${doc.name}]\n${doc.content}`)
            .join('\n\n');
        const cardCount = count ? parseInt(count, 10) : 10;
        const customPromptInstruction = prompt ? `\nFocus instructions: ${prompt}\n` : '';
        const systemPrompt = `
You are a StudySphere Flashcard Generator.
Analyze the provided study documents and generate exactly ${cardCount} high-quality flashcards following the spaced repetition format.${customPromptInstruction}
Each flashcard must have a "front" (a clear, direct question, concept prompt, or fill-in-the-blank) and a "back" (a brief, accurate answer or explanation, maximum 2 sentences).

Your output MUST be a valid JSON array of flashcard objects:
[
  {
    "front": "Question details here...",
    "back": "Answer details here..."
  }
]

Strictly return ONLY the raw JSON array. Do not wrap it in markdown code blocks.
    `.trim();
        const response = await gemini.generateResponse([{ role: 'user', content: `Analyze the documents and generate a comprehensive set of flashcards:\n\n${documentsText}` }], systemPrompt, true, // responseJson flag to force valid JSON output
        flashcardsSchema);
        // Record token usage
        await recordTokenUsage(userId, 'gemini-3.1-flash-lite', response.usage, 'Flashcard Generation');
        let cleanJsonText = response.text.trim();
        if (cleanJsonText.startsWith('```')) {
            cleanJsonText = cleanJsonText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }
        const cards = JSON.parse(cleanJsonText);
        // Save these cards to the database for this user
        const createdCards = [];
        for (const card of cards) {
            if (card.front && card.back) {
                const savedCard = await prisma_1.default.flashcard.create({
                    data: {
                        userId,
                        front: card.front,
                        back: card.back,
                        interval: 0,
                        easeFactor: 2.5,
                        reps: 0,
                        nextReview: new Date(),
                    }
                });
                createdCards.push(savedCard);
            }
        }
        res.json({ flashcards: createdCards });
    }
    catch (error) {
        logger_1.default.error('Failed to auto-generate and save flashcards for binder %s: %s', req.params.binderId, error.stack || error.message);
        res.status(500).json({ error: 'Failed to auto-generate flashcards.' });
    }
});
router.post('/flashcards/generate', async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user.userId;
        if (!text || typeof text !== 'string') {
            res.status(400).json({ error: 'Text content is required for flashcard generation.' });
            return;
        }
        const systemPrompt = `
You are a StudySphere Flashcard Generator.
Analyze the provided study text and distill it into 1 to 3 high-quality flashcards following the spaced repetition format.
Each flashcard must have a "front" (a clear, direct question, concept prompt, or fill-in-the-blank) and a "back" (a brief, accurate answer or explanation, maximum 2 sentences).

Your output MUST be a valid JSON array of flashcard objects:
[
  {
    "front": "Question details here...",
    "back": "Answer details here..."
  }
]

Strictly return ONLY the raw JSON array. Do not wrap it in markdown code blocks.
    `.trim();
        const response = await gemini.generateResponse([{ role: 'user', content: `Analyze this text and generate flashcards:\n\n${text}` }], systemPrompt, true, // responseJson flag to force valid JSON output
        flashcardsSchema);
        // Record token usage
        await recordTokenUsage(userId, 'gemini-3.1-flash-lite', response.usage, 'Flashcard Generation');
        let cleanJsonText = response.text.trim();
        if (cleanJsonText.startsWith('```')) {
            cleanJsonText = cleanJsonText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }
        const cards = JSON.parse(cleanJsonText);
        res.json({ cards });
    }
    catch (error) {
        logger_1.default.error('Failed to generate flashcards: %s', error.stack || error.message);
        res.status(500).json({ error: 'Failed to generate flashcards.' });
    }
});
router.post('/flashcards', (0, validation_1.validateRequest)(validation_1.createFlashcardSchema), async (req, res) => {
    try {
        const { front, back } = req.body;
        const userId = req.user.userId;
        const flashcard = await prisma_1.default.flashcard.create({
            data: {
                userId,
                front,
                back,
                interval: 0,
                easeFactor: 2.5,
                reps: 0,
                nextReview: new Date(),
            },
        });
        res.status(201).json(flashcard);
    }
    catch (error) {
        logger_1.default.error('Failed to create flashcard: %s', error.message);
        res.status(500).json({ error: 'Failed to create flashcard.' });
    }
});
router.get('/flashcards', async (req, res) => {
    try {
        const userId = req.user.userId;
        const dueOnly = req.query.due === 'true';
        const whereClause = { userId };
        if (dueOnly) {
            whereClause.nextReview = { lte: new Date() };
        }
        const flashcards = await prisma_1.default.flashcard.findMany({
            where: whereClause,
            orderBy: { nextReview: 'asc' },
        });
        res.json({ flashcards });
    }
    catch (error) {
        logger_1.default.error('Failed to fetch flashcards: %s', error.message);
        res.status(500).json({ error: 'Failed to fetch flashcards.' });
    }
});
// SuperMemo-2 (SM-2) Variant grading
router.post('/flashcards/grade', (0, validation_1.validateRequest)(validation_1.gradeFlashcardSchema), async (req, res) => {
    try {
        const { flashcardId, score } = req.body; // Score: 0 (blackout) to 5 (perfect)
        const userId = req.user.userId;
        const card = await prisma_1.default.flashcard.findFirst({
            where: { id: flashcardId, userId },
        });
        if (!card) {
            res.status(404).json({ error: 'Flashcard not found or unauthorized.' });
            return;
        }
        let interval = 1;
        let easeFactor = card.easeFactor;
        let reps = card.reps;
        if (score >= 3) {
            if (reps === 0) {
                interval = 1;
            }
            else if (reps === 1) {
                interval = 6;
            }
            else {
                interval = Math.ceil(card.interval * easeFactor);
            }
            reps++;
        }
        else {
            reps = 0;
            interval = 1;
        }
        // Adjust ease factor
        easeFactor = easeFactor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02));
        if (easeFactor < 1.3) {
            easeFactor = 1.3;
        }
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + interval);
        const updatedCard = await prisma_1.default.flashcard.update({
            where: { id: flashcardId },
            data: {
                interval,
                easeFactor,
                reps,
                nextReview,
            },
        });
        res.json({
            message: 'Flashcard graded successfully.',
            flashcard: updatedCard,
        });
    }
    catch (error) {
        logger_1.default.error('Failed to grade flashcard: %s', error.message);
        res.status(500).json({ error: 'Failed to process card grading.' });
    }
});
// ==========================================
// 5. Adaptive Mock Exam Engine
// ==========================================
router.post('/binders/:binderId/exam', (0, validation_1.validateRequest)(validation_1.generateQuizSchema), async (req, res) => {
    try {
        const binderId = req.params.binderId;
        const { questionCount } = req.body;
        const userId = req.user.userId;
        const binder = await prisma_1.default.binder.findFirst({
            where: { id: binderId, userId },
            include: { documents: true },
        });
        if (!binder) {
            res.status(404).json({ error: 'Binder not found or unauthorized.' });
            return;
        }
        const documentsText = binder.documents.map(doc => `[Doc: ${doc.name}]\n${doc.content}`).join('\n\n');
        if (binder.documents.length === 0) {
            res.status(400).json({ error: 'No files are present in the binder. Please upload files before starting an exam.' });
            return;
        }
        const attachments = binder.documents
            .filter(doc => doc.base64)
            .map(doc => ({
            inlineData: {
                data: doc.base64,
                mimeType: doc.fileType || 'application/pdf',
            }
        }))
            .slice(0, 3);
        // Fetch custom instructions
        const userRecord = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { customInstructions: true },
        });
        const customInstructions = userRecord?.customInstructions || '';
        const systemPrompt = `
You are an Academic Exam Evaluator.
Generate a structured mock exam containing exactly ${questionCount} questions based on the provided study files.
The questions must be highly tailored to the topics discussed, and should include:
- Multiple-choice questions (MCQs)
- Short answer conceptual explanations
- Debugging or coding challenges (if source code or computer science concepts are present)

Output MUST be a valid JSON array and nothing else. Avoid markdown wrapping blocks like \`\`\`json. Output format details:
[
  {
    "id": 1,
    "type": "mcq" | "short" | "code",
    "question": "question text",
    "options": ["A", "B", "C", "D"], // Only if type is mcq, empty array if not
    "correctAnswer": "correct response description or code snippet outline"
  }
]
${customInstructions ? `\n[USER PERSONALIZATION PREFERENCES]\nIncorporate the following personalization/memory preferences into the style or focus of the questions:\n${customInstructions}` : ''}
    `.trim();
        const response = await gemini.generateResponse([{
                role: 'user',
                content: documentsText || 'Please read the attached documents and generate the exam.',
                attachments: attachments.length > 0 ? attachments : undefined
            }], systemPrompt, true, examSchema);
        // Record token usage
        await recordTokenUsage(userId, 'gemini-3.1-flash-lite', response.usage, 'Exam Generation');
        let cleanJsonText = response.text.trim();
        // Strip markdown formatting if present
        if (cleanJsonText.startsWith('```')) {
            cleanJsonText = cleanJsonText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }
        try {
            const examQuestions = JSON.parse(cleanJsonText);
            res.json({ questions: examQuestions });
        }
        catch (parseErr) {
            logger_1.default.error('JSON parsing failure from Zenith AI Exam Generator output: %s\nRaw output: %s', parseErr, response.text);
            res.status(500).json({ error: 'Failed to format mock exam. Try generating again.' });
        }
    }
    catch (error) {
        logger_1.default.error('Mock Exam Generation Error: %s', error.stack || error.message);
        res.status(500).json({ error: 'Error generating mock exam.' });
    }
});
router.post('/exam/grade', (0, validation_1.validateRequest)(validation_1.gradeQuizSchema), async (req, res) => {
    try {
        const { quizAnswers } = req.body; // Array of { question: string, userAnswer: string }
        const userId = req.user.userId;
        const gradingContext = JSON.stringify(quizAnswers);
        const systemPrompt = `
You are an AI Study Tutor grading an exam.
Analyze the user's answers against the questions and determine their scores.
Provide:
1. An overall score (0 to 100 percentage).
2. Individual grades for each question, including specific helpful feedback.
3. A "gapAnalysis" (detailed assessment of what concepts the user struggled with).
4. "suggestedPathways" (an array of actionable learning steps or topics to study).

Output must be a valid JSON object. Do not include markdown formatting blocks like \`\`\`json. Format structure:
{
  "score": 85,
  "questionGrades": [
    {
      "question": "question text",
      "userAnswer": "answer text",
      "score": 10, // out of 10
      "feedback": "constructive feedback"
    }
  ],
  "gapAnalysis": "markdown string of conceptual gaps",
  "suggestedPathways": ["Study topic A in notes", "Practice more code on B"]
}
    `.trim();
        const response = await gemini.generateResponse([{ role: 'user', content: gradingContext }], systemPrompt, true, gradingSchema);
        let cleanJsonText = response.text.trim();
        if (cleanJsonText.startsWith('```')) {
            cleanJsonText = cleanJsonText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }
        try {
            const evaluation = JSON.parse(cleanJsonText);
            res.json(evaluation);
        }
        catch (parseErr) {
            logger_1.default.error('JSON parsing failure from Zenith AI Exam Grader output: %s\nRaw output: %s', parseErr, response.text);
            res.status(500).json({ error: 'Failed to grade mock exam.' });
        }
    }
    catch (error) {
        logger_1.default.error('Mock Exam Grading Error: %s', error.stack || error.message);
        res.status(500).json({ error: 'Error grading exam answers.' });
    }
});
// ==========================================
// 6. Study History & Session Stats
// ==========================================
router.get('/history', async (req, res) => {
    try {
        const userId = req.user.userId;
        const history = await prisma_1.default.studyHistory.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
        res.json({ history });
    }
    catch (error) {
        logger_1.default.error('Failed to fetch study history: %s', error.message);
        res.status(500).json({ error: 'Failed to fetch history.' });
    }
});
// ==========================================
// 7. Source Study Guide & Audio Podcast
// ==========================================
router.post('/binders/:binderId/guide', async (req, res) => {
    try {
        const binderId = req.params.binderId;
        const userId = req.user.userId;
        const binder = await prisma_1.default.binder.findFirst({
            where: { id: binderId, userId },
            include: { documents: true },
        });
        if (!binder) {
            res.status(404).json({ error: 'Binder not found or unauthorized.' });
            return;
        }
        const documentsText = binder.documents.map(doc => `[Document: ${doc.name}]\n${doc.content}`).join('\n\n');
        if (binder.documents.length === 0) {
            res.status(400).json({ error: 'No documents in this binder. Please upload files first.' });
            return;
        }
        const attachments = binder.documents
            .filter(doc => doc.base64)
            .map(doc => ({
            inlineData: {
                data: doc.base64,
                mimeType: doc.fileType || 'application/pdf',
            }
        }))
            .slice(0, 3);
        // Fetch custom instructions
        const userRecord = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { customInstructions: true },
        });
        const customInstructions = userRecord?.customInstructions || '';
        const systemPrompt = `
You are an expert Academic Advisor and Content Synthesizer.
Analyze the provided study documents and compile a comprehensive, highly-structured Study Guide in Markdown.
The study guide should be written in an elegant, clear, and publication-ready academic tone.
Structure it with the following sections (use clear headings):
1. # Executive Briefing: High-level overview of the binder's subject matter.
2. # Core Concepts & Terminology: A bulleted glossary defining critical terms, equations, or paradigms.
3. # Detailed Subject Breakdown: A deep-dive logical explanation of the primary topics found in the files.
4. # Frequently Asked Questions (FAQ): 5-7 conceptual study questions with detailed explanations.
5. # Actionable Key Takeaways: High-yield summaries or recommendations for mastering this material.

Cite specific document names (e.g. "[Doc: filename]") when explaining concepts.
Do not use summaries, truncations, or placeholders. Generate the full text completely.
${customInstructions ? `\n[USER PERSONALIZATION PREFERENCES]\nAdhere to the following personalization rules and constraints:\n${customInstructions}` : ''}
    `.trim();
        const response = await gemini.generateResponse([{
                role: 'user',
                content: documentsText || 'Please read the attached documents and compile a Study Guide.',
                attachments: attachments.length > 0 ? attachments : undefined
            }], systemPrompt);
        res.json({ guide: response.text });
    }
    catch (error) {
        logger_1.default.error('Study Guide Generation Error: %s', error.stack || error.message);
        res.status(500).json({ error: 'Error generating study guide.' });
    }
});
router.post('/binders/:binderId/podcast', async (req, res) => {
    try {
        const binderId = req.params.binderId;
        const userId = req.user.userId;
        const binder = await prisma_1.default.binder.findFirst({
            where: { id: binderId, userId },
            include: { documents: true },
        });
        if (!binder) {
            res.status(404).json({ error: 'Binder not found or unauthorized.' });
            return;
        }
        const documentsText = binder.documents.map(doc => `[Document: ${doc.name}]\n${doc.content}`).join('\n\n');
        if (binder.documents.length === 0) {
            res.status(400).json({ error: 'No documents in this binder. Please upload files first.' });
            return;
        }
        const attachments = binder.documents
            .filter(doc => doc.base64)
            .map(doc => ({
            inlineData: {
                data: doc.base64,
                mimeType: doc.fileType || 'application/pdf',
            }
        }))
            .slice(0, 3);
        // Fetch custom instructions
        const userRecord = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { customInstructions: true },
        });
        const customInstructions = userRecord?.customInstructions || '';
        const systemPrompt = `
You are the script writer for NotebookLM's famous Audio Overview.
Create an engaging, highly conversational, and incredibly natural podcast dialogue script between two hosts:
- Alex (Male Voice tone): Enthusiastic, inquisitive, loves analogies, asks practical and sometimes skeptical questions, interrupts naturally with thoughts, and uses phrases like "Wait, what?", "Oh, interesting!", "Hold on a second."
- Taylor (Female Voice tone): Brilliant, clear, conversational, uses friendly banter, breaks down complex academic jargon into clear layperson terms, and relates technical concepts back to the source documents.

CRITICAL INSTRUCTIONS for NotebookLM Realism:
1. Banish Dry Reading: The hosts should sound like real people who are excited about this material. Do not just present facts; make it a discussion.
2. Banter & Interjections: Include vocal markers and informal speech (e.g., "(laughs)", "(chuckles)", "Right, exactly!", "Wait, really?", "Let's unpack that," "Wow, that's wild.").
3. Analogies: Taylor should explain complicated technical terms using relatable, visual analogies (e.g., "Think of it like a restaurant kitchen where...").
4. Conversational Flow: One speaker should build on what the other just said, sometimes asking short clarifying questions, or expressing amazement.

Output MUST be a valid JSON array of dialogue objects. Do not wrap in markdown code blocks like \`\`\`json. Output format details:
[
  {
    "speaker": "Alex" | "Taylor",
    "text": "The line of dialogue"
  }
]

Generate approximately 30-40 turns of dialogue to cover the material deeply and comprehensively. Ensure it starts with an engaging introduction, covers all main technical concepts from the files in detail, and ends with a brief wrap-up.
${customInstructions ? `\n[USER PERSONALIZATION PREFERENCES]\nAdhere to the following personalization rules and constraints for the conversation tone or focus:\n${customInstructions}` : ''}
    `.trim();
        const response = await gemini.generateResponse([{
                role: 'user',
                content: documentsText || 'Please read the attached documents and write the podcast overview script.',
                attachments: attachments.length > 0 ? attachments : undefined
            }], systemPrompt, true, // responseJson flag to force valid JSON output
        podcastSchema);
        let cleanJsonText = response.text.trim();
        if (cleanJsonText.startsWith('```')) {
            cleanJsonText = cleanJsonText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }
        try {
            const dialogue = JSON.parse(cleanJsonText);
            res.json({ podcast: dialogue });
        }
        catch (parseErr) {
            logger_1.default.error('JSON parsing failure from Zenith AI Podcast Generator output: %s\nRaw output: %s', parseErr, response.text);
            res.status(500).json({ error: 'Failed to format podcast transcript. Try generating again.' });
        }
    }
    catch (error) {
        logger_1.default.error('Podcast Generation Error: %s', error.stack || error.message);
        res.status(500).json({ error: 'Error generating study podcast.' });
    }
});
router.post('/binders/:binderId/documents/:documentId/translate', async (req, res) => {
    try {
        const { targetLanguage } = req.body;
        const binderId = req.params.binderId;
        const documentId = req.params.documentId;
        const userId = req.user.userId;
        if (!targetLanguage) {
            res.status(400).json({ error: 'Target language is required.' });
            return;
        }
        const doc = await prisma_1.default.document.findFirst({
            where: { id: documentId, binderId, binder: { userId } }
        });
        if (!doc) {
            res.status(404).json({ error: 'Document not found or unauthorized.' });
            return;
        }
        const systemPrompt = `You are an expert translator. Translate the provided document text completely and accurately into ${targetLanguage}. Maintain the original meaning, structure, formatting, and tone. Output ONLY the translated text without adding any explanations, introductions, or markdown code block wrapper blocks (unless the original text had them).`;
        const response = await gemini.generateResponse([{ role: 'user', content: doc.content }], systemPrompt, false);
        // Create a new document in the same binder
        const newDocName = `[Translated to ${targetLanguage}] ${doc.name}`;
        const translatedDoc = await prisma_1.default.document.create({
            data: {
                binderId,
                name: newDocName,
                fileType: 'text/markdown',
                content: response.text || ''
            }
        });
        res.status(201).json({
            message: `Successfully translated document to ${targetLanguage}.`,
            document: { id: translatedDoc.id, name: translatedDoc.name }
        });
    }
    catch (error) {
        logger_1.default.error('Document translation failure: %s', error.stack || error.message);
        res.status(500).json({ error: 'Failed to translate document.' });
    }
});
router.post('/binders/:binderId/gaps', async (req, res) => {
    try {
        const binderId = req.params.binderId;
        const userId = req.user.userId;
        const binder = await prisma_1.default.binder.findFirst({
            where: { id: binderId, userId },
            include: { documents: true }
        });
        if (!binder) {
            res.status(404).json({ error: 'Binder not found or unauthorized.' });
            return;
        }
        if (binder.documents.length === 0) {
            res.status(400).json({ error: 'The selected binder has no files uploaded. Please upload context files first.' });
            return;
        }
        const documentsText = binder.documents
            .map(doc => `[Document: ${doc.name}]\n${doc.content}`)
            .join('\n\n');
        const systemPrompt = `
You are a StudySphere Conceptual Gap Analyzer.
Analyze the provided study documents and perform a deep diagnostic scan of the learning materials.
Provide:
1. Overall strength and coverage of the materials.
2. Prerequisite concept gaps: what foundational topics are assumed but not explained?
3. Terminology contradictions or logical inconsistencies between different documents (if any).
4. Suggested study pathways to close these gaps.

Output your response as a valid JSON object matching this schema:
{
  "gapAnalysis": "A detailed Markdown analysis outlining strengths, concept gaps, and inconsistencies.",
  "suggestedPathways": [
    "Pathway 1: e.g. Study prerequisite X",
    "Pathway 2: e.g. Resolve terminology conflict Y",
    "Pathway 3: e.g. Explore advanced topic Z"
  ]
}

Ensure the output is strictly valid JSON. Do not wrap it in markdown code blocks like \`\`\`json.
    `.trim();
        const response = await gemini.generateResponse([{ role: 'user', content: `Analyze the conceptual gaps in these materials:\n\n${documentsText}` }], systemPrompt, true, // responseJson
        {
            type: "object",
            properties: {
                gapAnalysis: { type: "string", description: "Detailed Markdown summary of strengths and concept gaps" },
                suggestedPathways: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of actionable next study steps"
                }
            },
            required: ["gapAnalysis", "suggestedPathways"]
        });
        // Record token usage
        await recordTokenUsage(userId, 'gemini-3.1-flash-lite', response.usage, 'Conceptual Gap Analysis');
        let cleanJsonText = response.text.trim();
        if (cleanJsonText.startsWith('```')) {
            cleanJsonText = cleanJsonText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }
        const analysisResult = JSON.parse(cleanJsonText);
        res.json(analysisResult);
    }
    catch (error) {
        logger_1.default.error('Conceptual Gap Analysis Error: %s', error.stack || error.message);
        res.status(500).json({ error: 'Failed to process conceptual gap analysis.' });
    }
});
exports.default = router;
