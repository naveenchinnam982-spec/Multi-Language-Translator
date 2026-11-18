import React from 'react';
import {
  Zap,
  Globe2,
  Sparkles,
  Copy,
  Volume2,
  History,
  ShieldCheck,
  Moon
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: 'Fast Translation',
      description: 'Experience blazing fast real-time translation powered by MyMemory neural translation infrastructure with zero fees or billing.',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/60',
    },
    {
      icon: <Globe2 className="w-6 h-6 text-brand-500" />,
      title: '100+ Languages',
      description: 'Translate across global languages, regional dialects, and complex scripts including Latin, Cyrillic, Arabic, Devanagari, and CJK.',
      bg: 'bg-brand-50 dark:bg-brand-950/40 border-brand-200/60 dark:border-brand-800/60',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      title: 'Auto Language Detection',
      description: 'Not sure what language text is in? LinguaFlow detects the source language automatically with high precision.',
      bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-800/60',
    },
    {
      icon: <Copy className="w-6 h-6 text-emerald-500" />,
      title: 'One-Click Copy',
      description: 'Instantly copy translated results to your system clipboard with visual confirmation and toast alerts.',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/60',
    },
    {
      icon: <Volume2 className="w-6 h-6 text-pink-500" />,
      title: 'Text-to-Speech Engine',
      description: 'Listen to native pronunciations with integrated Web Speech synthesis featuring accent matching and pause controls.',
      bg: 'bg-pink-50 dark:bg-pink-950/40 border-pink-200/60 dark:border-pink-800/60',
    },
    {
      icon: <History className="w-6 h-6 text-indigo-500" />,
      title: 'Translation History',
      description: 'Never lose your translations. Automatically preserves your recent queries locally with one-tap reuse.',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-800/60',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-teal-500" />,
      title: 'Zero API Key Exposure',
      description: 'Production-ready Netlify serverless proxy keeps your secret API credentials safe on the server side.',
      bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200/60 dark:border-teal-800/60',
    },
    {
      icon: <Moon className="w-6 h-6 text-sky-500" />,
      title: 'Dark & Light Mode',
      description: 'Carefully tuned palettes for day and night translation with instant theme persistence in localStorage.',
      bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-800/60',
    },
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/70 dark:border-brand-800/70 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>State-of-the-Art Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Designed for Precision & Flow
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Everything you need for seamless cross-cultural communication, language learning, and document translation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-5 ${feature.bg} transition-transform group-hover:scale-110 duration-200`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

