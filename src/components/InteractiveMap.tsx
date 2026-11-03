import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { NOAA_ZONES, SeasonKey, NOAA_LEGEND } from '../data/noaaClimateData';
import { LocationResolutionResult } from '../services/geocodingService';
import { Compass, Layers, Maximize2, Sparkles } from 'lucide-react';

interface InteractiveMapProps {
  currentResult: LocationResolutionResult | null;
  season: SeasonKey;
  onMapLocationSelected: (lat: number, lng: number, placeName?: string) => void;
}

export function InteractiveMap({ currentResult, season, onMapLocationSelected }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonsLayerRef = useRef<L.LayerGroup | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [-34.6, -58.4],
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      worldCopyJump: true
    });

    // 100% Free OpenStreetMap tile server with zero API key required
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors | NOAA Climate.gov',
      maxZoom: 19
    }).addTo(map);

    // Zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Polygon layers group
    const polyGroup = L.layerGroup().addTo(map);
    polygonsLayerRef.current = polyGroup;

    // Click handler to inspect any point on Earth
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onMapLocationSelected(lat, lng);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update NOAA Polygons when season changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const polyGroup = polygonsLayerRef.current;
    if (!map || !polyGroup) return;

    polyGroup.clearLayers();

    const zonesForSeason = NOAA_ZONES.filter(z => z.season === season);

    zonesForSeason.forEach(zone => {
      // Draw smooth styled polygon
      const polygon = L.polygon(zone.polygon, {
        color: zone.colorHex,
        weight: 2.5,
        opacity: 0.9,
        fillColor: zone.colorHex,
        fillOpacity: 0.28,
        dashArray: '4, 4'
      });

      polygon.bindTooltip(`
        <div style="font-family: inherit; font-size: 13px; line-height: 1.4; padding: 4px;">
          <div style="font-weight: 700; color: ${zone.colorHex};">${zone.icon} ${zone.categoryLabelEs}</div>
          <div style="font-weight: 600; color: #1e293b; margin-top: 2px;">${zone.regionName}</div>
          <div style="color: #64748b; font-size: 11px; margin-top: 2px;">Haz clic para consultar este punto</div>
        </div>
      `, {
        sticky: true,
        direction: 'auto',
        className: 'custom-noaa-tooltip'
      });

      polygon.on('click', (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        onMapLocationSelected(e.latlng.lat, e.latlng.lng, zone.regionName);
      });

      polyGroup.addLayer(polygon);
    });
  }, [season]);

  // Update Destination Marker and FlyTo
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !currentResult) return;

    const [lat, lng] = currentResult.coords;

    // Remove old marker
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // Custom pulse SVG Icon
    const isArgentineCoast = currentResult.detectedZone.toLowerCase().includes('costa argentina');
    const badgeColor = currentResult.colorHex;

    const iconHtml = `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full cursor-pointer">
        <div class="absolute w-10 h-10 rounded-full animate-ping opacity-60" style="background-color: ${badgeColor};"></div>
        <div class="relative flex items-center justify-center w-8 h-8 rounded-full shadow-xl border-2 border-white text-white font-bold text-sm" style="background-color: ${badgeColor};">
          ${currentResult.icon}
        </div>
        <div class="absolute -bottom-1 w-2 h-2 rotate-45 border-r border-b border-white" style="background-color: ${badgeColor};"></div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'custom-destination-pin',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -34]
    });

    const newMarker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

    const popupHtml = `
      <div style="font-family: inherit; min-width: 200px; padding: 2px;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: ${badgeColor};">
          ${currentResult.categoryLabel}
        </div>
        <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 2px 0;">
          ${currentResult.matchedName}
        </div>
        <div style="font-size: 12px; font-weight: 600; color: #0284c7; background: #e0f2fe; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 6px;">
          📍 ${currentResult.detectedZone}
        </div>
        <p style="font-size: 12px; color: #475569; margin: 0; line-height: 1.4;">
          ${currentResult.prognosisSummary}
        </p>
      </div>
    `;

    newMarker.bindPopup(popupHtml).openPopup();
    markerRef.current = newMarker;

    // Fly to coordinates smoothly
    const zoomLevel = isArgentineCoast ? 7 : Math.max(map.getZoom(), 6);
    map.flyTo([lat, lng], zoomLevel, {
      duration: 1.2
    });
  }, [currentResult]);

  const handleCenterOnResult = () => {
    if (!mapInstanceRef.current || !currentResult) return;
    mapInstanceRef.current.flyTo(currentResult.coords, 7, { duration: 1 });
  };

  const handleResetWorldView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([-10, -30], 2.5, { duration: 1 });
  };

  return (
    <div className="relative w-full h-[460px] md:h-[540px] rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Header Controls */}
      <div className="absolute top-3 left-3 right-3 md:right-auto z-[400] flex flex-wrap items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Layers className="w-4 h-4 text-sky-600" />
          <span>Mapa de Afectación NOAA</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-500 font-normal">
            {season === 'DJF' ? 'Diciembre – Febrero' : 'Junio – Agosto'}
          </span>
        </div>

        {currentResult && (
          <button
            onClick={handleCenterOnResult}
            className="bg-white/95 hover:bg-slate-50 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 text-xs font-semibold text-sky-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Centrar en el destino seleccionado"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Centrar en {currentResult.matchedName}</span>
          </button>
        )}

        <button
          onClick={handleResetWorldView}
          className="bg-white/95 hover:bg-slate-50 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-md border border-slate-200/80 text-xs font-medium text-slate-600 flex items-center gap-1 transition-all cursor-pointer"
          title="Vista global de la Tierra"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Vista Global</span>
        </button>
      </div>

      {/* Map Legend Overlay at Bottom-Left */}
      <div className="absolute bottom-3 left-3 z-[400] max-w-[calc(100%-24px)] md:max-w-md bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200/80 text-xs">
        <div className="flex items-center justify-between mb-1.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Categorías NOAA ({season})
          </span>
          <span className="text-[10px] text-slate-400 font-normal">Haz clic en una zona del mapa</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {Object.entries(NOAA_LEGEND)
            .filter(([cat]) => cat !== 'Neutral')
            .map(([cat, val]) => (
              <div key={cat} className="flex items-center gap-1.5 py-0.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                  style={{ backgroundColor: val.color }}
                />
                <span className="text-[11px] font-medium text-slate-700 truncate" title={val.desc}>
                  {val.label.split(' ')[0]}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
