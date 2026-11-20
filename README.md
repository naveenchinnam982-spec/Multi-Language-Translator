# LinguaFlow — Multi-Language Translator 🌐

LinguaFlow is a modern, fast, and responsive translation web application built with **React**, **TypeScript**, and **Tailwind CSS**. It delivers seamless real-time translations across 70+ languages with full bidirectional **English ↔ Telugu** support—completely free with **zero API keys or billing required**.

---

## 🔗 Quick Links

- **Live Demo:** [https://linguaflow-translator-ai.netlify.app](https://linguaflow-translator-ai.netlify.app)
- **GitHub Repository:** [https://github.com/naveenchinnam982-spec/Multi-Language-Translator](https://github.com/naveenchinnam982-spec/Multi-Language-Translator)

---

## ✨ Key Features

- **100% Free Translation:** Powered by the MyMemory translation engine without requiring any paid API keys or subscription.
- **English ↔ Telugu & 70+ Languages:** Accurate bidirectional translation with one-tap quick language pills.
- **Auto Language Detection:** Automatically detects source languages as you type.
- **Voice Text-to-Speech (TTS):** Natural speech playback with animated audio waveform indicator.
- **Mobile-First Experience:** Bottom-sheet drawer for easy language selection on mobile devices.
- **History & Bookmarks:** Automatically preserves translation history in local storage for quick access.
- **Dark & Light Themes:** Smooth day/night toggle matching user preference.
- **Smart Text Chunking:** Slices lengthy paragraphs into sentences to ensure reliable, high-quality results.

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, Lucide Icons |
| **Backend / Edge** | Netlify Serverless Functions (Node.js) |
| **Translation** | MyMemory Translation API |
| **Deployment** | Netlify |

---

## 📁 Project Structure

```
├── netlify/
│   └── functions/
│       └── translate.js         # Serverless proxy for translation requests
├── public/
│   ├── _redirects               # SPA routing & API rewrite rules
│   └── logo.svg                 # Brand icon
├── src/
│   ├── components/              # UI components (Navbar, Translator, History, etc.)
│   ├── context/                 # Theme and toast notification contexts
│   ├── data/                    # Language definitions and metadata
│   ├── utils/                   # Translation service, speech synthesis, storage
│   ├── App.tsx                  # Core application component
│   └── main.tsx                 # Entry point
├── netlify.toml                 # Netlify build and deployment config
└── package.json                 # Dependencies and npm scripts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/naveenchinnam982-spec/Multi-Language-Translator.git
   cd Multi-Language-Translator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local dev server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deployment to Netlify

This project is pre-configured for one-click deployment on Netlify:

1. Push your repository to GitHub.
2. In Netlify, select **Add new site > Import an existing project**.
3. Choose this repository.
4. Build settings are automatically detected from `netlify.toml`:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
   - **Functions Directory:** `netlify/functions`
5. Click **Deploy Site** — your translator is live!

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
