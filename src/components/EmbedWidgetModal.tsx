import React, { useState } from 'react';
import { 
  Code, 
  Copy, 
  Check, 
  X, 
  Globe, 
  ExternalLink, 
  Layers, 
  Smartphone, 
  Monitor, 
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface EmbedWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: string;
}

export function EmbedWidgetModal({ isOpen, onClose, currentCity }: EmbedWidgetModalProps) {
  const [copied, setCopied] = useState(false);
  const [embedView, setEmbedView] = useState<'all' | 'tactical' | 'nino'>('all');
  const [defaultCity, setDefaultCity] = useState(currentCity || 'Mar del Plata');
  const [heightPx, setHeightPx] = useState(850);
  const [hideHeader, setHideHeader] = useState(true);

  if (!isOpen) return null;

  const currentOrigin = window.location.origin;
  const embedUrl = `${currentOrigin}/?embed=true&ciudad=${encodeURIComponent(defaultCity)}&vista=${embedView}${hideHeader ? '&sinCabecera=true' : ''}`;

  const iframeSnippet = `<!-- Widget Monitor Alerta Temprana & El Niño (alertatemprana.online) -->
<div style="width: 100%; max-width: 1100px; margin: 0 auto; overflow: hidden; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
  <iframe 
    src="${embedUrl}" 
    width="100%" 
    height="${heightPx}" 
    frameborder="0" 
    loading="lazy"
    allow="geolocation"
    title="Monitor Climático de Destinos y Alertas - alertatemprana.online"
    style="border: none; display: block;"
  ></iframe>
</div>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Integrar en alertatemprana.online (Código Embed / iFrame)
              </h3>
              <p className="text-xs text-slate-300">
                Incrustá el monitor de alertas y El Niño en cualquier página de tu sitio web
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          {/* Target Domain Badge */}
          <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-2xl flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-700 shrink-0" />
              <span className="font-semibold text-sky-950">
                Optimizado para tu web: <strong className="text-sky-800">alertatemprana.online</strong>
              </span>
            </div>
            <a 
              href="https://alertatemprana.online" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-sky-700 hover:text-sky-900 underline"
            >
              <span>Visitar sitio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Vista Inicial a Mostrar
              </label>
              <select
                value={embedView}
                onChange={(e) => setEmbedView(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Visión Integral (Alertas arriba + El Niño abajo)</option>
                <option value="tactical">Solo Alertas en Vivo & Monitor Táctico</option>
                <option value="nino">Solo El Niño (NOAA) & Destinos Turísticos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Ciudad Inicial por Defecto
              </label>
              <input
                type="text"
                value={defaultCity}
                onChange={(e) => setDefaultCity(e.target.value)}
                placeholder="ej. Mar del Plata"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={hideHeader}
                onChange={(e) => setHideHeader(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
              />
              <span>Modo widget compacto (oculta la barra superior del navegador para integrarse limpia en tu diseño)</span>
            </label>
          </div>

          {/* Code Snippet Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-sky-600" />
                Código HTML para pegar en alertatemprana.online
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3 py-1 rounded-lg border border-sky-200 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>

            <pre className="bg-slate-900 text-sky-300 p-4 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
              <code>{iframeSnippet}</code>
            </pre>
          </div>

          {/* Guía Rápida de Instalación */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Instrucciones para insertar en tu web:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>En WordPress:</strong> Añadí un bloque de <em>"HTML Personalizado"</em> en la página o entrada deseada y pegá el código.</li>
              <li><strong>En Webflow / Wix / Squarespace:</strong> Creá un elemento de tipo <em>Embed / Código</em> y pegá el snippet.</li>
              <li><strong>En HTML directo:</strong> Pegalo en la sección `&lt;main&gt;` o `&lt;section&gt;` donde desees que aparezca el monitor.</li>
              <li>El iframe ya cuenta con permisos de geolocalización (`allow="geolocation"`) para que tus usuarios puedan usar el botón "Detectar mi ubicación".</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">Diseñado para adaptarse a computadoras y celulares.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
