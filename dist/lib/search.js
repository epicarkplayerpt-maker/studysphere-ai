"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWeb = searchWeb;
const logger_1 = __importDefault(require("./logger"));
/**
 * Searches DuckDuckGo HTML search page and parses the results.
 * This is free, requires no API key, and is fully local.
 */
const PREFERRED_DOMAINS = [
    'wikipedia.org',
    'arxiv.org',
    'ncbi.nlm.nih.gov',
    'nih.gov',
    'edu',
    'gov',
    'org',
    'nature.com',
    'sciencedirect.com',
    'springer.com',
    'ieee.org',
    'github.com',
    'stackoverflow.com',
    'mozilla.org',
    'microsoft.com',
    'google.com',
    'nytimes.com',
    'reuters.com',
    'britannica.com',
    'w3.org'
];
const BLACKLIST_DOMAINS = [
    'pinterest.com',
    'ask.com',
    'answers.yahoo.com',
    'softonic.com',
    'coupon',
    'spam'
];
/**
 * Calculates a quality score for search results based on domain reputation.
 */
function scoreResult(urlStr) {
    try {
        const parsedUrl = new URL(urlStr);
        const host = parsedUrl.hostname.toLowerCase();
        // Check blacklist first - discard completely if blacklisted
        for (const spam of BLACKLIST_DOMAINS) {
            if (host.includes(spam)) {
                return -100;
            }
        }
        let score = 0;
        // Check preferred authoritative/technical domains
        for (const pref of PREFERRED_DOMAINS) {
            if (host === pref || host.endsWith('.' + pref)) {
                score += 15;
                break;
            }
        }
        // Extra weight for official educational and government documents
        if (host.endsWith('.edu') || host.endsWith('.gov')) {
            score += 20;
        }
        else if (host.endsWith('.org')) {
            score += 10;
        }
        return score;
    }
    catch (e) {
        return -100;
    }
}
/**
 * Helper to perform the actual search request and parse DuckDuckGo HTML results.
 */
async function executeSearch(query) {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5'
        },
        signal: AbortSignal.timeout(6000) // 6 seconds timeout
    });
    if (!response.ok) {
        throw new Error(`DuckDuckGo responded with status code ${response.status}`);
    }
    const html = await response.text();
    const results = [];
    // Parse using string splitting to be lightweight and zero-dependency
    const resultBlocks = html.split(/<div class="result results_links[^"]*">/);
    // Extract up to 24 results
    for (let i = 1; i < resultBlocks.length && results.length < 24; i++) {
        const block = resultBlocks[i];
        // Extract title and URL: <a ... class="...result__a..." ... href="[URL]">[TITLE]</a>
        const titleMatch = block.match(/<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
        // Extract snippet: <a ... class="...result__snippet..."[^>]*>([\s\S]*?)<\/a>
        const snippetMatch = block.match(/<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/);
        if (titleMatch) {
            let rawUrl = titleMatch[1];
            // Clean redirected DuckDuckGo links
            if (rawUrl.startsWith('//duckduckgo.com/y.js') || rawUrl.includes('uddg=')) {
                const uddgMatch = rawUrl.match(/uddg=([^&]+)/);
                if (uddgMatch) {
                    rawUrl = decodeURIComponent(uddgMatch[1]);
                }
            }
            // Ensure absolute URLs
            if (rawUrl.startsWith('//')) {
                rawUrl = 'https:' + rawUrl;
            }
            // Clean HTML tags from Title
            const title = titleMatch[2].replace(/<[^>]*>/g, '').trim();
            // Clean HTML tags from Snippet
            const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, '').trim() : '';
            if (title) {
                results.push({
                    title,
                    url: rawUrl,
                    snippet: snippet || 'No snippet available.'
                });
            }
        }
    }
    return results;
}
/**
 * Searches DuckDuckGo HTML search page, prioritizing authoritative/peer-reviewed sources.
 */
async function searchWeb(query) {
    try {
        // Build enhanced query to prioritize authoritative sites and peer-reviewed journals
        let targetQuery = query;
        if (!query.includes('site:')) {
            targetQuery = `${query} (site:edu OR site:gov OR site:org OR "peer-reviewed" OR "paper" OR "research")`;
        }
        logger_1.default.info('Executing high-fidelity authoritative search for: "%s"', targetQuery);
        let results = await executeSearch(targetQuery);
        // If no results are found, fall back to general search to ensure information retrieval
        if (results.length === 0 && targetQuery !== query) {
            logger_1.default.info('Authoritative search yielded 0 results, falling back to general search for: "%s"', query);
            results = await executeSearch(query);
        }
        // Rank results based on domain reputation
        const scoredResults = results
            .map(r => ({ ...r, score: scoreResult(r.url) }))
            .filter(r => r.score > -50); // Filter out blacklisted/spam completely
        scoredResults.sort((a, b) => b.score - a.score);
        const sortedResults = scoredResults.map(({ title, url, snippet }) => ({ title, url, snippet }));
        logger_1.default.info('Web search for "%s" completed. Sorted and returned %d results.', query, sortedResults.length);
        return sortedResults;
    }
    catch (error) {
        logger_1.default.warn('Web search failed for query "%s": %s', query, error.message || error);
        return []; // Return empty list on failure
    }
}
