import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { ALL_LANGUAGES, POPULAR_LANGUAGES, AUTO_DETECT } from '../../data/languages';
import { Search, X, Check, Globe } from 'lucide-react';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCode: string;
  onSelect: (lang: Language) => void;
  title: string;
  includeAutoDetect?: boolean;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCode,
  onSelect,
  title,
  includeAutoDetect = false,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'popular'>('popular');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      // Prevent background scrolling on mobile when modal is open
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredLanguages = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sourceList = activeTab === 'popular' ? POPULAR_LANGUAGES : ALL_LANGUAGES;

    if (!query) {
      return sourceList;
    }

    return ALL_LANGUAGES.filter(
      l =>
        l.name.toLowerCase().includes(query) ||
        l.nativeName.toLowerCase().includes(query) ||
        l.code.toLowerCase().includes(query)
    );
  }, [search, activeTab]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200/80 dark:border-slate-800 flex flex-col max-h-[88vh] sm:max-h-[85vh] overflow-hidden animate-slide-up sm:animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {ALL_LANGUAGES.length} supported languages available
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close language selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by language, native name, or code..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Tabs */}
          {!search && (
            <div className="flex items-center gap-2 mt-2.5">
              <button
                onClick={() => setActiveTab('popular')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'popular'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Popular ({POPULAR_LANGUAGES.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                All Languages ({ALL_LANGUAGES.length})
              </button>
            </div>
          )}
        </div>

        {/* Language Options List */}
        <div className="overflow-y-auto p-2 sm:p-3 space-y-1 max-h-[380px] sm:max-h-[420px] scrollbar-thin">
          {/* Auto Detect option if allowed */}
          {includeAutoDetect && !search && (
            <button
              onClick={() => {
                onSelect(AUTO_DETECT);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-sm font-medium transition-colors ${
                selectedCode === 'auto'
                  ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:bg-slate-200 dark:active:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-500 animate-pulse shrink-0" />
                <span className="font-semibold">Auto Detect</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-normal truncate">
                  (Detect language automatically)
                </span>
              </div>
              {selectedCode === 'auto' && <Check className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 ml-2" />}
            </button>
          )}

          {/* List items */}
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map(lang => {
              const isSelected = selectedCode.toLowerCase() === lang.code.toLowerCase();
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelect(lang);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm transition-all ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:bg-slate-200 dark:active:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="w-8 text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
                      {lang.code}
                    </span>
                    <span className="font-medium truncate">{lang.name}</span>
                    {lang.nativeName && lang.nativeName !== lang.name && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        • {lang.nativeName}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
              No languages found matching "{search}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
