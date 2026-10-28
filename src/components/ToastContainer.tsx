import React from 'react';
import { CheckCircle2, HeartHandshake, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => {
        const isComfort = toast.type === 'comfort';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl p-4 shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              isComfort
                ? 'bg-slate-900/95 border-teal-500/40 text-slate-100 shadow-teal-950/40'
                : isSuccess
                ? 'bg-slate-900/95 border-emerald-500/40 text-slate-100 shadow-emerald-950/40'
                : isWarning
                ? 'bg-slate-900/95 border-amber-500/40 text-slate-100 shadow-amber-950/40'
                : 'bg-slate-900/95 border-slate-700 text-slate-100 shadow-slate-950/40'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="shrink-0 mt-0.5">
                {isComfort && (
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                )}
                {isSuccess && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                {isWarning && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                )}
                {!isComfort && !isSuccess && !isWarning && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Info className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-semibold text-slate-200">
                  {toast.title}
                </h5>
                <p className="mt-0.5 text-xs text-slate-300 leading-relaxed">
                  {toast.message}
                </p>

                {toast.actionLabel && toast.onAction && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.onAction?.();
                      onDismiss(toast.id);
                    }}
                    className="mt-2 text-xs font-semibold text-teal-300 hover:text-teal-200 underline underline-offset-2 flex items-center gap-1"
                  >
                    {toast.actionLabel} &rarr;
                  </button>
                )}
              </div>

              {/* Dismiss button */}
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 text-slate-500 hover:text-slate-300 p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
