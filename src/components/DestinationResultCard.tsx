import React from 'react';
import { LocationResolutionResult } from '../services/geocodingService';
import { SeasonKey } from '../data/noaaClimateData';
import { 
  CloudRain, 
  Sun, 
  Compass, 
  Luggage, 
  Lightbulb, 
  AlertCircle, 
  ArrowRightLeft, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Info,
  FileDown
} from 'lucide-react';

interface DestinationResultCardProps {
  result: LocationResolutionResult;
  season: SeasonKey;
  onToggleSeason: () => void;
  onOpenExportPdf: () => void;
}

export function DestinationResultCard({ result, season, onToggleSeason, onOpenExportPdf }: DestinationResultCardProps) {
  const isWet = result.category.includes('Wet');
  const isWarm = result.category.includes('Warm');
  const isDry = result.category.includes('Dry');
  const isCool = result.category.includes('Cool');

  const otherSeasonLabel = season === 'DJF' 
    ? 'Ver pronóstico en Junio – Agosto (Invierno austral)' 
    : 'Ver pronóstico en Diciembre – Febrero (Verano austral)';

  return (
    <div className="w-full bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200/90 transition-all duration-300">
      {/* Top Header: Matched Name & Detected Zone */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs"
              style={{ 
                backgroundColor: result.bgLightHex, 
                color: result.colorHex,
                border: `1px solid ${result.colorHex}40`
              }}
            >
              <span>{result.icon}</span>
              <span>{result.categoryLabel}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              <Calendar className="w-3 h-3 text-slate-500" />
              {season === 'DJF' ? 'Diciembre – Febrero' : 'Junio – Agosto'}
            </span>

            {result.source === 'curated' ? (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Destino Turístico Indexado
              </span>
            ) : (
              <span className="text-[11px] font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Compass className="w-3 h-3" />
                Geolocalización OpenStreetMap
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {result.matchedName}
          </h2>

          {/* Prominent Detected Zone */}
          <div className="mt-2.5 flex items-center gap-2 text-slate-700">
            <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200/80 px-3 py-1.5 rounded-xl text-sky-900 font-bold text-sm md:text-base">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Zona detectada:</span>
              <span className="text-sky-700 underline decoration-sky-300 underline-offset-2">
                {result.detectedZone}
              </span>
            </div>
            {result.country && (
              <span className="text-xs md:text-sm font-medium text-slate-500 hidden sm:inline">
                ({result.country})
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Season Flip + Export PDF */}
        <div className="shrink-0 flex items-center gap-2 flex-wrap">
          <button
            onClick={onToggleSeason}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs md:text-sm font-semibold text-slate-700 transition-colors cursor-pointer shadow-xs"
            title="Cambiar temporada para esta misma localidad"
          >
            <ArrowRightLeft className="w-4 h-4 text-sky-600" />
            <span>{otherSeasonLabel}</span>
          </button>

          <button
            onClick={onOpenExportPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-900 hover:bg-sky-950 text-white text-xs md:text-sm font-bold transition-all cursor-pointer shadow-sm"
            title="Exportar ficha técnica en PDF con pronóstico y recomendaciones"
          >
            <FileDown className="w-4 h-4 text-sky-300" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Main Impact Banner */}
      <div 
        className="mt-6 rounded-2xl p-5 md:p-6 border-l-8 transition-all"
        style={{ 
          backgroundColor: result.bgLightHex, 
          borderColor: result.colorHex,
          borderWidth: '1px 1px 1px 8px'
        }}
      >
        <div className="flex items-start gap-3.5">
          <div className="text-3xl shrink-0 mt-0.5">{result.icon}</div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
              {result.prognosisSummary}
            </h3>
            <p className="mt-2 text-sm md:text-base text-slate-700 leading-relaxed">
              {result.detailedImpact}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Travel Tips & Packing */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Tourist Tips */}
        <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base mb-2.5">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h4>Recomendaciones para tus Vacaciones</h4>
            </div>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              {result.touristAdvice}
            </p>
          </div>
          <div className="mt-3.5 pt-3 border-t border-amber-200/60 text-[11px] text-amber-800 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Monitorea alertas meteorológicas locales con 48 hs de antelación.</span>
          </div>
        </div>

        {/* Packing Tips */}
        <div className="bg-indigo-50/70 rounded-2xl p-5 border border-indigo-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-base mb-2.5">
              <Luggage className="w-5 h-5 text-indigo-600" />
              <h4>Qué llevar en la valija</h4>
            </div>
            <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed">
              {result.packingAdvice}
            </p>
          </div>
          <div className="mt-3.5 pt-3 border-t border-indigo-200/60 text-[11px] text-indigo-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Optimizá tu equipaje para la amplitud térmica y precipitaciones.</span>
          </div>
        </div>
      </div>

      {/* Coastal Argentina Spotlight if applicable */}
      {result.detectedZone.toLowerCase().includes('costa argentina') && season === 'DJF' && (
        <div className="mt-6 bg-emerald-50/80 rounded-2xl p-4 md:p-5 border border-emerald-200 text-xs sm:text-sm text-emerald-950">
          <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1.5">
            <CloudRain className="w-4 h-4 text-emerald-600" />
            <span>Especial Costa Argentina en Temporada de Verano (El Niño activo)</span>
          </div>
          <p className="leading-relaxed">
            En destinos como <strong>Mar del Plata, Pinamar, Villa Gesell, Miramar y Necochea</strong>, los veranos con Niño suelen presentar un régimen de tormentas convectivas y frentes fríos húmedos más activos. Si bien hay excelentes jornadas soleadas de playa, conviene planificar actividades alternativas para días lluviosos (circuito gastronómico en el puerto, cines, paseos comerciales como calle Güemes, teatros o visitas a estancias).
          </p>
        </div>
      )}

      {/* If Neutral / Outside NOAA Zone */}
      {result.isNeutral && (
        <div className="mt-5 bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block mb-1">
              ¿Por qué esta zona no figura coloreada en el mapa de NOAA?
            </span>
            <p className="leading-relaxed text-slate-600 text-xs">
              El mapa global de la NOAA solo resalta las regiones del planeta donde estadísticamente el fenómeno de El Niño genera una señal dominante y reproducible de exceso o déficit de lluvia o temperatura. Los destinos sin anomalía directa se rigen por su climatología estacional promedio.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
