import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  X, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'banner' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '',
  variant = 'navbar'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // If already installed or running as standalone PWA, hide install trigger
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {variant === 'navbar' && (
        <button
          type="button"
          onClick={handleClick}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs border ${
            isInstallable
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-emerald-500 animate-pulse'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
          } ${className}`}
          title="Instalar aplicación en tu celular o computadora"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Descargar App</span>
          <span className="sm:hidden">App</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 text-white p-3.5 sm:p-4 rounded-2xl shadow-md border border-sky-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Smartphone className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                  Instalable
                </span>
                <span className="text-xs font-semibold text-sky-200">Acceso rápido sin conexión</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">
                Instalá la app de Monitor Climático en tu dispositivo móvil
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-md cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Aplicación</span>
          </button>
        </div>
      )}

      {/* Installation Guide Modal (iOS / Manual install) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-800 to-indigo-900 text-white p-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
                  <Smartphone className="w-5 h-5 text-sky-300" />
                </div>
                <div>
                  <h3 className="text-lg font-black leading-snug">
                    Instalar en tu Dispositivo
                  </h3>
                  <p className="text-xs text-sky-200">
                    Monitor Climático de Destinos • IIARRD
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Aplicación ligera PWA: no ocupa espacio de tienda y funciona sin conexión.</span>
              </div>

              {isIOS ? (
                <div className="space-y-3">
                  <p className="font-bold text-slate-900 text-sm">
                    Pasos para iPhone o iPad (Safari):
                  </p>
                  <ol className="space-y-2.5 text-slate-700 text-xs">
                    <li className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                        1
                      </span>
                      <div>
                        Tocá el botón <strong>Compartir</strong> <Share className="w-3.5 h-3.5 inline text-sky-600 mx-0.5" /> en la barra inferior de Safari.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                        2
                      </span>
                      <div>
                        Deslizá hacia abajo y seleccioná <strong>"Agregar a inicio"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-sky-600 mx-0.5" />.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                        3
                      </span>
                      <div>
                        Presioná <strong>"Agregar"</strong> en la esquina superior derecha. ¡Listo! Ya tenés el ícono en tu pantalla.
                      </div>
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-bold text-slate-900 text-sm">
                    Pasos para Android o Computadora:
                  </p>
                  <ol className="space-y-2.5 text-slate-700 text-xs">
                    <li className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                        1
                      </span>
                      <div>
                        En Chrome o tu navegador, tocá el menú de <strong>tres puntos (⋮)</strong> en la esquina superior.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                        2
                      </span>
                      <div>
                        Elegí <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                        3
                      </span>
                      <div>
                        Confirmá la instalación para disfrutar de pantalla completa y alertas en tiempo real.
                      </div>
                    </li>
                  </ol>

                  {isInstallable && (
                    <button
                      type="button"
                      onClick={async () => {
                        await install();
                        setShowGuideModal(false);
                      }}
                      className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Lanzar Instalador Directo Ahora</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-xs text-slate-800 transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
