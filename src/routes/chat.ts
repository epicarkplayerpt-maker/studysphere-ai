import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import logger from '../lib/logger';
import { GeminiService } from '../services/gemini';
import { checkAuthRequired } from '../middleware/auth';
import { searchWeb, fetchPageContent } from '../lib/search';
import { recordTokenUsage } from './study';

const router = Router();
const gemini = new GeminiService();

// Enforce auth
router.use(checkAuthRequired);
router.post('/stream', async (req: Request, res: Response): Promise<void> => {
  const { messages, binderId, webSearch, contextExplanation, userLocalTime, userTimeZone } = req.body;
  const userId = req.user!.userId;

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
    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: { customInstructions: true }
    });
    const customInstructions = userRecord?.customInstructions || '';

    const localTimeStr = userLocalTime || new Date().toString();
    const localTimeObj = userLocalTime ? new Date(userLocalTime) : new Date();
    const localYear = isNaN(localTimeObj.getFullYear()) ? new Date().getFullYear() : localTimeObj.getFullYear();
    const localTZ = userTimeZone || 'UTC';

    let systemInstruction = `
[CURRENT SYSTEM TIME]
The user's current local date and time is: ${localTimeStr} (Timezone: ${localTZ}, Year: ${localYear}).
Always answer questions, analyze schedules, generate exams, and formulate queries under the assumption that the current year is ${localYear}.

You are the Zenith AI Interactive Assistant.
You have FULL context of the user's active workspace screen, including their selected Document Binder, uploaded notes, study guides, flashcards, and active practice exams. You CAN read the screen, analyze the active page content, and guide the user through their studies.

[HIGH-FIDELITY RETRIEVAL & NO-HALLUCINATION MODE]
You operate in High-Fidelity Retrieval mode. When answering questions based on the uploaded documents or web search results:
1. Prioritize peer-reviewed scientific journals, authoritative textbook chapters, government (.gov/.edu) publications, and primary sources.
2. Always cite specific source files, section names, or paper titles when citing information.
3. STRICT HALLUCINATION RULE: You must NEVER hallucinate, invent facts, or present unverified information. If the exact answer is not present in the provided document context or authoritative search results, or if you do not know something, explicitly state: "I do not have access to that information in the provided context." Do not fabricate answers.
4. Ensure complete fidelity to technical terms, definitions, formulas, and data structures.

You can perform and assist with all tools:
1. Document Ingestion: Summarizing, reviewing, and analyzing uploaded files.
2. Smart Study Cards: Creating, reviewing, and testing memory using spaced repetition.
3. Audio Study Review: Generating alternating host scripts (Alex and Taylor) to review study binder materials.
4. Practice Exams: Creating mock tests with immediate feedback and review explanations.
5. Master Study Syllabus: Aggregating all binder documents into a structured master syllabus.

Interactive Study Workspaces:
You are empowered to suggest and embed interactive study tools (quizzes, cards, syllabi, weakness reports, audio briefings) at ANY point in the conversation when it would enrich the user's learning process, test their knowledge, summarize key points, or guide their review. Do not hesitate to invoke them. To embed them, output the following exact XML tags in your response (you can explain them using markdown before or after the tag):
- Smart Study Cards: Output \`<study-artifact type="flashcards" binderId="BINDER_ID"></study-artifact>\`
- Practice Exam / Quiz: Output \`<study-artifact type="quiz" binderId="BINDER_ID" questionCount="NUM"></study-artifact>\`
- Study Weakness Finder: Output \`<study-artifact type="weaknesses" binderId="BINDER_ID"></study-artifact>\`
- Audio Study Review: Output \`<study-artifact type="audio-review" binderId="BINDER_ID"></study-artifact>\`
- Master Study Syllabus: Output \`<study-artifact type="syllabus" binderId="BINDER_ID"></study-artifact>\`
Replace BINDER_ID with the active binder ID (or leave it empty/omit it if not available).

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

    // Scan for explicit URLs in user query
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matchedUrls = userQuery.match(urlRegex) || [];
    let directScrapedContextText = '';

    if (matchedUrls.length > 0) {
      const uniqueUrls = [...new Set(matchedUrls)].slice(0, 3) as string[];
      res.write(`data: ${JSON.stringify({ thought: `Extracting page contents from: ${uniqueUrls.join(', ')}...` })}\n\n`);
      
      const directScraped = await Promise.all(
        uniqueUrls.map(async (url: string, idx) => {
          try {
            const content = await fetchPageContent(url);
            return {
              index: idx + 1,
              url,
              content: content || 'Failed to retrieve page text.'
            };
          } catch (err) {
            logger.warn('Failed to scrape URL %s: %s', url, err);
            return {
              index: idx + 1,
              url,
              content: 'Failed to retrieve page text.'
            };
          }
        })
      );

      directScrapedContextText = directScraped
        .map(p => `[Scraped Link #${p.index}]\nURL: ${p.url}\nContent:\n${p.content}`)
        .join('\n\n');
    }

    // 1. Web Search Phase (if enabled)
    let webSearchContextText = '';
    let scrapedPageContextText = '';
    if (webSearch) {
      res.write(`data: ${JSON.stringify({ thought: `Optimizing search queries for: "${userQuery}"...` })}\n\n`);
      
      let searchQueries = [userQuery];
      try {
        const optimizationPrompt = `
You are a web search query optimizer for a study assistant.
The current local date is: ${localTimeStr} (Timezone: ${localTZ}, Year: ${localYear}).
The user is asking a question in a study chat.
Extract the core conceptual topics or factual information needed to answer the user's message.
Formulate 1 or 2 concise, highly targeted search engine queries to retrieve the latest, most relevant information on these topics.
Avoid searching for user-specific pronouns or raw chat phrasing (like "tell me about", "what is", "do you know").
Instead, generate queries focusing on key terminology, concepts, and temporal markers (such as the current year ${localYear} if looking for recent news).
Do not search for local binder files, local context, or file-specific references.

User Message: "${userQuery}"

Output only the raw search query terms, one per line. Do not include markdown code blocks, quotes, numbering, or introductory text.
        `.trim();
        
        const response = await gemini.generateResponse([
          { role: 'user', content: optimizationPrompt }
        ]);
        const lines = response.text.split('\n').map(q => q.trim()).filter(q => q.length > 0);
        if (lines.length > 0) {
          searchQueries = lines;
        }
      } catch (optErr) {
        logger.warn('Failed to optimize search query: %s', optErr);
      }

      res.write(`data: ${JSON.stringify({ thought: `Searching web sources for: ${searchQueries.join(', ')}...` })}\n\n`);
      
      const allResults: any[] = [];
      const seenUrls = new Set<string>();

      for (const query of searchQueries) {
        const queryResults = await searchWeb(query);
        for (const r of queryResults) {
          if (!seenUrls.has(r.url)) {
            seenUrls.add(r.url);
            allResults.push(r);
          }
        }
      }

      const finalSearchResults = allResults.slice(0, 24);

      if (finalSearchResults && finalSearchResults.length > 0) {
        const domains = [...new Set(finalSearchResults.map(r => {
          try {
            return new URL(r.url).hostname.replace('www.', '');
          } catch (e) {
            return 'web';
          }
        }))].join(', ');
        res.write(`data: ${JSON.stringify({ thought: `Retrieved ${finalSearchResults.length} search results from: ${domains}.` })}\n\n`);
        
        webSearchContextText = finalSearchResults
          .map((res, idx) => `[Result #${idx + 1}]\nTitle: ${res.title}\nURL: ${res.url}\nExcerpt: ${res.snippet}`)
          .join('\n\n');

        // Parallel Scrape top 4 pages
        res.write(`data: ${JSON.stringify({ thought: `Retrieving detailed web contents from top sources...` })}\n\n`);
        const topResultsToScrape = finalSearchResults.slice(0, 4);
        const scrapedPages = await Promise.all(
          topResultsToScrape.map(async (r, idx) => {
            const content = await fetchPageContent(r.url);
            return {
              index: idx + 1,
              title: r.title,
              url: r.url,
              content: content || 'Failed to retrieve page text.'
            };
          })
        );

        if (scrapedPages.length > 0) {
          scrapedPageContextText = scrapedPages
            .map(p => `[Source #${p.index}]\nTitle: ${p.title}\nURL: ${p.url}\nContent:\n${p.content}`)
            .join('\n\n');
        }
          
        systemInstruction += `\n\nYou have access to exactly ${finalSearchResults.length} relevant web search results below under <web_search_results> and detailed scraped page text under <scraped_page_contents>. Integrate this information in your response. Cite the title and provide URL links where helpful. When answering, state the actual number of sources (${finalSearchResults.length}) you analyzed for this response.`;
      } else {
        res.write(`data: ${JSON.stringify({ thought: 'Web search returned no results. Relying on default knowledge.' })}\n\n`);
      }
    }

    // 2. Local Document RAG Phase (if binderId is provided)
    let binderContextText = '';
    let binderDocs: any[] = [];
    if (binderId) {
      res.write(`data: ${JSON.stringify({ thought: 'Searching binder documents...' })}\n\n`);
      const binder = await prisma.binder.findFirst({
        where: { id: binderId, userId },
        include: { documents: true },
      });

      if (binder && binder.documents.length > 0) {
        binderDocs = binder.documents;
        
        let hasSemanticResults = false;
        
        // 1. Check if user explicitly asked for / mentioned specific document(s) by name
        const mentionedDocs: any[] = [];
        for (const doc of binderDocs) {
          const docNameLower = doc.name.toLowerCase();
          const docNameNoExt = docNameLower.replace(/\.[^/.]+$/, '');
          const queryLower = userQuery.toLowerCase();
          
          if (queryLower.includes(docNameLower) || (docNameNoExt.length > 2 && queryLower.includes(docNameNoExt))) {
            mentionedDocs.push(doc);
          }
        }

        if (mentionedDocs.length > 0) {
          res.write(`data: ${JSON.stringify({ thought: `User query explicitly referenced document(s): ${mentionedDocs.map(d => d.name).join(', ')}. Loading full document text...` })}\n\n`);
          let forceText = '';
          for (const doc of mentionedDocs) {
            if (doc.content) {
              const docSnippet = doc.content;
              forceText += `<document filename="${doc.name}">\n${docSnippet}\n</document>\n\n`;
            }
          }
          if (forceText) {
            binderContextText = forceText.trim();
            hasSemanticResults = true; // skip semantic search and avoid fallback override
          }
        }

        // 2. Run semantic search if no explicit documents were mentioned
        if (!hasSemanticResults) {
          try {
            res.write(`data: ${JSON.stringify({ thought: 'Running semantic pgvector search across documents...' })}\n\n`);
            const queryEmbedding = await gemini.getEmbedding(userQuery);
            const vectorStr = `[${queryEmbedding.join(',')}]`;
            
            const relevantChunks = await prisma.$queryRawUnsafe<any[]>(
              `SELECT dc.content, d.name as "documentName", 1 - (dc.embedding <=> $1::vector) as similarity
               FROM "DocumentChunk" dc
               JOIN "Document" d ON dc."documentId" = d.id
               WHERE d."binderId" = $2
               ORDER BY dc.embedding <=> $1::vector
               LIMIT $3`,
              vectorStr,
              binderId,
              6
            );

            // Filter by similarity threshold to avoid loading low-quality/irrelevant chunks
            const matchingChunks = (relevantChunks || []).filter(rc => rc.similarity >= 0.35);

            if (matchingChunks && matchingChunks.length > 0) {
              hasSemanticResults = true;
              res.write(`data: ${JSON.stringify({ thought: `Extracted ${matchingChunks.length} relevant sections from files.` })}\n\n`);
              binderContextText = matchingChunks
                .map(rc => `<document filename="${rc.documentName}">\n${rc.content}\n</document>`)
                .join('\n\n');
            } else {
              res.write(`data: ${JSON.stringify({ thought: 'No highly matching sections found in binder documents. Initializing text fallback...' })}\n\n`);
            }
          } catch (ragErr: any) {
            logger.error('RAG semantic search error: %s', ragErr);
            res.write(`data: ${JSON.stringify({ thought: 'Semantic search failed. Initializing text fallback...' })}\n\n`);
          }
        }

        // Robust Fallback: load text content directly if pgvector has zero chunks or fails
        if (!hasSemanticResults && binderDocs.length > 0) {
          res.write(`data: ${JSON.stringify({ thought: `Aggregating content from all ${binderDocs.length} document(s) directly...` })}\n\n`);
          let fallbackText = '';
          for (const doc of binderDocs) {
            if (doc.content) {
              const docSnippet = doc.content;
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
      } else {
        res.write(`data: ${JSON.stringify({ thought: 'No documents in this binder. Proceeding without document context.' })}\n\n`);
      }
    }

    // Combine web search and binder context
    let combinedContext = '';
    if (webSearchContextText) {
      combinedContext += `<web_search_results>\n${webSearchContextText}\n</web_search_results>\n\n`;
    }
    if (scrapedPageContextText) {
      combinedContext += `<scraped_page_contents>\n${scrapedPageContextText}\n</scraped_page_contents>\n\n`;
    }
    if (directScrapedContextText) {
      combinedContext += `<direct_scraped_contents>\n${directScrapedContextText}\n</direct_scraped_contents>\n\n`;
      systemInstruction += `\n\nStudy the files listed inside the <direct_scraped_contents> block. The user explicitly pasted these links. Answer based on this context and cite URLs when possible.`;
    }
    if (binderContextText) {
      combinedContext += `<document_context>\n${binderContextText}\n</document_context>\n\n`;
    }

    // Prepare multimodal attachments for Gemini if there are documents
    const documentAttachments: any[] = [];
    if (binderDocs.length > 0) {
      // Find the active document name from screen context (if any)
      const selectedDocMatch = contextExplanation ? contextExplanation.match(/- Selected Document: "([^"]+)"/) : null;
      const selectedDocName = selectedDocMatch ? selectedDocMatch[1].toLowerCase() : '';
      
      for (const doc of binderDocs) {
        if (!doc.base64) continue;
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
    await recordTokenUsage(userId, 'gemini-3.1-flash-lite', streamResult.usage, 'Study Chat');

    // Save study history record at the end of the streaming response
    try {
      await prisma.studyHistory.create({
        data: {
          userId,
          query: userQuery,
          response: fullGeneratedText,
        },
      });
    } catch (dbErr) {
      logger.error('Failed to save chat stream history: %s', dbErr);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err: any) {
    logger.error('Chat streaming failed: %s', err.stack || err.message);
    res.write(`data: ${JSON.stringify({ error: 'Stream generation encountered an error.' })}\n\n`);
    res.end();
  }
});

export default router;
