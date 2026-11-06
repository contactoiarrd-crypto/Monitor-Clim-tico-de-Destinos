import React, { useState } from 'react';
import { 
  Bell, 
  BellRing, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Flame, 
  CloudRain, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Trash2, 
  RefreshCw, 
  Clock, 
  MapPin, 
  Sparkles,
  Check
} from 'lucide-react';
import { 
  WatchedDestination, 
  NotificationConfig, 
  NotificationEvent,
  getNotificationPermissionStatus,
  requestNotificationPermission,
  dispatchBrowserNotification,
  playAlertChime
} from '../services/notificationService';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchedDest: WatchedDestination | null;
  onUnwatch: () => void;
  config: NotificationConfig;
  onSaveConfig: (cfg: NotificationConfig) => void;
  history: NotificationEvent[];
  onClearHistory: () => void;
  onCheckNow: () => Promise<void>;
  isChecking: boolean;
  lastCheckedTime: string | null;
}

export function NotificationSettingsModal({
  isOpen,
  onClose,
  watchedDest,
  onUnwatch,
  config,
  onSaveConfig,
  history,
  onClearHistory,
  onCheckNow,
  isChecking,
  lastCheckedTime
}: NotificationSettingsModalProps) {
  const [permission, setPermission] = useState<NotificationPermission>(getNotificationPermissionStatus());
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setPermission(perm);
    if (perm === 'granted') {
      dispatchBrowserNotification(
        '🔔 Permisos Habilitados — alertatemprana.online',
        'El sistema te notificará cuando haya cambios tácticos o alertas en tu destino.',
        watchedDest?.name || 'Destino'
      );
    }
  };

  const handleTestNotification = () => {
    dispatchBrowserNotification(
      `🚨 Alerta de Prueba en ${watchedDest?.name || 'tu Destino Guardado'}`,
      'Esta es una notificación de prueba del servicio de monitoreo táctico (alertatemprana.online).',
      watchedDest?.name || 'Destino'
    );
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const toggleSound = () => {
    const updated = { ...config, soundEnabled: !config.soundEnabled };
    onSaveConfig(updated);
    if (updated.soundEnabled) {
      playAlertChime('info');
    }
  };

  const toggleOption = (key: keyof NotificationConfig) => {
    onSaveConfig({
      ...config,
      [key]: !config[key]
    });
  };

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Servicio de Notificaciones Tácticas
              </h3>
              <p className="text-xs text-slate-300">
                Alertas automáticas en el navegador para tu destino guardado
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          
          {/* Status Bar: Permisos de Navegador */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-3 ${
            permission === 'granted'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : permission === 'denied'
              ? 'bg-red-50 border-red-200 text-red-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 ${
                permission === 'granted' ? 'bg-emerald-600' : permission === 'denied' ? 'bg-red-600' : 'bg-amber-500'
              }`}>
                {permission === 'granted' ? <CheckCircle2 className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-bold text-xs uppercase tracking-wide">
                  Permisos del Navegador: {
                    permission === 'granted' ? 'Habilitados (Concedido)' : permission === 'denied' ? 'Bloqueados en navegador' : 'Pendientes de autorización'
                  }
                </div>
                <div className="text-xs opacity-90 mt-0.5">
                  {permission === 'granted' 
                    ? 'Recibirás notificaciones emergentes de escritorio al detectar cambios tácticos.'
                    : permission === 'denied'
                    ? 'Las notificaciones están bloqueadas en la configuración de tu navegador. También usamos alertas sonoras y visuales en la app.'
                    : 'Haz clic en el botón para permitir notificaciones emergentes en tu navegador.'}
                </div>
              </div>
            </div>

            {permission !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Habilitar Notificaciones
              </button>
            )}
          </div>

          {/* Destino Actualmente Monitoreado */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                Destino Monitoreado
              </span>
              {watchedDest && (
                <button
                  onClick={onUnwatch}
                  className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                >
                  Dejar de monitorear
                </button>
              )}
            </div>

            {watchedDest ? (
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <div>
                  <h4 className="text-xl font-black text-slate-900 leading-tight">
                    {watchedDest.name}
                  </h4>
                  <div className="text-xs text-sky-800 font-semibold mt-0.5">
                    📍 {watchedDest.zone} ({watchedDest.country})
                  </div>
                  {lastCheckedTime && (
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Última verificación: {new Date(lastCheckedTime).toLocaleTimeString('es-AR')}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onCheckNow}
                    disabled={isChecking}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${isChecking ? 'animate-spin' : ''}`} />
                    <span>{isChecking ? 'Verificando...' : 'Verificar Ahora'}</span>
                  </button>

                  <button
                    onClick={handleTestNotification}
                    className="px-3 py-1.5 rounded-xl bg-sky-900 hover:bg-sky-950 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                  >
                    <Bell className="w-3.5 h-3.5 text-sky-300" />
                    <span>{testSent ? '¡Notificación enviada!' : 'Probar Alerta'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-500">
                <p>No tienes ningún destino guardado para monitoreo continuo todavía.</p>
                <p className="mt-1 font-semibold text-sky-800">
                  Buscá cualquier localidad (ej. Cabo Frio, Mar del Plata, Pinamar) y hacé clic en el botón <strong>"🔔 Monitorear Destino"</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Alertas Push y Segundo Plano */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-sky-900">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>¿Cómo funcionan las Alertas cuando la web no está abierta?</span>
            </div>
            <p className="leading-relaxed">
              • <strong>Con la web abierta o minimizada:</strong> El monitor verifica el clima cada 5 minutos de forma automática y emite sonido y notificaciones emergentes en tu pantalla.
            </p>
            <p className="leading-relaxed">
              • <strong>Con la web cerrada:</strong> El <em>Service Worker</em> registrado en tu navegador permanece activo en el sistema para recibir eventos de <strong>Web Push</strong> y sincronización periódica en Android y computadoras.
            </p>
            <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-semibold text-sky-800">
                Probá si tu dispositivo muestra las notificaciones del sistema:
              </span>
              <button
                type="button"
                onClick={handleTestNotification}
                className="px-3 py-1.5 rounded-xl bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
              >
                {testSent ? '✓ Notificación Enviada' : 'Probar Notificación Ahora'}
              </button>
            </div>
          </div>

          {/* Configuración de Alertas Tácticas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Configuración de Disparadores
              </span>
              <button
                onClick={toggleSound}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
              >
                {config.soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sonido Activado</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sonido Silenciado</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">Tiempo Severo</span>
                    <span className="text-[11px] text-slate-500">Vientos &gt;50 km/h o tormentas</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.notifyOnSevere}
                  onChange={() => toggleOption('notifyOnSevere')}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">Riesgo Incendio 30-30-30</span>
                    <span className="text-[11px] text-slate-500">Subida a riesgo Alto o Extremo</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.notifyOnFireRisk}
                  onChange={() => toggleOption('notifyOnFireRisk')}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">Aviso de Crisis 48hs</span>
                    <span className="text-[11px] text-slate-500">Evento hídrico &gt;70mm o sismos</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.notifyOnCrisis}
                  onChange={() => toggleOption('notifyOnCrisis')}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-sky-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">Olas de Calor / Polar</span>
                    <span className="text-[11px] text-slate-500">Temp &gt;=35°C o &lt;=5°C</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.notifyOnTempSpike}
                  onChange={() => toggleOption('notifyOnTempSpike')}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Historial de Alertas Recibidas */}
          <div className="space-y-2 border-t pt-4 border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Historial de Alertas ({history.length})
              </span>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-[11px] font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Borrar historial</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-400">
                Aún no se han registrado eventos o cambios tácticos en tu destino.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {new Date(item.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-snug text-[11px]">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Monitoreo en segundo plano impulsado por Open-Meteo & USGS.
          </span>
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
