import React from 'react';
import { Shield, Sparkles, Server, Lock, Layers } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 relative bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Mission & Vision */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/70 dark:border-brand-800/70 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>About LinguaFlow</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Bridging Global Conversations Through Secure AI
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              LinguaFlow was designed to deliver a modern, intuitive, and high-performance translation workspace.
              Whether translating documents, casual messaging, or learning a foreign tongue, LinguaFlow combines the power of MyMemory's machine translation engine with a lightning-fast responsive interface.
            </p>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Built with privacy and developer best practices at its core, LinguaFlow ensures your API credentials and user data remain protected through isolated serverless Netlify microservices.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Zero Client-side Key Exposure</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <div className="w-2 h-2 rounded-full bg-brand-500" />
                <span>100+ Dialects & Accents</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Local History Preservation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Architecture Overview Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span>System & Security Architecture</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Netlify Serverless Functions
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Translation requests route securely via <code className="text-brand-600 dark:text-brand-300 font-mono">/.netlify/functions/translate</code>, automatically managing chunking and language pairs for MyMemory API.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Input Sanitization & Rate Safety
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Payloads are verified, truncated if beyond character ceilings, and decoded from HTML entities to preserve clean punctuation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Edge Optimized Static Hosting
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Vite-bundled React application deployed with global CDN edge caching, security headers, and instant SPA routing fallbacks.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

