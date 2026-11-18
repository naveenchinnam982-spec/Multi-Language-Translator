export interface Language {
  code: string;
  name: string;
  nativeName: string;
  speechCode?: string;
  popular?: boolean;
}

export interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  sourceLangName: string;
  targetLang: string;
  targetLangName: string;
  detectedSourceLanguage?: string;
  timestamp: number;
}

export interface TranslationResponse {
  success: boolean;
  translatedText: string;
  detectedSourceLanguage?: string;
  sourceLang: string;
  targetLang: string;
  characterCount: number;
  error?: string;
  details?: string;
  code?: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

