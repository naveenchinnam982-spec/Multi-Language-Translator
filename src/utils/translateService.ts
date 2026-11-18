import { TranslationResponse } from '../types';

function decodeHTMLEntities(text: string): string {
  if (!text) return text;
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

function splitIntoChunks(text: string, maxChunkSize = 450): string[] {
  if (!text || text.length <= maxChunkSize) {
    return [text];
  }

  const chunks: string[] = [];
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

// Direct client-side MyMemory fallback (used if static Netlify Drop is deployed without serverless functions)
async function directMyMemoryTranslate(
  text: string,
  targetLang: string,
  sourceLang?: string
): Promise<TranslationResponse> {
  const cleanSource = sourceLang && sourceLang !== 'auto' ? sourceLang : 'autodetect';
  const cleanTarget = targetLang;
  const langpair = `${cleanSource}|${cleanTarget}`;

  const chunks = splitIntoChunks(text, 450);
  const translatedSegments: string[] = [];
  let detectedLang = cleanSource !== 'autodetect' ? cleanSource : 'en';

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (!chunk.trim()) {
      translatedSegments.push(chunk);
      continue;
    }

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk.trim())}&langpair=${encodeURIComponent(langpair)}`;
    const res = await fetch(url);

    if (!res.ok && res.status === 429) {
      return {
        success: false,
        translatedText: '',
        sourceLang: cleanSource,
        targetLang: cleanTarget,
        characterCount: text.length,
        error: 'MyMemory daily translation quota reached. Please try again tomorrow.',
        code: 'RATE_LIMIT_EXCEEDED'
      };
    }

    const data = await res.json();

    if (data.responseStatus === 429 || (data.responseDetails && data.responseDetails.includes('DAILY LIMIT'))) {
      return {
        success: false,
        translatedText: '',
        sourceLang: cleanSource,
        targetLang: cleanTarget,
        characterCount: text.length,
        error: 'Daily free translation quota reached on MyMemory API. Please try again tomorrow.',
        code: 'RATE_LIMIT_EXCEEDED'
      };
    }

    const raw = data?.responseData?.translatedText;
    if (typeof raw === 'string' && raw.includes('YOU USED ALL AVAILABLE FREE TRANSLATIONS')) {
      return {
        success: false,
        translatedText: '',
        sourceLang: cleanSource,
        targetLang: cleanTarget,
        characterCount: text.length,
        error: 'Daily free translation quota reached on MyMemory API.',
        code: 'RATE_LIMIT_EXCEEDED'
      };
    }

    translatedSegments.push(decodeHTMLEntities(raw || ''));

    if (data?.responseData?.detectedLanguage) {
      detectedLang = data.responseData.detectedLanguage;
    }

    if (chunks.length > 1 && i < chunks.length - 1) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  return {
    success: true,
    translatedText: translatedSegments.join(' '),
    detectedSourceLanguage: detectedLang,
    sourceLang: cleanSource !== 'autodetect' ? cleanSource : 'auto',
    targetLang: cleanTarget,
    characterCount: text.length
  };
}

export async function executeTranslation(
  text: string,
  targetLang: string,
  sourceLang?: string
): Promise<TranslationResponse> {
  try {
    // 1. Try serverless function endpoint first
    const response = await fetch('/.netlify/functions/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLang,
        sourceLang: sourceLang === 'auto' ? undefined : sourceLang,
      }),
    });

    // 2. If endpoint returns 404 (e.g. deployed via static Netlify Drop zip without serverless build)
    if (response.status === 404) {
      console.warn('Serverless endpoint not found, falling back to direct MyMemory API');
      return await directMyMemoryTranslate(text, targetLang, sourceLang);
    }

    const data: TranslationResponse = await response.json();
    return data;
  } catch (netErr) {
    // 3. If local network fails to reach serverless, try direct MyMemory fallback
    try {
      console.warn('Backend proxy unreachable, attempting direct fallback to MyMemory...');
      return await directMyMemoryTranslate(text, targetLang, sourceLang);
    } catch {
      return {
        success: false,
        translatedText: '',
        sourceLang: sourceLang || 'auto',
        targetLang,
        characterCount: text.length,
        error: 'Unable to reach translation server. Please check your internet connection.',
        code: 'NETWORK_ERROR'
      };
    }
  }
}
