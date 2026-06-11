"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveRelevantChunks = retrieveRelevantChunks;
const logger_1 = __importDefault(require("./logger"));
const STOP_WORDS = new Set([
    'the', 'and', 'for', 'you', 'that', 'but', 'not', 'with', 'this', 'from', 'this', 'that',
    'how', 'why', 'what', 'who', 'where', 'when', 'which', 'their', 'there', 'about', 'would',
    'should', 'could', 'their', 'them', 'these', 'those', 'are', 'was', 'were', 'been', 'has',
    'have', 'had', 'does', 'did', 'doing', 'can', 'will', 'your', 'its', 'his', 'her', 'she', 'they'
]);
/**
 * Retrieve the top K most relevant text chunks from the indexed documents based on keyword TF-IDF scoring.
 */
function retrieveRelevantChunks(query, files, topK = 5) {
    try {
        const queryTerms = query
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(term => term.length > 2 && !STOP_WORDS.has(term));
        // If query has no substantial terms, return empty array to prevent irrelevant context insertion
        if (queryTerms.length === 0) {
            return [];
        }
        const scoredChunks = [];
        // 1. Calculate document (chunk) frequency for each query term in the corpus
        const chunkFrequency = {};
        let totalChunks = 0;
        for (const f of files) {
            for (const chunk of f.chunks) {
                totalChunks++;
                const lowerChunk = chunk.toLowerCase();
                // Identify which query terms appear in this chunk
                const uniqueTermsInChunk = new Set(queryTerms.filter(term => lowerChunk.includes(term)));
                for (const term of uniqueTermsInChunk) {
                    chunkFrequency[term] = (chunkFrequency[term] || 0) + 1;
                }
            }
        }
        // 2. Score each chunk by counting occurrences of terms weighted by IDF
        for (const f of files) {
            for (const chunk of f.chunks) {
                const lowerChunk = chunk.toLowerCase();
                let score = 0;
                for (const term of queryTerms) {
                    // Calculate occurrences of term in this chunk
                    // Avoid regex for safety; split-based counting is safe and fast
                    const occurrences = lowerChunk.split(term).length - 1;
                    if (occurrences > 0) {
                        // IDF = log(1 + totalChunks / chunkFrequency)
                        const idf = Math.log(1 + totalChunks / (chunkFrequency[term] || 1));
                        score += occurrences * idf;
                    }
                }
                if (score > 0) {
                    scoredChunks.push({ chunk, filename: f.filename, score });
                }
            }
        }
        // Sort by relevance score descending
        scoredChunks.sort((a, b) => b.score - a.score);
        // Only return scored chunks (score > 0)
        return scoredChunks.slice(0, topK);
    }
    catch (error) {
        logger_1.default.error('Error during TF-IDF chunk retrieval: %s', error);
        return [];
    }
}
