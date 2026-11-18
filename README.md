# LinguaFlow – Smart Language Translator 🌐✨

> A modern language translation web application built with React, TypeScript, Tailwind CSS, Netlify Serverless Functions, and the free MyMemory Translation API.

---

## 📖 Overview

**LinguaFlow** is a production-ready, full-stack language translation web platform. It delivers real-time machine translations across 70+ languages—including full bidirectional **English <-> Telugu** and **English <-> Hindi** support—completely free with **zero API keys and zero billing required**.

The architecture combines a modern React frontend with a Netlify Serverless proxy (`netlify/functions/translate.js`) that handles intelligent sentence chunking for long texts, rate-limit backoff, and automatic source language detection.

---

## ✨ Features

- ⚡ **100% Free Translation**: Integrated with the MyMemory Translation API (`https://api.mymemory.translated.net/get`). No credit card, API key, or billing required.
- 🇮🇳 **Full English <-> Telugu Support**: High-accuracy bidirectional translation between English and Telugu (`te`), alongside Hindi, Tamil, Kannada, Spanish, French, German, and 70+ languages.
- 🔍 **Automatic Language Detection**: Automatically recognizes source language without requiring manual language selection.
- 🔄 **Smart Language Swap**: One-click exchange between source and target languages with full state preservation.
- 🔊 **Text-to-Speech (TTS)**: Built-in SpeechSynthesis player with language and dialect matching for original and translated text.
- 📋 **One-Click Copy**: Instant clipboard copying with tactile feedback and toast notifications.
- 🕒 **Persistent Translation History**: Saves queries locally in `localStorage` with one-tap reuse, listen, or deletion.
- 📄 **Smart Sentence Chunking**: Automatically slices long paragraphs (up to 5,000 characters) into clean sentence segments, queries MyMemory, and recombines the results seamlessly.
- 🎨 **Glassmorphism UI / UX**: Modern translucent cards, gradient backdrops, smooth transitions, and responsive layout.
- 🌓 **Dark & Light Mode**: Fluid day/night switching with automatic system preference detection and localStorage persistence.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 (Vite + TypeScript) |
| **Styling** | Tailwind CSS + Glassmorphism & Animations |
| **Icons** | Lucide React |
| **Serverless Backend** | Netlify Functions (Node.js ESM) |
| **Translation Engine** | MyMemory Translation API |
| **Speech Engine** | Web SpeechSynthesis API |
| **Deployment Target** | Netlify Edge CDN |
| **Version Control** | Git & GitHub |

---

## 📂 Project Folder Structure

```text
Translater web/
├── .env.example                 # Optional environment configuration
├── .gitignore                   # Ignored files (node_modules, .env, dist)
├── index.html                   # HTML entry point with fonts & metadata
├── netlify.toml                 # Netlify build, SPA redirects & security headers
├── package.json                 # Project dependencies & npm scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind theme, dark mode & animations
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with local Netlify dev proxy
├── netlify/
│   └── functions/
│       └── translate.js         # Serverless translation proxy with smart chunking
├── public/
│   └── logo.svg                 # LinguaFlow brand logo
└── src/
    ├── App.tsx                  # Main application orchestrator
    ├── main.tsx                 # React DOM mount point
    ├── index.css                # Global styles, fonts, and scrollbars
    ├── types/
    │   └── index.ts             # TypeScript interfaces (Language, History, Response)
    ├── data/
    │   └── languages.ts         # 70+ supported languages (English, Telugu, Hindi, etc.)
    ├── context/
    │   ├── ThemeContext.tsx     # Dark/Light theme manager
    │   └── ToastContext.tsx     # Floating toast alert system
    ├── utils/
    │   ├── cn.ts                # Tailwind class utility
    │   ├── speech.ts            # SpeechSynthesis voice manager & controller
    │   └── storage.ts           # LocalStorage translation history helper
    └── components/
        ├── Navbar.tsx           # Navigation header with logo, theme toggle & mobile menu
        ├── Hero.tsx             # Hero banner with value proposition & feature badges
        ├── Features.tsx         # Showcase of core product capabilities
        ├── SupportedLanguages.tsx # Interactive searchable directory of 70+ languages
        ├── HowItWorks.tsx       # 4-step workflow roadmap
        ├── About.tsx            # Mission statement & architecture overview
        ├── Footer.tsx           # Footer with links & copyright
        ├── Translator/
        │   ├── TranslatorWorkspace.tsx  # Central translation split interface
        │   ├── LanguageSelectorModal.tsx # Searchable modal for language selection
        │   └── ApiKeyAlert.tsx          # Friendly notice & quota helper
        └── History/
            └── TranslationHistory.tsx   # History management cards & actions
```

---

## 🚀 Installation & Local Development

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0 or newer)
- npm (version 9.0 or newer)

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Translations work out of the box with zero setup!

> The local Vite development server includes an integrated proxy that handles `/.netlify/functions/translate` requests, enabling full local testing without requiring the Netlify CLI.

---

## ☁️ Netlify Deployment

1. Push your repository to GitHub.
2. Log in to [Netlify](https://app.netlify.com/).
3. Click **Add new site > Import an existing project** and select your GitHub repository.
4. Netlify will automatically detect settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
5. Click **Deploy site**. Your translation site is immediately live with zero environment variable configuration required!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
