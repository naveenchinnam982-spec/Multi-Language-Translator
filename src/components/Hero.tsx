import React from 'react';
import { ArrowDown, Globe2, Sparkles, Volume2, ShieldCheck, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative pt-24 pb-12 sm:pt-36 sm:pb-20 md:pt-40 md:pb-24 overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[250px] sm:h-[350px] bg-gradient-to-tr from-brand-500/20 via-indigo-500/20 to-accent-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-5 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-accent-500/10 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-40 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-brand-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/80 shadow-xs text-brand-700 dark:text-brand-300 text-[11px] sm:text-xs font-semibold mb-4 sm:mb-6 animate-fade-in max-w-full">
          <Sparkles className="w-3.5 h-3.5 text-accent-500 shrink-0" />
          <span className="truncate">Free AI Neural Translation • Powered by MyMemory</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.2] sm:leading-[1.12]">
          Break Language Barriers with{' '}
          <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-500 dark:from-brand-400 dark:via-indigo-300 dark:to-accent-400 bg-clip-text text-transparent">
            Smart Translation
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Translate text between multiple languages quickly and easily with our powerful translation tool.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-xs sm:max-w-none mx-auto">
          <a
            href="#translator"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 active:scale-[0.98] transition-all"
          >
            <span>Start Translating</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-700/80 shadow-xs active:scale-[0.98] transition-all"
          >
            <Zap className="w-4 h-4 text-brand-500" />
            <span>Explore Features</span>
          </a>
        </div>

        {/* Key Feature Badges Grid */}
        <div className="mt-8 sm:mt-12 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-left">
          <div className="flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
              <Globe2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">70+ Languages</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">Global dialects</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">Auto Detect</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">Smart detection</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
            <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">Text-to-Speech</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">Native audio</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">Free Engine</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">No billing needed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
