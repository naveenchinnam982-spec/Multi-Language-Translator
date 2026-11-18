import React, { useState, useMemo } from 'react';
import { ALL_LANGUAGES, POPULAR_LANGUAGES } from '../data/languages';
import { Language } from '../types';
import { Search, Globe2, ArrowUpRight } from 'lucide-react';

interface SupportedLanguagesProps {
  onSelectLanguage: (lang: Language) => void;
}

export const SupportedLanguages: React.FC<SupportedLanguagesProps> = ({ onSelectLanguage }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'popular'>('popular');

  const filteredLanguages = useMemo(() => {
    const query = search.trim().toLowerCase();
    const baseList = activeCategory === 'popular' ? POPULAR_LANGUAGES : ALL_LANGUAGES;

    if (!query) {
      return baseList;
    }

    return ALL_LANGUAGES.filter(
      l =>
        l.name.toLowerCase().includes(query) ||
        l.nativeName.toLowerCase().includes(query) ||
        l.code.toLowerCase().includes(query)
    );
  }, [search, activeCategory]);

  const handleLanguageClick = (lang: Language) => {
    onSelectLanguage(lang);
    // Smooth scroll to translator
    const el = document.getElementById('translator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="languages" className="py-20 relative bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-50 dark:bg-accent-950/60 text-accent-700 dark:text-accent-300 border border-accent-200/70 dark:border-accent-800/70 text-xs font-semibold mb-3">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Global Reach</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Supported Languages & Scripts
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
              Over {ALL_LANGUAGES.length} world languages powered by neural machine translation.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search languages..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        {!search && (
          <div className="flex items-center gap-2 mb-8">
            <button
              onClick={() => setActiveCategory('popular')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === 'popular'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              Popular Languages ({POPULAR_LANGUAGES.length})
            </button>
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === 'all'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              All Languages ({ALL_LANGUAGES.length})
            </button>
          </div>
        )}

        {/* Languages Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredLanguages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageClick(lang)}
              className="group p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 hover:bg-brand-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-brand-500/60 dark:hover:border-brand-500/60 shadow-xs hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 font-semibold">
                  {lang.code}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-300">
                  {lang.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                  {lang.nativeName}
                </p>
              </div>
            </button>
          ))}
        </div>

        {filteredLanguages.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            No supported language found for "{search}".
          </div>
        )}
      </div>
    </section>
  );
};
