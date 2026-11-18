import { ALL_LANGUAGES } from '../data/languages';

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public isSupported(): boolean {
    return !!this.synth;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  public getBestVoiceForLanguage(langCode: string): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (!voices || voices.length === 0) return null;

    const langObj = ALL_LANGUAGES.find(l => l.code.toLowerCase() === langCode.toLowerCase());
    const preferredSpeechCode = langObj?.speechCode?.toLowerCase() || langCode.toLowerCase();

    // 1. Exact match e.g. "es-ES" === "es-es"
    let match = voices.find(v => v.lang.toLowerCase() === preferredSpeechCode);
    if (match) return match;

    // 2. Prefix match e.g. "es" matches "es-MX" or "es-US"
    const prefix = langCode.split('-')[0].toLowerCase();
    match = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
    if (match) return match;

    // 3. Fallback to default voice
    return voices.find(v => v.default) || voices[0] || null;
  }

  public speak(
    text: string,
    langCode: string,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: Error) => void;
    }
  ): boolean {
    if (!this.synth) {
      callbacks?.onError?.(new Error('Speech synthesis is not supported in this browser.'));
      return false;
    }

    this.stop();

    if (!text || text.trim() === '') {
      return false;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      const langObj = ALL_LANGUAGES.find(l => l.code.toLowerCase() === langCode.toLowerCase());
      utterance.lang = langObj?.speechCode || langCode;

      const voice = this.getBestVoiceForLanguage(langCode);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 0.95; // Slightly natural pace
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        callbacks?.onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        callbacks?.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        // Ignore cancellation errors
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          callbacks?.onError?.(new Error(e.error || 'Speech error occurred.'));
        } else {
          callbacks?.onEnd?.();
        }
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
      return true;
    } catch (err: unknown) {
      callbacks?.onError?.(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!this.synth && this.synth.speaking;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }
}

export const speech = new SpeechService();
