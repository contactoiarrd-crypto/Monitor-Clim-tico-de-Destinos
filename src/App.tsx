import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  MapPin, 
  Sun, 
  Snowflake, 
  Sparkles, 
  Compass, 
  Info, 
  AlertTriangle, 
  Loader2, 
  Calendar, 
  Waves, 
  ShieldAlert, 
  ArrowRight, 
  Activity, 
  Layers, 
  Thermometer, 
  Flame, 
  CloudRain, 
  FileDown, 
  Code, 
  Globe, 
  ExternalLink,
  Bell,
  BellRing
} from 'lucide-react';
import { SeasonKey } from './data/noaaClimateData';
import { CURATED_DESTINATIONS, DestinationInfo } from './data/destinationsDatabase';
import { 
  resolveLocation, 
  LocationResolutionResult, 
  normalizeStr 
} from './services/geocodingService';
import { 
  fetchTacticalWeatherData, 
  TacticalWeatherState 
} from './services/weatherTacticalService';
import { 
  WatchedDestination,
  TacticalSnapshot,
  NotificationEvent,
  NotificationConfig,
  getSavedWatchedDestination,
  saveWatchedDestination,
  getSavedSnapshot,
  saveSnapshot,
  createSnapshotFromWeather,
  detectTacticalChanges,
  getNotificationHistory,
  addNotificationToHistory,
  clearNotificationHistory,
  getNotificationConfig,
  saveNotificationConfig,
  dispatchBrowserNotification,
  requestNotificationPermission,
  playAlertChime
} from './services/notificationService';

import { InteractiveMap } from './components/InteractiveMap';
import { DestinationResultCard } from './components/DestinationResultCard';
import { NoaaReferenceViewer } from './components/NoaaReferenceViewer';
import { TacticalDashboard } from './components/TacticalDashboard';
import { ExportPdfModal } from './components/ExportPdfModal';
import { EmbedWidgetModal } from './components/EmbedWidgetModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { NotificationToastBanner } from './components/NotificationToastBanner';
import { WatchDestinationButton } from './components/WatchDestinationButton';

type ViewMode = 'all' | 'tactical' | 'nino';

