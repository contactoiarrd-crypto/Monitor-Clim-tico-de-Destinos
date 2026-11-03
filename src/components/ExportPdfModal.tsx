import React, { useState, useRef } from 'react';
import { 
  FileDown, 
  Printer, 
  X, 
  CheckCircle2, 
  Loader2, 
  Eye, 
  Sparkles 
} from 'lucide-react';
import { LocationResolutionResult } from '../services/geocodingService';
import { TacticalWeatherState } from '../services/weatherTacticalService';
import { SeasonKey } from '../data/noaaClimateData';
import { PrintableFicha } from './PrintableFicha';
import { exportFichaToPdf } from '../utils/pdfExport';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: LocationResolutionResult;
  weather: TacticalWeatherState | null;
  season: SeasonKey;
}

export function ExportPdfModal({ isOpen, onClose, result, weather, season }: ExportPdfModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const fichaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      await exportFichaToPdf('printable-ficha-modal', result, weather, season);
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('Hubo un error al generar el PDF. Puedes utilizar la opción de Imprimir / Guardar como PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Exportar Ficha Técnica de {result.matchedName}
              </h3>
              <p className="text-xs text-slate-300">
                Zona: {result.detectedZone} • Formato oficial PDF
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="px-6 py-3.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Eye className="w-4 h-4 text-sky-600" />
            <span>Vista previa del documento A4</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Imprimir / Guardar como PDF</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generando PDF...</span>
                </>
              ) : exportSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>¡PDF Descargado!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Descargar Ficha en PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-200/70 flex justify-center">
          <div className="w-full max-w-[800px] bg-white rounded-2xl shadow-lg">
            <PrintableFicha
              id="printable-ficha-modal"
              ref={fichaRef}
              result={result}
              weather={weather}
              season={season}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
          El PDF descargado incluye el cruce con el mapa de la NOAA, detección de micro-zona turística, valija, pronóstico en tiempo real y teléfonos de emergencia.
        </div>
      </div>
    </div>
  );
}
