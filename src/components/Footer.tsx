import React from 'react';
import { Languages, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-500 p-0.5 shadow-md shadow-brand-500/20">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Languages className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              </div>
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white tracking-tight">
                LinguaFlow
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Smart AI-Powered Language Translator
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <a href="#home" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Home
            </a>
            <a href="#translator" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Translator
            </a>
            <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Features
            </a>
            <a href="#languages" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Supported Languages
            </a>
            <a href="#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              How It Works
            </a>
            <a href="#about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              About
            </a>
          </div>

          {/* Copyright & Made With */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>© {new Date().getFullYear()} LinguaFlow. All rights reserved.</p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
