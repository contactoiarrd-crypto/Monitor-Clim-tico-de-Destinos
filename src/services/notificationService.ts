import { TacticalWeatherState } from './weatherTacticalService';

export interface WatchedDestination {
  name: string;
  zone: string;
  country: string;
  coords: [number, number]; // [lat, lng]
  savedAt: string;
  active: boolean;
}

export interface TacticalSnapshot {
  temp: number;
  windSpeed: number;
  weatherCode: number;
  conditionText: string;
  severoOficial: boolean;
  olaCalor: boolean;
  olaPolar: boolean;
  eventoCrisis48h: string | null;
  puntos3030: number;
  label3030: string;
  tacticoHoy: string;
  lastChecked: string;
}

export interface NotificationEvent {
  id: string;
  timestamp: string;
  destinationName: string;
  type: 'severo' | 'crisis' | 'incendio' | 'temperatura' | 'tactico';
  title: string;
  message: string;
}

const STORAGE_KEYS = {
  WATCHED: 'at_watched_destination',
  SNAPSHOT: 'at_watched_snapshot',
  HISTORY: 'at_notification_history',
  CONFIG: 'at_notification_config'
};

export interface NotificationConfig {
  enabled: boolean;
  checkIntervalMinutes: number;
  soundEnabled: boolean;
  notifyOnSevere: boolean;
  notifyOnCrisis: boolean;
  notifyOnFireRisk: boolean;
  notifyOnTempSpike: boolean;
}

export const DEFAULT_CONFIG: NotificationConfig = {
  enabled: true,
  checkIntervalMinutes: 5,
  soundEnabled: true,
  notifyOnSevere: true,
  notifyOnCrisis: true,
  notifyOnFireRisk: true,
  notifyOnTempSpike: true
};

// Storage Helpers
export function getSavedWatchedDestination(): WatchedDestination | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCHED);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveWatchedDestination(dest: WatchedDestination | null): void {
  try {
    if (!dest) {
      localStorage.removeItem(STORAGE_KEYS.WATCHED);
      localStorage.removeItem(STORAGE_KEYS.SNAPSHOT);
    } else {
      localStorage.setItem(STORAGE_KEYS.WATCHED, JSON.stringify(dest));
    }
  } catch (e) {
    console.warn('Error saving watched destination:', e);
  }
}

export function getSavedSnapshot(): TacticalSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SNAPSHOT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveSnapshot(snap: TacticalSnapshot): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SNAPSHOT, JSON.stringify(snap));
  } catch (e) {
    console.warn('Error saving snapshot:', e);
  }
}

export function getNotificationHistory(): NotificationEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function addNotificationToHistory(event: NotificationEvent): void {
  try {
    const list = getNotificationHistory();
    const updated = [event, ...list].slice(0, 30); // keep last 30 events
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving notification history:', e);
  }
}

export function clearNotificationHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (e) {}
}

export function getNotificationConfig(): NotificationConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG;
  } catch (e) {
    return DEFAULT_CONFIG;
  }
}

export function saveNotificationConfig(cfg: NotificationConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(cfg));
  } catch (e) {}
}

// Web Audio API Synthesis Chime (gentle and self-contained)
export function playAlertChime(type: 'warning' | 'info' = 'warning'): void {
  try {
    const config = getNotificationConfig();
    if (!config.soundEnabled) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'warning') {
      // Two-tone warning chime (D5 -> A5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880.0, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.45);
    } else {
      // Gentle confirmation tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    console.warn('Audio chime error:', e);
  }
}

// Request Browser Permissions
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    return await Notification.requestPermission();
  } catch (e) {
    return 'denied';
  }
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermissionStatus(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

// Dispatch browser notification (uses ServiceWorkerRegistration on mobile and window.Notification on desktop)
export async function dispatchBrowserNotification(
  title: string,
  message: string,
  destinationName: string
): Promise<void> {
  playAlertChime('warning');

  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  const notifOptions: NotificationOptions = {
    body: message,
    icon: '/android/launchericon-192x192.png',
    badge: '/android/launchericon-96x96.png',
    tag: `at-alert-${destinationName.toLowerCase()}-${Date.now()}`
  };

  // 1. Prefer ServiceWorkerRegistration on Android/Mobile
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, notifOptions);
        return;
      }
    } catch (e) {
      console.warn('SW notification fallback to window Notification:', e);
    }
  }

  // 2. Desktop fallback
  try {
    new Notification(title, notifOptions);
  } catch (err) {
    console.warn('Could not launch window Notification:', err);
  }
}

