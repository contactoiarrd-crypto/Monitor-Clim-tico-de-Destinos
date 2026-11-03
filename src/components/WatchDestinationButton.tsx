import React from 'react';
import { Bell, BellRing, Check } from 'lucide-react';
import { WatchedDestination } from '../services/notificationService';

interface WatchDestinationButtonProps {
  destinationName: string;
  zone: string;
  country: string;
  coords: [number, number];
  isWatched: boolean;
  onToggleWatch: () => void;
  className?: string;
}

export function WatchDestinationButton({
  destinationName,
  isWatched,
  onToggleWatch,
  className = ''
}: WatchDestinationButtonProps) {
  return (
    <button
      onClick={onToggleWatch}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
        isWatched
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 shadow-emerald-500/20'
          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
      } ${className}`}
      title={
        isWatched
          ? `Destino ${destinationName} monitoreado activamente. Clic para desuscribir.`
          : `Activar notificaciones en el navegador para ${destinationName}`
      }
    >
      {isWatched ? (
        <>
          <BellRing className="w-3.5 h-3.5 text-white animate-bounce" />
          <span>Monitoreado</span>
          <Check className="w-3 h-3 text-emerald-200" />
        </>
      ) : (
        <>
          <Bell className="w-3.5 h-3.5 text-sky-600" />
          <span>Monitorear Destino</span>
        </>
      )}
    </button>
  );
}
