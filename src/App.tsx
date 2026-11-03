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
  SlidersHorizontal
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
import { InteractiveMap } from './components/InteractiveMap';
import { DestinationResultCard } from './components/DestinationResultCard';
import { NoaaReferenceViewer } from './components/NoaaReferenceViewer';
import { DestinationsGrid } from './components/DestinationsGrid';
import { TacticalDashboard } from './components/TacticalDashboard';
import { ExportPdfModal } from './components/ExportPdfModal';
import { FileDown } from 'lucide-react';

type ViewMode = 'all' | 'nino' | 'tactical';

export default function App() {
  const [season, setSeason] = useState<SeasonKey>('DJF');
  const [searchQuery, setSearchQuery] = useState('Mar del Plata');
  const [isSearching, setIsSearching] = useState(false);
  const [currentResult, setCurrentResult] = useState<LocationResolutionResult | null>(null);
  const [suggestions, setSuggestions] = useState<DestinationInfo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Tactical weather state from IIARRD monitor
  const [tacticalWeather, setTacticalWeather] = useState<TacticalWeatherState | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Initialize with Mar del Plata on mount
  useEffect(() => {
    executeSearch('Mar del Plata', season);
  }, []);

  // When season changes, re-evaluate current location
  useEffect(() => {
    if (currentResult) {
      executeSearch(currentResult.matchedName, season);
    }
  }, [season]);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col">
      {/* Top Navbar */}
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
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-100 text-sky-800 tracking-wider">
                  IIARRD + NOAA
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Cruce de destinos turísticos con El Niño, alertas de crisis y tiempo en tiempo real
              </p>
            </div>
          </div>

          {/* View Mode Tabs & PDF Export Button */}
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
                onClick={() => setViewMode('nino')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'nino'
                    ? 'bg-white text-sky-900 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                El Niño (NOAA)
              </button>
              <button
                onClick={() => setViewMode('tactical')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'tactical'
                    ? 'bg-white text-sky-900 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Táctico & Alertas
              </button>
            </div>

            {currentResult && (
              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-900 hover:bg-sky-950 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                title="Exportar ficha técnica completa en PDF"
              >
                <FileDown className="w-3.5 h-3.5 text-sky-300" />
                <span>Exportar PDF</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8 flex-1 w-full space-y-6 md:space-y-8">
        
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
              placeholder="Escribí una ciudad (ej. Mar del Plata, Pinamar, Florianópolis, Cancún, Miami, Bariloche)..."
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

        {/* Quick Picks Destination Grid */}
        <div className="max-w-4xl mx-auto">
          <DestinationsGrid
            onSelectDestination={(destName) => {
              setSearchQuery(destName);
              executeSearch(destName, season);
            }}
            activeDestinationName={currentResult?.matchedName}
          />
        </div>

        {/* SECTION 1: EL NIÑO SEASONAL TOURISM IMPACT */}
        {(viewMode === 'all' || viewMode === 'nino') && (
          <div className="space-y-6">
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
          </div>
        )}

        {/* SECTION 2: TACTICAL WEATHER & IIARRD DASHBOARD */}
        {(viewMode === 'all' || viewMode === 'tactical') && (
          <div className="max-w-4xl mx-auto pt-4 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-sky-700" />
                <h3 className="text-xl font-extrabold text-slate-900">
                  Monitor Táctico, Alertas Vivas y Estacionalidad (IIARRD)
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
                {currentResult?.matchedName || 'Destino Actual'}
              </span>
            </div>

            <TacticalDashboard
              weather={tacticalWeather}
              loading={loadingWeather}
              destinationName={currentResult?.matchedName || searchQuery}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-6 text-xs text-center border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Monitor Climático de Destinos Turísticos — Integración <strong>IIARRD</strong> & <strong>NOAA Climate.gov</strong>.
          </p>
          <div className="flex items-center gap-4 text-slate-300">
            <span>Open-Meteo & USGS Earthquakes</span>
            <span>•</span>
            <span>Mapas OpenStreetMap</span>
          </div>
        </div>
      </footer>

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
    </div>
  );
}
