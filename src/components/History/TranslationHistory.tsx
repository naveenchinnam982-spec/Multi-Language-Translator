import React, { useState, useEffect } from 'react';
import { TranslationHistoryItem } from '../../types';
import { getTranslationHistory, deleteTranslationHistoryItem, clearTranslationHistory } from '../../utils/storage';
import { useToast } from '../../context/ToastContext';
import { speech } from '../../utils/speech';
import {
  History,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ArrowRight,
  Clock
} from 'lucide-react';

interface TranslationHistoryProps {
  onReuseTranslation: (item: TranslationHistoryItem) => void;
  refreshTrigger: number;
}

export const TranslationHistory: React.FC<TranslationHistoryProps> = ({
  onReuseTranslation,
  refreshTrigger,
}) => {
  const { toast } = useToast();
  const [historyItems, setHistoryItems] = useState<TranslationHistoryItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setHistoryItems(getTranslationHistory());
  }, [refreshTrigger]);

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteTranslationHistoryItem(id);
    setHistoryItems(updated);
    toast.info('Item removed from history');
  };

  const handleClearAll = () => {
    clearTranslationHistory();
    setHistoryItems([]);
    setShowClearConfirm(false);
    toast.info('History cleared');
  };

  const handleCopyText = async (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleSpeech = (text: string, langCode: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingId === id) {
      speech.stop();
      setPlayingId(null);
      return;
    }

    speech.stop();
    const started = speech.speak(text, langCode, {
      onStart: () => setPlayingId(id),
      onEnd: () => setPlayingId(null),
      onError: () => setPlayingId(null),
    });

    if (!started) {
      setPlayingId(null);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  if (historyItems.length === 0) {
    return null; // Keep interface super clean if empty, or show minimal empty state
  }

  return (
    <section className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Recent Translations</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {historyItems.length}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Translations saved automatically in your browser's local storage
              </p>
            </div>
          </div>

          {/* Clear All Confirmation or Button */}
          {showClearConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-500 font-medium">Clear all?</span>
              <button
                onClick={handleClearAll}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete all translation history"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* History Cards Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {historyItems.slice(0, 10).map((item) => (
            <div
              key={item.id}
              onClick={() => onReuseTranslation(item)}
              className="group relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-brand-500/60 dark:hover:border-brand-500/60 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Language tags & timestamp */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60">
                      {item.sourceLangName}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold">
                      {item.targetLangName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(item.timestamp)}</span>
                  </div>
                </div>

                {/* Original Source */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {item.sourceText}
                </p>

                {/* Translated Result */}
                <p className="mt-2 text-sm sm:text-base font-semibold text-slate-900 dark:text-white line-clamp-2 leading-relaxed">
                  {item.translatedText}
                </p>
              </div>

              {/* Action Toolbar on Hover */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-brand-600 dark:text-brand-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <RotateCcw className="w-3 h-3" /> Click to reuse
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleSpeech(item.translatedText, item.targetLang, item.id, e)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      playingId === item.id
                        ? 'bg-accent-600 text-white'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100'
                    }`}
                    title="Listen to translation"
                  >
                    {playingId === item.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={(e) => handleCopyText(item.translatedText, item.id, e)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      copiedId === item.id
                        ? 'bg-emerald-600 text-white'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100'
                    }`}
                    title="Copy translated text"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={(e) => handleDeleteItem(item.id, e)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
