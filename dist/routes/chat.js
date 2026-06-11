"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const logger_1 = __importDefault(require("../lib/logger"));
const gemini_1 = require("../services/gemini");
const auth_1 = require("../middleware/auth");
const search_1 = require("../lib/search");
const study_1 = require("./study");
const router = (0, express_1.Router)();
const gemini = new gemini_1.GeminiService();
// Enforce auth
router.use(auth_1.checkAuthRequired);
router.post('/stream', async (req, res) => {
    const { messages, binderId, webSearch, contextExplanation } = req.body;
    const userId = req.user.userId;
    if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: 'Invalid message logs.' });
        return;
    }
    // Set up Server-Sent Events (SSE) headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    try {
        // Query personalization memory instructions
        const userRecord = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { customInstructions: true }
        });
        const customInstructions = userRecord?.customInstructions || '';
        let systemInstruction = `
You are the Zenith AI Interactive Assistant.
You have FULL context of the user's active workspace screen, including their selected Document Binder, uploaded notes, study guides, flashcards, and active practice exams. You CAN read the screen, analyze the active page content, and guide the user through their studies.

[HIGH-FIDELITY RETRIEVAL MODE]
You operate in High-Fidelity Retrieval mode. When answering questions based on the uploaded documents or web search results:
1. Prioritize peer-reviewed scientific journals, authoritative textbook chapters, government (.gov/.edu) publications, and primary sources.
2. Always cite specific source files, section names, or paper titles when citing information.
3. Do not synthesize or hallucinate claims. If the exact answer is not present in the provided document context or authoritative search results, explicitly state the limitations of the current retrieval context.
4. Ensure complete fidelity to technical terms, definitions, formulas, and data structures.

You can perform and assist with all tools:
1. Document Ingestion: Summarizing, reviewing, and analyzing uploaded files.
2. Smart Study Cards: Creating, reviewing, and testing memory using spaced repetition.
3. Audio Study Review: Generating alternating host scripts (Alex and Taylor) to review study binder materials.
4. Practice Exams: Creating mock tests with immediate feedback and review explanations.
5. Master Study Syllabus: Aggregating all binder documents into a structured master syllabus.

Interactive Study Workspaces:
You can embed fully interactive study tools directly inside your chat response to let the user study inline. Output the following exact XML tags in your response when the user asks to start/generate them:
- Smart Study Cards: Output \`<study-artifact type="flashcards" binderId="BINDER_ID"></study-artifact>\`
- Practice Exam / Quiz: Output \`<study-artifact type="quiz" binderId="BINDER_ID" questionCount="NUM"></study-artifact>\`
- Study Weakness Finder: Output \`<study-artifact type="weaknesses" binderId="BINDER_ID"></study-artifact>\`
- Audio Study Review: Output \`<study-artifact type="audio-review" binderId="BINDER_ID"></study-artifact>\`
- Master Study Syllabus: Output \`<study-artifact type="syllabus" binderId="BINDER_ID"></study-artifact>\`
Replace BINDER_ID with the active binder ID (or leave it empty/omit it if not available). You can include standard markdown text before or after these tags explaining what they are.

Formatting Guidelines:
- Markdown: Always format your output cleanly using markdown. Keep headings hierarchical (h2, h3).
- Math/Equations: For mathematical formulas, use standard LaTeX syntax. Wrap block equations in double dollar signs ($$ ... $$) and inline formulas in single dollar signs ($ ... $).
- Charts & Graphs: When asked to format graphs, charts, flowcharts, or concept maps, use Mermaid syntax enclosed in \`\`\`mermaid blocks or clean ASCII diagrams.
  For Mermaid diagrams, follow these strict rules to prevent rendering syntax errors:
  1. Every node label containing parentheses, brackets, quotes, braces, commas, or special punctuation MUST be wrapped in double quotes. Example: A["My Label (Special)"] or B["Key, Value Pair"].
  2. Avoid any HTML tags in labels.
  3. Keep the flowchart structure simple (e.g., use graph TD or graph LR).
  4. Do not insert any markdown bolding/italic formatting inside node labels.
- Code Blocks: Always write complete, functional code blocks with syntax highlighting. Do not truncate code blocks or use placeholders.
${customInstructions ? `\n[USER PERSONALIZATION MEMORY]\nAdhere to the following personalization rules and constraints strictly:\n${customInstructions}` : ''}
    `.trim();
        const lastMessage = messages[messages.length - 1];
        const userQuery = lastMessage?.content || '';
        // 1. Web Search Phase (if enabled)
        let webSearchContextText = '';
        if (webSearch) {
            res.write(`data: ${JSON.stringify({ thought: `Searching the web for: "${userQuery}"...` })}\n\n`);
            const searchResults = await (0, search_1.searchWeb)(userQuery);
            if (searchResults && searchResults.length > 0) {
                const domains = [...new Set(searchResults.map(r => {
                        try {
                            return new URL(r.url).hostname.replace('www.', '');
                        }
                        catch (e) {
                            return 'web';
                        }
                    }))].join(', ');
                res.write(`data: ${JSON.stringify({ thought: `Retrieved ${searchResults.length} search results from: ${domains}.` })}\n\n`);
                webSearchContextText = searchResults
                    .map((res, idx) => `[Result #${idx + 1}]\nTitle: ${res.title}\nURL: ${res.url}\nExcerpt: ${res.snippet}`)
                    .join('\n\n');
                systemInstruction += `\n\nYou have access to relevant web search results below under <web_search_results>. Integrate this information in your response. Cite the title and provide URL links where helpful.`;
            }
            else {
                res.write(`data: ${JSON.stringify({ thought: 'Web search returned no results. Relying on default knowledge.' })}\n\n`);
            }
        }
        // 2. Local Document RAG Phase (if binderId is provided)
        let binderContextText = '';
        let binderDocs = [];
        if (binderId) {
            res.write(`data: ${JSON.stringify({ thought: 'Searching binder documents...' })}\n\n`);
            const binder = await prisma_1.default.binder.findFirst({
                where: { id: binderId, userId },
                include: { documents: true },
            });
            if (binder && binder.documents.length > 0) {
                binderDocs = binder.documents;
                let hasSemanticResults = false;
                try {
                    res.write(`data: ${JSON.stringify({ thought: 'Running semantic pgvector search across documents...' })}\n\n`);
                    const queryEmbedding = await gemini.getEmbedding(userQuery);
                    const vectorStr = `[${queryEmbedding.join(',')}]`;
                    const relevantChunks = await prisma_1.default.$queryRawUnsafe(`SELECT dc.content, d.name as "documentName", 1 - (dc.embedding <=> $1::vector) as similarity
             FROM "DocumentChunk" dc
             JOIN "Document" d ON dc."documentId" = d.id
             WHERE d."binderId" = $2
             ORDER BY dc.embedding <=> $1::vector
             LIMIT $3`, vectorStr, binderId, 6);
                    if (relevantChunks && relevantChunks.length > 0) {
                        hasSemanticResults = true;
                        res.write(`data: ${JSON.stringify({ thought: `Extracted ${relevantChunks.length} relevant sections from files.` })}\n\n`);
                        binderContextText = relevantChunks
                            .map(rc => `<document filename="${rc.documentName}">\n${rc.content}\n</document>`)
                            .join('\n\n');
                    }
                    else {
                        res.write(`data: ${JSON.stringify({ thought: 'No highly matching sections found in binder documents. Initializing text fallback...' })}\n\n`);
                    }
                }
                catch (ragErr) {
                    logger_1.default.error('RAG semantic search error: %s', ragErr);
                    res.write(`data: ${JSON.stringify({ thought: 'Semantic search failed. Initializing text fallback...' })}\n\n`);
                }
                // Robust Fallback: load text content directly if pgvector has zero chunks or fails
                if (!hasSemanticResults && binderDocs.length > 0) {
                    res.write(`data: ${JSON.stringify({ thought: `Aggregating content from all ${binderDocs.length} document(s) directly...` })}\n\n`);
                    let fallbackText = '';
                    for (const doc of binderDocs) {
                        if (doc.content) {
                            const docSnippet = doc.content.substring(0, 150000); // Limit size per file to prevent prompt overflow
                            fallbackText += `<document filename="${doc.name}">\n${docSnippet}\n</document>\n\n`;
                        }
                    }
                    if (fallbackText) {
                        binderContextText = fallbackText.trim();
                    }
                }
                if (binderContextText) {
                    systemInstruction += `\n\nStudy the files listed inside the <document_context> block. Answer based on this context and cite filenames when possible.`;
                }
            }
            else {
                res.write(`data: ${JSON.stringify({ thought: 'No documents in this binder. Proceeding without document context.' })}\n\n`);
            }
        }
        // Combine web search and binder context
        let combinedContext = '';
        if (webSearchContextText) {
            combinedContext += `<web_search_results>\n${webSearchContextText}\n</web_search_results>\n\n`;
        }
        if (binderContextText) {
            combinedContext += `<document_context>\n${binderContextText}\n</document_context>\n\n`;
        }
        // Prepare multimodal attachments for Gemini if there are documents
        const documentAttachments = [];
        if (binderDocs.length > 0) {
            // Find the active document name from screen context (if any)
            const selectedDocMatch = userQuery.match(/- Selected Document: "([^"]+)"/);
            const selectedDocName = selectedDocMatch ? selectedDocMatch[1].toLowerCase() : '';
            for (const doc of binderDocs) {
                if (!doc.base64)
                    continue;
                const docNameLower = doc.name.toLowerCase();
                const isActiveDoc = selectedDocName && docNameLower.includes(selectedDocName);
                const isMentioned = userQuery.toLowerCase().includes(docNameLower);
                // Scanned files or files with empty/very short content must be sent
                const isScannedOrShort = !doc.content || doc.content.length < 150;
                if (isActiveDoc || isMentioned || (isScannedOrShort && documentAttachments.length < 2)) {
                    res.write(`data: ${JSON.stringify({ thought: `Attaching document "${doc.name}" directly to Gemini for multimodal analysis.` })}\n\n`);
                    documentAttachments.push({
                        inlineData: {
                            data: doc.base64,
                            mimeType: doc.fileType || 'application/pdf'
                        }
                    });
                }
            }
        }
        // Prepare the messages array for Gemini
        const historicalMessages = messages.slice(0, messages.length - 1);
        let finalPromptContent = userQuery;
        if (combinedContext || contextExplanation) {
            finalPromptContent = `
${contextExplanation ? `<screen_context>\n${contextExplanation}\n</screen_context>\n\n` : ''}${combinedContext ? `<context_information>\n${combinedContext}\n</context_information>\n\n` : ''}<user_query>
${userQuery}
</user_query>
      `.trim();
        }
        const formattedMessages = [
            ...historicalMessages,
            {
                role: 'user',
                content: finalPromptContent,
                attachments: documentAttachments.length > 0 ? documentAttachments : undefined
            }
        ];
        res.write(`data: ${JSON.stringify({ thought: 'Consulting Zenith AI...' })}\n\n`);
        let fullGeneratedText = '';
        const streamResult = await gemini.generateStream(formattedMessages, systemInstruction, (chunkText) => {
            fullGeneratedText += chunkText;
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        });
        // Record token usage
        await (0, study_1.recordTokenUsage)(userId, 'gemini-3.1-flash-lite', streamResult.usage, 'Study Chat');
        // Save study history record at the end of the streaming response (skip for guest users)
        if (!req.user.isGuest) {
            try {
                await prisma_1.default.studyHistory.create({
                    data: {
                        userId,
                        query: userQuery,
                        response: fullGeneratedText,
                    },
                });
            }
            catch (dbErr) {
                logger_1.default.error('Failed to save chat stream history: %s', dbErr);
            }
        }
        res.write('data: [DONE]\n\n');
        res.end();
    }
    catch (err) {
        logger_1.default.error('Chat streaming failed: %s', err.stack || err.message);
        res.write(`data: ${JSON.stringify({ error: 'Stream generation encountered an error.' })}\n\n`);
        res.end();
    }
});
exports.default = router;
