import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TranslatorWorkspace } from './components/Translator/TranslatorWorkspace';
import { TranslationHistory } from './components/History/TranslationHistory';
import { Features } from './components/Features';
import { SupportedLanguages } from './components/SupportedLanguages';
import { HowItWorks } from './components/HowItWorks';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { Language, TranslationHistoryItem } from './types';

export const App: React.FC = () => {
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [presetTranslation, setPresetTranslation] = useState<{
    sourceText: string;
    sourceLang: string;
    targetLang: string;
  } | null>(null);

  const handleTranslationComplete = () => {
    setHistoryRefreshKey(prev => prev + 1);
  };

  const handleReuseTranslation = (item: TranslationHistoryItem) => {
    setPresetTranslation({
      sourceText: item.sourceText,
      sourceLang: item.sourceLang,
      targetLang: item.targetLang,
    });
    // Scroll smoothly to translator
    const el = document.getElementById('translator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectLanguageFromShowcase = (lang: Language) => {
    setPresetTranslation(prev => ({
      sourceText: prev?.sourceText || '',
      sourceLang: prev?.sourceLang || 'auto',
      targetLang: lang.code,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TranslatorWorkspace
          onTranslationComplete={handleTranslationComplete}
          presetTranslation={presetTranslation}
        />
        <TranslationHistory
          onReuseTranslation={handleReuseTranslation}
          refreshTrigger={historyRefreshKey}
        />
        <Features />
        <SupportedLanguages onSelectLanguage={handleSelectLanguageFromShowcase} />
        <HowItWorks />
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default App;

