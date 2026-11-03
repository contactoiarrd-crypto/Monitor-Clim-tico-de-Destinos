import React from 'react';
import { LocationResolutionResult } from '../services/geocodingService';
import { TacticalWeatherState } from '../services/weatherTacticalService';
import { SeasonKey } from '../data/noaaClimateData';
import { 
  Waves, 
  MapPin, 
  Calendar, 
  Lightbulb, 
  Luggage, 
  Flame, 
  Droplets, 
  Wind, 
  ShieldCheck, 
  PhoneCall, 
  AlertTriangle,
  Globe
} from 'lucide-react';

interface PrintableFichaProps {
  id?: string;
  result: LocationResolutionResult;
  weather: TacticalWeatherState | null;
  season: SeasonKey;
}

export const PrintableFicha = React.forwardRef<HTMLDivElement, PrintableFichaProps>(
  ({ id = 'printable-ficha-doc', result, weather, season }, ref) => {
    const todayStr = new Date().toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const seasonLabel = season === 'DJF' 
      ? 'Diciembre – Febrero (Verano austral / Invierno boreal)' 
      : 'Junio – Agosto (Invierno austral / Verano boreal)';

    return (
      <div
        id={id}
        ref={ref}
        className="bg-white text-slate-800 p-8 sm:p-10 rounded-2xl max-w-[800px] mx-auto shadow-none border border-slate-200 font-sans"
        style={{ width: '100%', boxSizing: 'border-box' }}
      >
        {/* Header Institucional con alertatemprana.online */}
        <div className="flex items-start justify-between pb-5 border-b-2 border-sky-900 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-900 flex items-center justify-center text-white shrink-0">
              <Waves className="w-7 h-7 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" />
                <span>alertatemprana.online</span>
              </div>
              <h1 className="text-xl font-extrabold text-sky-950 uppercase tracking-tight">
                Ficha Técnica de Destino y Alerta Temprana
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                Monitor Climático de Destinos • IIARRD & NOAA Climate.gov
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Fecha de Emisión:</div>
            <div className="font-bold text-slate-800">{todayStr}</div>
          </div>
        </div>

        {/* Destino y Zona Detectada */}
        <div className="mt-5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
              Destino Analizado
            </span>
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {seasonLabel}
            </span>
          </div>

          <h2 className="text-3xl font-black text-slate-900 leading-tight">
            {result.matchedName}
          </h2>

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-sky-900 text-white px-3 py-1 rounded-xl text-sm font-bold">
              <MapPin className="w-4 h-4 text-sky-300" />
              <span>Zona detectada: {result.detectedZone}</span>
            </div>
            {result.country && (
              <span className="text-xs font-semibold text-slate-600 bg-slate-200/70 px-2.5 py-1 rounded-lg">
                {result.country}
              </span>
            )}
            <span className="text-[11px] text-slate-400">
              Coords: [{result.coords[0].toFixed(3)}, {result.coords[1].toFixed(3)}]
            </span>
          </div>
        </div>

        {/* 1. SECCIÓN PRINCIPAL: ALERTAS VIVAS Y CONDICIONES TÁCTICAS (PRIMERO) */}
        {weather && (
          <div className="mt-5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-sky-700" />
              <span>1. Alertas Vivas y Condiciones Tácticas (Open-Meteo & IIARRD)</span>
            </h3>

            {/* Alertas Activas en Destacado */}
            {(weather.alerts.severoOficial || weather.alerts.eventoCrisis48h || weather.alerts.olaCalor || weather.alerts.olaPolar) ? (
              <div className="bg-red-50 border-l-4 border-red-600 p-3.5 rounded-xl text-xs text-red-950 mb-3 font-medium">
                <div className="flex items-center gap-1 font-bold text-red-900 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>ALERTAS VIVAS EN EL DESTINO:</span>
                </div>
                {weather.alerts.severoOficial && <div>• Aviso Oficial: Tiempo severo o vientos superiores a 50 km/h.</div>}
                {weather.alerts.eventoCrisis48h && <div>• {weather.alerts.eventoCrisis48h}</div>}
                {weather.alerts.olaCalor && <div>• Ola de Calor: Temperatura extrema &gt;= 35°C.</div>}
                {weather.alerts.olaPolar && <div>• Ola Polar: Temperatura crítica &lt;= 5°C.</div>}
              </div>
            ) : (
              <div className="bg-emerald-50 border-l-4 border-emerald-600 p-2.5 rounded-xl text-xs text-emerald-950 mb-3 font-semibold">
                ✓ No se registran alertas hidrometeorológicas críticas ni sismos severos recientes en la zona.
              </div>
            )}

            {/* Grid Clima Actual & Índice 30-30-30 */}
            <div className="grid grid-cols-3 gap-3 text-center mb-3">
              <div className="bg-slate-900 text-white p-3 rounded-xl">
                <div className="text-[10px] text-sky-300 font-bold uppercase">Tiempo Actual</div>
                <div className="text-2xl font-black">{weather.current.temp}°C</div>
                <div className="text-[10px] text-slate-300">{weather.current.conditionText}</div>
              </div>

              <div className="bg-slate-50 border p-3 rounded-xl flex flex-col justify-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Humedad y Viento</div>
                <div className="text-xs font-bold text-slate-800 mt-1">
                  💧 {weather.current.humidity}% | 💨 {weather.current.windSpeed} km/h
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{weather.tacticoHoy}</div>
              </div>

              <div className="bg-slate-50 border p-3 rounded-xl flex flex-col justify-center">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Riesgo Incendio 30-30-30</div>
                <div 
                  className="text-base font-black mt-0.5"
                  style={{ color: weather.incendio3030.color }}
                >
                  {weather.incendio3030.puntos}% ({weather.incendio3030.label})
                </div>
              </div>
            </div>

            {/* Planificación 7 Días */}
            <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl text-[11px] text-sky-950 leading-relaxed">
              <strong className="block text-sky-900 font-bold mb-0.5">Planificación Táctica a 7 Días:</strong>
              {weather.narrativa7Dias}
            </div>
          </div>
        )}

        {/* 2. SECCIÓN: PROYECCIÓN EL NIÑO (NOAA CLIMATE.GOV) */}
        <div className="mt-5 border-t pt-4 border-slate-200">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
            <span>2. Proyección Climática de El Niño ({seasonLabel}) — NOAA</span>
          </h3>

          <div 
            className="p-4 rounded-2xl border-l-8"
            style={{ 
              backgroundColor: result.bgLightHex, 
              borderColor: result.colorHex,
              borderWidth: '1px 1px 1px 8px'
            }}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-1">
              <span>{result.icon}</span>
              <span>Patrón Esperado: {result.categoryLabel}</span>
            </div>
            <div className="font-semibold text-xs text-slate-800 mb-1.5">
              {result.prognosisSummary}
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              {result.detailedImpact}
            </p>
          </div>

          {/* Recomendaciones y Valija */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Recomendaciones Turísticas</span>
              </div>
              <p className="text-amber-950 leading-relaxed text-[10px]">
                {result.touristAdvice}
              </p>
            </div>

            <div className="bg-indigo-50/80 p-3 rounded-xl border border-indigo-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
                <Luggage className="w-3.5 h-3.5 text-indigo-600" />
                <span>Qué Llevar en la Valija</span>
              </div>
              <p className="text-indigo-950 leading-relaxed text-[10px]">
                {result.packingAdvice}
              </p>
            </div>
          </div>
        </div>

        {/* Emergencias y Kit IIARRD */}
        <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-100 p-3 rounded-xl">
            <div className="flex items-center gap-1 font-bold text-slate-900 mb-1">
              <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
              <span>Central de Emergencias Locales</span>
            </div>
            <div className="text-lg font-black text-sky-900">
              {weather?.emergencia.telefono || '911 / 103'}
            </div>
            <div className="text-[10px] text-slate-500">
              {weather?.emergencia.entidad || 'Defensa Civil / Bomberos / Policía'}
            </div>
          </div>

          <div className="bg-slate-100 p-3 rounded-xl">
            <div className="flex items-center gap-1 font-bold text-slate-900 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Kit de Emergencia IIARRD</span>
            </div>
            <div className="text-[10px] text-slate-600 grid grid-cols-2 gap-1">
              <span>💧 Agua (2L/p)</span>
              <span>🔦 Linterna</span>
              <span>🩹 Botiquín</span>
              <span>🔋 Powerbank</span>
            </div>
          </div>
        </div>

        {/* Footer con alertatemprana.online */}
        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
          <span>Emitido desde <strong>alertatemprana.online</strong> • Gestión Integral del Riesgo Climático</span>
          <span>Fuentes: NOAA Climate.gov, Open-Meteo, USGS, IIARRD.</span>
        </div>
      </div>
    );
  }
);

PrintableFicha.displayName = 'PrintableFicha';
