import { TranslationHistoryItem } from '../types';

const HISTORY_KEY = 'linguaflow_translations_history_v1';
const MAX_HISTORY_ITEMS = 50;

export function getTranslationHistory(): TranslationHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load translation history:', e);
    return [];
  }
}

export function saveTranslationHistoryItem(item: Omit<TranslationHistoryItem, 'id' | 'timestamp'>): TranslationHistoryItem {
  const newItem: TranslationHistoryItem = {
    ...item,
    id: `trans_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now()
  };

  if (typeof window === 'undefined') return newItem;

  try {
    const existing = getTranslationHistory();
    // Avoid exact duplicate at the top
    const filtered = existing.filter(
      h => !(h.sourceText.trim() === item.sourceText.trim() && h.targetLang === item.targetLang)
    );
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save translation item:', e);
  }

  return newItem;
}

export function deleteTranslationHistoryItem(id: string): TranslationHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getTranslationHistory();
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete history item:', e);
    return [];
  }
}

export function clearTranslationHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear translation history:', e);
  }
}

