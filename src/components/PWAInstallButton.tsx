import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { DownloadApkModal } from './DownloadApkModal';
import { 
  Download, 
  Smartphone, 
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  X,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'banner' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '',
  variant = 'navbar'
}) => {
  const { isInstallable, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [showDownloadAlert, setShowDownloadAlert] = useState(false);

  const apkDownloadUrl = './downloads/MonitorClimatico-IIARRD.apk';
  const apkFileName = 'MonitorClimatico-IIARRD.apk';

  // Handle click on download link
  const handleDownloadClick = () => {
    setShowDownloadAlert(true);
    // Programmatic trigger as extra safety
    try {
      const a = document.createElement('a');
      a.href = apkDownloadUrl;
      a.download = apkFileName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // Fallback handled by the native <a> link
    }
  };

  return (
    <>
      {/* 1. Navbar: Direct APK Download Link */}
      {variant === 'navbar' && (
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={apkDownloadUrl}
            download={apkFileName}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownloadClick}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs border bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-emerald-500 hover:shadow-md active:scale-95 ${className}`}
            title="Descargar archivo APK directamente para instalar en tu celular"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Descargar APK</span>
            <span className="sm:hidden font-extrabold">APK</span>
          </a>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Instrucciones de instalación y opciones para iPhone / Android"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Banner: Prominent Card with Direct APK Download */}
      {variant === 'banner' && (
        <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-sky-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
              <Smartphone className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-2xs">
                  APK Android Oficial
                </span>
                <span className="text-xs font-semibold text-sky-200">Versión 1.0.0</span>
              </div>
              <h4 className="text-base font-extrabold text-white mt-1">
                Descargá la App de Monitor Climático (.apk)
              </h4>
              <p className="text-xs text-sky-100/90 hidden sm:block">
                Instalá la app directamente en tu celular para recibir alertas vivas y funcionar sin conexión.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <a
              href={apkDownloadUrl}
              download={apkFileName}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDownloadClick}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs md:text-sm transition-all shadow-md cursor-pointer"
              title="Descargar archivo MonitorClimatico-IIARRD.apk"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Descargar APK Directo</span>
            </a>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-3 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer text-center"
              title="Ver instrucciones detalladas de instalación"
            >
              ¿Cómo instalar?
            </button>
          </div>
        </div>
      )}

      {/* Floating Download Feedback Modal / Toast */}
      {showDownloadAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    ¡Descargando archivo APK!
                  </h3>
                  <p className="text-xs text-emerald-100">
                    MonitorClimatico-IIARRD.apk (6.9 MB)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDownloadAlert(false)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps to Install */}
            <div className="p-5 space-y-4 text-xs sm:text-sm">
              <p className="text-slate-600 font-medium">
                La descarga ha iniciado en tu navegador. Para instalar la aplicación en tu celular Android:
              </p>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <div>
                    Abrí la notificación de descarga de tu celular (o la carpeta <strong>Descargas</strong>).
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <div>
                    Tocá el archivo <strong>MonitorClimatico-IIARRD.apk</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <div>
                    Si el teléfono muestra un aviso de seguridad, tocá <strong>Ajustes</strong> y activá <strong>Permitir desde esta fuente</strong>, luego presioná <strong>Instalar</strong>.
                  </div>
                </div>
              </div>

              {/* Troubleshooting download link */}
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-sky-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>¿No comenzó la descarga en tu dispositivo?</span>
                </div>
                <p className="text-sky-800">
                  Hacé{' '}
                  <a
                    href={apkDownloadUrl}
                    download={apkFileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline text-emerald-700 hover:text-emerald-800"
                  >
                    clic aquí para forzar la descarga directa del APK
                  </a>
                  {' '}o{' '}
                  <button
                    type="button"
                    onClick={() => {
                      window.open(apkDownloadUrl, '_blank');
                    }}
                    className="font-bold underline text-sky-700 hover:text-sky-900 cursor-pointer"
                  >
                    abrir en una pestaña nueva
                  </button>.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowDownloadAlert(false);
                  setShowModal(true);
                }}
                className="text-xs font-bold text-sky-700 hover:underline cursor-pointer"
              >
                Ver más opciones y ayuda
              </button>

              <button
                type="button"
                onClick={() => setShowDownloadAlert(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white transition-colors cursor-pointer shadow-xs"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Multi-device Assistance Modal */}
      <DownloadApkModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isInstallable={isInstallable}
        onTriggerInstall={install}
        isIOS={isIOS}
      />
    </>
  );
};
