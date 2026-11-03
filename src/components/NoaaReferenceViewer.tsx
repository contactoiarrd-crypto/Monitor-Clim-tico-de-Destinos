import React, { useState } from 'react';
import { Image as ImageIcon, X, ZoomIn, ExternalLink, HelpCircle } from 'lucide-react';

interface NoaaReferenceViewerProps {
  onSelectSeason?: (season: 'DJF' | 'JJA') => void;
}

export function NoaaReferenceViewer({ onSelectSeason }: NoaaReferenceViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const imageSrc = '/assets/aistudio/Nino_winterandsummer_620_8a67a432.jpg';

  return (
    <>
      {/* Banner / Card Trigger */}
      <div className="bg-gradient-to-r from-sky-900 to-indigo-950 text-white rounded-2xl p-4 md:p-5 shadow-md border border-sky-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <ImageIcon className="w-6 h-6 text-sky-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-700/50">
                Evidencia Científica
              </span>
              <span className="text-xs text-sky-200">NOAA Climate.gov</span>
            </div>
            <h4 className="text-base font-bold text-white mt-0.5">
              Mapa Original de Afectación Global de El Niño
            </h4>
            <p className="text-xs text-slate-300 line-clamp-1 sm:line-clamp-none">
              Compará las proyecciones de Diciembre–Febrero y Junio–Agosto publicadas por la NOAA.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="shrink-0 bg-white hover:bg-sky-50 text-sky-950 font-bold text-xs md:text-sm px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer flex items-center gap-2"
        >
          <ZoomIn className="w-4 h-4 text-sky-600" />
          <span>Ver Mapa Oficial NOAA</span>
        </button>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    El Niño Climate Impacts — NOAA Climate.gov
                  </h3>
                  <p className="text-xs text-slate-300">
                    Proyección estacional: December–February & June–August
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content: Image */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50 flex flex-col items-center">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2 w-full flex justify-center">
                <img
                  src={imageSrc}
                  alt="Mapa de impactos climáticos de El Niño según NOAA (December-February y June-August)"
                  className="max-h-[60vh] w-auto object-contain rounded-xl"
                  loading="lazy"
                />
              </div>

              {/* Explanatory legend below */}
              <div className="mt-4 w-full bg-white rounded-xl p-4 border border-slate-200/80 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-2">
                  <HelpCircle className="w-4 h-4 text-sky-600" />
                  <span>Cómo interpretar el mapa para turismo:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 leading-relaxed">
                  <div>
                    <span className="font-semibold text-emerald-700">🟢 Wet (Húmedo):</span> Precipitaciones abundantes por encima del promedio histórico (ej. Costa Argentina, Litoral y Sur de Brasil en verano austral).
                  </div>
                  <div>
                    <span className="font-semibold text-orange-600">🟠 Warm (Cálido):</span> Temperaturas superiores a la media con persistencia de calor anómalo (ej. Salvador de Bahía y Río de Janeiro).
                  </div>
                  <div>
                    <span className="font-semibold text-yellow-700">🟡 Dry (Seco):</span> Lluvias por debajo de lo habitual, ideal para turismo de playa pero con riesgo de sequía hídrica.
                  </div>
                  <div>
                    <span className="font-semibold text-amber-800">🟤 Warm and dry (Cálido y Seco):</span> Calor pronunciado y baja humedad (ej. Bali, Tailandia en verano austral; Caribe en invierno austral).
                  </div>
                  <div>
                    <span className="font-semibold text-teal-700">🟦 Cool and Wet (Frío y Húmedo):</span> Mayor nubosidad, precipitaciones frecuentes y frío relativo (ej. Florida y Costa del Golfo de EE.UU.).
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <span>Fuente: National Oceanic and Atmospheric Administration (NOAA Climate.gov)</span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold transition-colors cursor-pointer"
              >
                Cerrar vista
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
