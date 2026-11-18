/**
 * Netlify Serverless Function: translate
 * Endpoint: /.netlify/functions/translate
 * 
 * Powered by MyMemory Free Translation API (https://api.mymemory.translated.net/get)
 * No paid API key or Google Cloud billing required.
 * Supports auto-detection, English-Telugu, Telugu-English, and 70+ global languages.
 */

// Decode HTML entities commonly returned by machine translation engines
function decodeHTMLEntities(text) {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

// Split long text into chunks <= maxChunkSize preserving paragraph/sentence boundaries
function splitIntoChunks(text, maxChunkSize = 450) {
  if (!text || text.length <= maxChunkSize) {
    return [text];
  }

  const chunks = [];
  const paragraphs = text.split('\n');
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    if ((currentChunk + '\n' + paragraph).length <= maxChunkSize) {
      currentChunk = currentChunk ? currentChunk + '\n' + paragraph : paragraph;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }

      if (paragraph.length <= maxChunkSize) {
        currentChunk = paragraph;
      } else {
        // Split paragraph by punctuation / sentence delimiters
        const sentenceRegex = /([.!?।؟。]+[\s]+)/;
        const tokens = paragraph.split(sentenceRegex);
        let sentenceChunk = '';

        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i];
          if ((sentenceChunk + token).length <= maxChunkSize) {
            sentenceChunk += token;
          } else {
            if (sentenceChunk) {
              chunks.push(sentenceChunk);
              sentenceChunk = '';
            }
            if (token.length <= maxChunkSize) {
              sentenceChunk = token;
            } else {
              // Word level splitting
              const words = token.split(' ');
              let wordChunk = '';
              for (const word of words) {
                if ((wordChunk + ' ' + word).length <= maxChunkSize) {
                  wordChunk = wordChunk ? wordChunk + ' ' + word : word;
                } else {
                  if (wordChunk) chunks.push(wordChunk);
                  wordChunk = word;
                }
              }
              if (wordChunk) sentenceChunk = wordChunk;
            }
          }
        }
        if (sentenceChunk) {
          currentChunk = sentenceChunk;
        }
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler = async function(event, context) {
  // Handle HTTP OPTIONS for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  // Enforce POST method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, 'Allow': 'POST' },
      body: JSON.stringify({
        error: 'Method Not Allowed. Please send a POST request.',
        code: 'METHOD_NOT_ALLOWED'
      })
    };
  }

  // Parse request body
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (parseError) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Invalid JSON payload in request body.',
        code: 'INVALID_JSON'
      })
    };
  }

  const { text, targetLang, sourceLang } = body;

  // Validate text
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Please provide valid text to translate.',
        code: 'EMPTY_TEXT'
      })
    };
  }

  // Enforce 5,000 character maximum limit
  const MAX_CHAR_LIMIT = 5000;
  if (text.length > MAX_CHAR_LIMIT) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: `Text exceeds maximum allowed length of ${MAX_CHAR_LIMIT} characters. Currently: ${text.length} characters.`,
        code: 'TEXT_TOO_LONG'
      })
    };
  }

  // Validate target language
  if (!targetLang || typeof targetLang !== 'string' || targetLang.trim() === '') {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Target language code is required.',
        code: 'MISSING_TARGET_LANG'
      })
    };
  }

  const cleanTarget = targetLang.trim();
  const cleanSource = sourceLang && sourceLang.trim().toLowerCase() !== 'auto'
    ? sourceLang.trim()
    : 'autodetect';

  const langpair = `${cleanSource}|${cleanTarget}`;

  // Optional email parameter to grant 50,000 words/day instead of 5,000
  const userEmail = process.env.MYMEMORY_EMAIL || '';

  try {
    const textChunks = splitIntoChunks(text, 450);
    const translatedChunks = [];
    let detectedSourceLanguage = cleanSource !== 'autodetect' ? cleanSource : null;

    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      if (!chunk || chunk.trim() === '') {
        translatedChunks.push(chunk);
        continue;
      }

      let myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk.trim())}&langpair=${encodeURIComponent(langpair)}`;
      if (userEmail) {
        myMemoryUrl += `&de=${encodeURIComponent(userEmail)}`;
      }

      const response = await fetch(myMemoryUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LinguaFlow-Translator/1.0'
        }
      });

      if (!response.ok && response.status === 429) {
        return {
          statusCode: 429,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            error: 'MyMemory translation rate limit reached for today. Please try again later.',
            code: 'RATE_LIMIT_EXCEEDED'
          })
        };
      }

      const data = await response.json();

      // Check MyMemory internal responseStatus
      if (data.responseStatus === 429 || (data.responseDetails && data.responseDetails.includes('DAILY LIMIT'))) {
        return {
          statusCode: 429,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            error: 'Daily free translation quota reached on MyMemory API. Please try again tomorrow.',
            code: 'RATE_LIMIT_EXCEEDED',
            details: data.responseDetails
          })
        };
      }

      if (data.responseStatus && data.responseStatus !== 200 && data.responseStatus !== 403) {
        const errorMsg = data.responseDetails || 'MyMemory translation failed.';
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            error: errorMsg,
            code: 'TRANSLATION_ERROR',
            details: data.responseDetails
          })
        };
      }

      const rawTranslation = data?.responseData?.translatedText;
      if (rawTranslation === undefined || rawTranslation === null) {
        return {
          statusCode: 502,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            error: 'No translation was returned for this segment.',
            code: 'EMPTY_TRANSLATION_RESPONSE'
          })
        };
      }

      // Check if MyMemory returned quota exceeded inside translatedText
      if (typeof rawTranslation === 'string' && rawTranslation.includes('YOU USED ALL AVAILABLE FREE TRANSLATIONS')) {
        return {
          statusCode: 429,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            error: 'Daily free translation quota reached on MyMemory API. Please try again tomorrow.',
            code: 'RATE_LIMIT_EXCEEDED'
          })
        };
      }

      const cleanTranslated = decodeHTMLEntities(rawTranslation);
      translatedChunks.push(cleanTranslated);

      // Capture detected language from response if available
      if (!detectedSourceLanguage && data?.responseData?.detectedLanguage) {
        detectedSourceLanguage = data.responseData.detectedLanguage;
      }

      // Brief delay between chunks if multiple to avoid bursting the free API
      if (textChunks.length > 1 && i < textChunks.length - 1) {
        await new Promise(r => setTimeout(r, 120));
      }
    }

    // Merge translated chunks
    const combinedTranslatedText = translatedChunks.join(' ');

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        translatedText: combinedTranslatedText,
        detectedSourceLanguage: detectedSourceLanguage || (cleanSource !== 'autodetect' ? cleanSource : 'en'),
        sourceLang: cleanSource !== 'autodetect' ? cleanSource : 'auto',
        targetLang: cleanTarget,
        characterCount: text.length
      })
    };

  } catch (error) {
    return {
      statusCode: 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Failed to communicate with MyMemory Translation API. Please check your internet connection.',
        code: 'NETWORK_ERROR',
        details: error instanceof Error ? error.message : String(error)
      })
    };
  }
};
