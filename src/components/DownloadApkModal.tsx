import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Share, 
  PlusSquare, 
  FileCode, 
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  onTriggerInstall: () => Promise<boolean>;
  isIOS: boolean;
}

export function DownloadApkModal({
  isOpen,
  onClose,
  isInstallable,
  onTriggerInstall,
  isIOS
}: DownloadApkModalProps) {
  const [activeTab, setActiveTab] = useState<'apk' | 'webapk' | 'ios'>(isIOS ? 'ios' : 'apk');
  const [isInstalling, setIsInstalling] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://alertatemprana.online';
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?url=${encodeURIComponent('https://alertatemprana.online')}`;

  const handleInstallClick = async () => {
    setIsInstalling(true);
    const success = await onTriggerInstall();
    setIsInstalling(false);
    if (success) {
      setInstalledSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 text-white p-5 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-md">
              <Smartphone className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                  Android & Móviles
                </span>
                <span className="text-xs text-sky-200 font-semibold">IIARRD</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Instalación y Descarga de App Móvil
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-3 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('apk')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'apk'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Descargar Archivo APK</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('webapk')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'webapk'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4 text-sky-600" />
            <span>Instalar en 1 Clic</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ios'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>iPhone / iPad</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-sm flex-1">
          
          {/* TAB 1: DESCARGAR ARCHIVO APK */}
          {activeTab === 'apk' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-sky-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-sky-900">
                  <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
                  <span>¿Cómo obtener e instalar el archivo APK en Android?</span>
                </div>
                <p className="text-xs text-sky-800 leading-relaxed">
                  Para obtener el archivo <strong>.apk</strong> o <strong>.aab</strong> firmado listo para sideloading o Google Play, podés generarlo directamente con <strong>PWABuilder</strong> (la plataforma oficial de Microsoft y Google que empaqueta PWAs en Android APK).
                </p>
              </div>

              {/* Direct APK Download Button */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-400 rounded-2xl space-y-3 shadow-xs">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Descarga Directa de Archivo APK
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Descargá el archivo instalador <code>MonitorClimatico-IIARRD.apk</code> directamente a tu teléfono o computadora.
                  </p>
                </div>

                <a
                  href="./downloads/MonitorClimatico-IIARRD.apk"
                  download="MonitorClimatico-IIARRD.apk"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Archivo APK Directo (.apk)</span>
                </a>

                <div className="pt-1 text-center">
                  <a
                    href={pwaBuilderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-sky-700 hover:text-sky-900 font-semibold underline inline-flex items-center gap-1"
                  >
                    <span>También podés generar un nuevo APK firmado en PWABuilder</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Sideloading Instructions */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Pasos para instalar cualquier archivo .apk en tu celular:
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </span>
                    <div>
                      <strong>Descargar el archivo .apk</strong> en tu teléfono Android (o transferirlo desde tu PC).
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </span>
                    <div>
                      Abrí la notificación de descarga o buscalo en la app <strong>Archivos / Descargas</strong> y tocalo.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </span>
                    <div>
                      Si Android muestra el aviso <em>"Tu teléfono no tiene permitido instalar apps desconocidas"</em>, tocá <strong>Ajustes</strong> y activá la opción <strong>Permitir desde esta fuente</strong>.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                      4
                    </span>
                    <div>
                      Tocá <strong>Instalar</strong>. La aplicación aparecerá en el menú de aplicaciones con su ícono y alertas vivas.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSTALAR DIRECTO (WEBAPK NATIVO) */}
          {activeTab === 'webapk' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Instalación Automática WebAPK (Sin descargas manuales)</span>
                </div>
                <p>
                  Android y Google Chrome tienen incorporado el sistema <strong>WebAPK</strong>: al presionar el botón de instalación, el propio sistema operativo crea e instala un archivo APK nativo en segundo plano.
                </p>
              </div>

              {isInstallable ? (
                <div className="text-center py-4 space-y-3">
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    disabled={isInstalling || installedSuccess}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-black text-sm shadow-lg transition-all cursor-pointer"
                  >
                    {isInstalling ? (
                      <span>Generando e instalando en tu móvil...</span>
                    ) : installedSuccess ? (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        ¡Instalación completada!
                      </span>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Instalar en este Dispositivo Ahora</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-500">
                    Se abrirá el cuadro de diálogo oficial de Android para agregar la app.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Instalación manual desde el menú de Chrome:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 pl-1">
                    <li>Tocá el menú de <strong>tres puntos (⋮)</strong> en la esquina superior de Chrome.</li>
                    <li>Seleccioná <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.</li>
                    <li>Confirmá tocando <strong>Instalar</strong>.</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: IPHONE / IPAD (IOS) */}
          {activeTab === 'ios' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-sky-950 space-y-1 text-xs">
                <div className="font-bold text-sm text-sky-900">
                  Instalación en iPhone / iPad (Safari)
                </div>
                <p>
                  En iOS no existen los archivos .apk (son exclusivos de Android). En su lugar, Apple permite instalar la PWA directamente desde Safari:
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <div>
                    Abrí este sitio en <strong>Safari</strong> y tocá el botón <strong>Compartir</strong> <Share className="w-3.5 h-3.5 inline text-sky-600 mx-0.5" /> (cuadrado con flecha hacia arriba en la barra inferior).
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <div>
                    Deslizá hacia abajo y seleccioná <strong>"Agregar a pantalla de inicio"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-sky-600 mx-0.5" />.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <div>
                    Tocá <strong>"Agregar"</strong> en la esquina superior derecha. ¡Listo! Tendrás la app en tu iPhone como si fuera de la App Store.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            Compatible con Android, iOS, Windows y macOS.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-xs text-slate-800 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
