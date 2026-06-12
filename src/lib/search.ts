import logger from './logger';

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

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
function scoreResult(urlStr: string): number {
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
    } else if (host.endsWith('.org')) {
      score += 10;
    }
    
    return score;
  } catch (e) {
    return -100; 
  }
}

/**
 * Helper to perform the actual search request and parse DuckDuckGo HTML results,
 * with a automatic fallback to Bing Search if DuckDuckGo fails or blocks the request.
 */
async function executeSearch(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  
  // 1. Try DuckDuckGo first
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      signal: AbortSignal.timeout(5000) // 5 seconds timeout
    });

    if (response.ok && response.status !== 202) {
      const html = await response.text();
      const resultBlocks = html.split(/<div class="result results_links[^"]*">/);
      
      for (let i = 1; i < resultBlocks.length && results.length < 24; i++) {
        const block = resultBlocks[i];
        
        const titleMatch = block.match(/<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
        const snippetMatch = block.match(/<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/);
        
        if (titleMatch) {
          let rawUrl = titleMatch[1];
          
          if (rawUrl.startsWith('//duckduckgo.com/y.js') || rawUrl.includes('uddg=')) {
            const uddgMatch = rawUrl.match(/uddg=([^&]+)/);
            if (uddgMatch) {
              rawUrl = decodeURIComponent(uddgMatch[1]);
            }
          }
          
          if (rawUrl.startsWith('//')) {
            rawUrl = 'https:' + rawUrl;
          }

          const title = titleMatch[2].replace(/<[^>]*>/g, '').trim();
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
    }
  } catch (ddgErr: any) {
    logger.warn('DuckDuckGo request failed: %s', ddgErr.message || ddgErr);
  }

  // 2. If DuckDuckGo returned 0 results or was blocked (202), query Bing Search
  if (results.length === 0) {
    try {
      logger.info('DuckDuckGo search returned 0 results. Falling back to Bing Search...');
      const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=30`;
      
      const response = await fetch(bingUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        const html = await response.text();
        const rawBlocks = html.split(/<li\s+/i);
        
        for (let i = 1; i < rawBlocks.length && results.length < 24; i++) {
          const block = rawBlocks[i];
          const tagCloseIdx = block.indexOf('>');
          if (tagCloseIdx === -1) continue;
          
          const attributes = block.substring(0, tagCloseIdx);
          if (!/class="[^"]*\bb_algo\b[^"]*"/i.test(attributes)) {
            continue;
          }
          
          const titleMatch = block.match(/<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
          if (!titleMatch) continue;
          
          const bingUrl = titleMatch[1];
          const title = titleMatch[2].replace(/<[^>]*>/g, '').trim();
          if (!title) continue;
          
          let finalUrl = bingUrl;
          const uMatch = bingUrl.match(/(?:[&?]|&amp;)u=a1([^&;]+)/);
          if (uMatch) {
            try {
              let b64 = uMatch[1];
              b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
              while (b64.length % 4 !== 0) {
                b64 += '=';
              }
              finalUrl = Buffer.from(b64, 'base64').toString('utf8');
            } catch (e) {
              // fallback
            }
          }
          
          let snippet = '';
          const pMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
          if (pMatch) {
            snippet = pMatch[1].replace(/<[^>]*>/g, '').trim();
          } else {
            const divMatch = block.match(/<div\s+[^>]*class="[^"]*\b(b_snippet|b_caption)\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
            if (divMatch) {
              snippet = divMatch[2].replace(/<[^>]*>/g, '').trim();
            }
          }
          
          results.push({
            title,
            url: finalUrl,
            snippet: snippet || 'No snippet available.'
          });
        }
        logger.info('Bing Search parsed %d results as fallback.', results.length);
      } else {
        logger.warn('Bing Search failed with status code %d', response.status);
      }
    } catch (bingErr: any) {
      logger.warn('Bing Search request failed: %s', bingErr.message || bingErr);
    }
  }

  // 3. Fallback to Yahoo Search if both DDG and Bing return 0 results
  if (results.length === 0) {
    try {
      logger.info('Bing Search returned 0 results. Falling back to Yahoo Search...');
      const yahooUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(query)}&n=30`;
      
      const response = await fetch(yahooUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        const html = await response.text();
        const rawBlocks = html.split(/<div\s+class="[^"]*\balgo\b[^"]*"/i);
        
        for (let i = 1; i < rawBlocks.length && results.length < 24; i++) {
          const block = rawBlocks[i];
          
          const titleMatch = block.match(/<h3[^>]*>\s*<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
          if (!titleMatch) continue;
          
          let yahooUrlStr = titleMatch[1];
          const RUMatch = yahooUrlStr.match(/\/RU=([^/]+)/);
          if (RUMatch) {
            try {
              yahooUrlStr = decodeURIComponent(RUMatch[1]);
            } catch (e) {}
          }
          
          const title = titleMatch[2].replace(/<[^>]*>/g, '').trim();
          if (!title) continue;
          
          let snippet = '';
          const compTextMatch = block.match(/<div\s+class="[^"]*\bcompText\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
          if (compTextMatch) {
            snippet = compTextMatch[1].replace(/<[^>]*>/g, '').trim();
          } else {
            const pMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
            if (pMatch) {
              snippet = pMatch[1].replace(/<[^>]*>/g, '').trim();
            }
          }
          
          results.push({
            title,
            url: yahooUrlStr,
            snippet: snippet || 'No snippet available.'
          });
        }
        logger.info('Yahoo Search parsed %d results as secondary fallback.', results.length);
      } else {
        logger.warn('Yahoo Search failed with status code %d', response.status);
      }
    } catch (yahooErr: any) {
      logger.warn('Yahoo Search request failed: %s', yahooErr.message || yahooErr);
    }
  }

  return results;
}

/**
 * Searches DuckDuckGo HTML search page, prioritizing authoritative/peer-reviewed sources.
 */
export async function searchWeb(query: string): Promise<SearchResult[]> {
  try {
    // Build enhanced query to prioritize authoritative sites and peer-reviewed journals
    let targetQuery = query;
    if (!query.includes('site:')) {
      targetQuery = `${query} (site:edu OR site:gov OR site:org OR "peer-reviewed" OR "paper" OR "research")`;
    }

    logger.info('Executing high-fidelity authoritative search for: "%s"', targetQuery);
    let results = await executeSearch(targetQuery);

    // If no results are found, fall back to general search to ensure information retrieval
    if (results.length === 0 && targetQuery !== query) {
      logger.info('Authoritative search yielded 0 results, falling back to general search for: "%s"', query);
      results = await executeSearch(query);
    }

    // Rank results based on domain reputation
    const scoredResults = results
      .map(r => ({ ...r, score: scoreResult(r.url) }))
      .filter(r => r.score > -50); // Filter out blacklisted/spam completely

    scoredResults.sort((a, b) => b.score - a.score);

    const sortedResults = scoredResults.map(({ title, url, snippet }) => ({ title, url, snippet }));

    logger.info('Web search for "%s" completed. Sorted and returned %d results.', query, sortedResults.length);
    return sortedResults;
  } catch (error: any) {
    logger.warn('Web search failed for query "%s": %s', query, error.message || error);
    return []; // Return empty list on failure
  }
}

/**
 * Fetches the raw HTML of a page and extracts up to 3,000 characters of readable body text.
 */
export async function fetchPageContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(4000), // 4 seconds timeout
    });

    if (!response.ok) {
      return '';
    }

    const html = await response.text();
    
    // Extract text from body or whole page if body not present
    let bodyText = html;
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      bodyText = bodyMatch[1];
    }

    // Strip scripts, styles, comments, and HTML tags
    let cleanText = bodyText
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return cleanText.substring(0, 3000);
  } catch (error: any) {
    logger.warn('Failed to fetch page content for URL "%s": %s', url, error.message || error);
    return '';
  }
}
