# LinguaFlow — Advanced Multi-Language Translation Platform 🌐

**Live Production URL:** [https://linguaflow-translator-ai.netlify.app](https://linguaflow-translator-ai.netlify.app)  
**GitHub Repository:** [https://github.com/naveenchinnam982-spec/Multi-Language-Translator](https://github.com/naveenchinnam982-spec/Multi-Language-Translator)

LinguaFlow is a production-grade, full-stack language translation web platform engineered with **React 18**, **TypeScript**, **Tailwind CSS**, and **Netlify Serverless Functions**. It delivers accurate machine translation across 70+ world languages—featuring full bidirectional **English ↔ Telugu** and **English ↔ Hindi** support—completely free with **zero paid API keys, zero cloud billing, and zero usage fees**.

---

## 🏗️ Architectural Overview & System Design

```
                                  ┌────────────────────────────────────────┐
                                  │            Browser Client              │
                                  │  (React 18 + TypeScript + Tailwind)   │
                                  └───────────────────┬────────────────────┘
                                                      │
                                           User Translation Request
                                                      │
                                                      ▼
                                       ┌─────────────────────────────┐
                                       │   executeTranslation()      │
                                       │ (Client Service Controller) │
                                       └──────────────┬──────────────┘
                                                      │
                         ┌────────────────────────────┴───────────────────────────┐
                         │                                                        │
                         ▼ Primary Path                                           ▼ Failover Fallback
           ┌───────────────────────────┐                            ┌───────────────────────────┐
           │ Netlify Serverless Proxy  │                            │ Direct Client Translation │
           │ (/.netlify/functions/     │                            │ (directMyMemoryTranslate) │
           │  translate.js)            │                            └─────────────┬─────────────┘
           └─────────────┬─────────────┘                                          │
                         │                                                        │
                         ▼                                                        ▼
           ┌───────────────────────────┐                            ┌───────────────────────────┐
           │ 3-Tier Hierarchical       │                            │ 3-Tier Hierarchical       │
           │ Sentence Chunking Engine  │                            │ Sentence Chunking Engine  │
           └─────────────┬─────────────┘                            └─────────────┬─────────────┘
                         │                                                        │
                         ▼                                                        ▼
           ┌───────────────────────────┐                            ┌───────────────────────────┐
           │ HTML Entity Sanitization  │                            │ HTML Entity Sanitization  │
           │ Pipeline (decodeEntities) │                            │ Pipeline (decodeEntities) │
           └─────────────┬─────────────┘                            └─────────────┬─────────────┘
                         │                                                        │
                         └────────────────────────────┬───────────────────────────┘
                                                      │
                                                      ▼
                                       ┌─────────────────────────────┐
                                       │  MyMemory Free API Cluster  │
                                       │ (api.mymemory.translated)   │
                                       └─────────────────────────────┘
```

---

## 🔬 Core Engineering Techniques & Algorithms

### 1. Hierarchical Sentence-Boundary Chunking Algorithm
Free translation endpoints enforce a ~500-character single-query ceiling. Primitive substring or word slicing disrupts grammatical structures and causes severe mistranslations. LinguaFlow implements a multi-tier recursive tokenizer:

- **Tier 1 (Paragraph Preservation):** Splits text by newline delimiters (`\n`) to preserve paragraph structure.
- **Tier 2 (Multi-Lingual Sentence Tokenization):** Identifies sentence boundaries across Latin, Indic, Arabic, and East-Asian scripts using tokenizing regex:
  ```regex
  /([.!?।؟。]+[\s]+)/
  ```
  *(Matches standard punctuation `.!?`, Hindi/Sanskrit/Bengali danda `।`, Arabic question mark `؟`, and CJK full-stop `。`)*
- **Tier 3 (Word-Level Greedy Packing):** If an individual sentence exceeds 450 characters, it falls back to whitespace tokenization with greedy buffer accumulation under 450 characters.
- **Rate-Smoothing Dispatcher:** Dispatches sequential segment queries with a 100ms inter-chunk delay to avoid HTTP 429 rate limits, then recombines results into cohesive output.

---

### 2. Dual-Layer Hybrid Failover Strategy (Zero-Downtime)
To ensure high availability across any deployment environment:
1. **Primary Layer (Serverless Edge Proxy):** Requests are initially routed through `/.netlify/functions/translate`. This masks client IPs, prevents browser CORS restrictions, and normalizes headers.
2. **Resilient Client Fallback Layer:** If the serverless endpoint returns `404 Not Found` (e.g., when hosted on a pure static CDN drop or GitHub Pages) or encounters temporary network failures, `translateService.ts` transparently intercepts the error and executes the translation directly in the browser via the client-side engine.

---

### 3. HTML Entity Normalization Pipeline
Machine translation backends frequently return unescaped or partially encoded HTML entities. LinguaFlow cleans and normalizes all responses prior to DOM rendering:
- Unescapes named entities (`&quot;`, `&#39;`, `&apos;`, `&lt;`, `&gt;`, `&amp;`).
- Decodes base-10 decimal character codes (`&#(\d+);`).
- Decodes base-16 hexadecimal character codes (`&#x([0-9a-fA-F]+);`).

---

### 4. Advanced Web Speech Synthesis with BCP-47 Resolution
The built-in voice player uses a customized `SpeechService` singleton that resolves system voices through a three-stage heuristic:
1. **Exact BCP-47 Locale Match:** Matches specific language and regional dialect codes (e.g., `te-IN` for Telugu, `en-US` for English, `hi-IN` for Hindi).
2. **ISO-639-1 Prefix Match:** Matches primary language family codes (e.g., `es` matches `es-ES` or `es-MX`).
3. **Graceful System Fallback:** Selects the default synthesized speech voice when regional voices are missing.
4. **Synchronized Waveform Visualization:** An animated 3-bar audio wave activates during speech playback and cleans up cleanly on `onend` and `onerror` events.

---

### 5. Mobile-First Responsive UX Patterns
- **Touch-Friendly Bottom Sheet Drawer:** Mobile viewport opens language selectors in a modal bottom sheet with drag indicator, backdrop blur, and background scroll locking.
- **Quick-Access Language Pills:** Instant 1-tap switching between high-frequency language pairs (English, Telugu, Hindi, Spanish).
- **Auto-Scroll to Result:** On mobile screens, initiating a translation smoothly scrolls the user viewport directly to the translated result card.
- **Clipboard Integration:** One-click copy with tactile feedback and toast notifications.

---

## 🌐 Supported Languages (70+)

LinguaFlow includes pre-configured BCP-47 mapping and speech codes for over 70 languages:

| Language | Code | Native Name | TTS Voice Code |
|---|---|---|---|
| **English** | `en` | English | `en-US` |
| **Telugu** | `te` | తెలుగు | `te-IN` |
| **Hindi** | `hi` | हिन्दी | `hi-IN` |
| **Tamil** | `ta` | தமிழ் | `ta-IN` |
| **Kannada** | `kn` | ಕನ್ನಡ | `kn-IN` |
| **Malayalam** | `ml` | മലയാളം | `ml-IN` |
| **Spanish** | `es` | Español | `es-ES` |
| **French** | `fr` | Français | `fr-FR` |
| **German** | `de` | Deutsch | `de-DE` |
| **Japanese** | `ja` | 日本語 | `ja-JP` |
| **Chinese (Simplified)** | `zh-CN` | 简体中文 | `zh-CN` |
| **Arabic** | `ar` | العربية | `ar-SA` |

*(+ over 60 additional global languages with auto-detection support)*

---

## 🛠️ Complete Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Core Framework** | React 18.3.1 | Functional components, Hooks, Virtual DOM |
| **Language & Typings** | TypeScript 5.7.2 | Strict mode, full interface definitions |
| **Build Tooling** | Vite 6.0.3 | Fast HMR, Rollup production bundling |
| **Styling** | Tailwind CSS 3.4.17 | Utility-first CSS, dark-mode variant support |
| **Icons** | Lucide React | High-performance SVG icons |
| **Serverless Runtime** | Netlify Functions | Node.js 20/24 ESM Lambda runtime |
| **Audio API** | Web SpeechSynthesis API | Native browser speech synthesis |
| **Storage** | LocalStorage API | Persistent history & theme preference |
| **Hosting & Edge** | Netlify Edge CDN | Global edge distribution, HTTPS, security headers |

---

## 📁 Repository File Structure

```text
├── netlify/
│   └── functions/
│       └── translate.js             # Serverless backend proxy with chunking & rate management
├── public/
│   ├── _redirects                   # SPA rewrite rules & API reverse proxy configuration
│   └── logo.svg                     # Vector brand logo
├── src/
│   ├── App.tsx                      # Main application layout and view state
│   ├── main.tsx                     # React DOM initialization
│   ├── index.css                    # Tailwind directives and custom animation styles
│   ├── types/
│   │   └── index.ts                 # Type definitions (Language, HistoryItem, TranslationResponse)
│   ├── data/
│   │   └── languages.ts             # 70+ language definitions with BCP-47 speech codes
│   ├── context/
│   │   ├── ThemeContext.tsx         # Dark/Light mode provider with system preference detection
│   │   └── ToastContext.tsx         # Floating alert notification provider
│   ├── utils/
│   │   ├── cn.ts                    # Class name merger (clsx + tailwind-merge)
│   │   ├── speech.ts                # Web SpeechSynthesis controller & voice resolver
│   │   ├── storage.ts               # LocalStorage translation history manager
│   │   └── translateService.ts      # Dual-layer translation dispatcher with offline fallback
│   └── components/
│       ├── Navbar.tsx               # Header with mobile drawer & theme toggle
│       ├── Hero.tsx                 # Headline banner with feature pills
│       ├── Features.tsx             # Interactive platform capabilities grid
│       ├── SupportedLanguages.tsx   # Searchable interactive directory of 70+ languages
│       ├── HowItWorks.tsx           # Step-by-step workflow guide
│       ├── About.tsx                # Technical summary & mission
│       ├── Footer.tsx               # Footer with links & attribution
│       ├── Translator/
│       │   ├── TranslatorWorkspace.tsx   # Core translation workspace (inputs, controls, results)
│       │   ├── LanguageSelectorModal.tsx # Bottom-sheet language selector modal
│       │   └── ApiKeyAlert.tsx           # Friendly status information card
│       └── History/
│           └── TranslationHistory.tsx    # Saved translation cards with replay & deletion
├── netlify.toml                     # Netlify build configuration and security headers
├── package.json                     # Project manifest and build scripts
├── postcss.config.js                # PostCSS plugins (Tailwind, Autoprefixer)
├── tailwind.config.js               # Tailwind design system configuration
├── tsconfig.json                    # TypeScript compiler configuration
└── vite.config.ts                   # Vite configuration with local dev proxy
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 2. Installation
```bash
git clone https://github.com/naveenchinnam982-spec/Multi-Language-Translator.git
cd Multi-Language-Translator
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser. The Vite dev server proxies translation requests directly so translations work immediately.

### 4. Build for Production
```bash
npm run build
```
This generates an optimized static bundle in `dist/` verified with TypeScript checks (`tsc && vite build`).

---

## ☁️ Deployment Guide

### Deploying to Netlify (Automatic via Git)
1. Fork or push this repository to your GitHub account.
2. In [Netlify Dashboard](https://app.netlify.com/), click **Add new site > Import an existing project**.
3. Select your GitHub repository.
4. Settings are automatically picked up from `netlify.toml`:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
   - **Functions Directory:** `netlify/functions`
5. Click **Deploy**. Your site is instantly live with working serverless functions.

---

## 🔒 Security & Performance Headers

Configured via `netlify.toml`:
- `X-Frame-Options: DENY` — Prevents clickjacking attacks.
- `X-Content-Type-Options: nosniff` — Prevents MIME-type confusion exploits.
- `X-XSS-Protection: 1; mode=block` — Enforces cross-site scripting filters.
- `Referrer-Policy: strict-origin-when-cross-origin` — Protects user privacy.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
