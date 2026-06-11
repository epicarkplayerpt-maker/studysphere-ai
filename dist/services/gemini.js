"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const logger_1 = __importDefault(require("../lib/logger"));
class GeminiService {
    genAI;
    modelName = 'gemini-3.1-flash-lite';
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            logger_1.default.error('GEMINI_API_KEY is not defined in the environment variables.');
            throw new Error('GEMINI_API_KEY configuration is missing.');
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    /**
     * Helper to format generic chat messages into Google's Content format
     */
    formatMessages(messages) {
        const contents = [];
        for (const msg of messages) {
            if (msg.role === 'system')
                continue; // system instruction is passed separately
            const parts = [];
            if (msg.content) {
                parts.push({ text: msg.content });
            }
            if (msg.attachments && Array.isArray(msg.attachments)) {
                for (const att of msg.attachments) {
                    if (att.inlineData && att.inlineData.data && att.inlineData.mimeType) {
                        parts.push({
                            inlineData: {
                                data: att.inlineData.data,
                                mimeType: att.inlineData.mimeType,
                            },
                        });
                    }
                }
            }
            if (parts.length === 0)
                continue;
            const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';
            // Group consecutive messages of the same role
            if (contents.length > 0 && contents[contents.length - 1].role === role) {
                contents[contents.length - 1].parts.push(...parts);
            }
            else {
                contents.push({ role, parts });
            }
        }
        // Ensure first message is user role
        while (contents.length > 0 && contents[0].role !== 'user') {
            contents.shift();
        }
        return contents;
    }
    /**
     * Generate content using non-streaming API
     */
    async generateResponse(messages, systemInstruction = '', responseJson = false, responseSchema) {
        try {
            const contents = this.formatMessages(messages);
            const strictInstruction = `
${systemInstruction}
[CRITICAL SYSTEM DIRECTIVE]
You must provide complete, production-grade, and detailed answers, code snippets, and explanations. 
Never summarize code files, truncate explanations, or use placeholders (like "// ... rest of code" or "// TODO").
Output every single line of code completely when requested.
      `.trim();
            const model = this.genAI.getGenerativeModel({
                model: this.modelName,
                systemInstruction: strictInstruction,
            });
            const config = {
                temperature: 0.2, // Low temperature for high factual accuracy
                maxOutputTokens: 8192, // Safe upper bound for gemini-3.1-flash-lite
            };
            if (responseJson) {
                config.responseMimeType = 'application/json';
                if (responseSchema) {
                    config.responseSchema = responseSchema;
                }
            }
            const result = await model.generateContent({
                contents,
                generationConfig: config,
            });
            const responseText = result.response.text();
            return {
                text: responseText || 'No response generated.',
                usage: result.response.usageMetadata,
            };
        }
        catch (error) {
            logger_1.default.error('Gemini API Non-Stream Generation Failure: %s', error.message);
            throw error;
        }
    }
    /**
     * Generate content using streaming API
     */
    async generateStream(messages, systemInstruction = '', onChunk) {
        try {
            const contents = this.formatMessages(messages);
            const strictInstruction = `
${systemInstruction}
[CRITICAL SYSTEM DIRECTIVE]
You must provide complete, production-grade, and detailed answers, code snippets, and explanations. 
Never summarize code files, truncate explanations, or use placeholders (like "// ... rest of code" or "// TODO").
Output every single line of code completely when requested.
      `.trim();
            const model = this.genAI.getGenerativeModel({
                model: this.modelName,
                systemInstruction: strictInstruction,
            });
            const result = await model.generateContentStream({
                contents,
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 8192,
                },
            });
            let fullText = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                if (chunkText) {
                    fullText += chunkText;
                    onChunk(chunkText);
                }
            }
            const finalResponse = await result.response;
            const usage = finalResponse.usageMetadata;
            return { text: fullText, usage };
        }
        catch (error) {
            logger_1.default.error('Gemini API Stream Generation Failure: %s', error.message);
            throw error;
        }
    }
    /**
     * Wraps context items in XML tags as mandated for strict parsing
     */
    wrapInXmlTags(metadata, context, query) {
        const metaString = Object.entries(metadata)
            .map(([key, val]) => `  <meta key="${key}">${val}</meta>`)
            .join('\n');
        return `
<document_metadata>
${metaString}
</document_metadata>

<document_context>
${context}
</document_context>

<user_query>
${query}
</user_query>
    `.trim();
    }
    /**
     * Generate high-dimensional vector embedding for a single text chunk
     */
    async getEmbedding(text) {
        try {
            const model = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
            const result = await model.embedContent(text);
            if (!result.embedding || !result.embedding.values) {
                throw new Error('Embedding values not found in response');
            }
            return result.embedding.values;
        }
        catch (error) {
            logger_1.default.error('Gemini Single Embedding Generation Failure: %s', error.message);
            throw error;
        }
    }
    /**
     * Generate vector embeddings for a batch of text chunks (max 100 per call)
     */
    async getEmbeddings(texts) {
        try {
            if (texts.length === 0)
                return [];
            const model = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
            const response = await model.batchEmbedContents({
                requests: texts.map(t => ({
                    content: { role: 'user', parts: [{ text: t }] },
                    model: 'models/text-embedding-004'
                }))
            });
            if (!response.embeddings) {
                throw new Error('Embeddings list not found in response');
            }
            return response.embeddings.map(e => e.values);
        }
        catch (error) {
            logger_1.default.error('Gemini Batch Embedding Generation Failure: %s', error.message);
            throw error;
        }
    }
}
exports.GeminiService = GeminiService;
