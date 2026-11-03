import React from 'react';
import { CURATED_DESTINATIONS, DestinationInfo } from '../data/destinationsDatabase';
import { MapPin, Sparkles } from 'lucide-react';

interface DestinationsGridProps {
  onSelectDestination: (destName: string) => void;
  activeDestinationName?: string;
}

export function DestinationsGrid({ onSelectDestination, activeDestinationName }: DestinationsGridProps) {
  const popularDestinations = CURATED_DESTINATIONS.filter(d => d.popular).slice(0, 24);

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Destinos Turísticos Frecuentes
          </h3>
        </div>
        <span className="text-xs text-slate-400">Clic para consultar al instante</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {popularDestinations.map(dest => {
          const isSelected = activeDestinationName?.toLowerCase() === dest.name.toLowerCase() ||
                            activeDestinationName?.toLowerCase().includes(dest.name.toLowerCase().split(' ')[0]);

          const isArgentineCoast = dest.detectedZone.toLowerCase().includes('costa argentina');

          return (
            <button
              key={dest.id}
              onClick={() => onSelectDestination(dest.name)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : isArgentineCoast
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <MapPin className={`w-3 h-3 ${isSelected ? 'text-white' : isArgentineCoast ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{dest.name.split('/')[0].trim()}</span>
              {isArgentineCoast && !isSelected && (
                <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-1.5 py-0.2 rounded font-bold">
                  Costa Arg.
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