export default function App() {
  // Read URL query parameters for embedding into alertatemprana.online
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const urlCity = searchParams.get('ciudad') || '';
  const urlView = (searchParams.get('vista') as ViewMode) || 'all';
  const urlEmbed = searchParams.get('embed') === 'true' || searchParams.get('modo') === 'widget';
  const urlSinCabecera = searchParams.get('sinCabecera') === 'true';
  const urlSeason = (searchParams.get('temporada') as SeasonKey) || 'DJF';

  const [season, setSeason] = useState<SeasonKey>(urlSeason);
  const [searchQuery, setSearchQuery] = useState(urlCity);
  const [isSearching, setIsSearching] = useState(false);
  const [currentResult, setCurrentResult] = useState<LocationResolutionResult | null>(null);
  const [suggestions, setSuggestions] = useState<DestinationInfo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(urlView);

  // Modals
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Tactical weather state from IIARRD monitor
  const [tacticalWeather, setTacticalWeather] = useState<TacticalWeatherState | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Notification Service State
  const [watchedDest, setWatchedDest] = useState<WatchedDestination | null>(() => getSavedWatchedDestination());
  const [watchedSnapshot, setWatchedSnapshot] = useState<TacticalSnapshot | null>(() => getSavedSnapshot());
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>(() => getNotificationConfig());
  const [notificationHistory, setNotificationHistory] = useState<NotificationEvent[]>(() => getNotificationHistory());
  const [activeToastEvent, setActiveToastEvent] = useState<NotificationEvent | null>(null);
  const [isCheckingTactical, setIsCheckingTactical] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Initialize with destination on mount ONLY if provided via URL param
  useEffect(() => {
    if (urlCity) {
      executeSearch(urlCity, season);
    }
  }, []);

  // When season changes, re-evaluate current location
  useEffect(() => {
    if (currentResult) {
      executeSearch(currentResult.matchedName, season);
    }
  }, [season]);

  // Periodic tactical monitor for watched destination
  const checkWatchedDestinationTacticalUpdates = async () => {
    if (!watchedDest) return;
    setIsCheckingTactical(true);

    try {
      const freshWeather = await fetchTacticalWeatherData(
        watchedDest.coords[0],
        watchedDest.coords[1],
        watchedDest.country
      );
      if (!freshWeather) return;

      const events = detectTacticalChanges(watchedSnapshot, freshWeather, watchedDest.name);

      if (events.length > 0) {
        events.forEach((ev) => {
          dispatchBrowserNotification(ev.title, ev.message, watchedDest.name);
          addNotificationToHistory(ev);
        });
        setNotificationHistory(getNotificationHistory());
        setActiveToastEvent(events[0]);
      }

      const newSnap = createSnapshotFromWeather(freshWeather);
      saveSnapshot(newSnap);
      setWatchedSnapshot(newSnap);
      setLastCheckedTime(new Date().toISOString());

      // If currentResult is the same destination, also update current live view
      if (currentResult && normalizeStr(currentResult.matchedName) === normalizeStr(watchedDest.name)) {
        setTacticalWeather(freshWeather);
      }
    } catch (e) {
      console.warn('Tactical check error:', e);
    } finally {
      setIsCheckingTactical(false);
    }
  };

  // Setup periodic background polling for watched destination
  useEffect(() => {
    if (!watchedDest) return;
    checkWatchedDestinationTacticalUpdates();

    const intervalMin = notificationConfig.checkIntervalMinutes || 5;
    const timer = setInterval(() => {
      checkWatchedDestinationTacticalUpdates();
    }, intervalMin * 60 * 1000);

    return () => clearInterval(timer);
  }, [watchedDest?.name, notificationConfig.checkIntervalMinutes]);

  // Toggle Watch for currently active destination
  const handleToggleWatchCurrentDestination = async () => {
    if (!currentResult) return;

    const isCurrentlyWatched = watchedDest && normalizeStr(watchedDest.name) === normalizeStr(currentResult.matchedName);

    if (isCurrentlyWatched) {
      saveWatchedDestination(null);
      setWatchedDest(null);
      setWatchedSnapshot(null);
      playAlertChime('info');
      setActiveToastEvent({
        id: `unwatch_${Date.now()}`,
        timestamp: new Date().toISOString(),
        destinationName: currentResult.matchedName,
        type: 'tactico',
        title: `🔕 Monitoreo Desactivado`,
        message: `Has dejado de monitorear ${currentResult.matchedName}.`
      });
    } else {
      // Request browser permission
      await requestNotificationPermission();

      const newWatch: WatchedDestination = {
        name: currentResult.matchedName,
        zone: currentResult.detectedZone,
        country: currentResult.country,
        coords: currentResult.coords,
        savedAt: new Date().toISOString(),
        active: true
      };

      saveWatchedDestination(newWatch);
      setWatchedDest(newWatch);

      if (tacticalWeather) {
        const snap = createSnapshotFromWeather(tacticalWeather);
        saveSnapshot(snap);
        setWatchedSnapshot(snap);
      }

      setLastCheckedTime(new Date().toISOString());
      playAlertChime('info');

      dispatchBrowserNotification(
        `🔔 Monitoreo Activo en ${currentResult.matchedName}`,
        `El sistema te avisará automáticamente ante tiempo severo, vientos fuertes, incendios o sismos.`,
        currentResult.matchedName
      );

      setActiveToastEvent({
        id: `watch_${Date.now()}`,
        timestamp: new Date().toISOString(),
        destinationName: currentResult.matchedName,
        type: 'tactico',
        title: `🔔 Monitoreo Activado: ${currentResult.matchedName}`,
        message: `Te notificaremos en el navegador ante cualquier cambio táctico o alerta crítica.`
      });
    }
  };

  // Autocomplete suggestions based on query
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (val.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const normQ = normalizeStr(val);
    const matches = CURATED_DESTINATIONS.filter(d => {
      const matchName = normalizeStr(d.name).includes(normQ);
      const matchZone = normalizeStr(d.detectedZone).includes(normQ);
      const matchAlias = d.aliases.some(a => normalizeStr(a).includes(normQ));
      return matchName || matchZone || matchAlias;
    }).slice(0, 6);

    setSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  };

  // Perform search (both El Niño resolution and Tactical Weather)
  const executeSearch = async (queryText: string, activeSeason: SeasonKey) => {
    if (!queryText.trim()) return;
    setIsSearching(true);
    setShowSuggestions(false);
    setLoadingWeather(true);

    try {
      const result = await resolveLocation(queryText, activeSeason);
      setCurrentResult(result);
      setSearchQuery(result.matchedName);

      // Concurrently fetch tactical weather for coordinates
      const weather = await fetchTacticalWeatherData(
        result.coords[0],
        result.coords[1],
        result.country || 'Argentina'
      );
      setTacticalWeather(weather);

      // If this searched city is the watched destination, sync snapshot
      if (watchedDest && normalizeStr(watchedDest.name) === normalizeStr(result.matchedName) && weather) {
        const snap = createSnapshotFromWeather(weather);
        saveSnapshot(snap);
        setWatchedSnapshot(snap);
        setLastCheckedTime(new Date().toISOString());
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
      setLoadingWeather(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery, season);
  };

  const handleSelectSuggestion = (dest: DestinationInfo) => {
    setSearchQuery(dest.name);
    setShowSuggestions(false);
    executeSearch(dest.name, season);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // User click on Map
  const handleMapLocationSelected = async (lat: number, lng: number, placeName?: string) => {
    setIsSearching(true);
    setLoadingWeather(true);

    try {
      // Reverse geocode via Nominatim to get city name & zone
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          'Accept-Language': 'es,en',
          'User-Agent': 'ElNinoTourismMonitor/1.0'
        }
      });

      let nameToSearch = placeName || `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
      let detectedCountry = 'Global';

      if (res.ok) {
        const data = await res.json();
        const address = data.address || {};
        const city = address.city || address.town || address.village || address.municipality || address.state || data.name;
        detectedCountry = address.country || 'Global';
        if (city) {
          nameToSearch = city;
        }
      }

      const result = await resolveLocation(nameToSearch, season);
      result.coords = [lat, lng];
      setCurrentResult(result);
      setSearchQuery(result.matchedName);

      // Fetch live weather & crisis data
      const weather = await fetchTacticalWeatherData(lat, lng, detectedCountry);
      setTacticalWeather(weather);
    } catch (err) {
      console.error('Reverse geocode failed:', err);
    } finally {
      setIsSearching(false);
      setLoadingWeather(false);
    }
  };

  // Use Browser Geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }

    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await handleMapLocationSelected(latitude, longitude);
        setGeoLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGeoLocating(false);
      },
      { timeout: 8000 }
    );
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCurrentDestinationWatched = Boolean(
    currentResult && watchedDest && normalizeStr(currentResult.matchedName) === normalizeStr(watchedDest.name)
  );

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col ${urlEmbed ? 'p-1 sm:p-2 bg-transparent' : ''}`}>
      
      {/* Top Navbar (Hidden if embedded with sinCabecera=true) */}
      {!urlSinCabecera && (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-700 via-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
                <Waves className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight tracking-tight">
                    Monitor Climático de Destinos
                  </h1>
                  <a
                    href="https://alertatemprana.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-sky-100 text-sky-800 hover:bg-sky-200 transition-colors"
                  >
                    <span>alertatemprana.online</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Alertas tempranas en vivo (IIARRD) y cruce estacional con El Niño (NOAA Climate.gov)
                </p>
              </div>
            </div>

            {/* View Mode Tabs & Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'all'
                      ? 'bg-white text-sky-900 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Visión Integral
                </button>
                <button
                  onClick={() => setViewMode('tactical')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'tactical'
                      ? 'bg-white text-sky-900 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Alertas & Táctico
                </button>
                <button
                  onClick={() => setViewMode('nino')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'nino'
                      ? 'bg-white text-sky-900 shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  El Niño (NOAA)
                </button>
              </div>

              {/* Botón de Notificaciones del Navegador */}
              <button
                onClick={() => setIsNotificationModalOpen(true)}
                className={`relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
                  watchedDest
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title={
                  watchedDest
                    ? `Monitoreando ${watchedDest.name}. Clic para gestionar alertas del navegador.`
                    : 'Configurar servicio de notificaciones del navegador'
                }
              >
                {watchedDest ? (
                  <>
                    <BellRing className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                    <span className="hidden lg:inline">{watchedDest.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5 text-slate-600" />
                    <span className="hidden lg:inline">Alertas</span>
                  </>
                )}
                {notificationHistory.length > 0 && (
                  <span className="bg-red-600 text-white rounded-full text-[9px] font-black px-1.5 py-0.2">
                    {notificationHistory.length}
                  </span>
                )}
              </button>

              {/* Botón Integrar en Web */}
              <button
                onClick={() => setIsEmbedModalOpen(true)}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                title="Generar código para insertar en alertatemprana.online"
              >
                <Code className="w-3.5 h-3.5 text-sky-600" />
                <span>Integrar en mi Web</span>
              </button>

              {/* Botón Exportar PDF */}
              {currentResult && (
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-900 hover:bg-sky-950 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                  title="Exportar ficha técnica completa en PDF"
                >
                  <FileDown className="w-3.5 h-3.5 text-sky-300" />
                  <span>Exportar PDF</span>
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`max-w-6xl mx-auto px-4 py-6 md:py-8 flex-1 w-full space-y-6 md:space-y-8 ${urlEmbed ? 'p-2' : ''}`}>
        
        {/* Search Bar Container */}
        <div ref={searchContainerRef} className="max-w-3xl mx-auto relative">
          <form onSubmit={handleFormSubmit} className="relative flex items-center shadow-lg rounded-2xl">
            <div className="absolute left-4 pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-sky-600" />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Escribí una ciudad (ej. Cabo Frio, Mar del Plata, Pinamar, Florianópolis, Cancún, Bariloche)..."
              className="w-full pl-12 pr-28 py-4 bg-white text-slate-800 placeholder-slate-400 rounded-2xl text-base md:text-lg font-medium border-2 border-slate-200 focus:border-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all"
            />

            <div className="absolute right-3 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Borrar texto"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={geoLocating}
                className="p-2 text-slate-500 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer"
                title="Detectar mi ubicación actual"
              >
                {geoLocating ? (
                  <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
                ) : (
                  <Compass className="w-5 h-5" />
                )}
              </button>

              <button
                type="submit"
                disabled={isSearching}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span className="hidden sm:inline">Analizar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Autocomplete Dropdown List */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in-50 duration-150">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Sugerencias Destacadas
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectSuggestion(item)}
                    className="px-4 py-3 hover:bg-sky-50/70 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{item.name}</div>
                        <div className="text-xs text-sky-700 font-semibold flex items-center gap-1">
                          <span>Zona:</span>
                          <span>{item.detectedZone}</span>
                        </div>
                      </div>
                    </div>
                    {item.country && (
                      <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.country}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


        {/* Onboarding Welcome Prompt when no city is active yet */}
        {!currentResult && !isSearching && (
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-sky-50 via-white to-indigo-50 border border-sky-200 rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-sky-700 text-white flex items-center justify-center mx-auto shadow-md shadow-sky-700/20">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Consultar Destino y Alertas Tempranas
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              Escribí cualquier localidad o balneario en el buscador (ej. <strong>Cabo Frio</strong>, <strong>Mar del Plata</strong>, <strong>Pinamar</strong>, <strong>Búzios</strong>, <strong>Florianópolis</strong>, <strong>Cancún</strong> o <strong>Bariloche</strong>), o hacé clic en un destino frecuente o en el mapa global interactivo.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                🚨 Alertas vivas en tiempo real
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                🔥 Riesgo de incendios 30-30-30
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                🌊 Afectación El Niño (NOAA)
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                🔔 Notificaciones en el navegador
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECCIÓN 1 (PRIMERO): ALERTAS VIVAS, MONITOR TÁCTICO & IIARRD   */}
        {/* ============================================================== */}
        {(viewMode === 'all' || viewMode === 'tactical') && (currentResult || isSearching) && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <h3 className="text-xl font-extrabold text-slate-900">
                  Alertas en tiempo real y estacionalidad
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
                  {currentResult?.matchedName || 'Consultando...'}
                </span>

                {currentResult && (
                  <WatchDestinationButton
                    destinationName={currentResult.matchedName}
                    zone={currentResult.detectedZone}
                    country={currentResult.country}
                    coords={currentResult.coords}
                    isWatched={isCurrentDestinationWatched}
                    onToggleWatch={handleToggleWatchCurrentDestination}
                  />
                )}

                {currentResult && (
                  <button
                    onClick={() => setIsPdfModalOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-sky-900 hover:bg-sky-950 text-white font-bold text-xs transition-all shadow-2xs cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5 text-sky-300" />
                    <span>Exportar Ficha</span>
                  </button>
                )}
              </div>
            </div>

            <TacticalDashboard
              weather={tacticalWeather}
              loading={loadingWeather}
              destinationName={currentResult?.matchedName || searchQuery}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* SECCIÓN 2 (SEGUNDO): PROYECCIONES EL NIÑO (NOAA) & TURISMO     */}
        {/* ============================================================== */}
        {(viewMode === 'all' || viewMode === 'nino') && (
          <div className="space-y-6 pt-6 border-t border-slate-200/80">
            <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-sky-600" />
                <h3 className="text-xl font-extrabold text-slate-900">
                  Afectación Estacional de El Niño en Destinos Turísticos (NOAA)
                </h3>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                Base NOAA Climate.gov
              </span>
            </div>

            {/* Season Selector Tabs */}
            <div className="max-w-2xl mx-auto bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <button
                onClick={() => setSeason('DJF')}
                className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  season === 'DJF'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Sun className={`w-4 h-4 ${season === 'DJF' ? 'text-amber-300' : 'text-amber-500'}`} />
                <div className="text-left">
                  <div>Diciembre – Febrero</div>
                  <div className={`text-[11px] font-normal ${season === 'DJF' ? 'text-sky-100' : 'text-slate-400'}`}>
                    Verano austral / Invierno boreal
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSeason('JJA')}
                className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  season === 'JJA'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Snowflake className={`w-4 h-4 ${season === 'JJA' ? 'text-sky-200' : 'text-sky-500'}`} />
                <div className="text-left">
                  <div>Junio – Agosto</div>
                  <div className={`text-[11px] font-normal ${season === 'JJA' ? 'text-sky-100' : 'text-slate-400'}`}>
                    Invierno austral / Verano boreal
                  </div>
                </div>
              </button>
            </div>

            {/* Main Result Card */}
            {currentResult && (
              <div className="max-w-4xl mx-auto">
                <DestinationResultCard
                  result={currentResult}
                  season={season}
                  onToggleSeason={() => setSeason(season === 'DJF' ? 'JJA' : 'DJF')}
                  onOpenExportPdf={() => setIsPdfModalOpen(true)}
                  isWatched={isCurrentDestinationWatched}
                  onToggleWatch={handleToggleWatchCurrentDestination}
                />
              </div>
            )}

            {/* Interactive Map Component (100% Free OpenStreetMap Tiles, Zero API Key Required) */}
            <div className="max-w-5xl mx-auto space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-sky-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Mapa de Afectación Global NOAA (Sin API Key)
                  </h3>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Haz clic en cualquier punto del mapa para analizarlo
                </span>
              </div>

              <InteractiveMap
                currentResult={currentResult}
                season={season}
                onMapLocationSelected={handleMapLocationSelected}
              />
            </div>

            {/* Official NOAA Reference Image Viewer */}
            <div className="max-w-4xl mx-auto">
              <NoaaReferenceViewer onSelectSeason={(s) => setSeason(s)} />
            </div>

            {/* Explanatory FAQ / Context Box */}
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Info className="w-5 h-5 text-sky-600" />
                <h3 className="text-lg font-bold">¿Cómo influye El Niño en la planificación de viajes?</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block mb-1">🌊 Costa Argentina y Cuenca del Plata:</strong>
                  En veranos australes con Niño activo (Diciembre a Febrero), el aporte de humedad subtropical aumenta la frecuencia de tormentas severas. Es clave prever programas alternativos de lluvia (gastronomía, teatro, paseos bajo techo).
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block mb-1">🏖️ Playas de Brasil y Caribe:</strong>
                  Mientras que el sur de Brasil experimenta lluvias adicionales, el Nordeste (Bahía, Río) y el Caribe suelen presentar anomalías cálidas y menor nubosidad, con una disminución de la actividad de huracanes atlánticos.
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block mb-1">🏔️ Centros de Esquí (Chile / Andes):</strong>
                  En los inviernos (Junio a Agosto), El Niño suele favorecer mayores precipitaciones níveas en la cordillera de Chile Central (Portillo, Valle Nevado), generando temporadas de nieve copiosa para el turismo de invierno.
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      {!urlSinCabecera && (
        <footer className="mt-auto bg-slate-900 text-slate-400 py-6 text-xs text-center border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              Monitor Climático de Destinos Turísticos — Integración oficial para{' '}
              <a 
                href="https://alertatemprana.online" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 font-bold underline"
              >
                alertatemprana.online
              </a>{' '}
              & <strong>IIARRD</strong> • Base NOAA Climate.gov.
            </p>
            <div className="flex items-center gap-4 text-slate-300">
              <button
                onClick={() => setIsNotificationModalOpen(true)}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <Bell className="w-3 h-3 text-sky-400" />
                <span>Servicio de Notificaciones</span>
              </button>
              <span>•</span>
              <button
                onClick={() => setIsEmbedModalOpen(true)}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <Code className="w-3 h-3 text-sky-400" />
                <span>Insertar Widget</span>
              </button>
              <span>•</span>
              <span>Open-Meteo & USGS</span>
            </div>
          </div>
        </footer>
      )}

      {/* Export PDF Modal */}
      {currentResult && (
        <ExportPdfModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          result={currentResult}
          weather={tacticalWeather}
          season={season}
        />
      )}

      {/* Embed Widget Modal para alertatemprana.online */}
      <EmbedWidgetModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        currentCity={currentResult?.matchedName || searchQuery || 'Mar del Plata'}
      />

      {/* Notification Settings & Watchlist Modal */}
      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        watchedDest={watchedDest}
        onUnwatch={() => {
          saveWatchedDestination(null);
          setWatchedDest(null);
          setWatchedSnapshot(null);
        }}
        config={notificationConfig}
        onSaveConfig={(cfg) => {
          saveNotificationConfig(cfg);
          setNotificationConfig(cfg);
        }}
        history={notificationHistory}
        onClearHistory={() => {
          clearNotificationHistory();
          setNotificationHistory([]);
        }}
        onCheckNow={checkWatchedDestinationTacticalUpdates}
        isChecking={isCheckingTactical}
        lastCheckedTime={lastCheckedTime}
      />

      {/* Floating In-App Toast Banner */}
      <NotificationToastBanner
        event={activeToastEvent}
        onDismiss={() => setActiveToastEvent(null)}
        onViewDestination={(destName) => {
          setSearchQuery(destName);
          executeSearch(destName, season);
        }}
      />
    </div>
  );
}
