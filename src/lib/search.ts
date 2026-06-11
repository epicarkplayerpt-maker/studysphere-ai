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
/**
 * Helper to perform the actual search request and parse DuckDuckGo HTML results.
 */
async function executeSearch(query: string): Promise<SearchResult[]> {
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
  const results: SearchResult[] = [];
  
  // Parse using string splitting to be lightweight and zero-dependency
  const resultBlocks = html.split(/<div class="result results_links[^"]*">/);
  
  // Skip the first block as it's the HTML header/intro
  for (let i = 1; i < resultBlocks.length && results.length < 8; i++) {
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

    logger.info('Web search for "%s" completed. Returned %d results.', query, results.length);
    return results;
  } catch (error: any) {
    logger.warn('Web search failed for query "%s": %s', query, error.message || error);
    return []; // Return empty list on failure
  }
}
