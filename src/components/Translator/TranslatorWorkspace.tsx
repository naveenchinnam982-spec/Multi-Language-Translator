import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Language, TranslationResponse } from '../../types';
import { AUTO_DETECT, getLanguageByCode } from '../../data/languages';
import { LanguageSelectorModal } from './LanguageSelectorModal';
import { ApiKeyAlert } from './ApiKeyAlert';
import { useToast } from '../../context/ToastContext';
import { speech } from '../../utils/speech';
import { saveTranslationHistoryItem } from '../../utils/storage';
import {
  ArrowLeftRight,
  Sparkles,
  Copy,
  Check,
  Volume2,
  Trash2,
  ClipboardPaste,
  Loader2,
  ChevronDown,
  CornerDownLeft,
  SlidersHorizontal,
} from 'lucide-react';

interface TranslatorWorkspaceProps {
  onTranslationComplete?: () => void;
  presetTranslation?: {
    sourceText: string;
    sourceLang: string;
    targetLang: string;
  } | null;
}

const MAX_CHARACTERS = 5000;

// Popular quick shortcuts for instant 1-tap switching on mobile & desktop
const QUICK_TARGET_LANGS = [
  { code: 'te', label: 'Telugu' },
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
];

export const TranslatorWorkspace: React.FC<TranslatorWorkspaceProps> = ({
  onTranslationComplete,
  presetTranslation,
}) => {
  const { toast } = useToast();

  // State
  const [sourceLang, setSourceLang] = useState<Language>(AUTO_DETECT);
  const [targetLang, setTargetLang] = useState<Language>(() => getLanguageByCode('te'));
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLangCode, setDetectedLangCode] = useState<string | null>(null);
  
  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{
    error: string;
    details?: string;
    code?: string;
  } | null>(null);

  // Modal selector states
  const [modalType, setModalType] = useState<'source' | 'target' | null>(null);

  // Audio / Speech states
  const [isPlayingSourceSpeech, setIsPlayingSourceSpeech] = useState(false);
  const [isPlayingTargetSpeech, setIsPlayingTargetSpeech] = useState(false);

  // Copy success indicator
  const [isCopied, setIsCopied] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputCardRef = useRef<HTMLDivElement>(null);

  // Handle preset translation load
  useEffect(() => {
    if (presetTranslation) {
      setSourceText(presetTranslation.sourceText);
      setSourceLang(getLanguageByCode(presetTranslation.sourceLang));
      setTargetLang(getLanguageByCode(presetTranslation.targetLang));
      setTranslatedText('');
      setDetectedLangCode(null);
      setErrorInfo(null);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [presetTranslation]);

  // Swap Languages
  const handleSwapLanguages = () => {
    if (sourceLang.code === 'auto') return;

    const previousSource = sourceLang;
    const previousTarget = targetLang;
    const previousInput = sourceText;
    const previousResult = translatedText;

    setSourceLang(previousTarget);
    setTargetLang(previousSource);

    if (previousResult) {
      setSourceText(previousResult);
      setTranslatedText(previousInput);
      setDetectedLangCode(null);
    }
  };

  // Main Translate handler
  const handleTranslate = useCallback(async () => {
    const trimmed = sourceText.trim();
    if (!trimmed) {
      toast.warning('Input empty', 'Please enter text to translate.');
      textareaRef.current?.focus();
      return;
    }

    if (trimmed.length > MAX_CHARACTERS) {
      toast.error('Text too long', `Maximum character limit is ${MAX_CHARACTERS}.`);
      return;
    }

    setIsLoading(true);
    setErrorInfo(null);
    speech.stop();
    setIsPlayingSourceSpeech(false);
    setIsPlayingTargetSpeech(false);

    try {
      const response = await fetch('/.netlify/functions/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: trimmed,
          targetLang: targetLang.code,
          sourceLang: sourceLang.code === 'auto' ? undefined : sourceLang.code,
        }),
      });

      const data: TranslationResponse = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.error || 'Translation request failed.';
        setErrorInfo({
          error: errorMsg,
          details: data.details,
          code: data.code,
        });
        toast.error('Translation Notice', errorMsg);
        return;
      }

      setTranslatedText(data.translatedText);
      setDetectedLangCode(data.detectedSourceLanguage || null);

      // Save to local history
      const detectedName = data.detectedSourceLanguage
        ? getLanguageByCode(data.detectedSourceLanguage).name
        : sourceLang.name;

      saveTranslationHistoryItem({
        sourceText: trimmed,
        translatedText: data.translatedText,
        sourceLang: sourceLang.code,
        sourceLangName: sourceLang.code === 'auto' ? `Auto (${detectedName})` : sourceLang.name,
        targetLang: targetLang.code,
        targetLangName: targetLang.name,
        detectedSourceLanguage: data.detectedSourceLanguage,
      });

      onTranslationComplete?.();
      toast.success('Translated successfully!');

      // Smooth scroll to output on mobile devices so user sees result immediately
      if (window.innerWidth < 1024 && outputCardRef.current) {
        setTimeout(() => {
          outputCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
      }

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error or backend function unavailable.';
      setErrorInfo({
        error: 'Unable to reach translation server.',
        details: msg,
        code: 'NETWORK_ERROR',
      });
      toast.error('Connection Error', 'Check your network connection.');
    } finally {
      setIsLoading(false);
    }
  }, [sourceText, targetLang, sourceLang, toast, onTranslationComplete]);

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to translate
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && sourceText.trim()) {
        handleTranslate();
      }
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setIsCopied(true);
      toast.success('Copied to clipboard!', 'Translated text ready to paste.');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error('Copy failed', 'Please copy manually.');
    }
  };

  // Paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setSourceText(prev => (prev ? prev + ' ' + text : text).slice(0, MAX_CHARACTERS));
        toast.info('Pasted from clipboard');
      }
    } catch {
      toast.warning('Clipboard access', 'Use Ctrl+V or tap & hold to paste.');
    }
  };

  // Clear Source
  const handleClearSource = () => {
    setSourceText('');
    setDetectedLangCode(null);
    speech.stop();
    setIsPlayingSourceSpeech(false);
    textareaRef.current?.focus();
  };

  // Clear Result
  const handleClearResult = () => {
    setTranslatedText('');
    setDetectedLangCode(null);
    speech.stop();
    setIsPlayingTargetSpeech(false);
  };

  // Clear All
  const handleClearAll = () => {
    setSourceText('');
    setTranslatedText('');
    setDetectedLangCode(null);
    setErrorInfo(null);
    speech.stop();
    setIsPlayingSourceSpeech(false);
    setIsPlayingTargetSpeech(false);
    toast.info('Cleared all text');
  };

  // Text-To-Speech for Target
  const handleToggleTargetSpeech = () => {
    if (!translatedText) return;

    if (isPlayingTargetSpeech) {
      speech.stop();
      setIsPlayingTargetSpeech(false);
      return;
    }

    speech.stop();
    setIsPlayingSourceSpeech(false);

    const started = speech.speak(translatedText, targetLang.code, {
      onStart: () => setIsPlayingTargetSpeech(true),
      onEnd: () => setIsPlayingTargetSpeech(false),
      onError: (err) => {
        setIsPlayingTargetSpeech(false);
        toast.warning('Speech synthesis notice', err.message);
      },
    });

    if (!started) {
      setIsPlayingTargetSpeech(false);
    }
  };

  // Text-To-Speech for Source
  const handleToggleSourceSpeech = () => {
    if (!sourceText.trim()) return;

    if (isPlayingSourceSpeech) {
      speech.stop();
      setIsPlayingSourceSpeech(false);
      return;
    }

    speech.stop();
    setIsPlayingTargetSpeech(false);

    const langCode = detectedLangCode || (sourceLang.code === 'auto' ? 'en' : sourceLang.code);

    const started = speech.speak(sourceText, langCode, {
      onStart: () => setIsPlayingSourceSpeech(true),
      onEnd: () => setIsPlayingSourceSpeech(false),
      onError: (err) => {
        setIsPlayingSourceSpeech(false);
        toast.warning('Speech synthesis notice', err.message);
      },
    });

    if (!started) {
      setIsPlayingSourceSpeech(false);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      speech.stop();
    };
  }, []);

  const isSwapDisabled = sourceLang.code === 'auto' || isLoading;
  const detectedLanguageName = detectedLangCode ? getLanguageByCode(detectedLangCode).name : null;

  return (
    <section id="translator" className="relative py-4 sm:py-10">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Glassmorphism Workspace Card */}
        <div className="rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-brand-500/5 transition-all overflow-hidden">
          
          {/* Top Language Bar with Responsive Layout */}
          <div className="p-3 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40">
            <div className="flex items-center justify-between gap-2">
              
              {/* Language Selection Row: Source & Target */}
              <div className="flex-1 flex items-center gap-1.5 sm:gap-3 min-w-0">
                
                {/* Source Language Button */}
                <button
                  onClick={() => setModalType('source')}
                  className="flex-1 min-w-0 flex items-center justify-between gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-brand-500 dark:hover:border-brand-500 shadow-xs text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {sourceLang.code === 'auto' && (
                      <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse shrink-0" />
                    )}
                    <span className="truncate">{sourceLang.name}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
                </button>

                {/* Swap Button */}
                <button
                  onClick={handleSwapLanguages}
                  disabled={isSwapDisabled}
                  title={
                    sourceLang.code === 'auto'
                      ? 'Swap disabled when Auto Detect is active'
                      : 'Swap languages'
                  }
                  aria-label="Swap source and target languages"
                  className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border shrink-0 transition-all duration-300 ${
                    isSwapDisabled
                      ? 'border-slate-200/50 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed bg-slate-100/40 dark:bg-slate-800/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500 bg-white dark:bg-slate-800 hover:rotate-180 shadow-xs active:scale-90'
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                {/* Target Language Button */}
                <button
                  onClick={() => setModalType('target')}
                  className="flex-1 min-w-0 flex items-center justify-between gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-brand-500 dark:hover:border-brand-500 shadow-xs text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  <span className="truncate">{targetLang.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
                </button>
              </div>

              {/* Clear All Action */}
              {(sourceText || translatedText) && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              )}
            </div>

            {/* Quick 1-Tap Language Shortcut Pills (Google Translate Style) */}
            <div className="mt-2.5 pt-2 border-t border-slate-100/70 dark:border-slate-800/60 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-[11px] font-medium text-slate-500">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mr-1">To:</span>
                {QUICK_TARGET_LANGS.map(q => {
                  const isSelected = targetLang.code === q.code;
                  return (
                    <button
                      key={q.code}
                      onClick={() => setTargetLang(getLanguageByCode(q.code))}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-brand-600 text-white font-bold shadow-xs'
                          : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {q.label}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setModalType('target')}
                className="text-brand-600 dark:text-brand-400 text-xs font-semibold flex items-center gap-1 hover:underline shrink-0 pl-2"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>All Languages</span>
              </button>
            </div>
          </div>

          {/* 2-Column Responsive Body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
            
            {/* LEFT: SOURCE INPUT */}
            <div className="p-4 sm:p-6 flex flex-col justify-between min-h-[220px] sm:min-h-[340px]">
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-2 font-medium">
                  <span>Input ({sourceLang.name})</span>
                  {detectedLanguageName && (
                    <span className="text-brand-600 dark:text-brand-400 font-semibold bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-full border border-brand-200/60 dark:border-brand-800/60">
                      Detected: {detectedLanguageName} ({detectedLangCode})
                    </span>
                  )}
                </div>

                <textarea
                  ref={textareaRef}
                  value={sourceText}
                  onChange={e => setSourceText(e.target.value.slice(0, MAX_CHARACTERS))}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter text to translate..."
                  rows={6}
                  className="w-full flex-1 bg-transparent border-0 resize-none text-base sm:text-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 leading-relaxed scrollbar-thin"
                />
              </div>

              {/* Source Bottom Toolbar */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  {/* Speech Button with Animated Wave */}
                  {sourceText.trim() && (
                    <button
                      onClick={handleToggleSourceSpeech}
                      className={`p-2 rounded-xl transition-all ${
                        isPlayingSourceSpeech
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                      title={isPlayingSourceSpeech ? 'Stop speech' : 'Listen to original text'}
                      aria-label="Listen to original text"
                    >
                      {isPlayingSourceSpeech ? (
                        <div className="flex items-center gap-0.5 px-0.5">
                          <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                          <span className="w-1 h-4 bg-white rounded-full animate-bounce" />
                          <span className="w-1 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {/* Paste button */}
                  <button
                    onClick={handlePaste}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    title="Paste from clipboard"
                    aria-label="Paste from clipboard"
                  >
                    <ClipboardPaste className="w-4 h-4" />
                  </button>

                  {/* Clear text button */}
                  {sourceText && (
                    <button
                      onClick={handleClearSource}
                      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                      title="Clear input"
                      aria-label="Clear input"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Character counter */}
                <div className="text-xs font-mono text-slate-400 dark:text-slate-500">
                  <span className={sourceText.length >= MAX_CHARACTERS ? 'text-rose-500 font-bold' : ''}>
                    {sourceText.length.toLocaleString()}
                  </span>
                  <span> / {MAX_CHARACTERS.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* MOBILE ONLY TRANSLATE BUTTON (DIRECTLY UNDER INPUT) */}
            <div className="p-3 lg:hidden bg-slate-50/50 dark:bg-slate-800/30 border-y border-slate-100 dark:border-slate-800">
              <button
                onClick={handleTranslate}
                disabled={isLoading || !sourceText.trim()}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
                  isLoading || !sourceText.trim()
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 text-white shadow-brand-500/25'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Translating to {targetLang.name}...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-accent-200" />
                    <span>Translate to {targetLang.name}</span>
                  </>
                )}
              </button>
            </div>

            {/* RIGHT: OUTPUT AREA */}
            <div
              ref={outputCardRef}
              className="p-4 sm:p-6 flex flex-col justify-between min-h-[220px] sm:min-h-[340px] bg-slate-50/40 dark:bg-slate-800/20"
            >
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-2 font-medium">
                  <span>Translation ({targetLang.name})</span>
                  {translatedText && (
                    <span className="text-[11px] font-mono text-slate-400">
                      {translatedText.length} chars
                    </span>
                  )}
                </div>

                {/* Translated text or loading skeleton */}
                <div className="flex-1 relative min-h-[100px]">
                  {isLoading ? (
                    <div className="space-y-2.5 pt-2 animate-pulse">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-full"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-4/5"></div>
                      <div className="pt-3 flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 font-medium">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Translating with MyMemory...</span>
                      </div>
                    </div>
                  ) : translatedText ? (
                    <div className="text-base sm:text-lg text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap select-text font-normal">
                      {translatedText}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm italic select-none py-8">
                      Translation will appear here...
                    </div>
                  )}
                </div>
              </div>

              {/* Output Bottom Toolbar */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  {/* TTS for target translated text */}
                  {translatedText && (
                    <button
                      onClick={handleToggleTargetSpeech}
                      className={`p-2 rounded-xl transition-all ${
                        isPlayingTargetSpeech
                          ? 'bg-accent-600 text-white shadow-md'
                          : 'hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                      title={isPlayingTargetSpeech ? 'Stop speech' : 'Listen to translation'}
                      aria-label="Listen to translated text"
                    >
                      {isPlayingTargetSpeech ? (
                        <div className="flex items-center gap-0.5 px-0.5">
                          <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                          <span className="w-1 h-4 bg-white rounded-full animate-bounce" />
                          <span className="w-1 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {/* Copy button */}
                  {translatedText && (
                    <button
                      onClick={handleCopy}
                      className={`p-2 rounded-xl transition-all ${
                        isCopied
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                      title="Copy translated text"
                      aria-label="Copy translated text"
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}

                  {/* Clear result button */}
                  {translatedText && (
                    <button
                      onClick={handleClearResult}
                      className="p-2 rounded-xl hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      title="Clear translation"
                      aria-label="Clear translation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* DESKTOP ONLY TRANSLATE BUTTON */}
                <div className="hidden lg:flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                      Ctrl
                    </kbd>
                    +
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                      Enter
                    </kbd>
                    <CornerDownLeft className="w-3 h-3 ml-0.5" />
                  </span>

                  <button
                    onClick={handleTranslate}
                    disabled={isLoading || !sourceText.trim()}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 shadow-md ${
                      isLoading || !sourceText.trim()
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-brand-500/25 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Translating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-accent-200" />
                        <span>Translate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error / Rate Limit Alert Banner */}
          {errorInfo && (
            <div className="p-3 sm:p-5 border-t border-slate-100 dark:border-slate-800">
              <ApiKeyAlert
                error={errorInfo.error}
                details={errorInfo.details}
                code={errorInfo.code}
                onDismiss={() => setErrorInfo(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Language Selector Modals */}
      <LanguageSelectorModal
        isOpen={modalType === 'source'}
        onClose={() => setModalType(null)}
        selectedCode={sourceLang.code}
        onSelect={lang => setSourceLang(lang)}
        title="Select Source Language"
        includeAutoDetect={true}
      />

      <LanguageSelectorModal
        isOpen={modalType === 'target'}
        onClose={() => setModalType(null)}
        selectedCode={targetLang.code}
        onSelect={lang => setTargetLang(lang)}
        title="Select Target Language"
        includeAutoDetect={false}
      />
    </section>
  );
};
