import React from 'react';
import { Type, Sparkles, Cpu, Share2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: <Type className="w-5 h-5 text-brand-600 dark:text-brand-400" />,
      title: 'Enter or Paste Text',
      description: 'Type your message or paste paragraphs directly from your clipboard. Supports up to 5,000 characters per query.',
    },
    {
      number: '02',
      icon: <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      title: 'Select Language Pair',
      description: 'Choose your desired target language or leave the source on Auto Detect to identify the language automatically.',
    },
    {
      number: '03',
      icon: <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: 'Neural Serverless API',
      description: 'Our Netlify serverless function chunks long queries and proxies requests to MyMemory Translation API without requiring any paid API keys.',
    },
    {
      number: '04',
      icon: <Share2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Listen, Copy & Store',
      description: 'Hear native speech audio, copy the translation with one click, or review your recent translations in local history.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/70 text-xs font-semibold mb-3">
            <span>Simple Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How LinguaFlow Works
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            From raw input to natural, accurate translation in milliseconds.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="font-extrabold text-2xl font-mono text-slate-300 dark:text-slate-700">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

