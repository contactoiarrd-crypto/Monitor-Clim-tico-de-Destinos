import React, { useEffect } from 'react';
import { BellRing, X, ArrowRight, AlertTriangle, Flame, ShieldAlert, CloudRain } from 'lucide-react';
import { NotificationEvent } from '../services/notificationService';

interface NotificationToastBannerProps {
  event: NotificationEvent | null;
  onDismiss: () => void;
  onViewDestination: (destName: string) => void;
}

export function NotificationToastBanner({
  event,
  onDismiss,
  onViewDestination
}: NotificationToastBannerProps) {
  useEffect(() => {
    if (!event) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 9000);
    return () => clearTimeout(timer);
  }, [event]);

  if (!event) return null;

  const isSevere = event.type === 'severo' || event.type === 'crisis';
  const isFire = event.type === 'incendio';

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-[1400] max-w-md w-[calc(100%-32px)] animate-in slide-in-from-top-4 duration-300">
      <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
        isSevere
          ? 'bg-red-950/95 text-white border-red-700 shadow-red-900/30'
          : isFire
          ? 'bg-amber-950/95 text-white border-amber-700 shadow-amber-900/30'
          : 'bg-slate-900/95 text-white border-sky-600 shadow-sky-900/30'
      }`}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          isSevere ? 'bg-red-600' : isFire ? 'bg-orange-600' : 'bg-sky-600'
        }`}>
          {isSevere ? (
            <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
          ) : isFire ? (
            <Flame className="w-5 h-5 text-white" />
          ) : (
            <BellRing className="w-5 h-5 text-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
              Alerta Táctica en Vivo
            </span>
            <span className="text-[10px] text-slate-400">Ahora</span>
          </div>

          <h5 className="font-bold text-sm text-white leading-snug mt-0.5">
            {event.title}
          </h5>

          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            {event.message}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => {
                onViewDestination(event.destinationName);
                onDismiss();
              }}
              className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Ver {event.destinationName}</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={onDismiss}
              className="px-2.5 py-1 text-slate-400 hover:text-white text-xs rounded-lg transition-colors cursor-pointer"
            >
              Descartar
            </button>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
