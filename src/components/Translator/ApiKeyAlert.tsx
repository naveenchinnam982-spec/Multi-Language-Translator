import React from 'react';
import { AlertTriangle, Clock, X } from 'lucide-react';

interface ApiKeyAlertProps {
  error: string;
  details?: string;
  code?: string;
  onDismiss: () => void;
}

export const ApiKeyAlert: React.FC<ApiKeyAlertProps> = ({
  error,
  details,
  code,
  onDismiss,
}) => {
  const isRateLimit = code === 'RATE_LIMIT_EXCEEDED';

  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 backdrop-blur-sm animate-fade-in relative overflow-hidden">
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
          {isRateLimit ? <Clock className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <h4 className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
            <span>{isRateLimit ? 'Translation Rate Limit' : 'Translation Notice'}</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/20 text-amber-800 dark:text-amber-300">
              {code || 'NOTICE'}
            </span>
          </h4>
          <p className="mt-1 text-xs sm:text-sm text-amber-800 dark:text-amber-200/90 leading-relaxed">
            {error}
          </p>

          {details && details !== error && (
            <p className="mt-1.5 text-xs text-amber-700/80 dark:text-amber-300/70 font-mono bg-amber-500/10 p-2 rounded-lg break-all">
              {details}
            </p>
          )}

          {isRateLimit && (
            <div className="mt-3 text-xs bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-amber-500/20 space-y-1 text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Tip for higher translation volume:
              </p>
              <p>
                MyMemory provides generous free translations without any API key or credit card. If you translate extensively, you can optionally configure an email in your environment variables to expand the free quota up to 50,000 words per day.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
          title="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