// Helper to convert TacticalWeatherState to Snapshot
export function createSnapshotFromWeather(weather: TacticalWeatherState): TacticalSnapshot {
  return {
    temp: weather.current.temp,
    windSpeed: weather.current.windSpeed,
    weatherCode: weather.current.weatherCode,
    conditionText: weather.current.conditionText,
    severoOficial: weather.alerts.severoOficial,
    olaCalor: weather.alerts.olaCalor,
    olaPolar: weather.alerts.olaPolar,
    eventoCrisis48h: weather.alerts.eventoCrisis48h,
    puntos3030: weather.incendio3030.puntos,
    label3030: weather.incendio3030.label,
    tacticoHoy: weather.tacticoHoy,
    lastChecked: new Date().toISOString()
  };
}

// Detect tactical changes between snapshots
export function detectTacticalChanges(
  previous: TacticalSnapshot | null,
  current: TacticalWeatherState,
  destinationName: string
): NotificationEvent[] {
  if (!previous) return [];

  const config = getNotificationConfig();
  if (!config.enabled) return [];

  const events: NotificationEvent[] = [];
  const nowStr = new Date().toISOString();

  // 1. Severe Weather Alert Triggered
  if (config.notifyOnSevere && current.alerts.severoOficial && !previous.severoOficial) {
    events.push({
      id: `sev_${Date.now()}_1`,
      timestamp: nowStr,
      destinationName,
      type: 'severo',
      title: `⚠️ Aviso Oficial de Tiempo Severo en ${destinationName}`,
      message: `Se detectaron lluvias torrenciales o vientos superiores a 50 km/h (${current.current.windSpeed} km/h).`
    });
  }

  // 2. Crisis Event (48h high water or USGS earthquake)
  if (
    config.notifyOnCrisis &&
    current.alerts.eventoCrisis48h &&
    current.alerts.eventoCrisis48h !== previous.eventoCrisis48h
  ) {
    events.push({
      id: `cri_${Date.now()}_2`,
      timestamp: nowStr,
      destinationName,
      type: 'crisis',
      title: `🚨 Aviso de Crisis (48hs) en ${destinationName}`,
      message: current.alerts.eventoCrisis48h
    });
  }

  // 3. Fire Risk Index 30-30-30 Escalation
  if (config.notifyOnFireRisk) {
    const jumpedToExtreme = current.incendio3030.puntos > 75 && previous.puntos3030 <= 75;
    const jumpedToHigh = current.incendio3030.puntos > 50 && previous.puntos3030 <= 50;
    const bigJump = current.incendio3030.puntos - previous.puntos3030 >= 20;

    if (jumpedToExtreme || jumpedToHigh || bigJump) {
      events.push({
        id: `fire_${Date.now()}_3`,
        timestamp: nowStr,
        destinationName,
        type: 'incendio',
        title: `🔥 Alerta de Incendio 30-30-30 en ${destinationName}`,
        message: `El riesgo subió a ${current.incendio3030.puntos}% (${current.incendio3030.label}). Viento: ${current.current.windSpeed} km/h, Humedad: ${current.current.humidity}%.`
      });
    }
  }

  // 4. Extreme Heat or Polar Wave Alert
  if (config.notifyOnTempSpike) {
    if (current.alerts.olaCalor && !previous.olaCalor) {
      events.push({
        id: `heat_${Date.now()}_4`,
        timestamp: nowStr,
        destinationName,
        type: 'temperatura',
        title: `☀️ Alerta Ola de Calor en ${destinationName}`,
        message: `Temperatura extrema detectada: ${current.current.temp}°C. Riesgo térmico elevado.`
      });
    }
    if (current.alerts.olaPolar && !previous.olaPolar) {
      events.push({
        id: `polar_${Date.now()}_5`,
        timestamp: nowStr,
        destinationName,
        type: 'temperatura',
        title: `❄️ Alerta Ola Polar en ${destinationName}`,
        message: `Descenso térmico crítico: ${current.current.temp}°C.`
      });
    }
  }

  // 5. Tactical Weather Condition Shift (e.g. from Clear to Storm or Rain)
  if (
    current.current.weatherCode >= 51 &&
    previous.weatherCode < 51 &&
    current.tacticoHoy !== previous.tacticoHoy
  ) {
    events.push({
      id: `cond_${Date.now()}_6`,
      timestamp: nowStr,
      destinationName,
      type: 'tactico',
      title: `🌧️ Cambio Táctico en ${destinationName}`,
      message: `${current.tacticoHoy} Estado: ${current.current.conditionText}.`
    });
  }

  return events;
}
